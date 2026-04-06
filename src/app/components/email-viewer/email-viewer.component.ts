import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { InboxService } from '../../services/inbox.service';
import { StorageService } from '../../services/storage.service';
import { Email } from '../../models/email.model';

@Component({
  selector: 'app-email-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="email-viewer">
      @if (loading) {
        <div class="viewer-state">
          <div class="spinner"></div>
          <p>Loading email...</p>
        </div>
      } @else if (errorMessage) {
        <div class="viewer-state error">
          <p>{{ errorMessage }}</p>
        </div>
      } @else if (email) {
        <div class="viewer-content">
          <!-- Subject -->
          <h2 class="viewer-subject">{{ email.subject || '(No Subject)' }}</h2>

          <!-- Sender info -->
          <div class="sender-row">
            <div class="sender-avatar">
              {{ getSenderInitials(email.from) }}
            </div>
            <div class="sender-info">
              <p class="sender-from">{{ email.from }}</p>
              <p class="sender-date">{{ email.date | date:'medium' }}</p>
            </div>
          </div>

          @if (email.hasAttachments && email.attachments.length > 0) {
            <div class="attachments">
              @for (attachment of email.attachments; track attachment.filename) {
                <span class="attachment-pill">
                  {{ attachment.filename }}
                  <span class="attachment-size">({{ formatBytes(attachment.size) }})</span>
                </span>
              }
            </div>
          }

          <!-- View mode toggle -->
          <div class="view-toggle">
            <button
              class="toggle-btn"
              [class.active]="viewMode === 'html'"
              (click)="setViewMode('html')"
              [disabled]="!email.html">
              HTML
            </button>
            <button
              class="toggle-btn"
              [class.active]="viewMode === 'text'"
              (click)="setViewMode('text')"
              [disabled]="!email.text">
              Text
            </button>
          </div>

          <!-- Content -->
          <div class="content-area">
            @if (viewMode === 'html' && email.html && safeHtmlDoc) {
              <iframe
                class="html-frame"
                sandbox=""
                [srcdoc]="safeHtmlDoc"
                title="Email HTML Content">
              </iframe>
            } @else if (viewMode === 'text' && email.text) {
              <pre class="text-content">{{ email.text }}</pre>
            } @else {
              <div class="empty-content">No content available.</div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./email-viewer.component.scss']
})
export class EmailViewerComponent implements OnChanges {
  @Input() emailId: string | null = null;
  @Output() closed = new EventEmitter<void>();

  private inboxService = inject(InboxService);
  private sanitizer = inject(DomSanitizer);
  private storage = inject(StorageService);

  email: Email | null = null;
  loading = true;
  errorMessage = '';
  viewMode: 'html' | 'text' = 'html';
  safeHtmlDoc: SafeHtml | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['emailId'] && this.emailId) {
      this.fetchEmail(this.emailId);
    }
  }

  fetchEmail(id: string): void {
    this.loading = true;
    this.errorMessage = '';
    this.email = null;
    this.safeHtmlDoc = null;

    this.inboxService.getEmailContent(id).subscribe({
      next: (email) => {
        this.email = email;
        this.loading = false;
        this.storage.markEmailRead(id);
        if (email.html) {
          this.viewMode = 'html';
          this.safeHtmlDoc = this.sanitizer.bypassSecurityTrustHtml(email.html);
        } else {
          this.viewMode = 'text';
        }
      },
      error: (err: { message?: string; status?: number }) => {
        if (err.status === 404) {
          this.errorMessage = 'This email was not found or has expired.';
        } else {
          this.errorMessage = err.message || 'Failed to load email. Please try again.';
        }
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.closed.emit();
  }

  setViewMode(mode: 'html' | 'text'): void {
    this.viewMode = mode;
  }

  getSenderInitials(from: string | null | undefined): string {
    if (!from) return '?';

    const rawFrom = from.trim();
    if (!rawFrom) return '?';

    const displayNameMatch = rawFrom.match(/^\s*"?([^"<]+?)"?\s*<[^>]+>\s*$/);
    const displayName = displayNameMatch?.[1]?.trim();

    if (displayName) {
      const words = displayName
        .replace(/^"+|"+$/g, '')
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      if (words.length === 0) return '?';

      const first = words[0].charAt(0).toUpperCase();
      const last = words[words.length - 1].charAt(0).toUpperCase();
      return words.length === 1 ? first : `${first}${last}`;
    }

    const emailMatch = rawFrom.match(/<?\s*([^\s<>@]+)@[^\s<>]+\s*>?/);
    const localPart = emailMatch?.[1]?.trim();
    if (localPart) {
      return localPart.charAt(0).toUpperCase();
    }

    const cleaned = rawFrom.replace(/^"+|"+$/g, '').trim();
    return cleaned ? cleaned.charAt(0).toUpperCase() : '?';
  }

  formatBytes(bytes: number, decimals = 2): string {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }
}