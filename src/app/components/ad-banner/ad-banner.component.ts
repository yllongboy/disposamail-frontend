import { Component, Input, AfterViewInit, ElementRef, inject, NgZone } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-ad-banner',
  standalone: true,
  template: `
    @if (adsensePublisherId) {
      <div class="ad-container">
        <ins class="adsbygoogle"
          [style.display]="'block'"
          [attr.data-ad-client]="adsensePublisherId"
          [attr.data-ad-slot]="adSlot"
          [attr.data-ad-format]="adFormat"
          [attr.data-full-width-responsive]="'true'">
        </ins>
        <p class="ad-label">Advertisement</p>
      </div>
    }
  `,
  styles: [`
    .ad-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem 0;
      margin-top: 1.5rem;
      border-top: 1px solid var(--slate-100, #f1f5f9);
    }

    .ad-label {
      margin: 0.5rem 0 0;
      font-size: 0.6875rem;
      color: var(--slate-400, #94a3b8);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    ins.adsbygoogle {
      width: 100%;
      min-height: 100px;
    }
  `]
})
export class AdBannerComponent implements AfterViewInit {
  @Input() adSlot = environment.adsenseSlotId || '0000000000';
  @Input() adFormat = 'auto';

  adsensePublisherId = environment.adsensePublisherId;

  private el = inject(ElementRef);
  private ngZone = inject(NgZone);

  ngAfterViewInit(): void {
    if (!this.adsensePublisherId) return;
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
