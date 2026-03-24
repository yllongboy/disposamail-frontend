import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { SavedInbox, Inbox } from '../models/email.model';

const DEFAULT_TTL_MS = 86400 * 1000; // 24 hours

@Injectable({ providedIn: 'root' })
export class InboxStateService {
  private inboxesSubject = new BehaviorSubject<SavedInbox[]>([]);
  private activeInboxSubject = new BehaviorSubject<SavedInbox | null>(null);
  private unreadCountsSubject = new BehaviorSubject<Map<string, number>>(new Map());

  inboxes$: Observable<SavedInbox[]> = this.inboxesSubject.asObservable();
  activeInbox$: Observable<SavedInbox | null> = this.activeInboxSubject.asObservable();
  unreadCounts$: Observable<Map<string, number>> = this.unreadCountsSubject.asObservable();

  constructor(private storage: StorageService) {}

  initialize(): void {
    this.storage.pruneExpiredInboxes(DEFAULT_TTL_MS);
    const inboxes = this.storage.getInboxes();
    this.inboxesSubject.next(inboxes);

    if (inboxes.length > 0) {
      this.activeInboxSubject.next(inboxes[0]);
    }
  }

  isFirstVisit(): boolean {
    return this.storage.isFirstVisit();
  }

  addInbox(inbox: Inbox): SavedInbox {
    const saved: SavedInbox = { ...inbox };
    this.storage.addInbox(saved);
    this.storage.markInitialized();

    const inboxes = this.storage.getInboxes();
    this.inboxesSubject.next(inboxes);
    this.activeInboxSubject.next(saved);

    return saved;
  }

  selectInbox(email: string): void {
    const inboxes = this.inboxesSubject.getValue();
    const found = inboxes.find(i => i.email === email);
    if (found) {
      this.activeInboxSubject.next(found);
    }
  }

  removeInbox(email: string): void {
    this.storage.removeInbox(email);
    const inboxes = this.storage.getInboxes();
    this.inboxesSubject.next(inboxes);

    const active = this.activeInboxSubject.getValue();
    if (active && active.email === email) {
      this.activeInboxSubject.next(inboxes.length > 0 ? inboxes[0] : null);
    }
  }

  getLatestInbox(): SavedInbox | null {
    const inboxes = this.inboxesSubject.getValue();
    return inboxes.length > 0 ? inboxes[0] : null;
  }

  getActiveInbox(): SavedInbox | null {
    return this.activeInboxSubject.getValue();
  }

  getAllInboxEmails(): string[] {
    return this.inboxesSubject.getValue().map(i => i.email);
  }

  incrementUnread(email: string): void {
    const counts = new Map(this.unreadCountsSubject.getValue());
    counts.set(email, (counts.get(email) || 0) + 1);
    this.unreadCountsSubject.next(counts);
  }

  resetUnread(email: string): void {
    const counts = new Map(this.unreadCountsSubject.getValue());
    counts.delete(email);
    this.unreadCountsSubject.next(counts);
  }
}
