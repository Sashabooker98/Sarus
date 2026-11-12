# SARUS Clothes — UI/UX Design Brief

| Field | Value |
|---|---|
| Project | **SARUS Clothes** |
| Version / Status | 1.0 · Draft |
| Date | 29 October 2026 |
| Related | PRD.md (§6, §7, §25), APP_FLOW.md |

> **Brand assets.** The permanent logo, final domain and official brand assets have not been supplied. This brief uses a **text wordmark placeholder** ("SARUS" in the display font) clearly marked *placeholder*. Do not invent a logo, icon set claiming to be official, or fake press/trust badges. All hex values and fonts below are **proposed** and must be validated (contrast checks, font licences) before sign-off.

---

## 1. Design Vision

**Modern streetwear, premium, bold, editorial, clean, mobile-first.** SARUS Clothes should feel like a fashion label's lookbook that happens to sell: big type, strong photography, generous space, and zero clutter. Most Pakistani shoppers browse on phones, so design for a 360 px viewport first and scale up.

**Principles**
1. **Product first** — photography and price clarity lead every screen.
2. **Bold but quiet UI** — loud type and imagery, calm controls.
3. **Trust at every step** — clear price, delivery, return and COD information; honest stock and status messages.
4. **Speed is a feature** — light pages, skeletons, optimised images.
5. **One accent** — electric lime used sparingly for focus, CTAs and highlights.
6. **Accessible by default** — contrast, focus, keyboard, reduced motion.

**Tone of voice.** Confident, short, friendly, no hype. Example: "Winter drop is live." / "Only 2 left in M." / "Pay when it arrives."

---

## 2. Design Tokens (proposed)

### 2.1 Colour
| Token | Proposed value | Use |
|---|---|---|
| `--color-black` | `#0A0A0A` | Primary text on light, dark surfaces, primary buttons |
| `--color-charcoal-900` | `#161618` | Dark sections, admin sidebar |
| `--color-charcoal-700` | `#2A2A2E` | Cards on dark, borders on dark |
| `--color-charcoal-500` | `#5B5B61` | Secondary text (on light; verify contrast) |
| `--color-charcoal-300` | `#B9B9BF` | Dividers, disabled |
| `--color-offwhite` | `#F5F3EE` | Page background (light) |
| `--color-white` | `#FFFFFF` | Cards, inputs |
| `--color-lime-500` | `#C8FF2E` | Accent: primary CTA on dark, highlights, focus ring accent |
| `--color-lime-700` | `#8FBF00` | Accent hover / on-light decorative only |
| `--color-success` | `#1E8E3E` | Success states |
| `--color-warning` | `#B26A00` | Low stock, caution |
| `--color-danger` | `#C62828` | Errors, destructive actions |
| `--color-info` | `#1D4ED8` | Informational |

**Colour rules**
- Lime is used as a **background with black text** (or as a graphic on black). **Never** use lime as text or icons on off-white/white (insufficient contrast). Verify every pairing with a contrast tool; text ≥ 4.5:1, large text/UI components ≥ 3:1.
- Status colours always paired with an icon or text label (never colour alone).
- Dark mode: storefront is light-first with dark editorial sections; full dark theme for admin is optional (Could Have). Tokens are defined as CSS variables to allow it.

### 2.2 Typography (proposed — confirm licences)
| Role | Proposal | Fallback |
|---|---|---|
| Display / headlines | A bold condensed grotesque (e.g., **Anton** or **Bebas Neue**, both open-licensed Google Fonts **[VERIFY licence]**) | `Impact, 'Arial Narrow', sans-serif` |
| Body / UI | **Inter** or **DM Sans** | `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif` |
| Numeric / price | Body font with tabular figures | — |
| Urdu (future) | Noto Nastaliq Urdu / Noto Naskh Arabic | — |

Type scale (mobile → desktop): Display XL 40→96 px / line-height 0.95, uppercase, tight tracking; H1 32→56; H2 24→36; H3 20→24; Body 16 (min); Small 14; Caption 12 (not for essential info). Body line-height 1.5. Max line length 70 characters. Load ≤ 2 font families, subset, `font-display: swap`.

