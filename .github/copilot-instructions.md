# DisposaMail Frontend — Copilot Project Instructions

This is the open-source Angular frontend for DisposaMail, a disposable/temporary email service. It connects to a separate backend API via REST + WebSocket. The frontend is fully decoupled — it has zero dependencies on any backend package.

## Tech Stack

- **Angular 17** with standalone components (no NgModules)
- **Strict TypeScript** — no `any` types, strict templates, strict injection parameters
- **SCSS** with CSS custom properties for theming
- **RxJS** for state management (BehaviorSubjects, not NgRx)
- **Zone.js** change detection (not zoneless)
- Target: ES2022, module resolution: node

## Project Structure

```
src/
├── app/
│   ├── app.component.ts          # Root: fixed navbar (64px) + cookie consent
│   ├── components/
│   │   ├── landing-page/         # Main page orchestrator (scroll reveals, analytics)
│   │   ├── email-card/           # White card shell with 3 modes
│   │   ├── email-list/           # Email table + empty state with ad banner
│   │   ├── email-viewer/         # HTML/text email renderer
│   │   ├── inbox-generator/      # Lottery animation + domain dropdown + CTA
│   │   ├── inbox-dropdown/       # Custom animated dropdown (not native <select>)
│   │   ├── ad-banner/            # Optional AdSense placement
│   │   └── cookie-consent/       # GDPR consent banner
│   ├── models/
│   │   └── email.model.ts        # All TypeScript interfaces (Email, Inbox, etc.)
│   ├── services/
│   │   ├── inbox.service.ts      # REST API calls (generate, fetch, delete)
│   │   ├── websocket.service.ts  # Real-time emails (auto-reconnect, exponential backoff)
│   │   ├── inbox-state.service.ts # RxJS state (inboxes$, activeInbox$, unreadCounts$)
│   │   ├── storage.service.ts    # localStorage wrapper with prefix + TTL pruning
│   │   ├── domain.service.ts     # Domain list fetch with shareReplay caching
│   │   └── analytics.service.ts  # GA4 with consent gating + engagement tracking
│   └── environments/
│       ├── environment.ts        # Dev config (committed)
│       └── environment.prod.ts   # Prod config (git-ignored — contains secrets)
├── assets/
├── styles.scss                   # Global CSS variables, resets, typography (Inter)
├── index.html                    # SEO meta tags, structured data, preconnects
├── robots.txt
└── sitemap.xml
```

## Key Architecture Decisions

### Component Communication Pattern
The landing page orchestrates all child components via inputs/outputs. No shared service for component-to-component communication — it all flows through the parent:

```
LandingPage (orchestrator)
├── InboxGenerator → emits inboxGenerated
├── EmailCard → receives activeInbox, inboxes, unreadCounts
│   ├── EmailList → displays emails
│   ├── EmailViewer → shows selected email
│   └── InboxDropdown → switches between inboxes
└── Marketing sections (static)
```

### Email Card Modes
The email card has three visual states controlled by a `mode` string:
- `first-visit` — Shows the generator with CTA button
- `generating` — Shows the lottery animation in progress
- `email-client` — Shows inbox dropdown + email list + viewer

### Inbox Generator Display Modes
The generator component has a `displayMode` input: `'full' | 'hero' | 'controls'`
- `hero` — Only the lottery character animation (shown in the hero headline)
- `controls` — Only the domain dropdown + generate button (shown in the card)
- `full` — Both together (legacy, not currently used)

### Custom Dropdown (NOT native select)
The domain dropdown in `inbox-generator` is a custom-built dropdown with:
- CSS `dropdownFadeIn` keyframe animation
- 6px gap between trigger button and popup
- `@HostListener('document:click')` for click-outside-to-close
- The popup uses `position: absolute` — parent containers must NOT have `overflow: hidden`

### Scroll Reveal Animations
Sections use IntersectionObserver to add a `.revealed` class on scroll. The CSS pattern:
```scss
.scroll-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  &.revealed {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Lottery Animation
Character-by-character address reveal:
- Characters: `abcdefghijklmnopqrstuvwxyz0123456789`
- Total duration: 1800ms, interval: 50ms
- Characters resolve left-to-right while remaining positions keep cycling
- The hero headline shows the animated text with a gradient effect

## CSS / SCSS Conventions

### Color System (CSS Custom Properties)
```scss
// Primary blues
--blue-50 through --blue-700

// Neutrals
--slate-50 through --slate-800

