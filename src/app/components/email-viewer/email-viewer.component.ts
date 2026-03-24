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
  templateUrl: './email-viewer.component.html',
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

  formatBytes(bytes: number, decimals = 2): string {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }
}