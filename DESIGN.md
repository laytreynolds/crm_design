---
name: Chadwell CRM
description: A calm, dark-railed operations console for running a UK mobile/telecoms reseller's order pipeline.
colors:
  signal-green: "#71b69d"
  signal-green-hover: "#629c87"
  signal-green-active: "#517f6e"
  signal-green-tint: "#f4f9f7"
  signal-green-tint-strong: "#e5f2ed"
  deep-charcoal: "#1c1c1c"
  graphite: "#393939"
  slate: "#757575"
  stone: "#6b6b6b"
  hairline: "#d9d9d9"
  mist: "#e5e5e5"
  cloud: "#f6f6f6"
  white: "#ffffff"
  state-success: "#629c87"
  state-danger: "#c0524a"
  state-warning: "#c98a2e"
typography:
  display:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Work Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  label:
    fontFamily: "Work Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.04em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  xl: "24px"
  pill: "999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
  10: "40px"
  12: "48px"
  16: "64px"
  20: "80px"
  24: "96px"
  32: "128px"
components:
  button-primary:
    backgroundColor: "{colors.signal-green}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.signal-green-hover}"
  button-primary-active:
    backgroundColor: "{colors.signal-green-active}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "40px"
  badge-success:
    backgroundColor: "{colors.signal-green-tint}"
    textColor: "#517f6e"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.md}"
    height: "44px"
    padding: "0 14px"
---

# Design System: Chadwell CRM

## Overview

**Creative North Star: "The Control Deck"**

Chadwell CRM reads as an operator's console, not a marketing surface: a fixed dark rail down the left edge holds the whole map of the business, and everything to its right is a calm, well-lit instrument panel for working through orders one at a time. The system is built for someone who is at this screen for hours a day, moving customers through a real pipeline (Consumer QC → Awaiting Contract → Fully Connected, and every stage between) — so it favors legibility and quiet consistency over expression. Signal Green is the one color that's allowed to mean something; everywhere else the palette recedes into near-black rail, white working surface, and a narrow band of warm grays.

The aesthetic philosophy is calm and professional: competent, unshowy, the opposite of the neon-gradient "AI startup dashboard" look. Nothing here is decorative for its own sake — a color, a shadow, or a radius is present because it's carrying information (status, hierarchy, interactivity), and the system explicitly avoids visual noise that would compete with the sales/ops data on screen.

**Key Characteristics:**
- Dark instrument rail (near-black, `--ink-900`) fixed on the left, white working surface on the right — the console/canvas split repeats at every scale (leaderboard cards use the same dark-header/light-body pattern as the shell itself).
- Signal Green is reserved for functional moments only: primary actions, active nav state, links, and positive/success signals.
- Poppins carries anything scanned for orientation (titles, KPI numbers); Work Sans carries anything read (body copy, labels, table cells).
- Interactive controls (buttons, icon buttons, badges, the switch track) are fully rounded capsules; content containers (cards, tags, inputs, dialogs) use a softer 6–16px radius scale instead.
- Shadows are ambient, not symbolic — a quiet lift under resting surfaces, deepening naturally for anything that's physically floating above the page (dialogs, toasts, dropdowns).

## Colors

A near-monochrome working palette (charcoal, white, warm grays) with a single functional accent; state colors are reserved strictly for status communication, not styling.

### Primary
- **Signal Green** (`#71b69d`): the one brand color and the only accent the system spends freely — primary button fill, active sidebar icon + indicator, links, focus rings, checked checkbox/radio/switch fill, positive KPI trend deltas, "success" status badges and leaderboard headers.
- **Signal Green Hover** (`#629c87`) / **Signal Green Active** (`#517f6e`): press-state depth for the same accent — darker on hover, darker still on active/pressed.
- **Signal Green Tint** (`#f4f9f7`) / **Signal Green Tint Strong** (`#e5f2ed`): the palest steps of the same hue, used only as a background wash behind green content (success badges, input focus glow, brand-tinted surfaces) — never as a standalone UI color.

### Neutral
- **Deep Charcoal** (`#1c1c1c`): the sidebar rail's background and the darkest ink step; also the inverse surface behind toasts, tooltips, and the leaderboard's total row.
- **Graphite** (`#393939`): primary text color on light surfaces.
- **Slate** (`#757575`): secondary text — captions, subtitles, helper copy.
- **Stone** (`#6b6b6b`): tertiary text and muted iconography (placeholder text, sidebar group labels, disabled-adjacent copy).
- **Hairline** (`#d9d9d9`): the default border color and strong-border/divider role.
- **Mist** (`#e5e5e5`): subtle borders — card edges, tag outlines, dividers that should barely register.
- **Cloud** (`#f6f6f6`): the one non-white surface — subtle background fills for hover states and low-emphasis panels.
- **White** (`#ffffff`): the default page and card surface; also text-on-brand and text-on-inverse.

