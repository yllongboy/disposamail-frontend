# DisposaMail - Frequently Asked Questions (FAQ)

## General Questions

### What is DisposaMail?
DisposaMail is a **free, anonymous temporary email service** that lets you generate disposable email addresses instantly without signing up or creating an account. Use temporary email addresses to protect your privacy when registering on websites, receiving newsletters, or testing applications.

### Do I need to create an account or sign up?
**No!** DisposaMail requires zero registration. Simply visit the website, click "Generate," and your temporary email address is ready to use immediately. No email, password, or personal information required.

### How long can I use a temporary email address?
Temporary email addresses are active for **24 hours** from creation. After this period, the inbox automatically expires and is permanently deleted. You can generate a new address at any time.

If you want to keep an inbox longer, enable the **"Keep this inbox"** option in your inbox header to prevent auto-deletion and continue receiving emails.

### Can I choose my email address?
Not the full address, but you **can choose the domain**. When you click "Generate," a custom username is created, and you can select from available domains (like `tempmail.dev`, `quickinbox.net`, `throwmail.io`) before generating.

### Is DisposaMail free?
**Yes, completely free.** There are no hidden fees, premium tiers, or account upgrades. We may display ads to support server costs, but the service itself is free to use.

---

## Privacy & Security

### Is my privacy protected on DisposaMail?
Yes. DisposaMail:
- Does **not** require personal information
- Does **not** log your IP address or browsing history
- Does **not** track you across the web
- Does **not** sell your data
- Stores only essential email metadata (sender, subject, date)

### Can other people access my temporary inbox?
Your temporary email address is **publicly accessible** because it's temporary and disposable. If you share the address, anyone with it can view your emails. This is by design — we don't track who created an address.

**Recommendation:** Don't use temporary emails for sensitive communications or financial transactions where you need exclusive access.

### Is my email content encrypted?
Email content is **encrypted in transit** (HTTPS/TLS), but not encrypted at rest on our servers. Treat all temporary inboxes as **public** — don't send passwords or sensitive personal information to temporary addresses.

### What information do you collect?
We collect:
- Incoming emails (sender, subject, body, attachments)
- Basic usage analytics (with consent via cookie banner)
- Temporary inbox metadata (creation time, expiration)

We do **not** collect:
- Your real email address
- Your IP address
- Your location
- Any personal identifying information

### Are you GDPR compliant?
Yes. DisposaMail:
- Includes a cookie consent banner
- Only initializes analytics after consent
- Respects Do Not Track preferences
- Automatically deletes inboxes after 24 hours

---

## Using DisposaMail

### How do I generate a new temporary email?
1. Visit DisposaMail homepage
2. Click the **"Generate"** button
3. (Optional) Select a domain from the dropdown
4. Your temporary email address appears instantly
5. Copy it and use it anywhere

### How do I receive emails?
Once you've generated an address:
1. **Share or use the address** on websites, forms, or services
2. **Wait for incoming emails** — they arrive in real-time (no refresh needed)
3. **Read the email** by clicking it in the inbox
4. **Reply** — Not supported. This is a receive-only service.

### Can I reply to emails?
**No.** DisposaMail is **receive-only**. You can read incoming emails but cannot send replies. This is intentional to prevent spamming and abuse.

### Can I forward emails?
**No.** DisposaMail does not support email forwarding. However, you can manually copy email content and forward it yourself if needed.

### How do I keep an email?
Before your inbox expires (24 hours), you can:
- **Copy the address** to use again later
- **Save the email content** (copy-paste from the viewer)
- **Download the raw email** (if your browser allows)

**Note:** Your inbox is tied to the temporary address. Once it expires, all emails are permanently deleted.

### Can I keep my inbox active longer than 24 hours?
Yes! Turn on the **"Keep this inbox"** checkbox in your inbox header to stop auto-deletion and keep receiving emails indefinitely. You can turn it off at any time to resume the normal deletion countdown. If you turn **"Keep this inbox"** back on later, the countdown resets and you get a full grace period again.

### Can I save or export my emails?
Not directly through the interface, but you can:
- Manually copy/paste email content
- Take screenshots
- In some browsers, you may be able to save the page or email data

