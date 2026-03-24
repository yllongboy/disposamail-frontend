import { Injectable, inject, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = environment.gaTrackingId;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private ngZone = inject(NgZone);
  private initialized = false;
  private consentGiven = false;
  private scrollObserver: IntersectionObserver | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private sessionStart = Date.now();

  /** Load the GA4 script and initialize tracking (call after consent) */
  initialize(): void {
    if (this.initialized || !GA_MEASUREMENT_ID) return;
    this.initialized = true;
    this.consentGiven = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: unknown[]) {
      window.dataLayer.push(Object.assign({}, ...args.filter(a => typeof a === 'object' && a !== null)));
    };

    this.gtag('js', new Date());
    this.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: true
    });

    this.startEngagementTracking();
  }

  /** Send a custom event to GA4 */
  trackEvent(eventName: string, params: Record<string, unknown> = {}): void {
    if (!this.consentGiven) return;
    this.gtag('event', eventName, params);
  }

  /** Set user properties for segmentation */
  setUserProperty(name: string, value: string | number | boolean): void {
    if (!this.consentGiven) return;
    this.gtag('set', 'user_properties', { [name]: value });
  }

  // ── Predefined Event Helpers ──

  trackInboxGenerated(email: string, domain: string): void {
    this.trackEvent('inbox_generated', { email_domain: domain });
  }

  trackCtaClicked(): void {
    this.trackEvent('cta_clicked');
  }

  trackEmailReceived(inboxEmail: string): void {
    this.trackEvent('email_received', { inbox: inboxEmail });
  }

  trackEmailViewed(emailId: string): void {
    this.trackEvent('email_viewed', { email_id: emailId });
  }

  trackInboxCopied(email: string): void {
    this.trackEvent('inbox_copied', { email_domain: email.split('@')[1] });
  }

  trackInboxSwitched(email: string): void {
    this.trackEvent('inbox_switched');
  }

  trackInboxDeleted(): void {
    this.trackEvent('inbox_deleted');
  }

  trackNewInboxClicked(): void {
    this.trackEvent('new_inbox_clicked');
  }

  trackDomainSelected(domain: string): void {
    this.trackEvent('domain_selected', { domain });
  }

  trackScrollDepth(section: string): void {
    this.trackEvent('scroll_depth', { section });
  }

  // ── Engagement Tracking ──

  private startEngagementTracking(): void {
    this.ngZone.runOutsideAngular(() => {
      // Heartbeat every 30s while page is visible
      this.heartbeatTimer = setInterval(() => {
        if (document.visibilityState === 'visible') {
          const elapsed = Math.round((Date.now() - this.sessionStart) / 1000);
          this.trackEvent('session_heartbeat', { elapsed_seconds: elapsed });
        }
      }, 30000);

      // Track when user leaves
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          const elapsed = Math.round((Date.now() - this.sessionStart) / 1000);
          this.trackEvent('session_end', { total_seconds: elapsed });
        }
      });
    });
  }

  /** Call from a component with IntersectionObserver to track scroll depth */
  setupScrollTracking(sections: { element: Element; name: string }[]): void {
    if (!this.consentGiven) return;

    this.ngZone.runOutsideAngular(() => {
      const tracked = new Set<string>();
      this.scrollObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const name = (entry.target as HTMLElement).dataset['section'];
            if (entry.isIntersecting && name && !tracked.has(name)) {
              tracked.add(name);
              this.trackScrollDepth(name);
            }
          }
        },
        { threshold: 0.3 }
      );

      for (const s of sections) {
        (s.element as HTMLElement).dataset['section'] = s.name;
        this.scrollObserver.observe(s.element);
      }
    });
  }

  destroy(): void {
    this.scrollObserver?.disconnect();
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
  }

  private gtag(...args: unknown[]): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag(...args);
    }
  }
}