### 2.3 Spacing, grid, radius, elevation
- Spacing scale: 4 px base (4, 8, 12, 16, 24, 32, 48, 64, 96).
- Layout: container max 1440 px; side padding 16 (mobile) / 24 (tablet) / 48 (desktop). Grid: 4 columns mobile, 8 tablet, 12 desktop; 16–24 px gutters.
- Breakpoints: `sm 480`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.
- Radius: streetwear feel = sharp-to-slight: buttons/inputs 2–4 px, cards 0–4 px, chips 999 px.
- Elevation: minimal; use borders (1 px charcoal-300) and subtle shadow only for popovers/drawers.

### 2.4 Iconography
One consistent line-icon set (e.g., Lucide, open licence **[VERIFY]**), 24 px, 1.5–2 px stroke; labelled via `aria-label`/visible text where meaning isn't obvious.

### 2.5 Motion
Fast and purposeful: 150–250 ms ease-out for UI, 300–400 ms for drawers/modals; image hover zoom ≤ 1.04; marquee announcement optional. **Respect `prefers-reduced-motion`** (disable parallax, autoplay, marquees).

---

## 3. Imagery and Content Guidelines

- **Photography:** full-bleed editorial hero images; product shots on clean backgrounds plus on-model shots; consistent aspect ratio **4:5** for product cards/gallery, **16:9 (desktop) / 4:5 (mobile)** for hero banners; minimum 1600 px wide source.
- **Sourcing:** use only photography owned or licensed by SARUS Clothes. Placeholder images in development are neutral grey blocks labelled "Image placeholder" — no stock photos implying real products.
- **Alt text:** mandatory for product and banner images (describe item, colour, view).
- **Size guide:** table in cm/inches per audience; "How to measure" illustration (to be produced).
- **Copy:** sentence case for body, uppercase for display headlines. No fabricated testimonials, review counts, press logos, "As seen in…" or fake scarcity (e.g., countdown timers not tied to real sale end dates).
- **Trust strip:** icons + text for COD, returns window (from settings), delivery estimates — pulled from settings, not hard-coded.

---

## 4. Component Library (Storefront)

| Component | Spec highlights |
|---|---|
| Announcement bar | Black bg, white text, lime underline on the link; dismissible; 36–40 px height |
| Header | Logo wordmark left (placeholder), primary nav centre (desktop), search/wishlist/account/cart right; mobile: hamburger + logo + cart; sticky with hide-on-scroll-down option |
| Mega menu (desktop) | Columns by audience/category + featured collection image |
| Mobile drawer | Full-height, accordion categories, account/login, language toggle (future) |
| Hero | Image + 1–2 line display headline + CTA button (lime on black overlay or black on lime); text over image has a scrim for contrast |
| Product card | 4:5 image, secondary image on hover, wishlist heart (44 px target), badges (New, Sale %, Sold out, Low stock — from data), name (2 lines max), price (sale price bold + struck original), up to 5 colour swatches |
| Product grid | 2 / 3 / 4 columns; "Load more" or numbered pagination (default numbered for SEO) |
| Filter panel | Collapsible groups (Audience, Category, Size, Colour, Price slider, Availability, On sale); active filter chips; "Clear all"; mobile bottom sheet with "Show N results" CTA |
| Sort control | Select; keyboard accessible |
| PDP gallery | Mobile swipe carousel with dots; desktop thumbnails + zoom; pinch zoom; keyboard arrows |
| Variant selectors | Size = segmented buttons (disabled for sold out, strikethrough + label); colour = swatch buttons with accessible names; selected state has 2 px black outline + check |
| Add-to-cart bar | Mobile sticky bottom bar with price + button after scrolling past the primary button |
| Info accordions | Details, Fabric & care, Delivery & returns, Size guide |
| Mini-cart drawer | Line items, subtotal, CTA to cart/checkout |
| Cart line | Image, name, variant, price, quantity stepper, remove, warnings (price changed/out of stock) |
| Checkout form | Single column, step indicator, inline validation, phone input with PK hint, city autocomplete, sticky order summary (collapsible on mobile) |
| Payment option card | Radio card with method name, description; disabled style + "Not available" label for unconfigured methods |
| Order timeline | Vertical steps with timestamps (PKT) and state icons |
| Toasts / banners | Non-blocking confirmations; `role="status"`/`alert` correctly |
| Empty states | Simple illustration/typographic block + primary action |
| Skeletons | Match final layout to avoid CLS |
| Cookie banner | Bottom sheet, equal-weight Accept / Reject / Customise buttons |
| Footer | Black, link groups, newsletter with consent checkbox, payment/COD badges only for methods actually enabled |

