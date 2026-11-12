# SARUS Clothes — Product Requirements Document (PRD)

| Field | Value |
|---|---|
| Document title | SARUS Clothes — Product Requirements Document |
| Project name | **SARUS Clothes** (final; brand name is configurable via `settings/store` but this is the actual name) |
| Version | 1.0 |
| Status | Draft for owner review |
| Date | 29 October 2026 |
| Companion documents | TRD.md, APP_FLOW.md, UI_UX_DESIGN_BRIEF.md, BACKEND_SCHEMA.md, IMPLEMENTATION_PLAN.md |

> **Reading rules.** Items marked **[ASSUMPTION]** are provisional and must be confirmed by the owner. Items marked **[TBD]** are business decisions with no assumed value. Nothing in this document claims that any feature is built, deployed, tested, or integrated.

---

## Table of Contents

1. [Document Control](#1-document-control)
2. [Executive Summary](#2-executive-summary)
3. [Business Objectives and Success Metrics](#3-business-objectives-and-success-metrics)
4. [User Personas and Roles](#4-user-personas-and-roles)
5. [Product Scope](#5-product-scope)
6. [Information Architecture and Navigation](#6-information-architecture-and-navigation)
7. [Customer-Facing Storefront Requirements](#7-customer-facing-storefront-requirements)
8. [Summer, Winter and All-Season Management](#8-summer-winter-and-all-season-management)
9. [Product and Inventory Management](#9-product-and-inventory-management)
10. [Customer Accounts](#10-customer-accounts)
11. [Wishlist and Shopping Cart](#11-wishlist-and-shopping-cart)
12. [Checkout and Order Management](#12-checkout-and-order-management)
13. [Payment Requirements for Pakistan](#13-payment-requirements-for-pakistan)
14. [Shipping and Delivery](#14-shipping-and-delivery)
15. [Returns, Exchanges and Refunds](#15-returns-exchanges-and-refunds)
16. [Coupons and Promotions](#16-coupons-and-promotions)
17. [Loyalty Program](#17-loyalty-program)
18. [Admin Panel](#18-admin-panel)
19. [Dashboard and Analytics](#19-dashboard-and-analytics)
20. [Notifications and Customer Communication](#20-notifications-and-customer-communication)
21. [SEO and Discoverability](#21-seo-and-discoverability)
22. [Database Design and Data Dictionary](#22-database-design-and-data-dictionary)
23. [API and Integration Requirements](#23-api-and-integration-requirements)
24. [Security, Privacy and Data Protection](#24-security-privacy-and-data-protection)
25. [Non-Functional Requirements](#25-non-functional-requirements)
26. [User Stories and Acceptance Criteria](#26-user-stories-and-acceptance-criteria)
27. [Test Strategy](#27-test-strategy)
28. [Deployment and Operations](#28-deployment-and-operations)
29. [Implementation Roadmap](#29-implementation-roadmap)
30. [Risks, Assumptions and Open Questions](#30-risks-assumptions-and-open-questions)
31. [Requirements Traceability](#31-requirements-traceability)
32. [PRD Readiness Checklist](#32-prd-readiness-checklist)

---

## 1. Document Control

### 1.1 Purpose
Define what the SARUS Clothes e-commerce platform must do, for whom, under which business rules, and how completion is judged, in enough detail that an engineering team or AI coding assistant can implement it without guessing core rules.

### 1.2 Audience
Owner/business stakeholders; engineers and AI coding assistants; UX/UI designers; QA; operations/fulfilment staff.

### 1.3 Assumptions
| ID | Assumption (provisional) |
|---|---|
| A-01 | Initial market is Pakistan only; single currency PKR; single timezone Asia/Karachi (UTC+5, no DST). |
| A-02 | Release 1.0 launches with Cash on Delivery only. JazzCash and Easypaisa are built as disabled, "Not Configured" adapters. |
| A-03 | Shipping is manual in Release 1.0 (staff enter courier name and tracking reference). |
| A-04 | Storefront is English-first; Urdu content and RTL are post-MVP. |
| A-05 | Return window default is 7 days from delivery **[ASSUMPTION — confirm]**. |
| A-06 | Loyalty defaults in §17 are provisional and owner must confirm loyalty economics. |
| A-07 | Amounts are stored as integers in whole PKR; no paisa fractions. |
| A-08 | Google AI Studio Build capabilities, export options, and Cloud Run deployment steps must be verified against current platform documentation at implementation time; this PRD does not assume automatic configuration. |

### 1.3a Constraints
- Stack: React + TypeScript, Node.js server, Cloud Firestore, Firebase Authentication, Firebase Storage (or compatible persistent storage), Google Cloud Run (recommended).
- Secrets only server-side. No client-side authority over price, stock, payments, orders, or loyalty.
- No official logo, final domain, or brand assets are invented; placeholders are labelled.

### 1.4 Change History
| Version | Date | Author | Summary |
|---|---|---|---|
| 0.1 | — | — | Master prompt supplied by owner (Website_Builder_Master_Prompt_v5) |
| 1.0 | 2026-10-29 | Claude | First complete PRD draft |

### 1.5 Requirement ID Scheme
`FR-###` functional · `NFR-###` non-functional · `SEC-###` security/privacy · `DATA-###` data integrity · `INT-###` integrations · `US-###` user stories · `TC-###` test cases. Priority uses MoSCoW: **M** Must, **S** Should, **C** Could, **W** Won't (initial release).

---

## 2. Executive Summary

**Business.** SARUS Clothes is a modern streetwear online store serving Pakistan, selling Men, Women and Kids clothing across Summer, Winter and All-Season collections.

**Target customers.**
1. Style-aware 16–35 shoppers who buy mostly on mobile and expect COD.
2. Gift buyers and parents purchasing Kids items.
3. Repeat buyers who value seasonal drops and loyalty rewards.

**Opportunity.** Pakistani shoppers favour COD and mobile wallets; trust, clear delivery expectations, easy returns, and accurate stock are differentiators. Seasonal rhythm (Summer/Winter) creates natural merchandising campaigns.

**Problems solved.**
- Overselling and inaccurate stock → variant-level stock with transactional reservation.
- Untrusted online payments → server-verified payments with transparent "Not Configured" states.
- Manual order chaos → state-machine orders, audit trail, role-based staff panel.
- Seasonal catalogue churn → scheduled collections with safe archiving.

**Vision.** A premium, fast, mobile-first storefront backed by a trustworthy operations panel where every number and status comes from real records.

---

## 3. Business Objectives and Success Metrics

Targets are **to be decided by the owner**; no current performance data is assumed. Measured values come only from real platform data after launch.

| Objective | Metric | Formula | Target | Data source |
|---|---|---|---|---|
| Sell online reliably | Conversion rate | `orders_placed / sessions` (sessions from consent-based analytics) | [TBD] | Orders + analytics |
| Grow basket value | Average order value (AOV) | `net_merchandise_sales / orders_excluding_cancelled` | [TBD] | Orders |
| Fulfil promptly | Order fulfilment rate | `orders_delivered / orders_confirmed` (cohort by confirm date) | [TBD] | Orders, events |
| Fulfil promptly | Dispatch time | `median(shipped_at − confirmed_at)` | [TBD] | Order events |
| Limit waste | Cancellation rate | `cancelled_orders / orders_placed` | [TBD] | Orders |
| Limit waste | Return rate | `returned_orders / delivered_orders` | [TBD] | Orders, returns |
| Accurate stock | Stock accuracy | `1 − (Σ|counted − system| / Σ system)` on stock-count audits | [TBD] | Inventory movements (type `correction`) |
| Retain customers | Repeat purchase rate | `customers_with_≥2_orders / customers_with_≥1_order` per period | [TBD] | Orders |
| Retain customers | Retention (30/90 day) | `customers_ordering_again_within_N_days / customers_first_ordering_in_period` | [TBD] | Orders |
| Loyalty health | Redemption rate | `points_redeemed / points_earned` | [TBD] | Loyalty ledger |

**Rules.** Metrics exclude test orders (`isTest=true`). Dates are grouped in Asia/Karachi. Where the denominator is zero the UI shows "No data" (never 0% or a fabricated value).

---

## 4. User Personas and Roles

### 4.1 Customer personas
| Persona | Description | Key needs |
|---|---|---|
| Shopper (anonymous) | Browsing visitor | Fast browsing, clear price/size/stock, trust signals |
| Guest customer | Checks out without account | Quick COD checkout, order tracking by order number + phone/email |
| Registered customer | Has verified account | Order history, saved addresses, wishlist, loyalty |

### 4.2 Staff roles and permissions
Authorisation is enforced on the server via role claims plus a `staff/{uid}` record (see TRD). "R" read, "W" create/update, "D" delete/archive, "A" approve, "—" none.

| Area | Owner | Admin | Product Mgr | Order Mgr | Content Editor | Support | Analyst |
|---|---|---|---|---|---|---|---|
| Products, variants, categories | RWDA | RWDA | RWDA | R | R | R | R |
| Seasonal collections | RWDA | RWDA | RWA | R | RW | R | R |
| Inventory & movements | RWA | RWA | RWA | RW (fulfilment) | — | R | R |
| Orders & fulfilment | RWA | RWA | R | RWA | — | R (+ notes) | R |
| Customers & support notes | RW | RW | — | R | — | RW | R (aggregated, PII masked) |
| Returns & refunds | RWA | RWA | — | RWA (return decisions) | — | RW (create/notes) | R |
| Refund **approval** over threshold [TBD] | A | A | — | — | — | — | — |
| Coupons & promotions | RWA | RWA | RW | — | — | — | R |
| Loyalty settings & adjustments | RWA | RWA | — | — | — | RW (adjust ≤ limit [TBD], reason required) | R |
| Homepage, banners, CMS, SEO | RWA | RWA | R | — | RWA | — | R |
| Shipping settings | RWA | RWA | — | RW | — | R | R |
| Payment integration status | RWA | R | — | R | — | — | — |
| Staff accounts & roles | RWA | R (cannot grant Owner/Admin) | — | — | — | — | — |
| Store config, security settings | RWA | RW (not payments secrets) | — | — | — | — | — |
| Reports & exports | RA | RA | R (catalogue) | R (orders) | — | — | RA (masked) |
| Audit logs | R | R | — | — | — | — | — |

**Boundaries.**
- Only Owner can create/remove Owner or Admin accounts, change payment configuration status, or change Owner-only settings.
- No role can edit immutable order line snapshots, loyalty ledger rows, audit logs, or inventory movement rows (append-only).
- Analyst exports mask phone, email and address by default.
- At least one active Owner must always exist; the last Owner cannot be demoted or disabled.

**Responsibilities.** Owner: business policy, payments, staff. Admin: day-to-day operations. Product Manager: catalogue, stock, pricing. Order Manager: confirm, pack, ship, returns. Content Editor: homepage, banners, CMS, SEO. Support: customer communication, notes, return intake. Analyst: read-only reporting.

---

## 5. Product Scope

### 5.1 In scope for Release 1.0 (MVP)
Storefront; catalogue with variants; seasonal collections; inventory; accounts; guest and registered checkout with COD; wishlist; coupons; loyalty; manual shipping and tracking references; returns/exchanges/refund tracking; admin panel; notifications architecture with at least one real email provider; SEO; consent-based analytics; reports; audit logs.

### 5.2 MoSCoW
| Priority | Capabilities |
|---|---|
| **Must** | Catalogue, variants, per-variant stock and reservation; Summer/Winter/All-Season collections; cart; guest + registered COD checkout; order state machine; server-side pricing; Firebase Auth with email verification; RBAC; admin for products/inventory/orders/customers; audit log; Firestore & Storage rules; SEO basics; privacy policy & policies pages |
| **Should** | Wishlist; coupons; loyalty ledger; CSV import/export; returns/exchanges; reviews (verified buyers, moderated); email notifications; dashboard and reports; low-stock alerts; abandoned-cart design (disabled until provider ready) |
| **Could** | Bundles; scheduled campaign banners; staff 2FA enforcement UI; stock-count sessions; saved-for-later; recently viewed |
| **Won't (initial release)** | Live JazzCash/Easypaisa payments (adapters scaffolded, disabled); courier API automation; SMS/WhatsApp live delivery; native mobile apps; multi-currency/multi-language; marketplace/multi-vendor; gift cards; subscriptions; POS/offline store |

### 5.3 Post-MVP (Release 1.x)
JazzCash and Easypaisa live (requires merchant approval); courier API integration (provider TBD); SMS/WhatsApp notifications; abandoned-cart reminders; Urdu/RTL.

### 5.4 Future enhancements
Size recommendation, product bundles builder, referral program, gift cards, PWA offline wishlist, personalised recommendations.

### 5.5 Out of scope
Building the application code in this task; payment card or wallet PIN collection (never allowed); accounting/ERP replacement; guaranteed search ranking.

---

## 6. Information Architecture and Navigation

### 6.1 Sitemap
```
SARUS Clothes
├── Storefront (public)
│   ├── /                              Home
│   ├── /shop                          All products (filters, sort, pagination)
│   ├── /shop/:audience                men | women | kids
│   ├── /category/:slug                Category listing
│   ├── /collections                   Collections index
│   ├── /collections/:slug             summer | winter | all-season | custom campaign
│   ├── /product/:slug                 Product detail
│   ├── /search?q=                     Search results
│   ├── /cart
│   ├── /checkout                      Address → Delivery → Payment → Review
│   ├── /order/confirmation/:orderNo
│   ├── /track-order                   Guest + member tracking
│   ├── /pages/:slug                   About, Contact, FAQ, Size Guide
│   ├── /policies/{shipping|returns|privacy|terms|cookies}
│   └── /support                       Contact + FAQ
├── Customer account (auth required, noindex)
│   ├── /account                       Overview
│   ├── /account/profile
│   ├── /account/addresses
│   ├── /account/orders, /account/orders/:orderNo
│   ├── /account/returns, /account/returns/new?order=
│   ├── /account/wishlist
│   ├── /account/loyalty
│   ├── /account/privacy               Export / delete / marketing consent
│   └── /auth/{login|signup|verify-email|forgot-password|reset-password}
└── Admin (staff only, noindex)
    ├── /admin                         Dashboard
    ├── /admin/products, /products/new, /products/:id (variants tab)
    ├── /admin/categories
    ├── /admin/collections
    ├── /admin/inventory, /inventory/movements, /inventory/import
    ├── /admin/orders, /orders/:id
    ├── /admin/shipments
    ├── /admin/returns, /admin/refunds
    ├── /admin/customers, /customers/:id
    ├── /admin/coupons
    ├── /admin/loyalty
    ├── /admin/reviews
    ├── /admin/content (homepage, banners, pages)
    ├── /admin/seo
    ├── /admin/notifications (templates, outbox)
    ├── /admin/reports
    ├── /admin/settings (store, shipping, payments, analytics, policies)
    ├── /admin/staff
    └── /admin/audit-logs
```

### 6.2 Navigation hierarchy
**Primary header:** New · Men · Women · Kids · Collections (Summer / Winter / All-Season) · Sale. **Utilities:** Search, Wishlist, Account, Cart (count badge). **Footer:** Policies, Support, Track Order, newsletter (explicit consent), social links (configurable).
**Mobile:** hamburger drawer, sticky bottom "Add to cart" on PDP, bottom-sheet filters.
**Breadcrumbs** on category, collection and product pages.
**Admin:** left sidebar grouped (Catalogue, Sales, Customers, Marketing, Content, Settings), items hidden when role lacks `R`.

### 6.3 Routing rules
- Unknown routes → branded 404 with search and popular links, HTTP 404.
- Unpublished/archived product direct link → see §21.4.
- Admin and account routes redirect unauthenticated users to login with return URL; authorisation is re-checked server-side on every API call.

---

## 7. Customer-Facing Storefront Requirements

| ID | Requirement | Pri |
|---|---|---|
| FR-001 | Homepage composed of CMS-managed blocks: announcement bar, hero banner(s), seasonal collection spotlight, category tiles (Men/Women/Kids), featured/new products, optional promo strip, trust strip (COD, returns, delivery), newsletter signup (consent checkbox not pre-ticked). | M |
| FR-002 | Announcement bar supports start/end datetime, text, optional link, dismissible per session. | S |
| FR-003 | Shop and category pages show product grid with server-side pagination (default 24/page; page size configurable) and total counts. | M |
| FR-004 | Filters: audience, category, season/collection, size, colour, price range, availability (in stock), on sale. Filter state reflected in URL query. Only options with ≥1 matching product are shown. | M |
| FR-005 | Sorting: Newest, Price low→high, Price high→low, Best selling (derived from real order counts), Discount. Default Newest. | M |
| FR-006 | Search matches name, SKU, category, tags; handles empty query, no results (suggestions + popular categories), and special characters safely. Implementation choice documented in TRD (Firestore prefix search for MVP or external search service later). | M |
| FR-007 | Product card: primary image + hover/secondary image (desktop), name, price, struck-through original price and discount badge when on sale, colour swatches (max 5 + "+n"), "New"/"Sale"/"Sold out"/"Low stock" badges derived from real data, wishlist heart. | M |
| FR-008 | Product detail page: image gallery (zoom, swipe, thumbnails), size selector, colour selector, size guide modal, fabric, fit, care instructions, stock status, price/discount, delivery estimate, return policy summary, add to cart, wishlist, share, related products, reviews (if any). | M |
| FR-009 | Size/colour selection updates price, images, SKU, and availability from the selected variant. Unavailable combinations are visibly disabled with "Notify me" (S) or "Sold out". | M |
| FR-010 | Delivery estimate = configured zone estimate (working days) shown after city selection; shows "Select city" otherwise. Never claims a guaranteed date. | S |
| FR-011 | Related products: same category/audience/season, excluding current and unavailable products; hidden when fewer than 2. | S |
| FR-012 | Responsive: 2-column grid on mobile, 3 on tablet, 4 on desktop; layouts tested at 360, 768, 1024, 1440 px widths. | M |

### 7.1 Required UI states
| Surface | Loading | Empty | Success | Error |
|---|---|---|---|---|
| Product grid | Skeleton cards | "No products match your filters" + clear-filters button | — | Retry banner with sanitized message |
| PDP | Gallery/skeleton | 404 page if unavailable | "Added to cart" mini-cart | Variant unavailable / stock changed message |
| Cart | Skeleton lines | "Your cart is empty" + continue shopping | Quantity updated | Line-level: out of stock, price changed, max quantity |
| Checkout | Step spinner, disabled submit | — | Confirmation page with order number | Field-level validation; server error with reference ID |
| Wishlist | Skeleton | "Nothing saved yet" | Heart toggled | Retry |
| Admin tables | Skeleton rows | "No records" with create CTA | Toast on saved | Inline error + request ID |

---

## 8. Summer, Winter and All-Season Management

| ID | Requirement | Pri |
|---|---|---|
| FR-013 | Collections have: name, slug, type (`summer`, `winter`, `all_season`, `campaign`), description, banner (desktop/mobile) with alt text, sort order, status (`draft`, `scheduled`, `published`, `expired`, `archived`), `publishAt`, `expireAt`, featured product ids with order, SEO fields. | M |
| FR-014 | A product can belong to multiple collections (stored as `collectionIds[]` on the product and mirrored as derived membership for queries). | M |
| FR-015 | Publishing: `draft → published` manual; `scheduled` publishes automatically at `publishAt` (scheduled job, Asia/Karachi display, UTC storage). | M |
| FR-016 | Expiry: at `expireAt` status becomes `expired`; the collection page remains reachable with an "ended" notice (configurable: redirect to /shop). Products remain in catalogue. | S |
| FR-017 | Archiving hides the collection from navigation and sitemap, **never deletes** products or orders; orders keep collection names in their snapshots. Hard delete is not offered for collections with history. | M |
| FR-018 | Seasonal promotions: sale price windows (`saleStartAt`/`saleEndAt`) per product/variant or percentage promotion bound to a collection; promotion ordering is deterministic (see §16.3); sale dates evaluated server-side in Asia/Karachi. | S |

**Acceptance.** Given a scheduled collection with `publishAt` in the future, when time passes `publishAt`, then it appears on storefront and sitemap within the job interval (≤ 5 min target) and an audit entry `collection.auto_published` is written. Given an archived collection, when a past order is viewed, then order items still display correctly.

---

## 9. Product and Inventory Management

### 9.1 Product fields
Name, description (sanitized rich text/markdown), product SKU (parent), slug (unique, immutable after publish unless redirect created), categories, audience (`men|women|kids|unisex`), season (`summer|winter|all_season`), collectionIds, fabric, fit, care instructions, images (ordered, with alt text and optional colour binding), cost price, selling price, sale price + window, SEO metadata (title, description, canonical override), tags, status (`draft|active|inactive|archived`), size guide reference.

### 9.2 Variants
Each sellable size/colour combination is a **variant** with its own unique SKU, barcode (optional), price override (optional), cost override (optional), `stockOnHand`, `stockReserved`, `lowStockThreshold`, status. Sizes and colours are configurable option sets (e.g. size sets for Men, Women, Kids age ranges).

| ID | Requirement | Pri |
|---|---|---|
| FR-019 | Product and variant SKUs are globally unique (enforced via SKU registry document in a transaction). | M |
| FR-020 | Sale price must be < selling price; selling price ≥ 0 and integer; cost price optional but required for profit reporting. | M |
| FR-021 | A product cannot be set `active` without ≥1 active variant, ≥1 image with alt text, slug, price, category, audience and season. | M |
| FR-022 | `stockAvailable = stockOnHand − stockReserved` is derived; never negative. All stock changes go through server inventory service writing an immutable **inventory movement**. | M |
| FR-023 | Movement types: `restock`, `correction`, `reservation`, `reservation_release`, `fulfilment`, `return_restock`, `cancellation_release`, `import_adjustment`, `damage_writeoff`. Each records variantId, delta fields, reason, actor, orderId/returnId (if any), idempotency key, timestamp, before/after quantities. | M |
| FR-024 | Concurrency: reservation and fulfilment run in Firestore transactions that re-read the variant, check `available ≥ qty`, update atomically, and write the movement with a deterministic id (`{orderId}_{variantId}_{type}`) to prevent duplicate decrements. | M |
| FR-025 | Low-stock threshold per variant (default from store setting). When `available ≤ threshold`, the variant is flagged `low` and a low-stock notification is queued once per crossing (no repeat spam until restocked above threshold). | S |
| FR-026 | Out-of-stock behaviour: variant shows "Sold out", cannot be added to cart; product shows "Sold out" if all variants unavailable; optional "Notify me" capture (C). Setting `allowBackorder` is **false** and not offered in MVP. | M |
| FR-027 | Bulk CSV **export** of products/variants/stock (staff with R). | S |
| FR-028 | Bulk CSV **import**: upload → server parse → validation preview (valid/invalid rows, per-row errors, create vs update counts) → explicit confirm → import job with row-level result report. Import never changes `stockReserved`; stock changes are recorded as `import_adjustment` movements. Max rows per import and file size limits defined in TRD. | S |
| FR-029 | Product images uploaded to Storage via signed upload flow; types JPEG/PNG/WebP; size limit; server validates and creates derived sizes; alt text required before publish. | M |
| FR-030 | Archiving a product (instead of deleting) keeps history; products referenced by orders cannot be hard-deleted. | M |

### 9.3 CSV columns (minimum)
`product_sku, name, slug, description, audience, season, category_slugs, collection_slugs, fabric, fit, care, cost_price, price, sale_price, sale_start, sale_end, status, variant_sku, size, color, variant_stock_set, variant_price_override, low_stock_threshold, image_urls, seo_title, seo_description`. Rules: UTF-8, header required, one row per variant, validation errors listed with row number and column.

---

## 10. Customer Accounts

| ID | Requirement | Pri |
|---|---|---|
| FR-031 | Signup with email + password (and optional Google sign-in, S); display name; accepts Terms/Privacy; marketing consent separate and unticked by default. | M |
| FR-032 | Email verification required before placing orders **as a registered customer** (guests are exempt); resend limited by rate limit. | M |
| FR-033 | Login/logout; password reset by email; session revocation on password change; generic error messages that do not reveal account existence. | M |
| FR-034 | Profile: name, phone (Pakistani format validation), marketing preferences; saved addresses (max 10) with default shipping address. | M |
| FR-035 | Order history lists the customer's orders only; order detail shows items from immutable snapshots, status timeline, payment status, shipment tracking reference. | M |
| FR-036 | Privacy controls: export my data, request deletion (§24.5), toggle marketing consent, view consent log. | S |

**Guest checkout.** Guests provide name, phone, email (optional but recommended for confirmations), address. Guests track orders via order number + phone or email match (rate limited). After checkout, the guest may be offered account creation; orders are linked to the account only after email verification and matching email.

**Server-side authN/Z.** Every API call that reads/writes personal data verifies Firebase ID token on the server, checks ownership (`order.userId == token.uid`) or staff permission, and never trusts client-provided user ids or roles.

---

## 11. Wishlist and Shopping Cart

### 11.1 Wishlist
| ID | Requirement | Pri |
|---|---|---|
| FR-037 | Wishlist is persistent per registered user (server stored). Items reference product (and optional variant/colour). Guests are prompted to log in; optional guest wishlist is stored in a session-scoped server record only if enabled (C). | S |
| FR-038 | Add/remove is idempotent; duplicates prevented by deterministic item id. Unavailable (inactive/archived/sold-out) items remain visible with a clear status and cannot be moved to cart until available. | S |
| FR-039 | "Move to cart" validates variant availability server-side. | S |

### 11.2 Cart
| ID | Requirement | Pri |
|---|---|---|
| FR-040 | Cart is a server-side record. Guests receive an opaque `cartId` held in a secure, HttpOnly, SameSite cookie (the cart contains only variant ids and quantities, no authoritative data). Registered users have one active cart per uid. | M |
| FR-041 | Each line stores `variantId` and `quantity` only; display price, name, image, availability are **recomputed by the server on every cart read**. | M |
| FR-042 | Quantity rules: integer 1…min(available, `maxPerLine` setting, default [TBD]). Changing quantity re-validates; reducing to 0 removes the line. | M |
| FR-043 | Cart merge on login: guest cart lines are merged into the user cart (same variant → quantities summed then capped to availability; user is told about any adjustments). Merge is idempotent. | M |
| FR-044 | Cart does **not** reserve stock. Stock is reserved only when checkout is submitted (§12). Inactive or removed variants are flagged and excluded from totals. | M |

**Sources of truth.** Prices, discounts, shipping, availability, and totals are computed only by the server pricing engine from Firestore. The browser may display values but may never submit totals as authoritative; submitted totals are used only for stale-price detection ("price changed since you viewed"). Browser localStorage is allowed only for non-sensitive UI preferences (e.g. dismissed banners, recently viewed ids) and never for stock, orders, payment state, or loyalty balances.

---

## 12. Checkout and Order Management

### 12.1 Checkout flow
1. Cart review → 2. Contact & address → 3. Delivery method/cost → 4. Payment method (COD enabled; online methods hidden or "Not Configured") → 5. Review & place order.

| ID | Requirement | Pri |
|---|---|---|
| FR-045 | Address fields: full name, phone, email (optional for guests, required if marketing/confirmation by email desired), province, city (from configurable list), area/town, street address, postal code (optional), delivery instructions (≤ 300 chars). | M |
| FR-046 | Phone validation: Pakistani mobile accepted as `03XXXXXXXXX`, `03XX-XXXXXXX`, `+923XXXXXXXXX`, `00923XXXXXXXXX`; normalised to E.164 `+923XXXXXXXXX`. Landline accepted only if setting enabled. City validated against `settings/shipping` city/zone list; unknown city blocked with message. | M |
| FR-047 | Server-side pricing engine computes line subtotals, promotions, coupon, shipping, loyalty redemption, and total in the deterministic order of §16.3. Result returned with a `pricingVersion` and hash used for stale detection. | M |
| FR-048 | `POST /checkout/orders` requires an **Idempotency-Key** header. Repeating the same key returns the original order and never creates a second one or a second stock reservation. | M |
| FR-049 | On placement, in one Firestore transaction: validate each variant active and `available ≥ qty`; increment `stockReserved`; write inventory movements; create order, order items (immutable snapshots), initial event, payment record (COD awaiting collection), coupon redemption, loyalty redemption hold (if used). If any step fails, nothing is committed. | M |
| FR-050 | Order numbers are human-friendly, unique and non-guessable-by-increment, e.g. `SC-` + date + random base32 suffix (format finalised in TRD). | M |
| FR-051 | Order confirmation page and email (when provider configured) show order number, items, totals, address, payment method, and tracking instructions. No claim of email sent unless provider confirms. | M |
| FR-052 | Order line **snapshot** stores: productId, variantId, SKUs, name, size, colour, image URL, unit price, sale price applied, line discount, quantity, line total, cost price at time of sale, tax fields (if any), collection/season names. Snapshots are immutable. | M |
| FR-053 | COD risk controls (S): configurable max COD order value, optional phone-verification (OTP) before COD confirmation once an SMS provider exists, flagging of repeat failed-delivery phone numbers for staff review. | S |
| FR-054 | Order history for customers and staff includes full event timeline (who/when/what, reason where applicable). | M |

### 12.2 Order state machine

| State | Meaning |
|---|---|
| `pending_confirmation` | Placed; stock reserved; awaiting staff/phone confirmation (COD) or payment verification (online, future) |
| `confirmed` | Verified by staff (or payment verified) |
| `processing` | Being prepared/picked |
| `packed` | Packed, awaiting courier handover |
| `shipped` | Handed to courier; tracking reference recorded |
| `delivered` | Delivery confirmed (manual staff entry or verified courier event) |
| `cancelled` | Cancelled before shipment (or undeliverable cancelled — see rules) |
| `return_requested` | Customer/staff opened a return within window |
| `returned` | Return items received and inspected (stock handling per §15) |
| `refunded` | Refund resolution complete (terminal) |

**Allowed transitions**

| From | To | Who can perform | Required data | Stock effect |
|---|---|---|---|---|
| `pending_confirmation` | `confirmed` | Order Mgr, Admin, Owner | — | none |
| `pending_confirmation` | `cancelled` | Customer (self-serve), Order Mgr, Admin, Owner, Support (request) | reason | release reservation |
| `confirmed` | `processing` | Order Mgr+ | — | none |
| `confirmed` / `processing` | `cancelled` | Order Mgr+ (customer: request only) | reason | release reservation |
| `processing` | `packed` | Order Mgr+ | — | none |
| `packed` | `shipped` | Order Mgr+ | courier name, tracking ref (if available), shipment record | **fulfilment**: `stockOnHand −= qty`, `stockReserved −= qty` |
| `packed` | `cancelled` | Admin/Owner only | reason | release reservation |
| `shipped` | `delivered` | Order Mgr+ | delivered_at, COD collected amount | none; COD payment → `collected` |
| `shipped` | `returned` | Order Mgr+ | reason (undeliverable / refused / RTO) | `return_restock` after inspection |
| `delivered` | `return_requested` | Customer (within window), Support, Order Mgr+ | reason, items, qty | none |
| `return_requested` | `delivered` | Order Mgr+ | rejection reason | none (return rejected) |
| `return_requested` | `returned` | Order Mgr+ | items received, inspection outcome | restock only for resellable items |
| `returned` | `refunded` | Admin/Owner (or Order Mgr under threshold [TBD]) | refund record resolved | none |

Terminal states: `cancelled`, `refunded`. All other transitions are rejected with `409 INVALID_TRANSITION`. Every transition writes an `orders/{id}/events` document and an audit log entry. Transitions are executed only by the server in a transaction that re-reads the current state (prevents double transition/stale updates).

**Cancellation rules.** Customer self-cancel allowed only in `pending_confirmation`. After `confirmed`, customer submits a cancel request handled by staff. After `shipped`, cancellation is not possible; use return/refusal flow. Cancelled orders release reserved stock exactly once (idempotent movement id), reverse coupon usage (configurable), release loyalty holds.

**Partial returns/exchanges** do not change the parent order status to `refunded` until all return/refund records are resolved; item-level return status lives on the return record (§15).

---

## 13. Payment Requirements for Pakistan

| ID | Requirement | Pri |
|---|---|---|
| FR-055 | **COD** works with no third-party credentials. Payment record `method=cod`, status `cod_awaiting`; becomes `cod_collected` when staff mark order delivered with collected amount (must equal order total unless a recorded discrepancy reason exists). | M |
| FR-056 | **JazzCash** and **Easypaisa** are separate provider adapters behind a common internal interface (`createPayment`, `verifyCallback`, `queryStatus`, `refund`). They are **disabled and shown as "Not Configured"** until Owner completes onboarding checklist and tests pass in sandbox. | S (architecture) / W (live in 1.0) |
| FR-057 | No endpoints, signature algorithms, hash formats, callback fields or credentials for any provider are assumed in this PRD. Implementation requires the provider's current official documentation, merchant account, approved credentials, and sandbox testing (INT-001/INT-002). | M |
| FR-058 | Payment record states: `initiated → pending → verified | failed | expired`; COD: `cod_awaiting → cod_collected | void`. Transition to `verified` only via server verification (callback + status query as provider requires). | M |
| FR-059 | Server verifies `amount`, `currency=PKR`, merchant order reference, and provider transaction reference against the stored payment intent before marking verified. Mismatch → `failed`/`review_required` and alert. | M |
| FR-060 | Browser return/redirect URLs only trigger a **status refresh**; they never mark payment as paid. Callback replay is prevented by storing each provider event id/hash in `paymentEvents` with unique constraint. | M |
| FR-061 | Reconciliation: daily job/report lists payments in `pending` older than threshold, mismatches between provider settlement files and records (manual upload initially), and COD collections not yet remitted by courier (staff-entered). | S |
| FR-062 | Refund of a digital payment is tracked on a `refunds` record and is marked complete only with verified provider confirmation or an explicitly authorised, documented manual resolution (approver, reason, reference). No fabricated success. | M |

**Online-payment stock handling (post-activation).** Reservation expiry (`reservedUntil`, default [TBD, e.g. 15 min]) releases stock via scheduled job if payment not verified; late successful callbacks after expiry go to `review_required` (not auto-confirmed).

**Never collect** card PINs, wallet PINs, or OTPs inside SARUS Clothes pages; customers authenticate on the provider's own flow.

---

## 14. Shipping and Delivery

| ID | Requirement | Pri |
|---|---|---|
| FR-063 | Shipping zones: named zones containing cities/regions, flat fee (or weight tier — C), estimated working days min/max, COD fee (optional), enabled flag. Fees are PKR integers. | M |
| FR-064 | Optional free-shipping threshold (on discounted merchandise subtotal) globally or per zone; threshold and fees default to **[TBD]** (no assumed numbers). | S |
| FR-065 | Manual shipment management: staff create a shipment for an order (courier name, tracking reference, dispatch date, parcel count, notes); status `created → dispatched → in_transit → delivered | failed_delivery | returned_to_sender`. All statuses are staff-entered; no events are generated automatically. | M |
| FR-066 | Failed delivery: staff record attempt date, reason (customer unreachable, refused, wrong address…), next action (reattempt, RTO). Orders with 3 failed attempts [configurable] are flagged. | S |
| FR-067 | Courier API integrations (tracking sync, label printing, COD remittance) are a separate **INT** workstream; each courier is an adapter and stays disabled until real provider documentation/credentials exist. Tracking pages display only recorded events and the reference; never invented scans. | W (1.0) |

Return shipping: customer may book own courier or staff arrange pickup (manual); return shipment record uses the same collection with `direction=return`.

---

## 15. Returns, Exchanges and Refunds

| ID | Requirement | Pri |
|---|---|---|
| FR-068 | Policy config in `settings/returns`: return window days (default 7 **[ASSUMPTION]**), eligible categories, final-sale flag per product, who pays return shipping, restocking conditions, accepted reasons. | S |
| FR-069 | Eligibility check (server): order `delivered`, within window from `deliveredAt`, items not final-sale, quantity ≤ delivered minus already returned. | S |
| FR-070 | Return request: reasons (wrong size, defective, wrong item, not as described, changed mind, other), item(s) and quantity, comment, optional photos (Storage, size/type validated). | S |
| FR-071 | Return lifecycle: `requested → approved | rejected → in_transit → received → inspected → resolved`; resolution type `refund | exchange | store_credit(C) | rejected`. Staff record inspection outcome per item: `resellable`, `damaged`, `not_received`. | S |
| FR-072 | Exchange: requires an available target variant; server reserves it at approval; exchange creates a linked **exchange order** with zero or differential price, referencing the original. If target unavailable, offer refund. | S |
| FR-073 | Refund record (`refunds`) is independent of order status: `refund_status` ∈ `pending`, `approved`, `processing`, `completed`, `failed`, `rejected`. Amount ≤ refundable remaining (paid/collected total minus prior refunds). | S |

**Inventory restoration.** `resellable` items → `return_restock` movement (+`stockOnHand`). `damaged` items → no restock; optional `damage_writeoff`. Exchange target variant stock reserved at approval and fulfilled on dispatch. Idempotent by deterministic movement ids.

**Loyalty/coupon effects.** Points earned for returned items are reversed (§17); redeemed points on refunded items return only per policy; coupon usage is not restored unless Admin approves.

**COD refunds.** For COD orders the refund method is a manual transfer (bank/JazzCash/Easypaisa/cash-adjustment per policy). Status becomes `completed` only after staff enter reference and approver — an authorised, documented manual resolution.

---

## 16. Coupons and Promotions

### 16.1 Requirements
| ID | Requirement | Pri |
|---|---|---|
| FR-074 | Coupon types: `percentage`, `fixed_amount`, `free_shipping`, `bundle` (C: buy X get discount). | S |
| FR-075 | Fields: code (unique, case-insensitive, stored upper-case), name, type, value, `maxDiscount`, `minSubtotal`, `startAt`, `endAt`, `usageLimitTotal`, `usageLimitPerCustomer`, `firstOrderOnly`, `eligibleProductIds`, `eligibleCategoryIds`, `eligibleCollectionIds`, `excludedProductIds`, `excludeSaleItems`, `stackable` (default false), status. | S |
| FR-076 | All validation (dates, limits, eligibility, minimum spend, per-customer usage by uid or by normalised phone/email for guests) happens server-side at pricing and again inside the order transaction. | S |
| FR-077 | Usage counters update transactionally with order creation (`couponRedemptions/{orderId}`), preventing parallel over-redemption. | S |
| FR-078 | Seasonal sale: percentage or fixed promotion attached to a collection/category with schedule; shows computed sale price on storefront (derived), snapshotted on order. | S |
| FR-079 | Coupon error messages are specific enough for users (expired, minimum spend, not eligible) but never reveal other customers' data or the existence of private codes beyond a generic "Invalid code" for unknown codes. | S |

### 16.2 Combination rules (deterministic)
1. **At most one coupon code per order** (MVP).
2. Product **sale price** (scheduled promotion) is applied first at line level. A coupon applies on top of sale price unless `excludeSaleItems=true`.
3. A `free_shipping` coupon is a coupon; it cannot be combined with a discount coupon.
4. Loyalty point redemption is applied **after** coupons and is limited by loyalty rules (§17).
5. Automatic promotions (bundle/seasonal) and coupon stacking allowed only if both flagged `stackable=true`; evaluation order = priority ascending, then created time, then id.

### 16.3 Pricing calculation order
```
1. unit = variant.priceOverride ?? product.price
2. effectiveUnit = (sale active at server now, Asia/Karachi window) ? salePrice : unit
3. lineSubtotal = effectiveUnit × qty
4. Apply automatic promotions in priority order (floor to integer PKR)
5. Apply coupon (eligible lines only; pro-rata allocation; floor each, remainder to first eligible line)
   - percentage: floor(eligibleSubtotal × pct / 100), capped by maxDiscount
   - fixed: min(value, eligibleSubtotal)
6. merchandiseNet = Σ lineSubtotal − discounts (≥ 0)
7. shipping = zoneFee (0 if free-shipping threshold met on merchandiseNet or free_shipping coupon)
8. loyaltyRedeem = min(requestedPoints × pointValue, rules cap, merchandiseNet)
9. total = merchandiseNet + shipping + codFee − loyaltyRedeem
```
Rounding: all intermediate and final values are integers in PKR; rounding is floor for discounts, with the remainder rule above; formula versioned (`pricingVersion`) and stored on the order.

---

## 17. Loyalty Program

**Provisional policy [ASSUMPTION — owner must confirm economics]**

| Rule | Provisional value |
|---|---|
| Earning | 1 point per PKR 100 of **merchandiseNet** (after discounts, excluding shipping) |
| Earn timing | Created as `pending` at delivery; becomes `available` after return window ends |
| Point value | 1 point = PKR 1 at redemption |
| Minimum redemption | 500 points |
| Redemption cap | ≤ 20% of merchandiseNet per order |
| Expiry | 12 months from earn date (FIFO consumption) |
| Exclusions | Gift cards (future), shipping fees, orders paid with points only portion |
| Eligibility | Registered, email-verified customers; guests earn nothing (can convert later only if policy chosen — default no) |

| ID | Requirement | Pri |
|---|---|---|
| FR-080 | Loyalty is stored as an **append-only ledger** (`loyaltyLedger`) with `loyaltyAccounts/{uid}` holding a derived balance updated in the same transaction as each ledger row. | S |
| FR-081 | Entry types: `earn_pending`, `earn_available`, `redeem`, `redeem_reversal`, `earn_reversal`, `expire`, `manual_adjust`. Each row stores uid, points delta, balance after, orderId/returnId, reason, actor, idempotency key. | S |
| FR-082 | Duplicate awards are prevented by deterministic ledger ids (`earn_{orderId}`, `earnrev_{returnId}_{itemId}`) checked inside the transaction. | S |
| FR-083 | Customers can only read their own balance and ledger; no client write access; only server routines or authorised staff adjustments change balances. | S |
| FR-084 | Redemption reserves points (`redeem`) at order placement; cancelled order → `redeem_reversal`; returns reverse earned points proportionally (`earn_reversal`) and may refund redeemed points per policy. Balance can never go below zero; if reversal exceeds balance, balance floors at zero and a `negative_adjustment_debt` note is logged for staff (no negative balance). | S |
| FR-085 | Manual adjustments: Owner/Admin (and Support up to limit [TBD]) with mandatory reason, audit log, and customer notification. | S |
| FR-086 | Expiry job runs daily (Asia/Karachi), writing `expire` rows; the customer sees upcoming expiry. | S |

---

## 18. Admin Panel

### 18.1 General requirements
| ID | Requirement | Pri |
|---|---|---|
| FR-087 | Admin login uses Firebase Auth + server check of `staff/{uid}` (active) and role claims; non-staff receive 403 even with valid Firebase tokens. Staff 2FA (TOTP via Firebase/Identity Platform multi-factor, availability to verify) is **required for Owner/Admin** where supported, otherwise documented as manual setup. | M |
| FR-088 | Every admin screen action maps to a defined backend operation (table in §18.2). Screens without an operation are not built in 1.0 and are listed as future work. No placeholder buttons, no simulated success, no random chart values. | M |
| FR-089 | Admin tables: server-side pagination, search, filters, sort, column visibility, CSV export (permission-gated), row-level status chips, bulk actions only where listed. | M |
| FR-090 | Forms: labelled inputs, inline validation, unsaved-changes warning, optimistic-concurrency (`updatedAt`/`version` check; conflict → 409 with reload prompt). | M |
| FR-091 | Destructive actions (archive, cancel, adjust stock, refund) require confirmation dialog and, where specified, a reason. | M |
| FR-092 | Audit log written for every privileged write (who, role, action, entity, before/after diff of changed fields, IP, user agent, request id). Audit logs are append-only and visible to Owner/Admin. | M |
| FR-093 | Staff management: invite by email, assign role, disable, force sign-out (revoke refresh tokens), view last login; cannot remove last Owner. | M |
| FR-094 | Store configuration screens: store identity (name defaults to "SARUS Clothes"), contact details, currency (fixed PKR), timezone (fixed Asia/Karachi), social links, size/colour option sets, low-stock default, order-number prefix, maintenance mode. | M |
| FR-095 | Payment integration status screen shows per provider: `Not Configured`, `Configured – Sandbox`, `Configured – Live`, `Error`, last verification time, test results recorded by staff (manual attestation + automated health check if provider supports). Secrets are never displayed or stored in Firestore. | M |

### 18.2 Admin sections → backend operations
| Section | Key screens | Backend operations (see §23) |
|---|---|---|
| Dashboard | KPI cards, charts, date filter | `GET /admin/analytics/summary`, `/timeseries`, `/top-products`, `/inventory-health` |
| Products & variants | List, create/edit, variants tab, images, SEO tab, status | Product/variant CRUD, SKU registry, image signed-upload, publish/archive |
| Categories & Collections | Tree editor, ordering, banners, scheduling | Category CRUD, Collection CRUD + schedule/publish/archive |
| Inventory | Stock list, adjust, history, import | `POST /admin/inventory/adjust`, `GET /admin/inventory/movements`, CSV import jobs |
| Orders & fulfilment | List, detail, status actions, notes, shipment | Order transition, cancel, shipment create/update, internal notes |
| Customers & support | List, detail (orders, loyalty, notes), data requests | Customer read, support notes, data-export/deletion workflow |
| Returns & refunds | Return queue, inspection, refund records | Return decisions, refund create/approve/complete |
| Coupons & promotions | List, editor, usage report | Coupon CRUD, redemption report |
| Loyalty | Settings, ledger view, adjustment | Loyalty settings, ledger query, `POST /admin/loyalty/adjust` |
| Homepage/banners/CMS | Block editor, banner scheduler, pages editor | Homepage doc, banner CRUD, page CRUD (sanitised content) |
| Staff & roles | List, invite, role change | Staff CRUD, role assignment, token revocation |
| Shipping settings | Zones, fees, thresholds, estimates | Settings CRUD |
| Payment integration | Provider status, enable/disable (Owner) | `GET/PATCH /admin/settings/payments` (status flags only) |
| Notifications | Templates, outbox, delivery results | Template CRUD, outbox query, retry |
| Reports & exports | Sales, inventory, customers, tax-free summaries | Report generation jobs → downloadable files in Storage |
| SEO | Defaults, redirects, robots, sitemap controls | SEO settings CRUD, redirect CRUD |
| Analytics settings | Measurement IDs, consent config | Settings CRUD (IDs only; no secrets) |
| Audit & security | Audit viewer, login events, session revocation | Audit query, revoke sessions |

---

## 19. Dashboard and Analytics

| ID | Requirement | Pri |
|---|---|---|
| FR-096 | Dashboard KPIs computed from real order/payment/refund/inventory records; filters: today, last 7/30/90 days, month, custom range, season/collection, audience, category. | S |
| FR-097 | Date handling: input ranges are Asia/Karachi calendar days converted to UTC boundaries `[start 00:00:00, end+1 00:00:00)` on the server. | S |
| FR-098 | Test orders and orders flagged `isTest` are excluded. | S |
| FR-099 | Empty state: when no records match, show "No data for this period"; ratios with zero denominator show "—". | S |
| FR-100 | Aggregations use precomputed daily summary documents (`analyticsDaily`) maintained by server functions or computed on demand with bounded range; each summary stores its `computedAt` and source range; summaries are **derived** and rebuildable. | S |
| FR-101 | Reports exportable as CSV (and PDF — C). Export actions are audit-logged. | S |

### 19.1 Metric definitions
| Metric | Formula (date = order `placedAt`, except where noted) |
|---|---|
| Gross merchandise sales | Σ order line `unitPrice × qty` (pre-discount) for non-cancelled orders |
| Discounts | Σ (line promotion + coupon + loyalty redemption) |
| Net sales | Gross merchandise sales − discounts − refunds completed (by refund `completedAt`) — shipping excluded |
| Shipping revenue | Σ shipping charged on non-cancelled orders |
| Revenue (recognised) | Net sales + shipping revenue, on **delivered** orders (report states basis) |
| Order count | Non-cancelled orders placed |
| Cancellation rate | cancelled / placed |
| AOV | Net merchandise sales / non-cancelled orders |
| Refund amount | Σ refunds `completed` in period |
| Product performance | Units, revenue, return rate per product/variant |
| Seasonal comparison | Net sales and units grouped by `season` snapshot and by period (e.g. this Winter vs last Winter), only when both periods have data |
| Inventory metrics | Units on hand, reserved, available, low-stock count, out-of-stock count, stock value at cost = Σ(stockOnHand × cost) when cost known (items without cost listed as "cost missing") |
| Gross profit | Net sales (merchandise) − Σ(line `costPriceSnapshot × qty` for delivered, non-returned units); lines with missing cost excluded and counted in a "cost missing" warning |
| Net profit | Gross profit − recorded `expenses` (staff-entered: ads, packaging, courier charges, other) in period; **revenue ≠ profit** and screens label them separately |

Analytics tooling (e.g. Google Analytics 4 / Meta Pixel) loads only after configuration and, where required, user consent; cookie banner states categories; **no analytics values are shown unless provided by the configured tool or computed from records**.

---

## 20. Notifications and Customer Communication

| ID | Requirement | Pri |
|---|---|---|
| FR-102 | Notification **templates** (event key, channel, language, subject/body with variables, version, enabled) are stored separately from **delivery providers** (adapters: email now; SMS/WhatsApp later). | S |
| FR-103 | Events: `order.placed`, `order.confirmed`, `order.shipped`, `order.delivered`, `order.cancelled`, `account.verify_email`, `account.password_reset`, `return.requested/approved/rejected/received`, `refund.completed`, `inventory.low_stock` (staff), `loyalty.points_earned/expiring`, `abandoned_cart` (disabled until provider + consent), newsletter confirmation. | S |
| FR-104 | Pipeline: domain event → outbox record (`queued`) → worker sends via adapter → status `sent` **only when provider returns success/ID**; `delivered/bounced` only from provider webhooks if available; failures retry with backoff (max attempts) then `failed`. Customer-facing UI says "confirmation email requested" never "sent" until confirmed. | S |
| FR-105 | Account verification and password-reset emails use Firebase Auth's built-in messages (templates customisable in Firebase console, manual setup) unless a custom provider flow is configured. | M |
| FR-106 | Marketing messages require explicit consent stored with timestamp, source, and wording version; unsubscribe link and preference centre; transactional messages are not blocked by marketing opt-out. Abandoned-cart reminders require scheduler (Cloud Scheduler → worker), provider, consent, and are **disabled by default**. | S |

Provider setup (email domain verification/SPF/DKIM, WhatsApp Business approval, SMS sender registration) is documented in §28 as manual prerequisite work.

---

## 21. SEO and Discoverability

| ID | Requirement | Pri |
|---|---|---|
| FR-107 | Editable title, meta description, canonical URL, OG image for home, collections, categories, products, CMS pages; sensible auto-defaults when blank. | M |
| FR-108 | Unique, human-readable slugs for products/categories/collections; changing a published slug creates a 301 redirect record. | M |
| FR-109 | Image alt text required for product/banner images (publish-blocking for products). | M |
| FR-110 | `/sitemap.xml` generated server-side from published, indexable entities only (with `lastmod`); `/robots.txt` generated from settings, disallowing `/admin`, `/account`, `/cart`, `/checkout`, `/auth`, order pages, and `/api`. | M |
| FR-111 | Breadcrumbs with `BreadcrumbList` JSON-LD; `Product` JSON-LD (name, image, sku, brand=SARUS Clothes, offers with real `price`, `priceCurrency=PKR`, `availability` from real stock, `url`); `Review`/`AggregateRating` only when real approved reviews exist; `Organization` and `WebSite` (SearchAction only if search implemented). | S |
| FR-112 | Private pages (account, admin, checkout, order confirmation) send `X-Robots-Tag: noindex, nofollow` and meta robots noindex. | M |

### 21.4 Edge handling
| Case | Behaviour |
|---|---|
| Product `inactive` (temporarily hidden) | HTTP 404 (or 200 "unavailable" page with related items — configurable default: 404), excluded from sitemap |
| Product `archived` | HTTP 410 Gone (if no redirect) or 301 to replacement/category if redirect set |
| Sold-out product | Remains indexable with `OutOfStock` availability |
| Archived/expired collection | Expired: 200 with notice, noindex optional; archived: 301 to /collections or 404; removed from sitemap |
| Duplicate content | Canonical to base URL; filter/sort/pagination URLs carry canonical to the unfiltered listing (pagination uses `rel=prev/next` hints optional); variant selection does not create separate URLs (except `?color=` canonical to base) |
| Missing page | Branded 404 with status code 404 (no soft-404) |

No ranking, indexing timing, or search-engine approval (e.g. Merchant Center) is guaranteed.

---

## 22. Database Design and Data Dictionary

**Database:** Cloud Firestore (Native mode). Full field-level dictionary, rules, transactions and index definitions are in **BACKEND_SCHEMA.md** (normative). The table below is the consolidated summary used by this PRD.

**Conventions.** Timestamps are Firestore `Timestamp` (UTC). Money is integer PKR. Ids are Firestore auto ids unless stated. Every document has `createdAt`, `updatedAt`; mutable documents also carry `version` (integer) for optimistic concurrency. "Auth." = authoritative, "Derived" = cache/aggregate that can be rebuilt.

| Collection | Purpose | Key fields (R = required) | Class | Read / Write | Notable validation | Indexes | Lifecycle / retention |
|---|---|---|---|---|---|---|---|
| `users/{uid}` | Customer profile | R: uid, email, displayName, createdAt; phone, marketingConsent{status,at,version}, defaultAddressId | Auth. | Owner uid R; server W (profile edits via API) | Phone E.164 PK; no role fields here | — | Anonymised on deletion; retained legal minimum |
| `users/{uid}/addresses/{id}` | Saved addresses | R: fullName, phone, city, line1; province, area, postalCode, instructions, isDefault | Auth. | Owner R; server W | City in shipping list; ≤10 | — | Deleted with user |
| `staff/{uid}` | Staff role record | R: role, status, email; invitedBy, lastLoginAt | Auth. | Admin R; Owner W via server | role ∈ enum; ≥1 active owner | status+role | Disabled not deleted |
| `products/{id}` | Catalogue item | R: name, slug, productSku, audience, season, categoryIds, price, status; description, fabric, fit, care, collectionIds, images[], costPrice, salePrice, saleStartAt/EndAt, seo{}, tags, ratingSummary(Derived) | Auth. (ratingSummary Derived) | Public read via API only when `status=active` (cost/exact stock stripped); staff R all; server W | See §9; slug unique | status+season+createdAt; status+audience+categoryId+price; status+collectionIds array-contains+sortRank | Archive only |
| `products/{id}/variants/{vid}` | Sellable SKU | R: sku, size, color, status, stockOnHand, stockReserved, lowStockThreshold; barcode, priceOverride, costOverride | Auth. | Public R of non-stock fields via API; staff R; server W | sku unique; stock ≥0; reserved ≤ onHand | sku; status+productId | Archive |
| `skuRegistry/{sku}` | SKU uniqueness | R: productId, variantId? | Auth. | Server only | Created in transaction | — | Retained |
| `categories/{id}` | Category tree | R: name, slug, parentId?, sortRank, status; image, seo | Auth. | Public R (active) | slug unique | parentId+sortRank | Archive |
| `collections/{id}` | Seasonal/campaign collections | R: name, slug, type, status; banners, publishAt, expireAt, featuredProductIds, sortRank, seo | Auth. | Public R (published) | publishAt < expireAt | status+type+sortRank; status+publishAt | Archive; never delete if history |
| `optionSets/{id}` | Size/colour definitions | R: kind(size/color), name, values[] | Auth. | Public R; server W | unique values | — | — |
| `inventoryMovements/{id}` | Append-only stock ledger | R: variantId, productId, type, qtyOnHandDelta, qtyReservedDelta, before{}, after{}, actor{}, reason?, refs{orderId,returnId}, idempotencyKey, createdAt | Auth. (immutable) | Staff R; server W (create only) | id deterministic where order-linked | variantId+createdAt; orderId; type+createdAt | Retain ≥ 7 years [TBD] |
| `carts/{cartId}` | Active carts | R: ownerType(user/guest), uid?, lines[{variantId,qty}], expiresAt | Auth. (lines) | Owner via API | qty ints; ≤50 lines | uid; expiresAt (TTL) | Guest carts TTL 30 days |
| `wishlists/{uid}/items/{itemId}` | Wishlist | R: productId; variantId?, addedAt | Auth. | Owner R; server W | id=productId[_variantId] | — | Deleted with user |
| `orders/{id}` | Order header | R: orderNumber, status, customer{uid?,name,phone,email?}, shippingAddress{}, totals{merchandiseGross,discounts,shipping,codFee,loyaltyRedeem,total}, paymentMethod, paymentStatus(derived from payments), couponCode?, pricingVersion, idempotencyKey, placedAt, isTest, season/collection snapshots | Auth. (paymentStatus Derived mirror) | Owner R (own); staff R; server W | State machine enforced | uid+placedAt; status+placedAt; orderNumber; phone+placedAt | Retain ≥ 7 years [TBD per tax/legal advice] |
| `orders/{id}/items/{itemId}` | Immutable line snapshot | See FR-052 | Auth. (immutable) | Same as order | Create-once | — | With order |
| `orders/{id}/events/{eventId}` | Timeline | R: type, fromStatus, toStatus, actor, note?, createdAt | Auth. (immutable) | Same as order (customer sees customer-visible events) | Append-only | createdAt | With order |
| `payments/{id}` | Payment intents/records | R: orderId, method(cod/jazzcash/easypaisa), amount, currency=PKR, status, providerRef?, verifiedAt?, rawVerificationHash? | Auth. | Staff R (Owner/Admin/Order Mgr); customer R own via order API; server W | amount == order total | orderId; status+createdAt | Retain with order |
| `paymentEvents/{eventKey}` | Callback/event log + replay guard | R: provider, eventKey (hash/ID), paymentId?, receivedAt, outcome | Auth. | Server only | Create-if-absent | provider+receivedAt | 2 years [TBD] |
| `shipments/{id}` | Shipment (outbound/return) | R: orderId, direction, courier, trackingRef?, status, events[] (staff-entered) | Auth. | Staff R/W; customer R own | status enum | orderId; status+createdAt | With order |
| `returns/{id}` | Return/exchange request | R: orderId, items[{orderItemId,qty,reason}], status, resolutionType?, inspection[] | Auth. | Owner R; staff R/W via API | Eligibility §15 | orderId; status+createdAt; uid | With order |
| `refunds/{id}` | Refund records | R: orderId, returnId?, amount, method, refundStatus, reference?, approvedBy?, completedAt? | Auth. | Staff R; Owner/Admin approve | amount ≤ refundable | orderId; refundStatus | With order |
| `coupons/{id}` | Coupon definitions | See FR-075; usageCount (Derived from redemptions) | Auth. | Public: none (validated via API); staff R/W | code unique (registry doc `couponCodes/{CODE}`) | status+endAt | Archive |
| `couponRedemptions/{orderId_couponId}` | Redemption record | R: couponId, orderId, uid?/phoneHash, amount | Auth. | Server only | Create-once | couponId+createdAt; couponId+uid | With order |
| `loyaltyAccounts/{uid}` | Balance | R: balanceAvailable, balancePending, lifetimeEarned | Derived (rebuildable from ledger) | Owner R; server W | ≥ 0 | — | With user |
| `loyaltyLedger/{id}` | Append-only ledger | See FR-081 | Auth. (immutable) | Owner R (own); staff R | deterministic ids | uid+createdAt; orderId | ≥ 7 years [TBD] |
| `reviews/{id}` | Product reviews | R: productId, uid, orderId (verified), rating 1–5, status(pending/approved/rejected); title, body | Auth. | Public R (approved); owner R; server W | One review per order item | productId+status+createdAt | Delete on user deletion request (anonymise) |
| `settings/{docId}` | store, shipping, returns, loyalty, payments(status only), analytics(ids), seo, notifications | Config fields | Auth. | Public subset via API; staff per role | Schema validated | — | Versioned history in audit log |
| `banners/{id}`, `pages/{slug}`, `homepage/main` | CMS | See §18 | Auth. | Public R (published); content editors W | HTML sanitised | status+placement+sortRank | Archive |
| `notificationTemplates/{id}` | Templates | R: eventKey, channel, language, subject, body, enabled | Auth. | Admin R/W | Variables whitelisted | eventKey+channel | Versioned |
| `notificationOutbox/{id}` | Delivery queue/log | R: eventKey, channel, recipient (ref or masked), status, attempts, providerMessageId?, error? | Auth. | Staff R; server W | — | status+nextAttemptAt | 90 days [TBD] |
| `supportNotes/{id}` | Internal notes | R: subject(uid|orderId), note, author | Auth. | Support/Admin/Owner R/W; never customer | — | subjectId+createdAt | With customer |
| `expenses/{id}` | Staff-recorded expenses | R: date, category, amount, note | Auth. | Admin/Owner/Analyst(R) | amount>0 | date | 7 years [TBD] |
| `analyticsDaily/{yyyymmdd}` | Daily aggregates | Metrics fields, computedAt | **Derived** | Staff R; server W | Rebuildable | — | Rebuild on demand |
| `importJobs/{id}` | CSV imports | R: type, status, counts, errors[], file ref | Auth. | Product Mgr+ | — | status+createdAt | 90 days |
| `dataRequests/{id}` | Export/delete requests | R: uid, type, status | Auth. | Owner R (own); Admin R/W | — | status | 2 years |
| `idempotencyKeys/{hash}` | Request replay guard | R: scope, requestHash, resultRef, expiresAt | Auth. | Server only | TTL 24–72 h | expiresAt (TTL) | TTL |
| `auditLogs/{id}` | Staff/system audit | R: actor, action, entity, diff, ip, ua, requestId, createdAt | Auth. (immutable) | Owner/Admin R; server W | Append-only | entity+createdAt; actor+createdAt | ≥ 1 year [TBD] |

**Authoritative vs derived.** Authoritative: product/variant fields, `stockOnHand`/`stockReserved`, orders & snapshots, payments, ledger, refunds, settings. Derived: `ratingSummary`, `loyaltyAccounts` balances (rebuildable from ledger), `analyticsDaily`, `coupon.usageCount`, `orders.paymentStatus` mirror, collection membership lookups, search tokens, image derivatives.

**Transactions & idempotency.** (1) Checkout: single transaction — variants (reserve), order, items, events, payment, coupon redemption, loyalty ledger, idempotency key. (2) Fulfilment/cancel/return restock: transaction with deterministic movement id + status re-read. (3) Loyalty earn/reverse: deterministic ledger ids. (4) Payment callbacks: unique `paymentEvents` key. Firestore transaction read-before-write ordering and limits are respected (TRD §9).

**Security of data access.** Firestore/Storage security rules deny all client writes to privileged collections; the server (Admin SDK) bypasses rules, so **server-side authorisation is mandatory and independent of rules** (SEC-002).

---

## 23. API and Integration Requirements

Base path `/api/v1`. JSON. Auth: `Authorization: Bearer <Firebase ID token>`; server verifies signature, expiry, audience, issuer, revocation (for staff, `checkRevoked`). Error envelope: `{ "error": { "code": "STRING", "message": "safe text", "details": [...], "requestId": "..." } }`. Standard codes: 400 `VALIDATION_ERROR`, 401 `UNAUTHENTICATED`, 403 `FORBIDDEN`, 404 `NOT_FOUND`, 409 `CONFLICT/INVALID_TRANSITION/OUT_OF_STOCK/IDEMPOTENCY_MISMATCH`, 422 `BUSINESS_RULE`, 429 `RATE_LIMITED`, 500 `INTERNAL` (no stack traces).
Authorisation legend: **P** public, **U** signed-in customer (verified where noted), **S:role** staff role(s).

### 23.1 Auth and account
| Method & path | Auth | Purpose / input | Validation | Output | Errors | Side effects |
|---|---|---|---|---|---|---|
| `POST /auth/session/sync` | U | After client login: create/update `users/{uid}`, merge guest cart | Valid token; cart cookie optional | profile summary | 401 | Cart merge, audit (login) |
| `GET /me` | U | Current profile + roles | — | profile | 401 | — |
| `PATCH /me` | U | name, phone, marketing consent | E.164 PK phone; consent record | profile | 400 | consent log |
| `GET/POST /me/addresses`, `PATCH/DELETE /me/addresses/:id` | U | CRUD addresses | City/phone; ≤10 | address(es) | 400/404 | default-address update |
| `POST /me/data-requests` | U | type=`export|delete` | rate limit 1/24h | request id | 429 | Creates `dataRequests`, notifies staff |

(Registration, password reset, email verification use Firebase Auth client SDK flows; the server never sees passwords.)

### 23.2 Catalogue browsing
| Method & path | Auth | Purpose | Notes |
|---|---|---|---|
| `GET /products` | P | List with `audience, category, collection, season, size, color, minPrice, maxPrice, inStock, onSale, sort, page, pageSize, q` | Returns only active; computed sale price; no cost fields; cached (short TTL) |
| `GET /products/:slug` | P | Detail + variants (availability as `inStock/low/out`, **not exact stock** unless setting allows) | 404 if not active |
| `GET /categories`, `GET /collections`, `GET /collections/:slug` | P | Browse | Only published/active |
| `GET /search/suggest?q=` | P | Suggestions | Rate limited |
| `GET /content/home`, `GET /content/pages/:slug`, `GET /settings/public` | P | CMS and public settings | Sanitised |

### 23.3 Cart, wishlist
| Method & path | Auth | Purpose | Validation / side effects |
|---|---|---|---|
| `GET /cart` | P (cookie) / U | Priced cart view | Recomputes every read |
| `POST /cart/items` `{variantId, qty}` | P/U | Add | Variant active; qty rules; 409 if exceeds available |
| `PATCH /cart/items/:variantId` `{qty}` / `DELETE` | P/U | Update/remove | Same |
| `POST /cart/merge` | U | Merge guest cart | Idempotent |
| `GET/PUT/DELETE /wishlist/items/:productId` | U | Wishlist ops | Idempotent |
| `POST /wishlist/:productId/move-to-cart` | U | Move | Variant available |

### 23.4 Checkout and orders
| Method & path | Auth | Purpose / input | Validation | Output | Errors | Side effects |
|---|---|---|---|---|---|---|
| `POST /checkout/quote` | P/U | cart ref, address/city, coupon, loyaltyPoints, paymentMethod | Server pricing §16.3 | line items, totals, warnings, `pricingVersion` | 422 invalid coupon | None |
| `POST /checkout/orders` | P/U | Same + customer info + `Idempotency-Key` header | Full revalidation; PK phone; city; method enabled; stock; coupon; email-verified if registered (S) | order summary, orderNumber | 409 OUT_OF_STOCK / IDEMPOTENCY_MISMATCH, 422 | Transaction §22; clears cart; queues `order.placed` |
| `GET /orders` | U | My orders (paginated) | Ownership | list | — | — |
| `GET /orders/:orderNo` | U | Own order detail | `order.uid == uid` | order + timeline | 403/404 | — |
| `POST /orders/:orderNo/cancel-request` | U | Cancel (self-serve only in `pending_confirmation`) | Status check | updated order or request | 409 | Release stock if cancelled |
| `POST /track-order` | P | `{orderNumber, phone|email}` | Rate limit (5/min/IP), constant-time compare, generic error | limited order view (status, items, tracking ref) | 404 generic | — |
| `GET /admin/orders`, `GET /admin/orders/:id` | S:order_manager+, support(R), analyst(R masked) | Query | Filters, pagination | orders | — | — |
| `POST /admin/orders/:id/transition` `{to, reason?, data}` | S:order_manager/admin/owner | State change | §12.2 matrix; version check | order | 409 INVALID_TRANSITION | Stock movement, events, notifications, loyalty hooks, audit |
| `POST /admin/orders/:id/notes` | S:order_manager+, support | Internal note | length | note | — | audit |

### 23.5 Payments
| Method & path | Auth | Purpose | Notes |
|---|---|---|---|
| `GET /payments/methods` | P | Enabled methods (COD only in 1.0) | Providers `Not Configured` omitted |
| `POST /payments/:provider/initiate` | U/P | Create provider payment intent | **Disabled until INT-001/002 complete**; returns 501/`NOT_CONFIGURED` otherwise |
| `POST /payments/:provider/callback` | Provider (signature verified per provider docs) | Callback ingestion | Replay guard; amount/currency/reference verification; no trust in browser |
| `GET /payments/:paymentId/status` | U (owner) | Status refresh (server queries provider if needed) | Never trusts query params |
| `GET /admin/payments`, `POST /admin/payments/:id/reconcile` | S:owner/admin/order_manager(R) | Reconciliation | audit |
| `POST /admin/orders/:id/cod-collected` | S:order_manager+ | Record COD collection | amount equality or reason |

### 23.6 Shipping
| Method & path | Auth | Purpose |
|---|---|---|
| `GET /shipping/estimate?city=` | P | Zone fee and ETA range |
| `POST /admin/shipments`, `PATCH /admin/shipments/:id` | S:order_manager+ | Manual shipment CRUD, failed delivery records |
| `GET/PUT /admin/settings/shipping` | S:owner/admin (R: order_manager) | Zones, fees, thresholds |

### 23.7 Returns and refunds
| Method & path | Auth | Purpose |
|---|---|---|
| `POST /returns` | U/S:support | Create return (eligibility check) |
| `GET /returns`, `GET /returns/:id` | U (own) | View |
| `POST /admin/returns/:id/decision` | S:order_manager+ | approve/reject (+exchange variant reservation) |
| `POST /admin/returns/:id/receive` `{inspection[]}` | S:order_manager+ | Receive/inspect → restock movements |
| `POST /admin/refunds`, `POST /admin/refunds/:id/approve`, `POST /admin/refunds/:id/complete` | S:admin/owner (create: order_manager/support) | Refund lifecycle; `complete` requires provider confirmation ref or documented manual resolution |

### 23.8 Coupons, loyalty, reviews
| Method & path | Auth | Purpose |
|---|---|---|
| `POST /coupons/validate` | P/U | Validate in context of cart (no side effects) |
| `GET/POST/PATCH /admin/coupons` | S:product_manager/admin/owner | CRUD, archive |
| `GET /me/loyalty` | U | Balance + ledger page |
| `GET /admin/loyalty/ledger`, `POST /admin/loyalty/adjust` | S:admin/owner/support(limit) | Manual adjustment with reason |
| `GET/PUT /admin/settings/loyalty` | S:owner/admin | Policy |
| `POST /reviews` | U (verified purchase) | Create pending review |
| `PATCH /admin/reviews/:id` | S:admin/content_editor | Moderate |

### 23.9 Admin catalogue and inventory
| Method & path | Auth | Purpose / validation |
|---|---|---|
| `GET/POST /admin/products`, `GET/PATCH /admin/products/:id`, `POST /admin/products/:id/publish|archive` | S:product_manager+ | §9 rules; version check |
| `POST/PATCH /admin/products/:id/variants` | S:product_manager+ | Unique SKU; stock fields not directly editable (use adjust) |
| `POST /admin/uploads/sign` | S | Signed upload URL, type/size constraints |
| `POST /admin/inventory/adjust` `{variantId, type, qty, reason}` | S:product_manager/admin/owner, order_manager(fulfilment types only) | Transaction; no negative results |
| `GET /admin/inventory/movements` | S (R roles) | Filter by variant/order/type/date |
| `POST /admin/imports` `{type}` → upload → `GET /admin/imports/:id` → `POST /admin/imports/:id/confirm` | S:product_manager+ | Preview/confirm workflow |
| `GET/POST/PATCH /admin/categories`, `/admin/collections` (+ `/publish`, `/schedule`, `/archive`) | S:product_manager+/content_editor | §8 |

### 23.10 CMS, settings, analytics, reports, staff, audit
| Method & path | Auth | Purpose |
|---|---|---|
| `GET/PUT /admin/content/homepage`, `/admin/banners`, `/admin/pages` | S:content_editor+ | Sanitised content |
| `GET/PUT /admin/settings/{store|seo|analytics|notifications|returns|payments}` | S per §4 | Validated schemas; secrets rejected |
| `GET /admin/analytics/summary|timeseries|top-products|inventory-health` | S:analyst+ | §19 formulas |
| `POST /admin/reports` / `GET /admin/reports/:id` | S:analyst+ | Async export to Storage; signed download URL (short expiry) |
| `GET/POST/PATCH /admin/staff`, `POST /admin/staff/:uid/revoke-sessions` | S:owner (admin limited) | Staff mgmt |
| `GET /admin/audit-logs` | S:owner/admin | Filters |
| `POST /admin/expenses` | S:admin/owner | Expense entry for profit |
| `GET /sitemap.xml`, `GET /robots.txt` | P | SEO |
| `POST /jobs/{publish-collections|release-reservations|expire-points|rebuild-analytics|dispatch-notifications}` | Cloud Scheduler OIDC service identity only | Scheduled jobs; not user-callable |

### 23.11 Integration boundaries
| Boundary | Responsibility | Rules |
|---|---|---|
| Firebase Auth | Identity, email verification/reset, MFA | Server verifies tokens; custom claims mirror `staff` role (cache) |
| Firestore | Data | Admin SDK server-side; client SDK limited (see rules) |
| Firebase/Cloud Storage | Images, exports, return photos | Signed URLs; rules restrict public read to product/banner derivatives only |
| Payment gateways | JazzCash, Easypaisa adapters | INT-001/002; secrets in Secret Manager |
| Email provider | Transactional + marketing email | INT-003; adapter interface |
| SMS/WhatsApp | Future | INT-004 |
| Courier | Future | INT-005 |
| Analytics | GA4/others | INT-006; consent-gated |
| Search | Firestore-based MVP; optional external search | INT-007 (future) |

---

## 24. Security, Privacy and Data Protection

| ID | Requirement | Pri |
|---|---|---|
| SEC-001 | Every protected API verifies the Firebase ID token server-side (signature, issuer, audience, expiry); staff endpoints also use `checkRevoked` and re-load `staff/{uid}` (cached ≤ 60 s). | M |
| SEC-002 | Least-privilege RBAC per §4 enforced in a central server authorisation layer (policy table) — **not** only by Firestore rules, because the Admin SDK bypasses rules. | M |
| SEC-003 | Firestore and Storage rules: default deny; public read only for published catalogue/CMS documents and public image derivatives; users may read only their own `users`, `orders`, `loyalty*`, `returns` docs; **all** client writes denied for orders, payments, inventory, loyalty, coupons, staff, settings, audit. Rules unit-tested with the emulator. | M |
| SEC-004 | Input validation with a schema library on every endpoint (types, lengths, enums, ranges); reject unknown fields; sanitise rich text (allow-list) and escape output; parameterised Firestore queries only (no string-built paths from raw input). | M |
| SEC-005 | Rate limiting per IP + account (e.g., login-adjacent, track-order, coupon-validate, checkout, data-requests, search suggest); stricter for guest endpoints; 429 with `Retry-After`. Thresholds in TRD. Cloud Armor or equivalent optional. | M |
| SEC-006 | Secrets only in server environment/Secret Manager; client bundle contains only public Firebase web config and public analytics IDs. CI scan fails the build if secret patterns appear in bundle. Secrets and tokens redacted from logs. | M |
| SEC-007 | Forged price prevention: server ignores client totals/prices; checkout recomputes all values; order stores `pricingVersion`. | M |
| SEC-008 | Coupon abuse prevention: server validation, transactional redemption counters, per-customer limits (uid, normalised phone, email), rate limit on validate endpoint. | M |
| SEC-009 | Role escalation prevention: role assignment only through Owner-controlled staff endpoint; claims set by server; users cannot write role fields; "last owner" invariant. | M |
| SEC-010 | Unauthorised customer data access prevention: ownership checks on every object; guest tracking requires matching order number + phone/email, returns limited data. | M |
| SEC-011 | Duplicate-order prevention: Idempotency-Key + deterministic ids; button disable is UX only. | M |
| SEC-012 | Stock manipulation prevention: no direct stock writes from clients; adjustments require roles and write immutable movements. | M |
| SEC-013 | Payment callback security: provider-documented signature verification, timestamp/nonce or event-id replay protection, amount/currency/reference checks, constant-time comparisons, IP allow-list only if provider documents one. | M |
| SEC-014 | Error sanitisation: client gets `code`, safe `message`, `requestId`; stack traces and internal ids only in server logs. | M |
| SEC-015 | Session protection: Firebase ID tokens short-lived; admin app optionally uses server session cookies (`createSessionCookie`) with HttpOnly, Secure, SameSite=Lax/Strict; CSRF protection on cookie-authenticated mutations; strict CORS allow-list; security headers (CSP, HSTS, X-Content-Type-Options, frame-ancestors/X-Frame-Options, Referrer-Policy, Permissions-Policy). | M |
| SEC-016 | Audit logging for all staff writes and security events (login, role change, session revoke, export, refund, manual adjustment). | M |
| SEC-017 | No card/wallet PIN or OTP collection; no card numbers stored; provider-hosted authentication only. | M |
| SEC-018 | Upload security: MIME + magic-byte validation, size limits, random object names, no executable content, image re-encode; return photos private. | M |
| SEC-019 | Backups: scheduled Firestore export (managed export/PITR where available) to a separate bucket, retention [TBD], **documented restore drill** before launch and quarterly thereafter. | S |
| SEC-020 | Privacy: privacy policy and cookie consent; data export (JSON) and deletion workflow (anonymise orders required for legal/accounting retention, delete profile, addresses, wishlist, tokens); retention schedule documented; legal review required [Pakistan data-protection obligations to be confirmed with counsel]. | S |
| SEC-021 | Incident handling: severity levels, on-call contact, containment (disable payments, revoke sessions, rotate secrets), customer/regulator notification decision by Owner with legal advice, post-incident review. | S |
| SEC-022 | Dependency and supply-chain hygiene: lockfiles, automated vulnerability scanning, pinned CDN/script versions, no runtime remote code. | S |

---

## 25. Non-Functional Requirements

Targets below are **proposed**; none is a verified result.

| ID | Area | Requirement / acceptance condition (proposed) |
|---|---|---|
| NFR-001 | Responsiveness | All storefront and admin pages usable without horizontal scroll at 360, 768, 1024, 1440 px; touch targets ≥ 44×44 px |
| NFR-002 | Accessibility | WCAG 2.2 AA conformance target; automated axe checks show 0 critical/serious issues on key pages; full keyboard operability; visible focus; labelled forms; text contrast ≥ 4.5:1 (3:1 large text); lime accent never used alone as text on light backgrounds; `prefers-reduced-motion` respected |
| NFR-003 | Performance (storefront, mobile 4G emulation) | LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75 on home/PDP/listing in lab test; hero image ≤ 200 KB (WebP/AVIF); JS initial bundle budget [TBD, e.g. ≤ 250 KB gzip] |
| NFR-004 | API performance | p95 ≤ 500 ms for catalogue reads (cached), ≤ 1.5 s for checkout placement under nominal load; measured in staging load test |
| NFR-005 | Reliability | Monthly availability target 99.5% [TBD]; graceful degradation: catalogue works if notifications fail; checkout shows retriable error without duplicate orders |
| NFR-006 | Security | Zero high/critical findings open at launch from security review; SEC tests passing; headers verified by scanner |
| NFR-007 | Data integrity | Zero negative stock and zero double-decrement in concurrency test of N=[100] parallel orders for the last unit |
| NFR-008 | Maintainability | TypeScript strict mode; lint/format in CI; ≥ 80% unit coverage on pricing, inventory, state machine, loyalty modules; documented module boundaries; migration scripts versioned |
| NFR-009 | Scalability | Design supports ≥ [TBD] concurrent shoppers using Cloud Run autoscaling; Firestore hot-spot avoidance (no sequential ids; counters sharded where needed); load test with assumptions documented |
| NFR-010 | Localisation | English UI at launch; all strings in i18n resource files; PKR formatting `Rs 1,500` (configurable), dates `DD MMM YYYY` in Asia/Karachi; Urdu/RTL ready layout (logical CSS properties) |
| NFR-011 | Error recovery | Retry with exponential backoff for external calls; idempotent job handlers; failed notification/payment-verification jobs are visible and retryable; user-visible errors include request ID |
| NFR-012 | Observability | Structured JSON logs with requestId; error reporting; uptime checks; alerts for 5xx rate, failed jobs, payment mismatches |
| NFR-013 | Browser support | Latest 2 versions of Chrome, Safari (iOS 15+), Firefox, Edge; Android Chrome |
| NFR-014 | SEO performance | Product/collection pages deliver meta tags and JSON-LD in initial HTML (server-rendered or prerendered) |
| NFR-015 | Backup/RTO | RPO ≤ 24 h, RTO ≤ 8 h [TBD], verified by restore drill |
| NFR-016 | Time handling | Store UTC, display Asia/Karachi; all date-range reports tested across midnight boundaries |

---

## 26. User Stories and Acceptance Criteria

Format: **ID — Role — Story — Priority — Dependencies**, followed by Given/When/Then (G/W/T). Phases refer to §29.

### 26.1 Customer stories

**US-001 — Shopper — Browse and filter products — M — Dep: FR-003/004/005 (Phase 2)**
- G products exist in several categories, W I filter by audience=Women and size=M, T only active products with an available M variant appear and the URL reflects filters.
- G no product matches, W I apply filters, T I see an empty state with a clear-filters action.
- G the API fails, W the grid loads, T I see a retry message with a request ID, not a stack trace.

**US-002 — Shopper — View product details and pick variant — M — Dep: FR-008/009 (Phase 2)**
- G a product with sizes S–XL and 3 colours, W I select Black/M, T price, SKU, images and availability reflect that variant.
- G the Black/L variant has zero available stock, W I view sizes, T L is disabled and labelled "Sold out".
- G a product is archived, W I open its URL, T I get the configured 404/410/redirect behaviour.

**US-003 — Shopper — Search — M — Dep: FR-006 (Phase 2)**
- G products exist, W I search "hoodie", T matching active products show, ordered by relevance.
- G the query is empty or only symbols, W I submit, T no error occurs and popular categories are shown.

**US-004 — Customer — Add to cart as guest and edit quantities — M — Dep: FR-040–044 (Phase 3)**
- G I am not logged in, W I add a variant, T a server cart is created and a cart cookie is set.
- G available stock is 3, W I set quantity to 5, T the request is rejected/capped at 3 with a message.
- G a price changed since I added the item, W I open the cart, T I see the current price with a "price updated" notice.

**US-005 — Customer — Sign up and verify email — M — Dep: FR-031/032 (Phase 1)**
- G a new email, W I sign up, T a verification email is requested through Firebase and my account is unverified.
- G an unverified registered account, W I try to place an order, T I am asked to verify first.
- G an existing email, W I sign up, T I see a non-leaking error and a login/reset link.

**US-006 — Customer — Log in, log out, reset password — M — Dep: FR-033 (Phase 1)**
- G wrong password, W I log in, T I get a generic failure message and rate limiting applies after repeated attempts.
- G I request a reset, W the email exists or not, T the UI response is identical.

**US-007 — Customer — Merge guest cart on login — M — Dep: FR-043 (Phase 3)**
- G a guest cart with Variant A ×1 and my account cart with Variant A ×2, W I log in, T the merged cart shows A ×3 capped by availability and I am told of any cap.
- G the merge request is repeated, W it is processed again, T the cart is unchanged (idempotent).

**US-008 — Customer — Place a COD order as guest — M — Dep: FR-045–052, FR-055 (Phase 3)**
- G a valid cart, WHEN I submit a valid Pakistani phone, city and address, T an order is created in `pending_confirmation`, stock is reserved, COD payment is `cod_awaiting`, and I see an order number.
- G phone `12345`, W I submit, T field-level error "Enter a valid Pakistani mobile number".
- G double-click or network retry with the same Idempotency-Key, W submitted twice, T exactly one order exists.
- G another buyer took the last unit milliseconds earlier, W I submit, T I get `OUT_OF_STOCK` for that line and no order is created.
- G client-sent total differs from server total, W I submit, T the server total prevails and I am informed if it changed.

**US-009 — Registered customer — Place an order with saved address and loyalty points — S — Dep: US-008, FR-080–084 (Phase 5)**
- G balance 800 points and min redemption 500, W I redeem 600, T discount is applied after coupons within the cap, and a `redeem` ledger row is written in the same transaction.
- G I request more points than my balance, W I submit, T the request is rejected with a business-rule error.

**US-010 — Customer — Apply a coupon — S — Dep: FR-074–079 (Phase 5)**
- G coupon SALE10 requires minimum PKR [value], W subtotal is below it, T I see "Minimum spend not met".
- G coupon expired, W I apply, T "This code has expired".
- G coupon usage limit reached concurrently by two orders, W both submit, T only the allowed count succeed; the other is rejected without partial writes.

**US-011 — Customer — See COD as the only enabled payment method and online methods unavailable — M — Dep: FR-056/095 (Phase 3)**
- G JazzCash/Easypaisa not configured, W I reach payment step, T they are hidden or disabled with "Not available", and direct API initiation returns `NOT_CONFIGURED`.

**US-012 — Customer — Track an order (guest and member) — M — Dep: FR-054 (Phase 3)**
- G order number + matching phone, W I submit, T I see status timeline and tracking reference exactly as recorded by staff.
- G wrong phone, W I submit, T generic "Order not found" and rate limit counts apply.
- G no tracking reference yet, W I view, T the page says tracking is not available yet (no invented events).

**US-013 — Customer — Cancel an order — M — Dep: FR-049, §12.2 (Phase 3/4)**
- G status `pending_confirmation`, W I cancel, T status becomes `cancelled`, reserved stock released once, event logged.
- G status `shipped`, W I request cancel, T I am told to refuse delivery/start a return; no state change.

**US-014 — Customer — Request a return/exchange — S — Dep: FR-068–073 (Phase 4)**
- G delivered 3 days ago, W I request return for 1 of 2 units, T a return is `requested` for qty 1.
- G delivered 20 days ago with window 7, W I request, T I see "outside return window" and Support contact.
- G exchange variant out of stock, W staff approve exchange, T the system blocks and offers refund.

**US-015 — Customer — Manage wishlist — S — Dep: FR-037–039 (Phase 5)**
- G logged in, W I toggle heart twice, T the item is added then removed without duplicates.
- G wishlist item became inactive, W I view wishlist, T it is shown as unavailable and cannot be moved to cart.
- G I am a guest, W I tap the heart, T I am prompted to log in.

**US-016 — Customer — View loyalty balance and history — S — Dep: FR-080–086 (Phase 5)**
- G I have ledger rows, W I open Loyalty, T I see available, pending and expiring points matching ledger sums.
- G I attempt to POST a points change, W I call any endpoint, T no endpoint allows it (403/404).

**US-017 — Customer — Privacy requests — S — Dep: FR-036, SEC-020 (Phase 6)**
- G logged in, W I request export, T a request is logged and staff process it; I never receive another user's data.
- G I request deletion with open orders, W staff review, T profile is anonymised and orders retained per legal policy with personal fields minimised.

**US-018 — Customer — Write a verified review — C — Dep: FR-111, reviews collection (Phase 5)**
- G I received item X, W I submit a rating, T it is `pending` until moderated; unverified buyers cannot review.

### 26.2 Staff stories

**US-101 — Owner — Manage staff and roles — M — Dep: FR-093, SEC-009 (Phase 1/4)**
- G I am Owner, W I invite a Support user, T a `staff` record and claims are set by the server and an audit log is written.
- G an Admin tries to create an Owner, W they submit, T 403.
- G only one Owner exists, W I try to disable them, T the operation is blocked.

**US-102 — Product Manager — Create product with variants — M — Dep: FR-019–021, FR-029 (Phase 2)**
- G duplicate SKU, W I save a variant, T validation error and no document created.
- G missing alt text, W I publish, T publish blocked listing missing fields.
- G sale price ≥ price, W I save, T validation error.

**US-103 — Product Manager — Adjust stock — M — Dep: FR-022/023 (Phase 2)**
- G on hand 10, reserved 3, W I record a correction to 2, T it is rejected (would go below reserved) with explanation.
- G a valid restock +20, W I submit, T on hand updates and an immutable movement with before/after is stored.

**US-104 — Product Manager — Import products via CSV — S — Dep: FR-028 (Phase 2/5)**
- G a CSV with 100 rows, 3 invalid, W I upload, T a preview lists 97 valid, 3 invalid with row/column messages; nothing is saved until I confirm.
- G I confirm, W import runs twice due to retry, T results are idempotent (no duplicate variants or stock deltas).

**US-105 — Product Manager/Content Editor — Schedule a seasonal collection — M — Dep: FR-013–017 (Phase 2)**
- G a collection scheduled for tomorrow 09:00 PKT, W the time passes, T it is published and sitemap includes it.
- G I archive a collection, W I check products and past orders, T all remain intact.

**US-106 — Order Manager — Process an order through states — M — Dep: §12.2 (Phase 3/4)**
- G `pending_confirmation`, W I click Confirm, T status `confirmed`, event logged.
- G `confirmed`, W I attempt Ship directly, T 409 `INVALID_TRANSITION`.
- G two staff click Confirm simultaneously, W both submit, T one succeeds, the other gets a conflict.
- G I mark `shipped` with courier and tracking, W saved, T stock is fulfilled (onHand and reserved decremented) exactly once.

**US-107 — Order Manager — Record delivery and COD collection — M — Dep: FR-055 (Phase 3/4)**
- G `shipped`, W I mark delivered with collected amount equal to total, T payment `cod_collected`.
- G collected amount differs, W I submit, T a reason is required and a discrepancy flag is stored.

**US-108 — Order Manager — Handle failed delivery — S — Dep: FR-066 (Phase 4)**
- G a shipment attempt failed, W I log reason and choose reattempt, T attempt count increments and the order remains `shipped`.
- G RTO chosen, W I confirm, T order moves to `returned` and inspection leads to restock.

**US-109 — Support — Add notes and open a return for a customer — S — Dep: FR-070 (Phase 4)**
- G I am Support, W I add a note, T customers cannot see it; audit written.
- G I try to change order status to shipped, W I submit, T 403.

**US-110 — Admin — Approve and complete refund — S — Dep: FR-073, FR-062 (Phase 4)**
- G refund amount greater than refundable, W I create it, T rejected.
- G digital refund, W I mark complete without provider confirmation or documented manual resolution, T rejected.
- G COD refund via bank transfer, W I enter reference and approver, T status `completed` and order may move to `refunded` once all refunds resolved.

**US-111 — Product Manager — Create coupon — S — Dep: FR-075 (Phase 5)**
- G a duplicate code, W I save, T error.
- G percentage 120, W I save, T validation error (0 < pct ≤ 100).

**US-112 — Admin — Adjust loyalty points manually — S — Dep: FR-085 (Phase 5)**
- G reason is empty, W I submit, T rejected.
- G valid adjustment, W submitted twice (retry), T one ledger row (idempotent), customer notified when provider is configured.

**US-113 — Content Editor — Edit homepage and banners — M — Dep: FR-001 (Phase 4)**
- G a banner with an end date, W the date passes, T it disappears without manual change.
- G pasted script tags in text, W I save, T content is sanitised.

**US-114 — Owner — View payment integration status — M — Dep: FR-095 (Phase 3/4)**
- G no provider credentials, W I open Payment Integration, T both show `Not Configured`; enabling is blocked.
- G an Admin (non-Owner) tries to change status, W submits, T 403.

**US-115 — Analyst — View dashboard and export report — S — Dep: FR-096–101 (Phase 5)**
- G no orders in range, W I open dashboard, T I see "No data for this period".
- G orders exist with some missing cost price, W I open profit, T I see gross profit with a "cost missing for N items" warning; revenue and profit are shown separately.
- G I export customers, W the file generates, T phone/email are masked by default and the export is audit-logged.

**US-116 — Admin — Review audit logs and revoke sessions — S — Dep: SEC-016 (Phase 4)**
- G an action on a product price, W I open audit logs, T I see actor, time, before/after.
- G I revoke a staff member's sessions, W they call an API with an old token, T 401.

**US-117 — Support/Admin — Notification status honesty — S — Dep: FR-104 (Phase 5)**
- G no email provider configured, W an order is placed, T the outbox shows `queued`/`not_configured` and customers are not told an email "was sent".
- G provider returns failure, W the worker retries, T attempts are recorded and final `failed` is visible.

**US-118 — System — Release expired reservations and publish scheduled collections — M — Dep: jobs (Phase 3/5)**
- G a reservation older than `reservedUntil` with unverified online payment, W the job runs, T stock is released once and order is cancelled/expired with an event.
- G the job runs twice, W reprocessed, T no double release.

---

## 27. Test Strategy

**Principle.** Tests are specified here; none has been executed. No result is to be reported as passing until a recorded CI/manual run exists.

| Level | Scope | Tools (proposed) | Gate |
|---|---|---|---|
| Unit | Pricing engine, coupon rules, loyalty maths, state machine, phone/city validators, slug/SKU logic, date handling | Vitest/Jest | ≥ 80% on critical modules |
| Integration | API handlers with Firestore/Auth/Storage **emulators**; transactions; idempotency; payment adapter contract tests with mocks | Firebase Emulator Suite, Supertest | All pass in CI |
| Security | Firestore/Storage rules tests; authZ matrix tests (each endpoint × each role); injection/XSS payloads; rate-limit tests; header checks; dependency scan; secret scan | Rules unit-testing library, OWASP ZAP baseline (staging), npm audit | No high/critical open |
| End-to-end | Customer journeys and admin journeys | Playwright | Critical paths pass on Chromium + WebKit (+Android emulation) |
| Accessibility | Automated + manual keyboard/screen-reader checks | axe, Lighthouse, manual NVDA/VoiceOver | No critical/serious |
| Responsive | Viewports 360/768/1024/1440, touch interaction | Playwright projects | Visual review sign-off |
| Performance | Lighthouse CI budgets; API load tests; concurrency test on stock | Lighthouse CI, k6 | Meets NFR-003/004/007 |
| Manual/UAT | Owner/staff acceptance with real-like data in staging | Checklist | Sign-off recorded |

### 27.1 Critical scenarios
| TC | Scenario | Expected |
|---|---|---|
| TC-001 | Account permissions: each role calls each admin endpoint | Matrix per §4; unauthorised → 403; non-staff with valid token → 403 |
| TC-002 | Customer A requests Customer B's order/address/ledger | 403/404; rules deny direct reads |
| TC-003 | Product variation selection: price/SKU/stock per variant; unavailable combos | Correct data; disabled state |
| TC-004 | Concurrent checkout: 50 parallel orders for the last 5 units | Exactly 5 units sold; stock ≥ 0; no duplicates |
| TC-005 | Duplicate order request (same Idempotency-Key, and same body different key) | Same key → one order; different key → separate legit order, never double-decrement per order |
| TC-006 | Forged totals/prices/discount in request body | Ignored; server totals used; mismatch flagged |
| TC-007 | Coupon edge cases: expired, min spend, max discount cap, per-customer limit, concurrent last-use, excluded sale items, stacking rules | Per §16 |
| TC-008 | Payment callback verification (mock provider): bad signature, wrong amount, wrong currency, unknown reference, replayed event | Rejected, logged, no `verified` state; replay no-op |
| TC-009 | Browser redirect to "success" URL without callback | Payment remains `pending` |
| TC-010 | COD collected amount mismatch | Reason required; flag set |
| TC-011 | Refund over-limit; digital refund completion without confirmation | Rejected |
| TC-012 | Loyalty: duplicate earn on retry; reversal on return; redemption cap; balance floor; no client write | Ledger consistent; balance = Σ(ledger) |
| TC-013 | Order state machine: every illegal transition; concurrent transitions | 409 with no side effects |
| TC-014 | Cancellation releases reservation exactly once; retry safe | Movement id unique |
| TC-015 | Fulfilment decrement exactly once on repeated `shipped` calls | One movement |
| TC-016 | Return restock for resellable only; exchange reservation | Per §15 |
| TC-017 | Collection archive keeps products and orders readable | No data loss |
| TC-018 | CSV import: invalid rows, injection (`=cmd|…`), duplicate SKUs, retry | Preview, sanitised, idempotent |
| TC-019 | XSS in product description/review/notes | Sanitised/escaped |
| TC-020 | Rate limits on track-order, coupon validate, login-adjacent endpoints | 429 |
| TC-021 | Staff session revocation, last-owner invariant, role escalation attempts | Blocked |
| TC-022 | Missing integrations: online payment initiate, email/SMS/courier adapters | `NOT_CONFIGURED`; UI honest |
| TC-023 | Time zone: orders around midnight PKT in reports; scheduled collection publishing | Correct boundaries |
| TC-024 | SEO: noindex headers on private pages; sitemap excludes inactive/archived; JSON-LD uses real price/availability | Verified by crawler tests |
| TC-025 | Backup/restore drill in staging | Data restored and integrity checked |
| TC-026 | Analytics dashboard with zero data and missing cost | Honest empty/warning states |
| TC-027 | Data export/deletion workflow | Correct scope; anonymisation |

**Environments.** `local` (emulators) · `test/staging` (separate Firebase/GCP project, sandbox provider credentials only, test email recipients) · `production` (separate project; no test data; live credentials only after approval). Test orders flagged `isTest` and excluded from reports. Sandbox and live credentials never share a project.

---

## 28. Deployment and Operations

> This section is a plan; **no deployment has occurred**. Verify each step against current Google AI Studio, Firebase and Cloud Run documentation before executing. Where a step depends on account eligibility, billing, or provider approval, it is marked **[MANUAL]**.

### 28.1 Workflow overview
1. **Prototype/build in Google AI Studio Build mode** using these documents as the prompt set (build phase by phase per the Implementation Plan). Confirm what runtime AI Studio provides for server code and how secrets are handled; **[ASSUMPTION A-08]**.
2. **Export/sync to a Git repository** (e.g., GitHub) to gain version control, CI and code review. **[MANUAL]**
3. **Provision GCP/Firebase projects**: `sarus-dev`, `sarus-staging`, `sarus-prod` (names illustrative; final ids chosen by owner). Enable billing on staging/prod (Cloud Run and Firestore beyond free quota require a billing account). **[MANUAL]**
4. **Firebase setup (per project):** create Firestore (Native mode, region close to users — decision [TBD], e.g. a South Asia or nearby region subject to availability), enable Authentication providers (Email/Password; Google optional), customise email templates, add **authorised domains** (staging/prod domains, Cloud Run URL, localhost for dev), enable Storage with rules, optionally enable Identity Platform for MFA. **[MANUAL]**
5. **Rules and indexes:** deploy `firestore.rules`, `storage.rules`, `firestore.indexes.json` via Firebase CLI; run emulator rule tests in CI before deploy.
6. **Secrets:** store server secrets in Secret Manager (or secure environment variables), mounted to Cloud Run; client gets only public Firebase config. Separate secrets per environment. Rotation procedure documented (see TRD).
7. **Build & deploy to Cloud Run:** containerise Node server (serves API and built React app), deploy via Cloud Build or GitHub Actions with Workload Identity Federation; configure min instances (0 or 1 [TBD]), concurrency, memory, timeout, service account with least-privilege IAM.
8. **Scheduler jobs:** Cloud Scheduler → authenticated HTTP calls (OIDC) to `/api/v1/jobs/*` (publish collections, release reservations, expire points, rebuild analytics, dispatch notifications).
9. **Custom domain & HTTPS:** obtain domain **[MANUAL — owner]**; map domain to Cloud Run (domain mapping or load balancer), complete DNS verification, managed TLS certificate; add domain to Firebase authorised domains; set canonical base URL env var; HSTS after verification. Propagation time is not guaranteed.
10. **Email domain setup:** SPF/DKIM/DMARC for chosen provider. **[MANUAL]**
11. **Payments:** do not enable. Complete INT-001/INT-002 checklists first (§28.4).
12. **Monitoring:** Cloud Logging, Error Reporting, Uptime checks, alerting policies (5xx rate, latency, job failures, payment mismatch counter), budget alerts.
13. **Backup & restore:** scheduled Firestore exports (and PITR if enabled) to a locked-down bucket; restore drill in staging; Storage object versioning optional. **[MANUAL setup]**
14. **Release gate:** Phase 6 checklist signed (security review, e2e, accessibility, restore drill, UAT).

### 28.2 Environment variables (names; values never in repo)
`NODE_ENV`, `APP_BASE_URL`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `GOOGLE_APPLICATION_CREDENTIALS` (only if not using workload identity), `SESSION_COOKIE_SECRET`, `ALLOWED_ORIGINS`, `EMAIL_PROVIDER`, `EMAIL_API_KEY`, `EMAIL_FROM`, `JAZZCASH_*` and `EASYPAISA_*` (provider-defined names, only after INT onboarding), `SCHEDULER_AUDIENCE`, `RATE_LIMIT_*`, `LOG_LEVEL`. Client-visible (public): `VITE_FIREBASE_*` web config, `VITE_GA_MEASUREMENT_ID`.

### 28.3 Migrations / schema evolution
Documents carry `schemaVersion`. Migrations are idempotent scripts run from CI/manual job with dry-run, logging, and backups beforehand; backward-compatible reads for one release; destructive changes need a two-step (expand → migrate → contract) deployment.

### 28.4 Provider onboarding checklist (payments)
1. Owner registers merchant account with provider **[MANUAL, approval time and eligibility determined by provider]**.
2. Obtain official integration documentation, sandbox credentials, callback URL requirements.
3. Implement adapter strictly per documentation; configure secrets in staging.
4. Run sandbox test plan (success, failure, cancel, timeout, duplicate callback, amount mismatch).
5. Owner reviews results; obtain live credentials; configure prod; run live low-value test; set status `Configured – Live`.

### 28.5 Operations
Support runbooks: stuck orders, stock discrepancies, payment mismatch, failed notifications, rollback (Cloud Run revision rollback), incident response (SEC-021), on-call contact list [TBD], change log, post-release checks.

---

## 29. Implementation Roadmap

Durations are not estimated here because team size/velocity are unknown **[TBD]**.

### Phase 1 — Foundation, database, authentication and permissions
- **Objectives:** project skeleton, environments, auth, RBAC, schema, rules, audit logging.
- **Deliverables:** repo/CI, Firebase projects, `users`, `staff`, `settings`, `auditLogs`; auth flows; authZ middleware; security rules v1 + emulator tests; design tokens; error/logging framework.
- **Dependencies:** Firebase project access; owner Owner-account email.
- **Acceptance:** US-005, US-006, US-101; TC-001, TC-002, TC-021 pass; rules tests pass.
- **Tests:** unit (validators, authZ), rules tests, integration (token verification).
- **DoD:** merged, CI green, rules deployed to dev, documentation updated.
- **External setup:** Firebase/GCP project(s), authorised domains.

### Phase 2 — Storefront, product catalogue, seasonal collections and inventory
- **Objectives:** browsable catalogue and stock correctness.
- **Deliverables:** product/variant/category/collection collections, admin product & inventory screens, image upload, storefront pages (home, shop, PDP, collections), SEO basics, CSV export/import (basic), movements ledger, scheduled collection job.
- **Dependencies:** Phase 1; sample products supplied by owner (not invented).
- **Acceptance:** US-001–003, US-102–105; TC-003, TC-017, TC-018, TC-024 (partial).
- **Tests:** inventory transaction tests, concurrency tests (staging), a11y/responsive checks.
- **DoD:** catalogue managed end-to-end from admin; Lighthouse budgets measured.
- **External setup:** Storage bucket, brand assets (placeholder until supplied).

### Phase 3 — Cart, checkout, orders, COD and payment architecture
- **Objectives:** reliable COD order placement and order state machine.
- **Deliverables:** pricing engine, cart, checkout, orders, events, COD payment records, shipping zones, order tracking, payment provider interface + disabled adapters, idempotency, reservation job, order emails via outbox (provider optional).
- **Dependencies:** Phase 2.
- **Acceptance:** US-004, US-007, US-008, US-011–013, US-106, US-107, US-118; TC-004–006, TC-009, TC-010, TC-013–015, TC-022.
- **Tests:** concurrency, idempotency, forged price, state machine.
- **DoD:** COD orders placed on staging with correct stock; no negative stock in load test.
- **External setup:** email provider (optional at this phase), shipping fee data from owner.

### Phase 4 — Complete admin panel, settings, fulfilment, returns and customer management
- **Objectives:** full operations tooling.
- **Deliverables:** order/shipment screens, returns & refunds, customers & support notes, staff management, CMS/homepage/banners, store/shipping/payment-status settings, audit viewer, notifications templates.
- **Dependencies:** Phase 3.
- **Acceptance:** US-013 (staff side), US-014, US-108–110, US-113, US-114, US-116; TC-011, TC-016, TC-021.
- **Tests:** authZ matrix, e2e admin journeys.
- **DoD:** every admin screen backed by an API op; no mock data.
- **External setup:** 2FA configuration where supported.

### Phase 5 — Wishlist, loyalty, coupons, marketing, SEO and analytics
- **Objectives:** growth features and reporting.
- **Deliverables:** wishlist, loyalty ledger/jobs, coupons and promotions, reviews, newsletter consent, abandoned-cart design (disabled), SEO (sitemap, robots, JSON-LD, redirects), analytics/reports, expenses.
- **Dependencies:** Phases 3–4.
- **Acceptance:** US-009, US-010, US-015, US-016, US-018, US-111, US-112, US-115, US-117; TC-007, TC-012, TC-020, TC-023, TC-024, TC-026.
- **Tests:** coupon edge tests, loyalty reversal tests, report correctness against fixture data.
- **DoD:** formulas verified with fixtures; consent banner functional.
- **External setup:** analytics property, email marketing consent wording (legal).

### Phase 6 — Security audit, integration verification, end-to-end tests, deployment and release preparation
- **Objectives:** launch readiness.
- **Deliverables:** security review report, pen-test baseline, full e2e suite, a11y audit, performance report, backup/restore drill, monitoring/alerts, production environment, domain/HTTPS, runbooks, UAT sign-off, data-request workflow.
- **Dependencies:** all prior phases; domain; production Firebase project; legal review of policies.
- **Acceptance:** US-017; TC-001–027 executed with recorded results; NFR targets measured; no open high/critical issues.
- **DoD:** Release checklist signed by Owner.
- **External setup:** domain, billing, email domain DNS, policies finalised, optional courier/payment onboarding tracks (post-MVP).

### 29.1 Features requiring external credentials or manual setup
JazzCash/Easypaisa (merchant approval), email provider keys + DNS, SMS/WhatsApp (provider approval), courier APIs, analytics IDs, custom domain/DNS, Firebase MFA, billing account, legal policy text.

---

## 30. Risks, Assumptions and Open Questions

### 30.1 Risk register
| ID | Risk | Severity | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R-01 | Overselling during concurrent checkout | High | Customer dissatisfaction, refunds | Transactional reservation, deterministic movement ids, concurrency tests (TC-004) | Tech Lead |
| R-02 | Payment gateway approval/spec delays | Medium | No online payments at launch | COD-first launch; adapters disabled; start onboarding early | Owner |
| R-03 | Client-side trust (forged price/total) | High | Financial loss | Server pricing; tests TC-006 | Tech Lead |
| R-04 | Firestore rules misconfiguration exposes data | High | Data breach | Default deny; emulator rule tests; review | Security Eng |
| R-05 | Admin SDK endpoints missing authZ | High | Privilege escalation | Central policy layer; matrix tests TC-001 | Tech Lead |
| R-06 | COD fake orders / failed deliveries | Medium | Operational cost | Confirmation call, COD limits, repeat-offender flags | Ops Lead |
| R-07 | AI Studio platform limits (server runtime, export, secrets) | Medium | Delivery friction | Early spike; Git export; fall back to local dev + Cloud Run | Tech Lead |
| R-08 | Inaccurate manual stock | Medium | Oversell/undersell | Movement ledger, stock counts, low-stock alerts | Ops Lead |
| R-09 | Email deliverability (no SPF/DKIM) | Medium | Missed confirmations | Domain auth setup, provider monitoring | Owner |
| R-10 | Legal/privacy non-compliance | Medium | Penalties/trust | Counsel review of policies and retention | Owner |
| R-11 | Loyalty liability and abuse | Medium | Margin loss | Caps, expiry, ledger audit, owner-approved economics | Owner |
| R-12 | Hot-spot/cost growth on Firestore | Low–Med | Latency/cost | Query design, caching, daily aggregates | Tech Lead |
| R-13 | SEO weak on SPA | Medium | Poor discoverability | Server-rendered meta/JSON-LD, sitemap | Tech Lead |
| R-14 | Single point of failure on Owner account | Medium | Lockout | ≥2 Owners recommended, MFA, recovery process | Owner |
| R-15 | Image/content licensing | Medium | Legal | Use only owned/licensed photography | Owner |

### 30.2 Provisional assumptions to confirm
Return window 7 days; loyalty 1 pt/PKR 100, 12-month expiry, 20% cap, 500 min; one coupon per order; COD fee none; guests do not earn loyalty; guest cart TTL 30 days; reservation expiry for online payments 15 min; Firestore region chosen by owner; Admin 2FA required where supported.

### 30.3 Open questions (do not block implementation start)
1. Final domain name and DNS provider.
2. Logo, brand assets, typography licences, photography source.
3. Shipping provider(s) and rate cards by city; free-shipping threshold; COD fee policy.
4. JazzCash/Easypaisa merchant status and timeline.
5. Email provider choice and sending domain.
6. Return window, return shipping cost responsibility, final-sale rules.
7. Loyalty economics (earn rate, value, expiry, caps).
8. Tax/GST/NTN invoicing requirements (not modelled in 1.0 beyond optional fields) — consult accountant.
9. Product catalogue size and initial data source (CSV?).
10. Staff headcount/roles at launch; who is Owner.
11. COD limits and risk policy.
12. Data retention periods per legal advice.
13. Newsletter/WhatsApp marketing plans.

---

## 31. Requirements Traceability

### 31.1 ID scheme
`FR-001…112` functional (by section), `NFR-001…016`, `SEC-001…022`, `DATA-001…010` (below), `INT-001…007` (below).

### 31.2 Data integrity requirements
| ID | Requirement | Pri |
|---|---|---|
| DATA-001 | Stock never negative; `stockReserved ≤ stockOnHand` | M |
| DATA-002 | Every stock change has exactly one immutable movement | M |
| DATA-003 | Order item snapshots and events are immutable | M |
| DATA-004 | Loyalty balance equals sum of ledger; ledger append-only | M |
| DATA-005 | Idempotency keys unique per scope and expire after TTL | M |
| DATA-006 | SKU and coupon-code uniqueness enforced by registry docs in transactions | M |
| DATA-007 | Payment amount/currency equals order total at verification | M |
| DATA-008 | Refund total ≤ paid/collected total | M |
| DATA-009 | Derived data rebuildable from authoritative data | S |
| DATA-010 | Archiving/soft-delete preferred; hard delete forbidden for entities referenced by orders | M |

### 31.3 Integration requirements
| ID | Requirement | Pri |
|---|---|---|
| INT-001 | JazzCash adapter per official docs; sandbox tests; disabled until approved | S (post-MVP live) |
| INT-002 | Easypaisa adapter per official docs; sandbox tests; disabled until approved | S (post-MVP live) |
| INT-003 | Email provider adapter with delivery confirmation semantics | S |
| INT-004 | SMS/WhatsApp adapter (future) | C |
| INT-005 | Courier adapter(s) (future) | C |
| INT-006 | Analytics integration with consent gating | S |
| INT-007 | External search (future) | C |

### 31.4 Traceability matrix (major requirements)
| Requirement | Phase | User stories | Acceptance tests |
|---|---|---|---|
| FR-003/004/005/006 Catalogue browse/search | 2 | US-001, US-003 | TC-003, E2E-browse |
| FR-008/009 PDP and variants | 2 | US-002 | TC-003 |
| FR-013–017 Collections | 2 | US-105 | TC-017, TC-023 |
| FR-019–026 Product & inventory | 2 | US-102, US-103 | TC-004, TC-014, TC-015 |
| FR-028 CSV import | 2/5 | US-104 | TC-018 |
| FR-031–036 Accounts | 1 | US-005, US-006, US-017 | TC-002, TC-027 |
| FR-040–044 Cart | 3 | US-004, US-007 | TC-005, TC-006 |
| FR-045–054 Checkout/orders | 3 | US-008, US-012, US-013 | TC-004, TC-005, TC-006, TC-013 |
| §12.2 State machine | 3 | US-106, US-107, US-108 | TC-013, TC-014, TC-015 |
| FR-055–062 Payments | 3 | US-011, US-114 | TC-008, TC-009, TC-010, TC-011, TC-022 |
| FR-063–067 Shipping | 3/4 | US-107, US-108 | TC-010, TC-022 |
| FR-068–073 Returns/refunds | 4 | US-014, US-110 | TC-011, TC-016 |
| FR-074–079 Coupons | 5 | US-010, US-111 | TC-007 |
| FR-080–086 Loyalty | 5 | US-009, US-016, US-112 | TC-012 |
| FR-087–095 Admin | 1/4 | US-101, US-113, US-116 | TC-001, TC-021 |
| FR-096–101 Analytics | 5 | US-115 | TC-023, TC-026 |
| FR-102–106 Notifications | 3/5 | US-117 | TC-022 |
| FR-107–112 SEO | 2/5 | — | TC-024 |
| SEC-001/002/003 AuthN/Z & rules | 1 | US-101 | TC-001, TC-002, rules suite |
| SEC-005 Rate limiting | 3–6 | US-012 | TC-020 |
| SEC-007/008/011/012/013 Integrity & abuse | 3 | US-008, US-010 | TC-004, TC-005, TC-006, TC-007, TC-008 |
| SEC-019 Backup/restore | 6 | — | TC-025 |
| SEC-020 Privacy workflows | 6 | US-017 | TC-027 |
| DATA-001–008 Integrity | 2–5 | US-103, US-106, US-110, US-112 | TC-004, TC-012, TC-014, TC-015 |
| NFR-001/002/003 UX quality | 2–6 | — | Responsive, a11y, perf suites |
| NFR-007 Concurrency | 3 | US-008 | TC-004 |
| INT-001/002 Payments adapters | Post-MVP | US-011, US-114 | TC-008 (mock now; sandbox later) |

---

## 32. PRD Readiness Checklist

**Specified in this PRD**
- [x] Business scope, roles, permissions, MoSCoW priorities
- [x] Storefront, collections, product/inventory, accounts, cart, checkout
- [x] Order state machine and transition rules with stock effects
- [x] Pakistan payment approach (COD now; JazzCash/Easypaisa architecture, verification and honesty rules)
- [x] Shipping (manual), returns/exchanges/refunds, coupons (deterministic), loyalty ledger
- [x] Admin panel operations map; analytics formulas; notifications pipeline; SEO rules
- [x] Firestore data dictionary summary, API contracts, security requirements, NFRs
- [x] User stories with G/W/T, test strategy and critical scenarios, deployment plan, phased roadmap, risks, traceability

**Consistency review performed (document-level, not a test run)**
- Order states, roles, collection names, movement types and ID schemes were cross-checked between §4, §9, §12, §22, §23, §26 and the companion documents. Where wording differs, BACKEND_SCHEMA.md (data) and TRD.md (runtime behaviour) are normative.

**Must be confirmed before implementation starts**
- [ ] Return window, loyalty economics, COD policy, free-shipping threshold, shipping fees
- [ ] Final tech decisions after AI Studio capability spike (server runtime, export, secrets)
- [ ] Firestore region; project naming; Owner accounts (≥ 2 recommended)
- [ ] Brand assets and photography rights; typography licences
- [ ] Initial catalogue data source

**Must be confirmed before live launch**
- [ ] Domain + HTTPS; email domain authentication; email provider live
- [ ] Legal review of Privacy, Terms, Returns, Shipping, Cookie policies; tax/invoicing needs
- [ ] Security review, rules tests, e2e, accessibility and performance results **actually executed and recorded**
- [ ] Backup/restore drill completed
- [ ] Payment methods remain `Not Configured` until merchant approval, sandbox and live tests pass
- [ ] Staff trained; runbooks reviewed; UAT sign-off

*End of PRD.*
