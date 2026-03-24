import { Component, Input, Output, EventEmitter, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavedInbox } from '../../models/email.model';

@Component({
  selector: 'app-inbox-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inbox-dropdown.component.html',
  styleUrls: ['./inbox-dropdown.component.scss']
})
export class InboxDropdownComponent {
  @Input() inboxes: SavedInbox[] = [];
  @Input() activeEmail: string = '';
  @Input() unreadCounts: Map<string, number> = new Map();
  @Output() inboxSelected = new EventEmitter<string>();
  @Output() inboxDeleted = new EventEmitter<string>();

  private el = inject(ElementRef);
  isOpen = false;

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen && !this.el.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  selectInbox(email: string): void {
    this.inboxSelected.emit(email);
    this.isOpen = false;
  }

  deleteInbox(event: MouseEvent, email: string): void {
    event.stopPropagation();
    this.inboxDeleted.emit(email);
  }

  getUnreadCount(email: string): number {
    return this.unreadCounts.get(email) || 0;
  }

  getLocalPart(email: string): string {
    return email.split('@')[0] || '';
  }

  getDomain(email: string): string {
    return email.split('@')[1] || '';
  }

  getRelativeTime(createdAt: number): string {
    const diff = Math.floor((Date.now() - createdAt) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }
}