### 4.1 Buttons
| Variant | Style | Use |
|---|---|---|
| Primary | Black bg, off-white text, uppercase, 48 px high (mobile) | Main action on light |
| Primary-accent | Lime bg, black text | Main action on dark/hero |
| Secondary | 1.5 px black outline | Alternate action |
| Tertiary/link | Underlined text | Minor actions |
| Destructive | Danger bg, white text | Cancel/delete confirmations |
States: default, hover, focus-visible (2 px lime ring with 2 px black inner outline on light; 2 px lime ring on dark), pressed, disabled (50% opacity + not-allowed + `aria-disabled`), loading (spinner + label preserved).

### 4.2 Forms
Visible labels above fields (no placeholder-only labels), helper text, error text below field with icon, `aria-describedby`, error summary at top on submit failure, autocomplete attributes (`name`, `tel`, `email`, `street-address`), correct mobile keyboards (`inputmode="tel"` etc.).

---

## 5. Key Screen Layouts (wireframe-level)

### 5.1 Home (mobile)
1. Announcement bar
2. Header
3. Hero (full-bleed, headline, CTA "Shop Winter" / "Shop Summer" dynamic by active seasonal collection)
4. Category tiles (Men / Women / Kids) — 3 large image tiles
5. Seasonal spotlight (collection banner + horizontal product rail)
6. New arrivals rail
7. Editorial promo strip (e.g., sale with real end date)
8. Trust strip (COD, returns, delivery) — from settings
9. Newsletter (consent)
10. Footer

### 5.2 Listing
Title + breadcrumb → filter/sort bar (sticky) → grid → pagination → SEO text block (optional, collapsible) → related collections.

### 5.3 PDP
Mobile: gallery → title/price → colour → size (+ size guide link) → CTA → delivery & COD info → accordions → reviews → related. Desktop: two columns (gallery left sticky, details right).

### 5.4 Cart & checkout
Cart: items left, summary right (desktop) / stacked (mobile). Checkout: step indicator, form left, summary right; place-order button final.

### 5.5 Account
Left nav (desktop) / tabs or list (mobile): Overview, Orders, Returns, Wishlist, Loyalty, Addresses, Profile, Privacy.

---

## 6. Admin Interface Design System

**Feel:** professional, dense-but-calm, consistent. Light theme default with charcoal sidebar; lime used only for focus and small highlights (not as large fills).

| Element | Spec |
|---|---|
| Layout | Fixed left sidebar (240 px, collapsible to icons), top bar (global search for orders/SKUs, user menu, environment badge: `STAGING` in amber / `PRODUCTION` in red-outline), content max 1600 px |
| Page header | Title, breadcrumbs, primary action (right), secondary actions menu |
| Tables | Sticky header; sortable columns; column chooser; row hover; bulk-select (where allowed); pagination footer; density toggle; export button (permission-gated); saved filters (Could) |
| Filters | Filter bar with chips; date range in PKT; reset |
| Status chips | Consistent colour + icon + text: order states, payment states, stock states, publication states (see 6.1) |
| Forms | Two-column on desktop with sticky action bar (Save / Discard); dirty-state warning; field-level errors; optimistic concurrency conflict dialog |
| Detail pages | Summary header + tabbed sections (e.g., Product: Details, Variants, Images, SEO, History) |
| Dialogs | Confirm destructive actions; reason textarea where required; keyboard focus trap |
| Charts | Only render from real data; axes labelled; accessible table alternative; empty state when no data |
| Notifications | Toasts for success/errors with request ID link on error |
| Permissions | Hidden vs disabled: hide whole sections the role can't read; disable with tooltip for actions the role can't perform but can see |
| Empty/zero states | "No records yet" + primary CTA; "No data for this period" in analytics |
| Responsive | Usable on tablet; on mobile: collapsible sidebar, card-style rows for key lists (orders, inventory) |
| Honest integrations | Payment/notification/courier screens show `Not Configured` / `Configured – Sandbox` / `Live` / `Error` badges and setup guidance; never a working-looking toggle without a backend |

