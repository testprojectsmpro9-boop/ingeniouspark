---
name: ui-ux-pro-max
description: "UI/UX design intelligence for web and mobile. Includes 50+ styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, and 25 chart types across 10 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, HTML/CSS). Actions: plan, build, create, design, implement, review, fix, improve, optimize, enhance, refactor, and check UI/UX code. Projects: website, landing page, dashboard, admin panel, e-commerce, SaaS, portfolio, blog, and mobile app. Elements: button, modal, navbar, sidebar, card, table, form, and chart. Styles: glassmorphism, claymorphism, minimalism, brutalism, neumorphism, bento grid, dark mode, responsive, skeuomorphism, and flat design. Topics: color systems, accessibility, animation, layout, typography, font pairing, spacing, interaction states, shadow, and gradient."
---

# UI/UX Pro Max - Design Intelligence

Comprehensive design guide with searchable databases: 50+ styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, 25 chart types.

## When to Apply

**Must Use:** Designing new pages, creating/refactoring UI components, choosing color/typography/spacing, reviewing UI code for UX/accessibility, implementing animations or responsive behavior, making product-level design decisions.

**Skip:** Pure backend logic, API/database design unrelated to UI, DevOps/infrastructure.

**Rule:** If the task changes how a feature *looks, feels, moves, or is interacted with* → use this skill.

## Rule Categories by Priority

| Priority | Category | Impact | Key Checks |
|----------|----------|--------|------------|
| 1 | Accessibility | CRITICAL | Contrast 4.5:1, Alt text, Keyboard nav, Aria-labels |
| 2 | Touch & Interaction | CRITICAL | Min 44×44px, 8px+ spacing, Loading feedback |
| 3 | Performance | HIGH | WebP/AVIF, Lazy loading, CLS < 0.1 |
| 4 | Style Selection | HIGH | Match product type, SVG icons (no emoji) |
| 5 | Layout & Responsive | HIGH | Mobile-first, No horizontal scroll |
| 6 | Typography & Color | MEDIUM | Base 16px, Line-height 1.5, Semantic tokens |
| 7 | Animation | MEDIUM | 150-300ms, Motion conveys meaning |
| 8 | Forms & Feedback | MEDIUM | Visible labels, Error near field |
| 9 | Navigation Patterns | HIGH | Predictable back, Bottom nav ≤5 |
| 10 | Charts & Data | LOW | Legends, Tooltips, Accessible colors |

## Search Scripts

Scripts location: `claude/skills/ui-ux-pro-max/scripts/`

### Design System (REQUIRED first step for new projects/pages)

```bash
python3 claude/skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system -p "Project Name"
```

Example:
```bash
python3 claude/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard analytics" --design-system -p "MPro"
```

Returns: Pattern, Style, Colors, Typography, Effects, Anti-patterns, Pre-delivery checklist.

### Persist Design System (Master + Overrides)

```bash
python3 claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
# With page override:
python3 claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" --page "dashboard"
```

Creates: `design-system/MASTER.md` + `design-system/pages/<page>.md`

### Domain Search

```bash
python3 claude/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain>
```

| Domain | Use For |
|--------|---------|
| `product` | Product type patterns |
| `style` | UI styles (glassmorphism, minimalism, etc.) |
| `color` | Color palettes by product type |
| `typography` | Font pairings |
| `chart` | Chart types + library recommendations |
| `ux` | Best practices, anti-patterns |
| `landing` | Landing page structures |
| `react` | React/Next.js performance patterns |
| `web` | App interface guidelines (iOS/Android/RN) |

### Stack Search

```bash
python3 claude/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --stack <stack>
```

Stacks: `react`, `nextjs`, `vue`, `nuxtjs`, `svelte`, `react-native`, `flutter`, `html-tailwind`, `shadcn`, `swiftui`, `astro`, `nuxt-ui`, `jetpack-compose`

## Workflow

1. **Analyze requirements**: product type, target audience, style keywords, tech stack
2. **Generate design system** (REQUIRED): run `--design-system` command
3. **Supplement**: domain searches for specific needs
4. **Stack guidelines**: stack-specific search

## Common Professional UI Rules

### Icons
- Use **Phosphor** (`@phosphor-icons/react`) as primary icon library
- NO emoji as structural icons — use vector icons only
- Consistent stroke width within same visual layer
- Min 44×44pt touch target (use hitSlop if icon is smaller)

### Interaction
- Tap feedback within 80-150ms
- Animation timing 150-300ms with platform-native easing
- Min touch targets: ≥44×44pt (iOS), ≥48×48dp (Android)

### Light/Dark Mode
- Primary text contrast ≥4.5:1 in both modes
- Secondary text contrast ≥3:1
- Use semantic color tokens, not hardcoded hex

### Layout
- Respect safe areas (notch, gesture bar)
- 4/8dp spacing rhythm
- Mobile-first breakpoints: 375/768/1024/1440px

## Pre-Delivery Checklist

- [ ] No emojis as icons
- [ ] All tappable elements have pressed feedback
- [ ] Touch targets ≥44×44pt
- [ ] Primary text contrast ≥4.5:1 (light + dark)
- [ ] Safe areas respected
- [ ] Tested on 375px and landscape
- [ ] Reduced-motion and Dynamic Type supported
- [ ] Dark mode tested independently
