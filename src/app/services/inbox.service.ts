import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Email, Inbox, InboxEmail } from '../models/email.model';

@Injectable({ providedIn: 'root' })
export class InboxService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  generateInbox(domain?: string): Observable<Inbox> {
    return this.http.post<Inbox>(`${this.apiUrl}/inbox`, domain ? { domain } : {});
  }

  getEmails(email: string): Observable<InboxEmail[]> {
    return this.http.get<{ emails: InboxEmail[]; count: number }>(`${this.apiUrl}/inbox/${encodeURIComponent(email)}`)
      .pipe(map(res => res.emails));
  }

  getEmailContent(id: string): Observable<Email> {
    return this.http.get<Email>(`${this.apiUrl}/email/${encodeURIComponent(id)}`);
  }

  deleteInbox(email: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/inbox/${encodeURIComponent(email)}`);
  }

  deleteEmail(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/email/${encodeURIComponent(id)}`);
  }

  deleteEmails(ids: string[]): Observable<{ deleted: number }> {
    return this.http.post<{ deleted: number }>(`${this.apiUrl}/email/bulk-delete`, { ids });
  }

  persistInbox(email: string, persist: boolean): Observable<{ persisted: boolean }> {
    return this.http.patch<{ persisted: boolean }>(
      `${this.apiUrl}/inbox/${encodeURIComponent(email)}/persist`,
      { persist }
    );
  }
}