### How many emails can I receive?
There's **no hard limit**, but very large inboxes may slow down the interface. Typical use cases (newsletter signups, registrations) are unlimited.

### Can I delete individual emails?
Yes. Click the email in the inbox, then select **"Delete"** to remove it. The email is immediately removed from your inbox.

### Can I delete my entire inbox?
Yes. You can **delete the entire inbox** to purge all emails immediately. This action is **permanent and irreversible**.

---

## Technical & Troubleshooting

### Why aren't my emails arriving?
**Check the following:**
1. **Confirm the address is correct** — Copy-paste it from the DisposaMail page
2. **Wait a few seconds** — Emails may take up to 30 seconds to arrive
3. **Check your spam folder** — Some services classify temporary email as spam
4. **Refresh the page** — Reload DisposaMail to ensure real-time connection is active
5. **Check the sender** — Some services may reject or block temporary email domains
6. **Verify the domain is active** — Occasionally domains may be blacklisted; try regenerating with a different domain

### Emails arrived but now they're gone. Why?
Your inbox **automatically expires after 24 hours** and is permanently deleted. If you need to keep emails, save them before expiration.

### The interface is slow or unresponsive. What should I do?
1. **Refresh the page** — Browser cache may be stale
2. **Clear your browser cache** — Delete cookies and cached data
3. **Try a different browser** — Compatibility issues with some browsers
4. **Check your internet connection** — Ensure you're not on a slow or unstable network
5. **Disable browser extensions** — Some ad blockers or privacy extensions interfere

### Real-time emails aren't working. What's happening?
1. **Check your firewall/network** — WebSocket connections may be blocked
2. **Ensure cookies are enabled** — Required for real-time functionality
3. **Try manual refresh** — Click refresh in the UI to fetch emails
4. **Check browser console** — Look for error messages (F12 → Console tab)
5. **Try a different network** — VPNs or corporate firewalls may block WebSocket

### Can I use DisposaMail on my phone?
**Yes!** DisposaMail is fully responsive and works on:
- iOS (Safari, Chrome)
- Android (Chrome, Firefox, Edge)
- Tablets (iPad, Android tablets)

Simply open DisposaMail in your mobile browser.

### Is there a mobile app?
Currently, DisposaMail is **web-only**. You can add it to your home screen on iPhone/Android for quick access:
- **iPhone:** Share → Add to Home Screen
- **Android:** Menu → "Install app" or add to home screen

### What browsers are supported?
DisposaMail works on:
- Chrome/Chromium (all versions)
- Firefox (all versions)
- Safari (all versions)
- Edge (all versions)

Older browsers (IE 11, very old Safari) are not supported. Please use a modern browser.

### Can I use DisposaMail with email clients (Outlook, Gmail, etc.)?
**No.** DisposaMail is **web-only**. You cannot add temporary addresses to email clients because:
- No IMAP/POP3 support
- No SMTP sending
- Real-time delivery requires WebSocket (not supported by email clients)

---

## Domains & Configuration

### What email domains are available?
Default domains include:
- `tempmail.dev`
- `quickinbox.net`
- `throwmail.io`

Additional domains may be available depending on your instance. Check the domain dropdown when generating an address.

### Can I use a custom domain?
**For end users:** No. You can only choose from pre-configured domains.

**For self-hosted instances:** Yes! Configure custom domains via the `DOMAINS` environment variable in the backend configuration.

### Why was my domain blacklisted?
Some email services may blacklist temporary email domains to prevent abuse. If a domain isn't working:
1. Try a different domain from the dropdown
2. Contact the service you're registering with — they may whitelist specific domains

---

## Limitations & Restrictions

### What can't I do with DisposaMail?
- **Send emails** — Receive-only service
- **Reply to emails** — No outbound support
- **Forward emails** — Not possible
- **Attach files to send** — No outbound capability
- **Set up auto-replies** — Not supported
- **Filter or organize emails** — Basic interface only
- **Use with email clients** — Web-only, no IMAP/POP3
- **Guarantee email delivery** — Some senders may reject temporary domains

### Is DisposaMail suitable for important communications?
**No.** DisposaMail is designed for:
- ✅ Signing up for newsletters
- ✅ Testing websites/apps
- ✅ Avoiding spam
- ✅ Temporary registrations

