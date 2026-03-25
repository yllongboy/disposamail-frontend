import { Component, OnInit, OnDestroy, AfterViewInit, inject, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmailCardComponent } from '../email-card/email-card.component';
import { InboxGeneratorComponent } from '../inbox-generator/inbox-generator.component';
import { AdBannerComponent } from '../ad-banner/ad-banner.component';
import { InboxStateService } from '../../services/inbox-state.service';
import { InboxService } from '../../services/inbox.service';
import { WebSocketService } from '../../services/websocket.service';
import { DomainService } from '../../services/domain.service';
import { AnalyticsService } from '../../services/analytics.service';
import { SavedInbox, Inbox } from '../../models/email.model';
import { environment } from '../../../environments/environment';

export type CardMode = 'first-visit' | 'generating' | 'email-client';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, EmailCardComponent, InboxGeneratorComponent, FormsModule, AdBannerComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy, AfterViewInit {
  private inboxState = inject(InboxStateService);
  private inboxService = inject(InboxService);
  private wsService = inject(WebSocketService);
  private domainService = inject(DomainService);
  private analytics = inject(AnalyticsService);
  private el = inject(ElementRef);
  private ngZone = inject(NgZone);
  private observer: IntersectionObserver | null = null;

  inboxes: SavedInbox[] = [];
  activeInbox: SavedInbox | null = null;
  unreadCounts: Map<string, number> = new Map();
  currentEmail = '';
  cardMode: CardMode = 'first-visit';
  appName = environment.appName;
  currentYear = new Date().getFullYear();
  appVersion = '1.0.0';

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.inboxState.initialize();

    this.subscriptions.push(
      this.inboxState.inboxes$.subscribe(inboxes => {
        this.inboxes = inboxes;
      })
    );

    this.subscriptions.push(
      this.inboxState.activeInbox$.subscribe(inbox => {
        this.activeInbox = inbox;
        this.currentEmail = inbox ? inbox.email : '';
      })
    );

    this.subscriptions.push(
      this.inboxState.unreadCounts$.subscribe(counts => {
        this.unreadCounts = counts;
      })
    );

    // Subscribe WS to all stored inboxes
    const allEmails = this.inboxState.getAllInboxEmails();
    if (allEmails.length > 0) {
      this.wsService.subscribeAll(allEmails);
    }

    // Listen for new emails to update unread counts
    this.subscriptions.push(
      this.wsService.messages$.subscribe(event => {
        this.analytics.trackEmailReceived(event.email);
        if (event.email !== this.currentEmail) {
          this.inboxState.incrementUnread(event.email);
        }
      })
    );

    // Determine initial card mode
    if (this.inboxes.length > 0) {
      this.cardMode = 'email-client';
    } else {
      this.cardMode = 'first-visit';
    }
  }

  ngAfterViewInit(): void {
    this.setupScrollReveal();
    this.setupScrollTracking();
  }

  private setupScrollReveal(): void {
    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              this.observer?.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );

      const sections = this.el.nativeElement.querySelectorAll('.reveal-on-scroll');
      for (const section of sections) {
        this.observer.observe(section);
      }
    });
  }

  private setupScrollTracking(): void {
    const sectionMap = [
      { selector: '.hero', name: 'hero' },
      { selector: '.how-it-works', name: 'how_it_works' },
      { selector: '.features', name: 'features' },
      { selector: '.use-cases', name: 'use_cases' },
      { selector: '.site-footer', name: 'footer' },
    ];

    const sections = sectionMap
      .map(s => {
        const el = this.el.nativeElement.querySelector(s.selector);
        return el ? { element: el, name: s.name } : null;
      })
      .filter((s): s is { element: Element; name: string } => s !== null);

    if (sections.length > 0) {
      this.analytics.setupScrollTracking(sections);
    }
  }

  ngOnDestroy(): void {
    this.analytics.destroy();
    this.observer?.disconnect();
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  onGenerateRequested(): void {
    // No mode change needed - hero generator handles generation inline
    // and emits inboxGenerated when complete
  }

  onInboxGenerated(inbox: Inbox): void {
    this.cardMode = 'email-client';
    this.analytics.trackInboxGenerated(inbox.email, inbox.email.split('@')[1]);
    this.analytics.setUserProperty('has_inbox', true);
    this.analytics.setUserProperty('inbox_count', this.inboxes.length);
  }

  onNewInboxRequested(): void {
    this.cardMode = 'generating';
  }

  onInboxSelected(email: string): void {
    this.inboxState.selectInbox(email);
    this.inboxState.resetUnread(email);
    this.analytics.trackInboxSwitched(email);
  }

  onInboxDeleted(email: string): void {
    this.analytics.trackInboxDeleted();
    this.wsService.unsubscribe(email);
    this.inboxService.deleteInbox(email).subscribe({
      next: () => this.inboxState.removeInbox(email),
      error: () => this.inboxState.removeInbox(email)
    });

    // If all inboxes deleted, go back to first-visit
    setTimeout(() => {
      if (this.inboxes.length === 0) {
        this.cardMode = 'first-visit';
      }
    });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
