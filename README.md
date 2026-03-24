# DisposaMail Frontend

An open-source, privacy-focused disposable email client built with **Angular 17**. Generate temporary email addresses instantly and receive emails in real-time — no signup required.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Angular](https://img.shields.io/badge/Angular-17-red.svg)

## Features

- **Instant inbox generation** — Create a disposable email address with one click
- **Real-time email delivery** — Emails arrive via WebSocket, no polling
- **Lottery-style animation** — Fun character-by-character address reveal
- **Multiple domain support** — Choose from available email domains
- **Full email viewer** — Read HTML and plain-text emails
- **Scroll-triggered animations** — Smooth reveal effects as you scroll
- **SEO optimized** — Meta tags, structured data, sitemap
- **Analytics ready** — GA4 integration with consent gating
- **Ad-supported** — Optional AdSense integration
- **GDPR compliant** — Cookie consent banner included
- **Fully responsive** — Works on mobile, tablet, and desktop
- **Zero dependencies on backend package** — Fully decoupled, connects via REST + WebSocket

## Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** 9+
- **Angular CLI** 17: `npm install -g @angular/cli`
- A running backend API (see [API Contract](#api-contract) below)

### Installation

```bash
git clone https://github.com/your-username/disposamail-frontend.git
cd disposamail-frontend
npm install
```

### Configuration

Edit `src/environments/environment.ts` to point to your backend:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',  // Your API server
  wsUrl: 'ws://localhost:3000',     // Your WebSocket server
  appName: 'DisposaMail',           // Your brand name
  appTagline: 'Temporary Email, Zero Hassle',
  appUrl: 'https://your-domain.com',
  gaTrackingId: '',                 // Google Analytics 4 ID (leave empty to disable)
  adsensePublisherId: '',           // AdSense publisher ID (leave empty to disable)
  adsenseSlotId: '',                // AdSense slot ID
  storagePrefix: 'disposable_email_', // LocalStorage key prefix
};
```

### Development Server

```bash
npm start
# Runs at http://localhost:4200
# API calls proxy to your backend via proxy.conf.json
```

### Production Build

```bash
npm run build:prod
# Output in dist/frontend/
```

## Proxy Configuration

During development, API calls are proxied to avoid CORS issues. Edit `proxy.conf.json`:

```json
{
  "/api/*": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  },
  "/ws": {
    "target": "ws://localhost:3000",
    "secure": false,
    "ws": true
  }
}
```

## API Contract

This frontend expects a backend API with these endpoints:

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/domains` | List available email domains |
| GET | `/api/inboxes/:address/emails` | Fetch emails for an inbox |
| GET | `/api/emails/:id` | Get a single email by ID |

### WebSocket

Connect to `/ws` with the query parameter `inbox=<email-address>` to receive real-time email notifications.

**Message format:**
```json
{
  "type": "new-email",
  "data": {
    "id": "string",
    "from": "string",
    "subject": "string",
    "receivedAt": "ISO-8601"
  }
}
```

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Landing Page                     │
│  ┌─────────────┐  ┌──────────────────────────┐  │
│  │   Hero +     │  │      Email Card           │  │
│  │   Lottery    │  │  ┌────────────────────┐  │  │
│  │   Animation  │  │  │ Inbox Generator    │  │  │
│  │              │  │  │ (address + domains) │  │  │
│  └─────────────┘  │  ├────────────────────┤  │  │
│                    │  │ Email List          │  │  │
│  ┌─────────────┐  │  ├────────────────────┤  │  │
│  │  Marketing   │  │  │ Email Viewer       │  │  │
│  │  Sections    │  │  └────────────────────┘  │  │
│  └─────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Key Services

| Service | Purpose |
|---------|---------|
| `InboxService` | REST API calls for emails and domains |
| `WebSocketService` | Real-time email notifications |
| `InboxStateService` | Manages inbox list and active selection |
| `StorageService` | LocalStorage persistence |
| `AnalyticsService` | GA4 event tracking with consent |
| `DomainService` | Domain list management |

## Customization

### Branding

All brand references are centralized in `src/environments/environment.ts`:
- `appName` — Displayed in navbar, footer, and copyright
- `appTagline` — Shown below the brand name
- `appUrl` — Used in SEO meta tags

### Theming

Colors use CSS custom properties defined in component SCSS files. Key tokens:
- `--blue-50` through `--blue-700` — Primary palette
- `--slate-*` — Neutral grays
- `--amber-*`, `--emerald-*`, `--violet-*` — Accent colors

### Analytics & Ads

- Set `gaTrackingId` to your GA4 measurement ID to enable analytics
- Set `adsensePublisherId` and `adsenseSlotId` to enable ads
- Both are disabled when their IDs are empty strings
- Analytics respects the cookie consent banner

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.