### State / Functional
- **Success** (`#629c87`, shares Signal Green Hover's value): positive status — completed orders, "good" KPI deltas.
- **Danger** (`#c0524a`): destructive actions, error borders, error toasts, notification badges.
- **Warning** (`#c98a2e`): pending/attention states — "Awaiting" badges, warning toasts.

### Named Rules
**The Working Color Rule.** Signal Green only appears where it's doing something — a primary action, an active nav state, a live link, a completed/success status. It never appears as ambient decoration or a background fill outside those functional moments; if a screen needs more visual weight, reach for type size or spacing, not more green.

## Typography

**Display/Title Font:** Poppins (with ui-sans-serif, system-ui, sans-serif fallback)
**Body/Label Font:** Work Sans (with ui-sans-serif, system-ui, sans-serif fallback)

**Character:** Poppins' geometric, single-story "a" and circular bowls were chosen to match the logo mark, so every heading quietly reinforces the brand; Work Sans is a plain, high-legibility grotesque that disappears into long-form reading and dense data. The pairing is functional, not decorative — Poppins never appears in a sentence, Work Sans never appears in a number someone is meant to scan for.

### Hierarchy
- **Display** (700, 2.25rem/36px, 1.1 line-height, -0.02em tracking): page-level titles — "Dashboard," a list page's H1.
- **Title** (600, 1.375rem/22px–1rem/16px depending on level, 1.3 line-height, -0.02em tracking): section headers, card titles, leaderboard headers — anything that orients a sub-region of the screen.
- **Body** (400, 1rem/16px, 1.5 line-height): the default reading size — body copy, form values, table cells.
- **Label** (600, 0.75rem/12px, 1.3 line-height, 0.04em tracking, uppercase): the small system labels that never carry prose — KPI tile labels, sidebar group headers, badge/tag text.

### Named Rules
**The Two-Voice Rule.** Poppins is reserved for anything a user scans for orientation — page titles, section headers, card titles, KPI numeric values. Work Sans carries everything actually read — body copy, form fields, labels, table cells. If it's a number or a heading, it's Poppins; if it's a sentence, it's Work Sans.

## Layout

The shell is a fixed two-column console: a 240px dark sidebar rail pinned to the full viewport height (`position: sticky; top: 0`) on the left, and a fluid main column on the right that scrolls independently. A slim topbar (12px/24px padding, white, hairline bottom border) sits atop the main column for global actions (collapse, notifications, user menu).

Page content centers in a 1240px max-width container with generous outer padding (32px sides, scaling up to 96px bottom on the dashboard) and a consistent vertical rhythm of 32px between major sections. Data-dense regions (KPI tiles, highlight cards, chart pairs) use CSS grid with `auto-fill`/`auto-fit` and a fixed minimum tile width (220–420px depending on content), so the same layout reflows from a wide monitor down to a single column without a hand-authored breakpoint per grid.

Three responsive thresholds recur across the app: **900px** is the structural break — the sidebar rail collapses into a fixed bottom tab bar (thumb-reach optimized) and the brand mark moves into the topbar; **720px** tightens page padding for small screens; **640px** hides secondary text (like the topbar's user email) to keep controls from crowding. Below 900px, a nav item's children open as a bottom sheet (max 70vh, scrollable) rather than an inline flyout, since the tab bar has no room to expand in place.

## Elevation & Depth

Depth is ambient, not symbolic: a shadow signals "this surface is physically above the page," not "this surface is more important." Resting cards and tiles carry the barely-there `shadow-sm`; anything that's genuinely floating above the content flow — dropdowns, dialogs, toasts, the switch thumb — carries more shadow simply because it's higher up, not because the system is trying to direct attention. Cards pair this soft shadow with a 1px hairline border rather than relying on either alone — the border defines the edge crisply, the shadow gives it a quiet lift off the page.

### Shadow Vocabulary
- **Ambient** (`box-shadow: 0 1px 2px rgba(28,28,28,0.06)`): resting cards, KPI tiles, the leaderboard card.
- **Raised** (`box-shadow: 0 4px 12px rgba(28,28,28,0.08)`): elevated card variant, the topbar user dropdown, the switch thumb.
- **Floating** (`box-shadow: 0 12px 32px rgba(28,28,28,0.12)`): dialogs, toasts — content that has interrupted the page flow and sits visually above everything else.

## Shapes

Radius is used as a semantic signal, not a stylistic flourish, and splits cleanly along one line: **things you act on are fully round; things that hold content are softly rounded.**

- **Capsule** (`999px`, pill): buttons (all variants/sizes), icon buttons, badges, the switch track, the leaderboard's value chip. This is the system's "you can interact with this at a glance" shape.
- **16px**: cards, dialogs, the mobile nav's bottom sheet.
- **10px**: inputs, selects, the topbar's icon buttons and dropdown menu.
- **6px**: tags, tooltips, small inline chips — the tightest radius in the scale, for the smallest elements.

### Named Rules
**The Capsule Rule.** If it's clickable and small (a button, an icon button, a badge, a switch), it's a fully-rounded pill. If it contains other content (a card, an input, a dialog, a tag), it uses the softer 6–16px scale instead. No element mixes the two languages.

## Components

Every interactive component shares the same tactile signature: buttons compress with a `scale(0.97)` press on `:active`, the switch thumb physically slides across its track, and checkbox/radio marks scale in from zero rather than just toggling opacity. Nothing bounces or overshoots — transitions run fast (120–200ms) on a standard ease curve — but every control gives a small, immediate confirmation that it was actually pressed.

### Buttons
- **Shape:** fully rounded capsule (`border-radius: 999px`, see The Capsule Rule).
- **Sizes:** sm (32px), md (40px), lg (48px) — height-driven, with proportional horizontal padding (14px/20px/26px).
- **Primary:** Signal Green fill, white text; darkens through hover → active (`#71b69d` → `#629c87` → `#517f6e`).
- **Secondary:** white fill, graphite text, hairline border; border darkens to graphite on hover (no fill change).
- **Ghost:** transparent, graphite text; fills with Cloud (`#f6f6f6`) on hover.
- **Press feedback:** `transform: scale(0.97)` on `:active`; disabled state drops to 40% opacity and removes the press transform.
- **Focus:** a 2px Signal Green (lightened, `--focus-ring`) outline, offset 2px outward.

### Badges & Tags
- **Badges** (status pills): fully rounded, tinted background + colored text per status — neutral (mist/slate), success (green tint/deep green), warning (pale amber/warning), danger (pale rose/danger). Used for order/lead status, never for anything non-statusful.
- **Tags** (removable chips): 6px radius, Cloud background, hairline border — a quieter, content-holding shape distinct from status badges.

### Cards / Containers
- **Corner Style:** 16px radius.
- **Background:** white (`--surface-raised`), or the dark inverse (`--ink-900`) for header bands like the leaderboard's colored headers and total row.
- **Shadow Strategy:** Ambient by default; the `--elevated` variant swaps the hairline border for `Raised` shadow when a card needs to sit visually above its siblings.
- **Border:** 1px Mist (`--border-subtle`) on the default variant; none on elevated.
- **Internal Padding:** 24px (space-6) is the default card padding.

### Inputs / Fields
- **Style:** 44px height, 10px radius, hairline border, white background.
- **Focus:** border shifts to Signal Green plus a 3px soft green glow (`box-shadow: 0 0 0 3px var(--color-brand-tint-strong)`) — no outline, the glow carries the affordance.
- **Error:** border switches to Danger red; no background change.
- **Labels:** small (14px), medium-weight, sit directly above the field with an optional 12px hint line below.

### Checkbox / Radio / Switch
- **Checkbox/Radio:** 20px square (checkbox: 6px radius) or circle (radio), 1.5px Border-Strong outline at rest; on check, fills solid Signal Green and a white mark (checkmark or dot) scales in from zero.
- **Switch:** 42×24px capsule track, Ink-200 off / Signal Green on; a white circular thumb with Raised shadow slides 18px on toggle.

### Navigation (Sidebar Rail)
- **Style:** Deep Charcoal background, Ink-200 text at rest. Active items get a subtle white-alpha wash (`rgba(255,255,255,0.08)`) and their icon recolors to Signal Green; a small green dot marks the active leaf in nested sub-lists.
- **Structure:** uppercase, letter-spaced 10px group labels; 40px-indented sub-items under a chevron-expandable parent.
- **Mobile:** collapses into a fixed bottom tab bar at ≤900px; children open as a full-width bottom sheet with a sticky dark header instead of expanding inline.

### KPI Tile (signature component)
The dashboard's core building block: a white, 16px-radius card holding an icon + uppercase label, a large Poppins numeric value, and a footer pairing a plain caption with a colored trend delta (green ▲ good, red ▼ bad, gray → flat). Tiles lay out in an `auto-fill, minmax(220px, 1fr)` grid so the count of visible KPIs adapts to viewport width without a custom breakpoint.

## Do's and Don'ts

### Do:
- **Do** keep Signal Green tied to function — primary actions, active state, links, positive/success signals — never as a decorative fill.
- **Do** use the capsule (999px) radius exclusively for small interactive elements (buttons, icon buttons, badges, switches); use 6–16px radii for anything that contains content.
- **Do** set Poppins on anything scanned for orientation (titles, section headers, KPI numbers) and Work Sans on anything read (body copy, form fields, table cells).
- **Do** pair a hairline border with an ambient shadow on cards — neither carries the surface alone.
- **Do** give every interactive control a fast (120–200ms), no-bounce transition and a visible press/focus state.

### Don't:
- **Don't** introduce a second accent hue. The system deliberately runs on one functional color plus neutrals; a new brand color needs a product-level decision, not a one-off screen choice.
- **Don't** mix the capsule and soft-radius languages on the same element class — a button never gets a 16px radius, a card never gets a pill.
- **Don't** reach for heavier shadows to signal importance. Elevation here tracks literal z-position (is it floating above the page?), not visual priority — use type weight, size, or color for that instead.
- **Don't** add gradients, glows, or decorative color washes outside the established tint steps (`signal-green-tint` / `signal-green-tint-strong`). The palette's restraint is the point.
