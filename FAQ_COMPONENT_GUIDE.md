# FAQ Component Integration Guide

## Overview

The FAQ component is a standalone Angular 17 component designed for the DisposaMail frontend. It provides an interactive, searchable, and categorized FAQ interface.

## Features

- ✅ **Full-text search** — Users can search across all FAQ items
- ✅ **Category filtering** — Quick filter by topic
- ✅ **Expand/collapse** — Smooth animations for opening/closing answers
- ✅ **Responsive design** — Works on mobile, tablet, and desktop
- ✅ **SEO-friendly** — Proper semantic HTML structure
- ✅ **Accessibility** — ARIA labels and keyboard navigation
- ✅ **Standalone component** — No dependencies on NgModules

## Installation

The component is already created at:
```
src/app/components/faq/faq.component.ts
```

## Integration Steps

### 1. Add to Routes (Optional)

If you want FAQ as a standalone page, add it to your routing configuration:

```typescript
// src/app/app.routes.ts
import { FAQComponent } from './components/faq/faq.component';

export const routes: Route[] = [
  // ... existing routes
  {
    path: 'faq',
    component: FAQComponent,
    data: { 
      title: 'FAQ - DisposaMail',
      description: 'Frequently asked questions about DisposaMail temporary email service'
    }
  },
];
```

### 2. Add Navigation Link (Optional)

Add a link to FAQ in your navbar or footer:

```html
<a routerLink="/faq" class="nav-link">FAQ</a>
```

### 3. Use as a Modal or Dialog (Optional)

Embed the FAQ in a modal/dialog:

```typescript
// In your component
import { FAQComponent } from './components/faq/faq.component';

// Use in template
<app-faq></app-faq>
```

## Component API

### Inputs
None currently. All data is internal to the component.

### Outputs
None currently. The component is self-contained.

### Internal Properties

| Property | Type | Description |
|----------|------|-------------|
| `searchTerm` | `string` | Current search query |
| `activeCategory` | `string` | Currently selected category |
| `categories` | `string[]` | Available FAQ categories |
| `faqData` | `FAQItem[]` | Complete FAQ dataset |
| `filteredFAQ` | `FAQItem[]` | Filtered results shown to user |

### Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `toggleExpand()` | `item: FAQItem` | Toggle expand/collapse state |
| `filterByCategory()` | `category: string` | Filter by category |
| `filterFAQ()` | None | Apply search and category filters |

## Adding New FAQ Items

To add new FAQ items, edit the `faqData` array in `faq.component.ts`:

```typescript
{
  id: 'q15',
  category: 'General Questions',
  question: 'Your question here?',
  answer: `<p>Your answer here. You can use <strong>HTML</strong> for formatting.</p>`,
  expanded: false,
},
```

### FAQ Item Structure

```typescript
interface FAQItem {
  id: string;           // Unique identifier (q1, q2, etc.)
  category: string;     // One of the categories in the categories array
  question: string;     // The question text
  answer: string;       // HTML content (supports p, ul, li, strong, em, a, code)
  expanded: boolean;    // Initial expand state (usually false)
}
```

### Supported HTML in Answers

- `<p>` — Paragraphs
- `<strong>` / `<b>` — Bold text
- `<em>` / `<i>` — Italic text
- `<a>` — Links (will auto-open in new tab)
- `<ul>` / `<ol>` / `<li>` — Lists
- `<code>` — Inline code
- Line breaks and basic formatting

## Styling & Customization

The component uses **CSS custom properties** for theming. Edit the styles in the component or override globally:

### CSS Custom Properties

```scss
--blue-50, --blue-600, --blue-700      // Primary color
--slate-50, --slate-100, --slate-200   // Neutral backgrounds
--slate-600, --slate-700, --slate-900  // Text colors
```

Override in your global styles:

```scss
// styles.scss
:root {
  --blue-600: #2563eb;  // Your primary color
  --slate-900: #0f172a; // Your text color
}
```

### Responsive Breakpoints

The component is responsive at:
- Mobile: `max-width: 480px`
- Tablet: `max-width: 768px`
- Desktop: All larger screens

## Performance Considerations

- **Lazy loading:** FAQ component doesn't load until user navigates to it
- **Search performance:** Filters are applied client-side (fast for typical FAQ sizes)
- **Memory:** All FAQ data is in-memory (acceptable for typical FAQ size)

For very large FAQ datasets (100+ items), consider:
1. Splitting into multiple pages
2. Lazy-loading categories
3. Server-side search

## SEO Optimization

To improve SEO for the FAQ page:

1. **Add structured data** (optional):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [...]
}
</script>
```

2. **Update page title & meta tags** in your route:

```typescript
{
  path: 'faq',
  component: FAQComponent,
  data: { 
    title: 'FAQ - DisposaMail',
    description: 'Common questions about DisposaMail temporary email service'
  }
}
```

## Accessibility

The component includes:
- ✅ Semantic HTML (`<h1>`, `<button>`, etc.)
- ✅ Proper focus management
- ✅ Keyboard navigation (Enter/Space to expand)
- ✅ Color contrast meets WCAG AA standards
- ✅ Screen reader friendly

## Browser Support

Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Editing the Markdown FAQ

A companion markdown FAQ file is available at:
```
FAQ.md
```

Use this for:
- Raw documentation
- Exporting to other formats
- Version control and documentation

Both the component and markdown should stay in sync.

## Future Enhancements

Potential improvements:
- [ ] Add FAQ printing support
- [ ] Export FAQ as PDF
- [ ] Multi-language support
- [ ] Analytics tracking (which questions are popular)
- [ ] Recently viewed questions
- [ ] "Was this helpful?" feedback
- [ ] Collapsible code examples
- [ ] Video walkthrough links

## Troubleshooting

### Component not showing
- Ensure `FAQComponent` is imported in your routes or parent component
- Check that standalone is set to `true`

### Styling not applied
- Verify CSS custom properties are defined in your global styles
- Check for CSS conflicts from global stylesheets

### Search not working
- Ensure `FormsModule` is imported (it is in the component)
- Check browser console for errors

### Performance issues
- Profile with DevTools
- Consider pagination for very large FAQ datasets

## Support

For issues, feature requests, or questions:
1. Check the [main FAQ](../FAQ.md)
2. Open an issue on GitHub
3. Contact the development team
