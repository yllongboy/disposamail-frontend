import { Component, EventEmitter, Output } from '@angular/core';
import { environment } from '../../../environments/environment';

const CONSENT_KEY = `${environment.storagePrefix}analytics_consent`;

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  template: `
    @if (!dismissed) {
      <div class="consent-banner" role="dialog" aria-label="Cookie consent">
        <div class="consent-content">
          <div class="consent-text">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="consent-icon">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
            </svg>
            <p>We use analytics cookies to understand how you use our site and improve your experience.</p>
          </div>
          <div class="consent-actions">
            <button class="btn-decline" (click)="decline()">Decline</button>
            <button class="btn-accept" (click)="accept()">Accept</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .consent-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 1rem;
      animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .consent-content {
      max-width: 48rem;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      background: white;
      border: 1px solid var(--slate-200, #e2e8f0);
      border-radius: 12px;
      padding: 1rem 1.25rem;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .consent-text {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      flex: 1;
    }

    .consent-icon {
      flex-shrink: 0;
      color: var(--blue-500, #3b82f6);
      margin-top: 2px;
    }

    .consent-text p {
      margin: 0;
      font-size: 0.8125rem;
      color: var(--slate-600, #475569);
      line-height: 1.5;
    }

    .consent-actions {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .btn-decline {
      padding: 0.5rem 1rem;
      border: 1px solid var(--slate-200, #e2e8f0);
      border-radius: 8px;
      background: white;
      color: var(--slate-600, #475569);
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: var(--slate-50, #f8fafc);
        border-color: var(--slate-300, #cbd5e1);
      }
    }

    .btn-accept {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 8px;
      background: var(--blue-600, #2563eb);
      color: white;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: var(--blue-700, #1d4ed8);
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(100%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 640px) {
      .consent-content {
        flex-direction: column;
        text-align: center;
      }

      .consent-text {
        flex-direction: column;
        align-items: center;
      }

      .consent-actions {
        width: 100%;
      }

      .btn-decline,
      .btn-accept {
        flex: 1;
      }
    }
  `]
})
export class CookieConsentComponent {
  @Output() consentGiven = new EventEmitter<boolean>();
  dismissed = false;

  constructor() {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored !== null) {
      this.dismissed = true;
      // Emit stored preference on next tick so parent can subscribe
      setTimeout(() => this.consentGiven.emit(stored === 'true'));
    }
  }

  accept(): void {
    localStorage.setItem(CONSENT_KEY, 'true');
    this.dismissed = true;
    this.consentGiven.emit(true);
  }

  decline(): void {
    localStorage.setItem(CONSENT_KEY, 'false');
    this.dismissed = true;
    this.consentGiven.emit(false);
  }
}
