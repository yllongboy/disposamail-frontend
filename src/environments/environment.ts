export const environment = {
  production: false,
  apiUrl: '/api',
  wsUrl: 'ws://localhost:3000/ws',

  // Branding
  appName: 'DisposaMail',
  appTagline: 'Temporary Email, Zero Hassle',
  appUrl: 'http://localhost:4200',

  // App version (overridden at build time in production via set-env.js)
  appVersion: 'dev',

  // Google Analytics 4 (leave empty to disable)
  gaTrackingId: '',

  // Google AdSense (leave empty to disable ads)
  adsensePublisherId: '',
  adsenseSlotId: '',

  // Storage key prefix (for localStorage)
  storagePrefix: 'disposaMail_',
};
