import { Component, Input, AfterViewInit, inject, NgZone } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-ad-banner',
  standalone: true,
  template: `
    <div class="ad-container" [class.vertical]="orientation === 'vertical'" [class.horizontal]="orientation === 'horizontal'">
      @if (hasAdsense) {
        <ins
          class="adsbygoogle"
          [style.display]="'block'"
          [attr.data-ad-client]="adsensePublisherId"
          [attr.data-ad-slot]="adSlot"
          [attr.data-ad-format]="adFormat"
          [attr.data-full-width-responsive]="'true'">
        </ins>
      } @else {
        <div class="ad-placeholder" aria-label="Advertisement placeholder" role="note"></div>
      }

      <p class="ad-label">Advertisement</p>
    </div>
  `,
  styles: [`
    .ad-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem 0;
      margin-top: 1.5rem;
      border-top: 1px solid var(--slate-100, #f1f5f9);
      box-sizing: border-box;
    }

    .ad-container.horizontal {
      width: 100%;
      min-height: 90px;
    }

    .ad-container.vertical {
      width: 160px;
      height: 100%;
      min-height: 250px;
      margin-top: 0;
      padding: 0;
      border-top: 0;
      justify-content: center;
    }

    .ad-label {
      margin: 0.5rem 0 0;
      font-size: 0.6875rem;
      color: var(--slate-400, #94a3b8);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .ad-container.vertical .ad-label {
      margin-top: 0.375rem;
    }

    ins.adsbygoogle {
      width: 100%;
      min-height: 90px;
    }

    .ad-container.vertical ins.adsbygoogle {
      width: 160px;
      min-height: 250px;
      height: 100%;
    }

    .ad-placeholder {
      width: 100%;
      min-height: 90px;
      border: 1px dashed var(--slate-300, #cbd5e1);
      border-radius: 8px;
      background: var(--slate-50, #f8fafc);
      opacity: 0.8;
    }

    .ad-container.vertical .ad-placeholder {
      width: 160px;
      min-height: 250px;
      height: 100%;
    }
  `]
})
export class AdBannerComponent implements AfterViewInit {
  @Input() adSlot = environment.adsenseSlotId || '0000000000';
  @Input() adFormat = 'auto';
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

  adsensePublisherId = environment.adsensePublisherId;

  get hasAdsense(): boolean {
    return Boolean(this.adsensePublisherId?.trim());
  }

  private ngZone = inject(NgZone);

  ngAfterViewInit(): void {
    if (!this.hasAdsense) return;
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        try {
          const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || [];
          adsbygoogle.push({});
        } catch {
          // AdSense not loaded or blocked
        }
      }, 100);
    });
  }
}