DisposaMail is **NOT suitable for:**
- ❌ Financial transactions
- ❌ Password resets (you may lose access to the service)
- ❌ Legal/official documents
- ❌ Sensitive personal information
- ❌ Two-factor authentication setup

### What happens if I lose access to my temporary email?
Since it's temporary by design, if you lose the address, you've lost access permanently. **Always note the address before closing the browser tab.**

---

## Common Use Cases

### I want to sign up for a service without getting spammed. Can I use DisposaMail?
**Yes!** This is a primary use case. Use a temporary address to:
- Sign up for newsletters
- Create test accounts
- Avoid marketing emails
- Test website registration flows

### I need to receive a verification email. Will it work?
**Usually yes**, but check:
- Does the service accept temporary email domains? (Some block them)
- Are you using the correct address?
- Did you wait long enough for email to arrive?
- Did the verification link expire? (Some are time-limited)

### I forgot to verify my account and my inbox expired. What do I do?
Generate a **new temporary address** and start over. This is why temporary email is best for low-stakes signups. For important accounts, use your real email.

### Can I use DisposaMail for two-factor authentication (2FA)?
**Not recommended.** If your temporary inbox expires or you lose access, you'll be locked out of the service. Use 2FA only with email addresses you control permanently.

---

## Advanced & Technical

### How does real-time email delivery work?
DisposaMail uses **WebSocket** technology:
1. When you open an inbox, a real-time connection is established
2. Incoming emails are pushed to your browser instantly
3. No polling or manual refreshing needed
4. Connection auto-reconnects if interrupted

### What data is stored about my temporary inbox?
- **Email metadata:** Sender, subject, date, attachments list
- **Email content:** Full message body (HTML + plain text)
- **Inbox timestamp:** When the address was created
- **Expiration:** Automatic deletion after 24 hours

**Not stored:**
- Your IP address
- Your browser type/user agent
- Your location
- Any personally identifying information

### Can I access expired inboxes?
**No.** After 24 hours, inboxes are completely purged from the system. There is no archive or recovery.

### How are emails stored? (Self-hosted admins)
Emails are stored in **Redis** with automatic expiration:
- TTL: 24 hours by default
- No backup or persistent storage
- Automatic cleanup of expired records

### Can I self-host DisposaMail?
**Yes!** DisposaMail is **open-source** (MIT License). You can:
- Clone the repository
- Deploy the frontend and backend
- Configure your own domains
- Scale horizontally with multiple instances

See the [documentation](../docs/) for self-hosting instructions.

---

## Abuse Prevention & Terms

### Can DisposaMail addresses be used for spam or abuse?
DisposaMail is designed to:
- **Receive emails** — not send spam
- **Prevent abuse** — temporary nature prevents persistent harassment
- **Respect sender domains** — we don't send unsolicited emails

However, if abused, we reserve the right to block addresses or domains.

### Can I be tracked through my temporary email?
Difficult to track:
- ✅ Address changes every time (different username each time)
- ✅ No account linking
- ❌ But: Sender services may track your activity after signup

**Privacy tip:** Use a different address for each signup to maximize privacy.

### Is DisposaMail legal?
**Yes.** DisposaMail is legal to use. However:
- Don't use it for fraudulent activity
- Don't use it to bypass security measures improperly
- Respect the terms of service of websites you're registering for
- Some services explicitly ban temporary email — respect their policies

---

## Support & Feedback

### How do I report a bug?
1. Visit the GitHub repository
2. Open an issue with:
   - Browser and OS details
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots if helpful

### How do I suggest a feature?
Open a GitHub discussion or issue with:
- Clear description of the feature
- Use case / why you need it
- Screenshots or mockups (if design-related)

### Is there a roadmap?
Check the GitHub repository for current projects and planned features.

### Can I donate or support the project?
See the repository README for donation links and sponsorship options.

---

## FAQ Metadata

**Last Updated:** July 2024  
**Version:** 1.0  
**Project:** DisposaMail Frontend (Angular 17)

For more information, visit the [GitHub repository](#) or read the [documentation](#).
