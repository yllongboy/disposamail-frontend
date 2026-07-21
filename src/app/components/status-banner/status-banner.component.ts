import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

type BannerType = 'info' | 'warning' | 'success';

interface BannerConfig {
  enabled: boolean;
  message: string;
  type: BannerType;
}

@Component({
  selector: 'app-status-banner',
  standalone: true,
  imports: [NgClass],
  template: `
    @if (visible) {
      <div class="status-banner" [ngClass]="bannerType" role="status">
        <div class="banner-content">
          <span class="banner-icon">
            @if (bannerType === 'success') { ✓ }
            @else if (bannerType === 'warning') { ⚠ }
            @else { ℹ }
          </span>
          <p class="banner-message">{{ message }}</p>
          <button class="banner-dismiss" (click)="dismiss()" aria-label="Dismiss banner">✕</button>
        </div>
      </div>
    }
  `,
  styles: [`
    .status-banner {
      position: relative;
      padding: 12px 24px;
      border-bottom: 2px solid;
      animation: slideDown 0.3s ease-out;
    }

    .banner-content {
      max-width: 72rem;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .banner-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .banner-message {
      flex: 1;
      margin: 0;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .banner-dismiss {
      padding: 0;
      border: 0;
      background: none;
      color: var(--slate-400);
      font-size: 1.25rem;
      cursor: pointer;
    }

    .banner-dismiss:hover {
      color: var(--slate-600);
    }

    .info {
      background: var(--blue-50);
      border-color: var(--blue-500);
    }

    .info .banner-icon {
      color: var(--blue-500);
    }

    .warning {
      background: var(--amber-100);
      border-color: var(--amber-500);
    }

    .warning .banner-icon {
      color: var(--amber-500);
    }

    .success {
      background: var(--emerald-100);
      border-color: var(--emerald-500);
    }

    .success .banner-icon {
      color: var(--emerald-500);
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-100%);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .status-banner {
        padding: 10px 16px;
      }
    }
  `]
})
export class StatusBannerComponent {
  visible = false;
  message = '';
  bannerType: BannerType = 'info';

  private readonly dismissKeyPrefix = `${environment.storagePrefix}banner_dismissed_`;

  constructor() {
    const config = (environment as typeof environment & { banner?: BannerConfig }).banner;
    if (!config?.enabled || !config.message?.trim()) return;

    this.message = config.message;
    this.bannerType = ['info', 'warning', 'success'].includes(config.type) ? config.type : 'info';

    const dismissKey = this.dismissKeyPrefix + this.hashCode(this.message);
    try {
      this.visible = !sessionStorage.getItem(dismissKey);
    } catch {
      this.visible = true;
    }
  }

  dismiss(): void {
    const dismissKey = this.dismissKeyPrefix + this.hashCode(this.message);
    try {
      sessionStorage.setItem(dismissKey, '1');
    } catch {
      // The banner still dismisses for the current page when storage is unavailable.
    }
    this.visible = false;
  }

  private hashCode(value: string): string {
    let hash = 0;
    for (let index = 0; index < value.length; index++) {
      const character = value.charCodeAt(index);
      hash = ((hash << 5) - hash) + character;
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }
}