### 6.1 Status chip palette
| Entity | Values → colour |
|---|---|
| Order | pending_confirmation (amber), confirmed (blue), processing (blue), packed (indigo), shipped (purple), delivered (green), cancelled (grey), return_requested (orange), returned (orange), refunded (grey-green) |
| Payment | cod_awaiting (amber), cod_collected (green), pending (amber), verified (green), failed (red), expired (grey), not_configured (grey outline) |
| Stock | In stock (green), Low (amber), Out (red) |
| Publication | draft (grey), scheduled (blue), published/active (green), expired (amber), archived (grey) |
Each chip includes text label; colour is supplementary.

---

## 7. Accessibility Requirements (target WCAG 2.2 AA)

| Area | Requirement |
|---|---|
| Structure | One `<h1>` per page, logical headings, landmarks (`header, nav, main, footer`), skip-to-content link |
| Keyboard | All interactive elements reachable and operable; logical tab order; no keyboard traps; custom widgets follow ARIA Authoring Practices (menus, dialogs, accordions, tabs, carousels) |
| Focus | Always visible, ≥ 2 px, ≥ 3:1 contrast against adjacent colours; focus returns to trigger after dialog close |
| Contrast | Text 4.5:1, large text and UI components 3:1; lime accent only with black text/graphics |
| Forms | Programmatic labels, error identification, instructions, `autocomplete`, no reliance on colour |
| Images | Meaningful alt; decorative `alt=""` |
| Targets | ≥ 44 × 44 px touch targets (WCAG 2.2 target-size minimum is 24 px; this brief uses stricter 44 px) |
| Motion | Reduced-motion variant; no auto-playing carousels without pause control |
| Zoom/reflow | Usable at 200% zoom and 320 px reflow; no horizontal scroll except data tables in scroll containers |
| Language | `lang="en"`; future Urdu with `dir="rtl"` support via logical CSS properties |
| Dynamic content | `aria-live` for cart updates and toasts; loading states announced |
| Testing | axe in CI, Lighthouse, manual keyboard and screen-reader checks (NVDA, VoiceOver) |

---

## 8. Responsive Behaviour

| Viewport | Layout notes |
|---|---|
| 360–479 (phones) | 2-col product grid, drawer nav, sticky add-to-cart, bottom-sheet filters, single-column checkout |
| 480–767 | Same, larger imagery |
| 768–1023 (tablet) | 3-col grid, split checkout (form + collapsible summary), admin sidebar collapsed |
| 1024–1439 (desktop) | 4-col grid, mega menu, sticky PDP gallery, persistent summary |
| ≥ 1440 | Max container 1440, larger display type, extra whitespace |

Images use `srcset`/`sizes`, intrinsic dimensions to prevent layout shift. Performance budgets (PRD NFR-003) apply.

---

## 9. Localisation and Formatting
- Currency: `Rs 1,499` (symbol/placement configurable); no decimals.
- Dates: `29 Oct 2026`, 12-hour time with PKT when shown to staff.
- Phone hint: `03XX-XXXXXXX`.
- All UI strings externalised; allow ~30% text expansion; Urdu/RTL not in 1.0 but layout uses logical properties (`margin-inline`, `padding-inline`, `text-align: start`).

---

## 10. Design Deliverables and Process
| Deliverable | Notes |
|---|---|
| Design tokens file (CSS variables / Tailwind theme) | From §2, finalised after contrast checks |
| Component library (Storybook or equivalent) | States, accessibility notes |
| Wireframes → high-fidelity: Home, Listing, PDP, Cart, Checkout, Confirmation, Account, Admin dashboard, Orders, Product editor | Mobile first |
| Prototype for usability test | Test checkout with 5+ target users (no results assumed) |
| Content inventory | Policies, FAQ, size guides — owner-supplied |
| Asset checklist | Logo, favicon, OG image, photography, fonts (licences) — pending from owner |

**Design Definition of Done:** contrast verified, all states (default/hover/focus/active/disabled/loading/error/empty) designed, responsive variants for 360/768/1024/1440, accessibility notes added, copy final or marked placeholder.

---

## 11. Brand Placeholders Register
| Item | Status |
|---|---|
| Logo | Placeholder text wordmark "SARUS" (not official) |
| Favicon / app icon | Placeholder lime square with black "S" (not official) |
| OG default image | Placeholder |
| Domain | Not set |
| Photography | Not supplied |
| Brand fonts | Proposed only |

*End of UI/UX Design Brief.*
