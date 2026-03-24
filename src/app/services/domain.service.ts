import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DomainService {
  private apiUrl = environment.apiUrl;
  private domains$!: Observable<string[]>;
  private initialized = false;

  constructor(private http: HttpClient) {}

  getDomains(): Observable<string[]> {
    if (!this.initialized) {
      this.initialized = true;
      this.domains$ = this.http.get<{ domains: string[] }>(`${this.apiUrl}/domains`)
        .pipe(
          map(res => res.domains),
          shareReplay(1)
        );
    }
    return this.domains$;
  }
}