// Accents
--amber-100, --amber-500, --amber-600
--emerald-100, --emerald-500, --emerald-600
--violet-100, --violet-500, --violet-600
--cyan-500
```

### Typography
- Font: Inter (Google Fonts, loaded in index.html)
- Font smoothing: antialiased + grayscale

### Responsive Breakpoints
- Mobile: `max-width: 480px`
- Tablet: `max-width: 768px`
- Desktop: `max-width: 1024px`

### Key CSS Fixes (Do Not Revert)
1. **`.email-card` must NOT have `overflow: hidden`** — It clips the custom dropdown popup. Bottom border-radius is on `.client-body` instead.
2. **`.hero` section has `position: relative; z-index: 10`** — Prevents the how-it-works section below from overlapping the dropdown popup.
3. **Navbar is 64px fixed height** — Content should account for this offset.

### Glassmorphic Design
The navbar and some cards use glassmorphism:
```scss
background: rgba(255, 255, 255, 0.85);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
```

### Button Border Radii (User Preference)
- Pill buttons: `border-radius: 30px`
- Generate button: `border-radius: 25px`
- CTA button: `border-radius: 30px`

## Environment Configuration

All tunable values are in `src/environments/environment.ts`. No hardcoded brand names, URLs, or tracking IDs in components.

| Field | Purpose |
|-------|---------|
| `apiUrl` | Backend REST API base URL |
| `wsUrl` | WebSocket connection URL |
| `appName` | Brand name (navbar, footer, copyright) |
| `appTagline` | Tagline below brand name |
| `appUrl` | Canonical URL for SEO |
| `gaTrackingId` | GA4 measurement ID (empty = disabled) |
| `adsensePublisherId` | AdSense pub ID (empty = disabled) |
| `adsenseSlotId` | AdSense ad slot ID |
| `storagePrefix` | localStorage key prefix |

Components read these via `import { environment } from '...environments/environment'`.

## API Contract

### REST Endpoints

| Method | Endpoint | Response |
|--------|----------|----------|
| GET | `/api/domains` | `string[]` |
| POST | `/api/inbox` | `{ email, domain }` |
| GET | `/api/inbox/:email` | `{ emails: InboxEmail[] }` |
| GET | `/api/email/:id` | `Email` |
| DELETE | `/api/inbox/:email` | `{ success }` |
| DELETE | `/api/email/:id` | `{ success }` |
| POST | `/api/email/bulk-delete` | `{ deleted: number }` |

### WebSocket
- Connect to `/ws?inbox=<email>`
- Message: `{ type: 'new-email', data: InboxEmail }`
- Auto-reconnect with exponential backoff (max 30s, 10 attempts)

## Analytics Events (GA4)

9 custom events wired into components:
- `inbox_generated`, `cta_clicked`, `email_received`, `email_viewed`
- `inbox_copied`, `inbox_switched`, `inbox_deleted`, `new_inbox_clicked`
- `domain_selected`

Plus engagement tracking: scroll depth per section, 30s heartbeat, session duration.
All analytics are gated behind cookie consent.

## State Management

- **InboxStateService**: Central state via RxJS BehaviorSubjects (`inboxes$`, `activeInbox$`, `unreadCounts$`)
- **StorageService**: localStorage persistence with `disposaMail_` prefix, 24-hour TTL, automatic pruning of expired inboxes
- **No NgRx** — Simple service-based state is intentional; don't add a state library

## Common Patterns

### Dependency Injection
All services use `inject()` function (not constructor injection):
```typescript
private someService = inject(SomeService);
```

### Component Inputs/Outputs
Use decorator syntax (not signal-based):
```typescript
@Input() mode: string = 'first-visit';
@Output() inboxGenerated = new EventEmitter<Inbox>();
```

### Error Handling in Services
- Services catch HTTP errors and return empty/fallback values
- StorageService catches quota exceeded and prunes oldest entries
- WebSocket auto-reconnects on disconnect

### Inline Templates
Most components use inline templates (`template:` in the decorator) rather than separate `.html` files. The exceptions are `landing-page` and `email-card` which have external template files due to size.

## Do NOT

- Add NgModules — everything is standalone
- Add NgRx or any state management library
- Add `overflow: hidden` to `.email-card`
- Hardcode brand names, URLs, or tracking IDs in templates
- Use constructor injection (use `inject()`)
- Use native `<select>` for the domain picker (it's a custom dropdown)
- Remove the `.hero { z-index: 10 }` rule
- Skip the cookie consent check before initializing analytics
