# Contributing to DisposaMail Frontend

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies: `npm install`
4. **Start** the dev server: `npm start`

## Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Angular CLI 17 (`npm install -g @angular/cli`)

### Environment Configuration

Copy the development environment template and customize:

```bash
# The dev environment file is pre-configured for local development
# Edit src/environments/environment.ts to set your API endpoint
```

### Running Locally

```bash
npm start
# App runs at http://localhost:4200
# API requests proxy to http://localhost:3000 (configure in proxy.conf.json)
```

## Code Style

- **Angular 17** standalone components (no NgModules)
- **Strict TypeScript** — no `any` types
- **SCSS** with CSS custom properties for theming
- **Responsive first** — mobile breakpoints at 480px, 768px, 1024px

## Making Changes

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Test locally with `npm start`
4. Commit with clear messages: `git commit -m "feat: add email filtering"`
5. Push and open a Pull Request

## Commit Message Convention

Use conventional commits:

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Formatting, missing semicolons, etc.
- `refactor:` — Code restructuring without behavior change
- `test:` — Adding or updating tests
- `chore:` — Build process or tooling changes

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Include a clear description of what changed and why
- Add screenshots for UI changes
- Ensure no TypeScript errors (`ng build`)

## Project Structure

```
src/
├── app/
│   ├── components/          # UI components
│   │   ├── landing-page/    # Main page orchestrator
│   │   ├── email-card/      # Email client shell
│   │   ├── email-list/      # Email table
│   │   ├── email-viewer/    # Email content display
│   │   ├── inbox-generator/ # Address generation + lottery animation
│   │   ├── inbox-dropdown/  # Custom animated dropdown
│   │   ├── ad-banner/       # Optional ad placement
│   │   └── cookie-consent/  # GDPR consent banner
│   ├── models/              # TypeScript interfaces
│   ├── services/            # Business logic & API calls
│   └── environments/        # Environment configuration
├── assets/                  # Static assets
└── styles.scss              # Global styles
```

## Reporting Issues

- Use GitHub Issues for bug reports and feature requests
- Include browser version and steps to reproduce for bugs
- Check existing issues before creating duplicates

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
