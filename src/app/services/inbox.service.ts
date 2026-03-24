import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Email, InboxEmail, Inbox } from '../models/email.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InboxService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

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
}
