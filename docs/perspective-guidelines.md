# Perspective Design — Implementation Guidelines

**Design intent:** spatial, high-contrast surfaces that use depth and isometric
layering to direct attention, without ever letting decoration outrank legibility.

Grounded against the tokens IsotopeAI actually ships (`docs/assets/site.css`),
not a generic palette. Where Perspective's defaults conflict with the live brand,
the conflict is named and resolved explicitly rather than silently overridden.

---

## 1. Design tokens and foundations

### Color

| Role | Perspective default | **IsotopeAI token** | Value | Use |
|---|---|---|---|---|
| Primary | `#00BD7D` | `--c-accent` | `#5b21b6` | Actions, active state, focus ring |
| Primary hover | — | `--c-accent-hover` | `#4c1d95` | Hover only |
| Surface | `#FFFFFF` | `--c-surface` | `#ffffff` | Cards, panels |
| Subtle bg | — | `--c-bg-subtle` | `#faf9fc` | Page ground, wells |
| Text | `#111827` | `--c-text` | `#16121f` | Body, headings |
| Muted text | — | `--c-text-muted` | `#4a4458` | Secondary copy |
| Faint text | — | `--c-text-faint` | `#605973` | Tertiary, timestamps |
| Border | — | `--c-border` | `#e7e4ee` | Default hairline |
| Border strong | — | `--c-border-strong` | `#cbc5d8` | Input borders, dividers |
| Success | `#16A34A` | — | derive | Confirmation |
| Warning | `#D97706` | `--c-warn` | `#92400e` | Caution banners |
| Danger | `#DC2626` | `--c-danger` | `#b42318` | Destructive, errors |

> **Conflict, resolved in favour of the existing brand.** Perspective's
> `#00BD7D` green is not adopted. IsotopeAI's violet `#5b21b6` is the shipped
> brand across the app, docs and Android build; introducing a second accent would
> split identity across every surface that already exists. New UI uses
> `--c-accent`. Palette swaps are a brand decision, not a component decision.

Note `--c-warn` and `--c-danger` are *darkened* from Perspective's defaults
(`#92400e` vs `#D97706`). This is deliberate: the lighter values fall below
4.5:1 on white. Do not "correct" them toward the Perspective defaults.

### Typography

Scale 12 / 14 / 16 / 20 / 24 / 32px. Poppins for UI, Oswald for display,
JetBrains Mono for code and data.

- Body and controls: Poppins 400. Labels 500. Never below 400 for body copy.
- Display: Oswald, 600/700, used only for page and section titles.
- Numeric data (timers, scores, counts): JetBrains Mono, `font-variant-numeric:
  tabular-nums` — a focus timer's digits must not shift width as they change.
- Measure: 60–75ch for prose. Never full-width body text.

### Spacing and radius

Spacing `4 / 8 / 12 / 16 / 24 / 32` maps exactly onto the shipped
`--s-1` … `--s-6`. Radius: `6px` sm, `10px` md, `16px` lg, `999px` full.

Component padding must be a multiple of 4. Vertical rhythm between siblings
must use the same step as the spacing inside them — a 16px gap between cards
containing 8px internal padding reads as a broken rhythm, not as air.

### Depth (the Perspective signature)

Depth is carried by **shadow and surface elevation**, never by heavy borders.

| Level | Token | Use |
|---|---|---|
| 0 | none | Page ground, wells |
| 1 | `--e-1` | Cards at rest |
| 2 | `--e-2` | Raised panels, popovers, the demo frame |
| 3 | `--e-3` | Modals, command palette |

Rules:
- Exactly one elevated element per region. Two competing shadows read as a
  rendering bug.
- A shadow must never substitute for a border on a control that needs an edge —
  inputs use `--c-border-strong` so their boundary survives in forced-colors mode.
- Do not animate shadow on scroll. It is the single most common cause of jank.

---

## 2. Component-level rules

### Buttons

Anatomy: label (Poppins 500, 1rem), optional leading icon 16px, optional
trailing icon 16px. Padding `8px 16px` md, `12px 20px` lg. Radius `--r-md`.

Variants: primary (`--c-accent` fill, white text), secondary
(`--c-surface` + `--c-border-strong`), ghost (transparent, accent text),
danger (`--c-danger` fill).

States — **all seven are required**:

| State | Treatment |
|---|---|
| Default | Variant base |
| Hover | `--c-accent-hover`; ≤8% darken for secondary/ghost |
| **Focus-visible** | 2px `--c-accent` ring, 2px offset. Never `outline: none` |
| Active | 1px translateY, shadow drops to `--e-0` |
| Disabled | 40% opacity, `cursor: not-allowed`, `aria-disabled="true"` |
| Loading | Label stays, spinner replaces icon, `aria-busy="true"` |
| Error | 2px `--c-danger` border + message below, `aria-describedby` |

