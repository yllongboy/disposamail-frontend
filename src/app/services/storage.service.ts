import { Injectable } from '@angular/core';
import { SavedInbox } from '../models/email.model';

const KEY_PREFIX = 'disposaMail_';
const INBOXES_KEY = `${KEY_PREFIX}inboxes`;
const READ_EMAILS_KEY = `${KEY_PREFIX}readEmails`;
const INITIALIZED_KEY = `${KEY_PREFIX}initialized`;

@Injectable({ providedIn: 'root' })
export class StorageService {

  getInboxes(): SavedInbox[] {
    return this.getArray<SavedInbox>(INBOXES_KEY);
  }

  addInbox(inbox: SavedInbox): void {
    const inboxes = this.getInboxes();
    const exists = inboxes.some(i => i.email === inbox.email);
    if (!exists) {
      inboxes.unshift(inbox);
      this.setItem(INBOXES_KEY, inboxes);
    }
  }

  removeInbox(email: string): void {
    const inboxes = this.getInboxes().filter(i => i.email !== email);
    this.setItem(INBOXES_KEY, inboxes);
  }

  pruneExpiredInboxes(ttlMs: number): SavedInbox[] {
    const now = Date.now();
    const inboxes = this.getInboxes();
    const active = inboxes.filter(i => (now - i.createdAt) < ttlMs);
    const pruned = inboxes.filter(i => (now - i.createdAt) >= ttlMs);
    this.setItem(INBOXES_KEY, active);
    return pruned;
  }

  getReadEmailIds(): Set<string> {
    const arr = this.getArray<string>(READ_EMAILS_KEY);
    return new Set(arr);
  }

  markEmailRead(id: string): void {
    const ids = this.getReadEmailIds();
    ids.add(id);
    this.setItem(READ_EMAILS_KEY, [...ids]);
  }

  isEmailRead(id: string): boolean {
    return this.getReadEmailIds().has(id);
  }

  isFirstVisit(): boolean {
    return !localStorage.getItem(INITIALIZED_KEY);
  }

  markInitialized(): void {
    localStorage.setItem(INITIALIZED_KEY, '1');
  }

  clearAll(): void {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(KEY_PREFIX));
    for (const key of keys) {
      localStorage.removeItem(key);
    }
  }

  private getArray<T>(key: string): T[] {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      localStorage.removeItem(key);
      return [];
    }
  }

  private setItem(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        this.pruneOldestInboxes(10);
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch {
          // Storage is truly full, silently fail
        }
      }
    }
  }

  private pruneOldestInboxes(keepCount: number): void {
    const inboxes = this.getInboxes();
    if (inboxes.length > keepCount) {
      const trimmed = inboxes.slice(0, keepCount);
      localStorage.setItem(INBOXES_KEY, JSON.stringify(trimmed));
    }
  }
}
