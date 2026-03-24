import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { InboxEmail } from '../models/email.model';

export interface InboxEmailEvent {
  email: string;
  data: InboxEmail;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService implements OnDestroy {
  private ws: WebSocket | null = null;
  private messagesSubject = new Subject<InboxEmailEvent>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private subscribedEmails = new Set<string>();
  private isDestroyed = false;
  private isConnected = false;

  messages$: Observable<InboxEmailEvent> = this.messagesSubject.asObservable();

  subscribeAll(emails: string[]): void {
    for (const email of emails) {
      this.subscribedEmails.add(email);
    }
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.reconnectAttempts = 0;
      this.connect();
    } else {
      for (const email of emails) {
        this.sendSubscribe(email);
      }
    }
  }

  subscribeToNew(email: string): void {
    this.subscribedEmails.add(email);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.sendSubscribe(email);
    } else {
      this.reconnectAttempts = 0;
      this.connect();
    }
  }

  unsubscribe(email: string): void {
    this.subscribedEmails.delete(email);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'unsubscribe', email }));
    }
  }

  disconnect(): void {
    this.subscribedEmails.clear();
    this.reconnectAttempts = this.maxReconnectAttempts;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  private connect(): void {
    if (this.isDestroyed) return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const wsUrl = this.getWsUrl();
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      for (const email of this.subscribedEmails) {
        this.sendSubscribe(email);
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new-email' && data.data) {
          const recipientEmail = data.data.to || this.findMatchingInbox(data.data);
          this.messagesSubject.next({ email: recipientEmail, data: data.data });
        }
      } catch (e) {
        console.error('WebSocket message parse error:', e);
      }
    };

    this.ws.onclose = () => {
      this.isConnected = false;
      if (this.subscribedEmails.size > 0 && this.reconnectAttempts < this.maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        this.reconnectAttempts++;
        this.reconnectTimer = setTimeout(() => this.connect(), delay);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private sendSubscribe(email: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'subscribe', email }));
    }
  }

  private findMatchingInbox(emailData: InboxEmail): string {
    // Fallback: try to match from subscribed emails
    return [...this.subscribedEmails][0] || '';
  }

  private getWsUrl(): string {
    if (environment.wsUrl) return environment.wsUrl;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/ws`;
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.disconnect();
    this.messagesSubject.complete();
  }
}
