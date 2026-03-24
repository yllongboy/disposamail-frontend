import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InboxGeneratorComponent } from '../inbox-generator/inbox-generator.component';
import { EmailListComponent } from '../email-list/email-list.component';
import { EmailViewerComponent } from '../email-viewer/email-viewer.component';
import { InboxDropdownComponent } from '../inbox-dropdown/inbox-dropdown.component';
import { InboxStateService } from '../../services/inbox-state.service';
import { StorageService } from '../../services/storage.service';
import { AnalyticsService } from '../../services/analytics.service';
import { SavedInbox, Inbox } from '../../models/email.model';

@Component({
  selector: 'app-email-card',
  standalone: true,
  imports: [
    CommonModule,
    InboxGeneratorComponent,
    EmailListComponent,
    EmailViewerComponent,
    InboxDropdownComponent
  ],
  templateUrl: './email-card.component.html',
  styleUrls: ['./email-card.component.scss']
})
export class EmailCardComponent {
  @Input() mode: 'first-visit' | 'generating' | 'email-client' = 'first-visit';
  @Input() activeInbox: SavedInbox | null = null;
  @Input() inboxes: SavedInbox[] = [];
  @Input() unreadCounts: Map<string, number> = new Map();

  @Output() generateRequested = new EventEmitter<void>();
  @Output() inboxGenerated = new EventEmitter<Inbox>();
  @Output() newInboxRequested = new EventEmitter<void>();
  @Output() inboxSelected = new EventEmitter<string>();
  @Output() inboxDeleted = new EventEmitter<string>();

  private storage = inject(StorageService);
  private inboxState = inject(InboxStateService);
  private analytics = inject(AnalyticsService);
  private cdr = inject(ChangeDetectorRef);

  selectedEmailId: string | null = null;
  copied = false;
  private copyTimeout: ReturnType<typeof setTimeout> | null = null;

  onGenerateClicked(): void {
    this.generateRequested.emit();
  }

  onInboxGenerated(inbox: Inbox): void {
    this.selectedEmailId = null;
    this.inboxGenerated.emit(inbox);
  }

  onNewInbox(): void {
    this.selectedEmailId = null;
    this.analytics.trackNewInboxClicked();
    this.newInboxRequested.emit();
  }

  get totalOtherUnread(): number {
    let total = 0;
    for (const [email, count] of this.unreadCounts) {
      if (this.activeInbox && email !== this.activeInbox.email) {
        total += count;
      }
    }
    return total;
  }

  onInboxSelected(email: string): void {
    this.selectedEmailId = null;
    this.inboxSelected.emit(email);
  }

  onInboxDeleted(email: string): void {
    this.selectedEmailId = null;
    this.inboxDeleted.emit(email);
  }

  onEmailSelected(emailId: string): void {
    this.selectedEmailId = emailId;
    this.analytics.trackEmailViewed(emailId);
    if (this.activeInbox) {
      this.inboxState.resetUnread(this.activeInbox.email);
    }
  }

  closeViewer(): void {
    this.selectedEmailId = null;
  }

  copyEmail(): void {
    if (!this.activeInbox) return;
    const email = this.activeInbox.email;

    // Use execCommand fallback for broader compatibility
    const textarea = document.createElement('textarea');
    textarea.value = email;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    this.copied = true;
    this.analytics.trackInboxCopied(this.activeInbox?.email || '');
    if (this.copyTimeout) clearTimeout(this.copyTimeout);
    this.copyTimeout = setTimeout(() => {
      this.copied = false;
      this.cdr.detectChanges();
    }, 2000);
  }

  refreshEmails(): void {
    // EmailListComponent handles its own refresh via loadEmails()
    // We trigger it by briefly toggling email, or using ViewChild
    // For now, we'll use a simple approach: re-set the activeInbox
    if (this.activeInbox) {
      const email = this.activeInbox.email;
      this.activeInbox = { ...this.activeInbox };
      this.cdr.detectChanges();
    }
  }
}
