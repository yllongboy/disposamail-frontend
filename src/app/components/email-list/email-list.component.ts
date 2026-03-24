import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, OnDestroy, Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { InboxService } from '../../services/inbox.service';
import { WebSocketService, InboxEmailEvent } from '../../services/websocket.service';
import { StorageService } from '../../services/storage.service';
import { InboxEmail } from '../../models/email.model';
import { AdBannerComponent } from '../ad-banner/ad-banner.component';

@Pipe({
  name: 'relativeTime',
  standalone: true
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }
}

@Component({
  selector: 'app-email-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RelativeTimePipe, AdBannerComponent],
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss']
})
export class EmailListComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) email!: string;
  @Output() emailSelected = new EventEmitter<string>();

  emails: InboxEmail[] = [];
  isLoading = false;
  error = '';
  selectedIds = new Set<string>();
  allSelected = false;
  isDeleting = false;
  private wsSubscription?: Subscription;

  constructor(
    private inboxService: InboxService,
    private wsService: WebSocketService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.setupWebsocket();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['email'] && this.email) {
      this.selectedIds.clear();
      this.allSelected = false;
      this.loadEmails();
    }
  }

  ngOnDestroy() {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
  }

  loadEmails() {
    if (!this.email) return;

    this.isLoading = true;
    this.error = '';

    this.inboxService.getEmails(this.email)
      .pipe(
        catchError((err: { message?: string }) => {
          this.error = err.message || 'Failed to load emails';
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe(emails => {
        this.emails = emails || [];
      });
  }

  private setupWebsocket() {
    this.wsSubscription = this.wsService.messages$.subscribe((event: InboxEmailEvent) => {
      if (event.email === this.email && event.data) {
        this.emails = [event.data, ...this.emails];
        this.cdr.detectChanges();
      }
    });
  }

  selectEmail(id: string) {
    this.storageService.markEmailRead(id);
    this.emailSelected.emit(id);
  }

  isRead(id: string): boolean {
    return this.storageService.isEmailRead(id);
  }

  toggleSelection(event: Event, id: string): void {
    event.stopPropagation();
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    this.allSelected = this.emails.length > 0 && this.selectedIds.size === this.emails.length;
  }

  toggleSelectAll(): void {
    if (this.allSelected) {
      this.selectedIds.clear();
      this.allSelected = false;
    } else {
      for (const mail of this.emails) {
        this.selectedIds.add(mail.id);
      }
      this.allSelected = true;
    }
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  deleteSelected(): void {
    if (this.selectedIds.size === 0) return;
    this.isDeleting = true;
    const ids = [...this.selectedIds];

    this.inboxService.deleteEmails(ids).subscribe({
      next: () => {
        this.emails = this.emails.filter(e => !this.selectedIds.has(e.id));
        this.selectedIds.clear();
        this.allSelected = false;
        this.isDeleting = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isDeleting = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteSingle(event: Event, id: string): void {
    event.stopPropagation();
    this.inboxService.deleteEmail(id).subscribe({
      next: () => {
        this.emails = this.emails.filter(e => e.id !== id);
        this.selectedIds.delete(id);
        this.allSelected = this.emails.length > 0 && this.selectedIds.size === this.emails.length;
        this.cdr.detectChanges();
      }
    });
  }

  copyEmail(): void {
    if (this.email) {
      navigator.clipboard.writeText(this.email);
    }
  }
}