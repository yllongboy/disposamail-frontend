import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  expanded: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="faq-container">
      <div class="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p class="faq-subtitle">Find answers to common questions about DisposaMail</p>
      </div>

      <div class="faq-search">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          placeholder="Search FAQ..."
          class="search-input"
          (input)="filterFAQ()"
        />
      </div>

      <div class="faq-categories">
        <button
          *ngFor="let category of categories"
          [class.active]="activeCategory === category"
          (click)="filterByCategory(category)"
          class="category-btn"
        >
          {{ category }}
        </button>
      </div>

      <div class="faq-items">
        <div
          *ngFor="let item of filteredFAQ"
          class="faq-item"
        >
          <div class="faq-question" (click)="toggleExpand(item)">
            <span class="question-text">{{ item.question }}</span>
            <span class="toggle-icon" [class.rotated]="item.expanded">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </div>

          <div class="faq-answer" [class.expanded]="item.expanded">
            <div class="faq-answer-inner">
              <div class="answer-content" [innerHTML]="item.answer"></div>
            </div>
          </div>
        </div>

        <div *ngIf="filteredFAQ.length === 0" class="no-results">
          <p>No FAQ items found. Try a different search or category.</p>
        </div>
      </div>

      <div class="faq-footer">
        <p>Can't find what you're looking for?</p>
        <a href="https://github.com/yllongboy/disposamail-frontend/issues" target="_blank" class="support-link">
          Open an issue on GitHub
        </a>
      </div>
    </div>
  `,
  styles: [`
    .faq-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
      font-family: inherit;
    }

    .faq-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .faq-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: #0f172a;
    }

    .faq-subtitle {
      font-size: 1.125rem;
      color: #475569;
    }

    .faq-search {
      margin-bottom: 2rem;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      color: #0f172a;
      transition: border-color 0.2s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-input::placeholder {
      color: #94a3b8;
    }

    .faq-categories {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .category-btn {
      padding: 0.5rem 1rem;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.9rem;
      color: #334155;
    }

    .category-btn:hover {
      background: #e2e8f0;
    }

    .category-btn.active {
      background: #2563eb;
      color: white;
      border-color: #2563eb;
    }

    .faq-items {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .faq-item {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      transition: box-shadow 0.2s ease;
    }

    .faq-item:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .faq-question {
      padding: 1.25rem;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
      transition: background-color 0.2s ease;
      user-select: none;
    }

    .faq-question:hover {
      background: #f1f5f9;
    }

    .question-text {
      font-size: 1rem;
      font-weight: 600;
      color: #0f172a;
      flex: 1;
      display: block;
    }

    .toggle-icon {
      display: flex;
      align-items: center;
      color: #475569;
      transition: transform 240ms cubic-bezier(0.4, 0, 0.2, 1);
      margin-left: 1rem;
      flex-shrink: 0;
    }

    .toggle-icon.rotated {
      transform: rotate(180deg);
    }

    .faq-answer {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 240ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .faq-answer.expanded {
      grid-template-rows: 1fr;
    }

    .faq-answer-inner {
      overflow: hidden;
      padding: 0 1.25rem;
      transition: padding 240ms cubic-bezier(0.4, 0, 0.2, 1);
      border-top: 0px solid #e2e8f0;
    }

    .faq-answer.expanded .faq-answer-inner {
      padding: 1.25rem;
      border-top-width: 1px;
    }

    .answer-content {
      color: #334155;
      line-height: 1.6;
      font-size: 0.95rem;
    }

    .answer-content strong {
      color: #0f172a;
    }

    .answer-content a {
      color: #2563eb;
      text-decoration: none;
    }

    .answer-content a:hover {
      text-decoration: underline;
    }

    .answer-content p {
      margin-bottom: 0.75rem;
    }

    .answer-content p:last-child {
      margin-bottom: 0;
    }

    .answer-content ul {
      margin: 0.75rem 0;
      padding-left: 1.5rem;
    }

    .answer-content li {
      margin-bottom: 0.5rem;
    }

    .no-results {
      text-align: center;
      padding: 2rem;
      color: #475569;
    }

    .faq-footer {
      text-align: center;
      padding: 2rem;
      background: #eff6ff;
      border-radius: 8px;
    }

    .faq-footer p {
      margin-bottom: 0.75rem;
      color: #334155;
    }

    .support-link {
      display: inline-block;
      padding: 0.625rem 1.25rem;
      background: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      transition: background-color 0.2s ease;
    }

    .support-link:hover {
      background: #1d4ed8;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        max-height: 0;
      }
      to {
        opacity: 1;
        max-height: 1000px;
      }
    }

    @media (max-width: 768px) {
      .faq-container {
        padding: 1rem;
      }

      .faq-header h1 {
        font-size: 1.75rem;
      }

      .faq-categories {
        gap: 0.5rem;
      }

      .category-btn {
        font-size: 0.85rem;
        padding: 0.5rem 0.75rem;
      }

      .question-text {
        font-size: 0.95rem;
      }

      .answer-content {
        font-size: 0.9rem;
      }
    }
  `],
})
export class FAQComponent {
  searchTerm = '';
  activeCategory = 'All';

  categories = [
    'All',
    'General Questions',
    'Privacy & Security',
    'Using DisposaMail',
    'Troubleshooting',
    'Technical',
  ];

  faqData: FAQItem[] = [
    // General Questions
    {
      id: 'q1',
      category: 'General Questions',
      question: 'What is DisposaMail?',
      answer: `<p><strong>DisposaMail</strong> is a free, anonymous temporary email service that lets you generate disposable email addresses instantly without signing up or creating an account. Use temporary email addresses to protect your privacy when registering on websites, receiving newsletters, or testing applications.</p>`,
      expanded: false,
    },
    {
      id: 'q2',
      category: 'General Questions',
      question: 'Do I need to create an account?',
      answer: `<p><strong>No!</strong> DisposaMail requires zero registration. Simply visit the website, click "Generate," and your temporary email address is ready to use immediately. No email, password, or personal information required.</p>`,
      expanded: false,
    },
    {
      id: 'q3',
      category: 'General Questions',
      question: 'How long can I use a temporary email address?',
      answer: `<p>Temporary email addresses are active for <strong>24 hours</strong> from creation by default. After this period, the inbox automatically expires and is permanently deleted.</p>
      <p>If you want to keep an inbox longer, enable the <strong>"Keep this inbox"</strong> option in your inbox header to prevent auto-deletion and continue receiving emails.</p>`,
      expanded: false,
    },
    {
      id: 'q4',
      category: 'General Questions',
      question: 'Can I choose my email address?',
      answer: `<p>Not the full address, but you <strong>can choose the domain</strong>. When you click "Generate," a custom username is created, and you can select from available domains (like <code>tempmail.dev</code>, <code>quickinbox.net</code>, <code>throwmail.io</code>) before generating.</p>`,
      expanded: false,
    },

    // Privacy & Security
    {
      id: 'q5',
      category: 'Privacy & Security',
      question: 'Is my privacy protected?',
      answer: `<p>Yes. DisposaMail:</p>
      <ul>
        <li>Does <strong>not</strong> require personal information</li>
        <li>Does <strong>not</strong> log your IP address</li>
        <li>Does <strong>not</strong> track you across the web</li>
        <li>Does <strong>not</strong> sell your data</li>
        <li>Stores only essential email metadata</li>
      </ul>`,
      expanded: false,
    },
    {
      id: 'q6',
      category: 'Privacy & Security',
      question: 'Can other people access my inbox?',
      answer: `<p>Your temporary email address is <strong>publicly accessible</strong> because it's temporary and disposable. If you share the address, anyone with it can view your emails. This is by design — we don't track who created an address.</p>
      <p><strong>Recommendation:</strong> Don't use temporary emails for sensitive communications or financial transactions where you need exclusive access.</p>`,
      expanded: false,
    },
    {
      id: 'q7',
      category: 'Privacy & Security',
      question: 'Is email content encrypted?',
      answer: `<p>Email content is <strong>encrypted in transit</strong> (HTTPS/TLS), but not encrypted at rest on our servers. Treat all temporary inboxes as <strong>public</strong> — don't send passwords or sensitive personal information to temporary addresses.</p>`,
      expanded: false,
    },

    // Using DisposaMail
    {
      id: 'q8',
      category: 'Using DisposaMail',
      question: 'How do I generate a temporary email?',
      answer: `<p>Follow these steps:</p>
      <ol>
        <li>Visit DisposaMail homepage</li>
        <li>Click the <strong>"Generate"</strong> button</li>
        <li>(Optional) Select a domain from the dropdown</li>
        <li>Your temporary email address appears instantly</li>
        <li>Copy it and use it anywhere</li>
      </ol>`,
      expanded: false,
    },
    {
      id: 'q9',
      category: 'Using DisposaMail',
      question: 'Can I reply to emails?',
      answer: `<p><strong>No.</strong> DisposaMail is <strong>receive-only</strong>. You can read incoming emails but cannot send replies. This is intentional to prevent spamming and abuse.</p>`,
      expanded: false,
    },
    {
      id: 'q10',
      category: 'Using DisposaMail',
      question: 'Can I delete individual emails?',
      answer: `<p>Yes. Click the email in the inbox, then select <strong>"Delete"</strong> to remove it. The email is immediately removed from your inbox.</p>
      <p>You can also <strong>delete the entire inbox</strong> to purge all emails immediately. This action is <strong>permanent and irreversible</strong>.</p>`,
      expanded: false,
    },
    {
      id: 'q15',
      category: 'Using DisposaMail',
      question: 'Can I keep my inbox active longer than 24 hours?',
      answer: `<p>Yes. Turn on the <strong>"Keep this inbox"</strong> checkbox in your inbox header to stop auto-deletion and keep receiving emails indefinitely.</p>
      <p>You can turn it off at any time to resume the normal deletion countdown. If you turn <strong>"Keep this inbox"</strong> back on later, the countdown is reset and you get a full grace period again.</p>`,
      expanded: false,
    },

    // Troubleshooting
    {
      id: 'q11',
      category: 'Troubleshooting',
      question: 'Why aren\'t my emails arriving?',
      answer: `<p><strong>Check the following:</strong></p>
      <ul>
        <li>Confirm the address is correct — copy-paste it from DisposaMail</li>
        <li>Wait a few seconds — emails may take up to 30 seconds to arrive</li>
        <li>Check spam folder — some services classify temporary email as spam</li>
        <li>Refresh the page — reload DisposaMail to ensure real-time connection</li>
        <li>Verify the domain is active — try regenerating with a different domain</li>
      </ul>`,
      expanded: false,
    },
    {
      id: 'q12',
      category: 'Troubleshooting',
      question: 'The interface is slow or unresponsive',
      answer: `<p><strong>Try these solutions:</strong></p>
      <ul>
        <li>Refresh the page — browser cache may be stale</li>
        <li>Clear your browser cache — delete cookies and cached data</li>
        <li>Try a different browser — compatibility issues with some browsers</li>
        <li>Check your internet connection — ensure stability</li>
        <li>Disable browser extensions — ad blockers may interfere</li>
      </ul>`,
      expanded: false,
    },

    // Technical
    {
      id: 'q13',
      category: 'Technical',
      question: 'Is there a mobile app?',
      answer: `<p>Currently, DisposaMail is <strong>web-only</strong>. You can add it to your home screen for quick access:</p>
      <ul>
        <li><strong>iPhone:</strong> Share → Add to Home Screen</li>
        <li><strong>Android:</strong> Menu → "Install app" or add to home screen</li>
      </ul>
      <p>DisposaMail works on all modern browsers and is fully responsive.</p>`,
      expanded: false,
    },
    {
      id: 'q14',
      category: 'Technical',
      question: 'Real-time emails aren\'t working',
      answer: `<p><strong>Check the following:</strong></p>
      <ul>
        <li>Ensure cookies are enabled — required for real-time functionality</li>
        <li>Check your firewall — WebSocket connections may be blocked</li>
        <li>Try manual refresh — click refresh to fetch emails</li>
        <li>Try a different network — VPNs or corporate firewalls may interfere</li>
        <li>Check browser console — open DevTools (F12) and look for errors</li>
      </ul>`,
      expanded: false,
    },
  ];

  filteredFAQ: FAQItem[] = [];

  constructor() {
    this.filteredFAQ = this.faqData;
  }

  toggleExpand(item: FAQItem): void {
    item.expanded = !item.expanded;
  }

  filterByCategory(category: string): void {
    this.activeCategory = category;
    this.filterFAQ();
  }

  filterFAQ(): void {
    let filtered = this.faqData;

    if (this.activeCategory !== 'All') {
      filtered = filtered.filter((item) => item.category === this.activeCategory);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.question.toLowerCase().includes(term) ||
          item.answer.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term),
      );
    }

    this.filteredFAQ = filtered;
  }
}
