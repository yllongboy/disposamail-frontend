import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component';
import { AnalyticsService } from './services/analytics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CookieConsentComponent],
  template: `
    <nav class="navbar">
      <div class="navbar-content">
        <a routerLink="/" class="navbar-brand">
          <div class="brand-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </div>
          <div class="brand-info">
            <span class="brand-text">{{ appName }}</span>
            <p class="navbar-tagline">{{ appTagline }}</p>
          </div>
        </a>
        <div class="navbar-nav">
          <a routerLink="/faq" routerLinkActive="active" class="nav-link">FAQ</a>
        </div>
      </div>
    </nav>
    <main class="page-content">
      <router-outlet />
    </main>
    <app-cookie-consent (consentGiven)="onConsent($event)"></app-cookie-consent>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }

    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 50;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--slate-100, #f1f5f9);
      height: 64px;
    }

    .navbar-content {
      max-width: 72rem;
      margin: 0 auto;
      padding: 0 1rem;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      cursor: pointer;
      transition: opacity 0.2s ease;
    }

    .navbar-brand:hover {
      opacity: 0.8;
    }

    .brand-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--blue-500, #3b82f6), var(--blue-600, #2563eb));
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.25);
      flex-shrink: 0;
    }

    .brand-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .brand-text {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--slate-800, #1e293b);
    }

    .navbar-tagline {
      color: var(--slate-500, #64748b);
      font-size: 0.75rem;
      margin: 0;
    }

    .navbar-nav {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .nav-link {
      color: var(--slate-600, #475569);
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .nav-link:hover {
      color: var(--blue-600, #2563eb);
      background: var(--blue-50, #eff6ff);
    }

    .nav-link.active {
      color: var(--blue-600, #2563eb);
      background: var(--blue-50, #eff6ff);
      font-weight: 600;
    }

    .page-content {
      padding-top: 64px;
    }

    @media (max-width: 640px) {
      .navbar-content {
        padding: 0 1rem;
      }
      .navbar-tagline {
        display: none;
      }
      .brand-text {
        font-size: 1rem;
      }
      .navbar-nav {
        gap: 1rem;
      }
      .nav-link {
        font-size: 0.9rem;
      }
    }

    @media (min-width: 640px) {
      .navbar-content {
        padding: 0 1.5rem;
      }
    }

    @media (min-width: 1024px) {
      .navbar-content {
        padding: 0 2rem;
      }
    }
  `]
})
export class AppComponent {
  private analytics = inject(AnalyticsService);
  appName = environment.appName;
  appTagline = environment.appTagline;

  onConsent(accepted: boolean): void {
    if (accepted) {
      this.analytics.initialize();
    }
  }
}