Loading must not resize the button. Reserve the icon's width.

### Inputs

Radius `--r-md`, height 44px minimum, border `--c-border-strong`.
Label sits above, 12px gap, Poppins 500.
Error: `--c-danger` border + message in `--c-danger`, linked via
`aria-describedby`. Placeholder text is never the label.

### Cards

Radius `--r-lg`, `--e-1`, padding `--s-5`. Interactive cards must expose a real
`<button>` or `<a>` — not `onclick` on a `<div>`. Hover lifts to `--e-2` with a
120ms transition.

### Navigation

Active item: 2px `--c-accent` indicator plus 600 weight. Weight change alone is
not sufficient — it fails for anyone who cannot perceive weight shifts.
44px minimum touch target, per WCAG 2.2.

### Tables

Header: Poppins 500, `--c-text-muted`, no borders. Row divider `--c-border` at
1px. Numeric columns right-aligned with `tabular-nums`. Row hover uses
`--c-bg-subtle`, never a shadow.

---

## 3. Accessibility requirements and acceptance criteria

Each is testable in implementation:

1. **Text contrast** ≥ 4.5:1 for body, ≥ 3:1 for large text (≥18.66px bold or
   ≥24px). Verify every new `--c-text-faint` usage against its actual background.
2. **Non-text contrast** ≥ 3:1 for control boundaries, focus rings, and any
   element conveying state without colour.
3. **Focus visible** — every interactive element has a `:focus-visible` style
   meeting 3:1 against its adjacent background. Keyboard-tab through any view
   and confirm the ring is visible at every stop.
4. **Target size** — 44×44px minimum, or ≥24px with sufficient spacing
   (WCAG 2.2 SC 2.5.8).
5. **Keyboard** — all functionality reachable and operable by keyboard. No
   keyboard traps. Focus order follows visual order.
6. **Motion** — respect `prefers-reduced-motion: reduce`. Transform and opacity
   only; nothing above 200ms without a reason.
7. **Status messages** use `role="status"`; errors that block a task use
   `role="alert"` and receive focus.
8. **No colour-only encoding** — every state signalled by colour is also
   signalled by weight, icon, text or shape.

Where aesthetic intent and accessibility conflict, **accessibility wins**, and
the compromise is documented here rather than discovered later.

---

## 4. Content and tone

Concise, confident, helpful. Second person. Present tense.

- Buttons name the action: "Save changes", not "Submit".
- Errors say what happened and what to do: "Email already registered — sign in
  instead", not "Invalid input".
- No exclamation marks in system copy. No exclamation in error text at all.
- Sentence case everywhere, including buttons. No Title Case.
- Numbers with units, and a real space: `25 min`, not `25min`.
- Avoid "simply", "just", "easy" — they instruct the reader to skip the part
  that is actually hard.

---

## 5. Anti-patterns

| Don't | Do instead |
|---|---|
| `outline: none` without a replacement | 2px `--c-accent` ring at 2px offset |
| Introducing Perspective green | Use `--c-accent` violet; palette changes are brand decisions |
| Two elevated elements fighting in one region | One elevation level per region |
| `onclick` on a `<div>` | Real `<button>` / `<a>` |
| Placeholder as label | Persistent label above the field |
| Weight-only active nav state | Indicator plus weight |
| Two hex values for one role | Semantic token only |
| Animating `box-shadow` | Animate `transform`/`opacity` |
| Timer digits in proportional type | `tabular-nums` |
| Lightened `--c-warn`/`--c-danger` | Keep the darkened values; they pass contrast |
| Hiding errors in a tooltip | Inline, linked with `aria-describedby` |

---

## 6. QA checklist

Run in code review:

- [ ] No new raw hex values — every colour is a `--c-*` token
- [ ] No new spacing value outside the 4/8/12/16/24/32 scale
- [ ] Every interactive element has all required states, including focus-visible
- [ ] Keyboard-tab the view; ring visible at every stop; no trap
- [ ] Body text ≥ 4.5:1; control boundaries ≥ 3:1
- [ ] Touch targets ≥ 44px
- [ ] `prefers-reduced-motion` honoured for anything that moves
- [ ] No status conveyed by colour alone
- [ ] Errors inline, linked via `aria-describedby`, not tooltip-only
- [ ] `node --check` on changed JS; `validate-docs.mjs` at 65/0
- [ ] Demo surfaces: any invented figure still carries its `sample` marker