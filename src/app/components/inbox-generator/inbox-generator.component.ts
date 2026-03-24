import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomainService } from '../../services/domain.service';
import { InboxService } from '../../services/inbox.service';
import { InboxStateService } from '../../services/inbox-state.service';
import { WebSocketService } from '../../services/websocket.service';
import { AnalyticsService } from '../../services/analytics.service';
import { Inbox } from '../../models/email.model';
import { Observable } from 'rxjs';

const LOTTERY_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
const LOTTERY_DURATION = 1800;
const LOTTERY_INTERVAL = 50;

@Component({
  selector: 'app-inbox-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inbox-generator.component.html',
  styleUrls: ['./inbox-generator.component.scss']
})
export class InboxGeneratorComponent implements OnInit, OnDestroy {
  @Input() demoMode = false;
  @Input() displayMode: 'full' | 'hero' | 'controls' = 'full';
  @Output() inboxGenerated = new EventEmitter<Inbox>();
  @Output() generateRequested = new EventEmitter<void>();

  private domainService = inject(DomainService);
  private inboxService = inject(InboxService);
  private inboxState = inject(InboxStateService);
  private wsService = inject(WebSocketService);
  private analytics = inject(AnalyticsService);
  private cdr = inject(ChangeDetectorRef);

  domains$: Observable<string[]> = this.domainService.getDomains();
  selectedDomain: string = '';
  domains: string[] = [];
  domainDropdownOpen = false;
  isGenerating: boolean = false;
  errorMessage: string = '';

  // Lottery animation state
  lotteryActive = false;
  lotteryChars: string[] = [];
  lotteryDomain = '';
  private lotteryTimer: ReturnType<typeof setInterval> | null = null;
  private demoLoopTimer: ReturnType<typeof setTimeout> | null = null;
  protected pendingInbox: Inbox | null = null;
  private animationStart = 0;

  ngOnInit() {
    this.domains$.subscribe({
      next: (domains) => {
        if (domains && domains.length > 0) {
          this.domains = domains;
          this.selectedDomain = domains[0];
          if (this.demoMode && this.displayMode !== 'controls') {
            this.startDemoLoop();
          }
        }
      },
      error: (err: { message?: string }) => {
        this.errorMessage = err.message || 'Failed to load available domains.';
      }
    });
  }

  ngOnDestroy(): void {
    this.stopDemoLoop();
  }

  generateInbox() {
    this.isGenerating = true;
    this.errorMessage = '';
    this.startLottery();

    this.inboxService.generateInbox(this.selectedDomain).subscribe({
      next: (inbox) => {
        this.pendingInbox = inbox;
        this.resolveLottery(inbox.email);
      },
      error: (err: { message?: string }) => {
        this.isGenerating = false;
        this.stopLottery();
        this.errorMessage = err.message || 'Failed to generate inbox. Please try again.';
      }
    });
  }

  private startLottery(): void {
    this.lotteryActive = true;
    this.lotteryDomain = `@${this.selectedDomain}`;
    this.lotteryChars = Array.from({ length: 8 }, () => this.randomChar());
    this.animationStart = Date.now();
    this.pendingInbox = null;

    this.lotteryTimer = setInterval(() => {
      this.lotteryChars = this.lotteryChars.map(() => this.randomChar());
      this.cdr.detectChanges();
    }, LOTTERY_INTERVAL);
  }

  private resolveLottery(email: string): void {
    const localPart = email.split('@')[0];
    const elapsed = Date.now() - this.animationStart;
    const remaining = Math.max(0, LOTTERY_DURATION - elapsed);

    setTimeout(() => {
      this.stopLottery();
      this.lotteryChars = localPart.split('');
      this.lotteryDomain = `@${email.split('@')[1]}`;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.finishGeneration();
      }, 400);
    }, remaining);
  }

  private finishGeneration(): void {
    if (this.pendingInbox) {
      this.inboxState.addInbox(this.pendingInbox);
      this.wsService.subscribeToNew(this.pendingInbox.email);
      this.inboxGenerated.emit(this.pendingInbox);
    }
    this.isGenerating = false;
    this.lotteryActive = false;
    this.cdr.detectChanges();
  }

  private stopLottery(): void {
    if (this.lotteryTimer) {
      clearInterval(this.lotteryTimer);
      this.lotteryTimer = null;
    }
  }

  private startDemoLoop(): void {
    this.lotteryActive = true;
    this.lotteryDomain = `@${this.selectedDomain}`;
    this.lotteryChars = Array.from({ length: 10 }, () => this.randomChar());

    const cycle = () => {
      this.lotteryChars = Array.from({ length: 10 }, () => this.randomChar());
      this.stopLottery();
      this.lotteryTimer = setInterval(() => {
        this.lotteryChars = this.lotteryChars.map(() => this.randomChar());
        this.cdr.detectChanges();
      }, LOTTERY_INTERVAL);

      this.demoLoopTimer = setTimeout(() => {
        this.stopLottery();
        const fakeLocal = Array.from({ length: 10 }, () => this.randomChar()).join('');
        this.lotteryChars = fakeLocal.split('');
        this.cdr.detectChanges();

        this.demoLoopTimer = setTimeout(() => {
          cycle();
        }, 2000);
      }, 600);
    };

    cycle();
  }

  private stopDemoLoop(): void {
    this.stopLottery();
    if (this.demoLoopTimer) {
      clearTimeout(this.demoLoopTimer);
      this.demoLoopTimer = null;
    }
  }

  private randomChar(): string {
    return LOTTERY_CHARS[Math.floor(Math.random() * LOTTERY_CHARS.length)];
  }

  toggleDomainDropdown(): void {
    this.domainDropdownOpen = !this.domainDropdownOpen;
  }

  selectDomain(domain: string): void {
    this.selectedDomain = domain;
    this.domainDropdownOpen = false;
    this.analytics.trackDomainSelected(domain);
  }

  closeDomainDropdown(): void {
    this.domainDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.domain-dropdown')) {
      this.domainDropdownOpen = false;
    }
  }

  dismissError() {
    this.errorMessage = '';
  }

  onCtaClick(): void {
    this.analytics.trackCtaClicked();
    this.stopDemoLoop();
    this.lotteryActive = false;
    this.generateRequested.emit();
    this.generateInbox();
  }
}
