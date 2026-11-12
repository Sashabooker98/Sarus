# SARUS Premium Fabrics (سیرس)

An elegant, full-stack ecommerce website and management portal for **SARUS Premium Fabrics**, owned by **Suleman Sarwar** in Sadiqabad, Punjab, Pakistan.

---

## 1. Brand Identity & Design System

- **Brand Name**: SARUS Premium Fabrics
- **Proprietor**: Suleman Sarwar
- **Core Philosophy**: Pure unstitched fabrics (not fibers)—curated Egyptian Giza cottons, crisp snow-white latha, organic Belgian flax linen, handloom winter Karandi, and celebratory festive raw silk.
- **Strict Color Palette (Light Mode)**:
  - Ivory & Warm Beige Backgrounds: `#F7F4EE`, `#FAF8F5`, `#EFE8DC`, `#ECE4D9`
  - Crisp White Cards & Surfaces: `#FFFFFF`
  - High-Contrast Heading & Body Typography: `#1A1816`
  - Muted Brown Borders & Botanical Accents: `#8A7864`, `#685F54`, `#DED6CA`
  - Zero arbitrary blues, greens, neon purples, or unrelated gradients.
- **Authentic Brand Imagery**:
  - Embedded SARUS logo (`/assets/aistudio/SARUS_Premium_Fabrics_Logo-removebg-preview_2b5db1d0.png`)
  - Minimal Urdu Botanical Label (`/assets/aistudio/Minimal_Urdu_Botanical_Label_4b635bb9.png`)
  - Dedicated fabric collection stamps and labels

---

## 2. Customer Storefront

The storefront features an intuitive, single-page flow with direct section jumps:

1. **Header**:
   - Official SARUS logo
   - Navigation links: **Home**, **Shop**, **Categories**, **About Us**, **Contact Us**
   - Live search overlay with instant keyword suggestions
   - Wishlist drawer & COD parcel tracker
   - Cart bag with live counter badge
   - Quick Admin shortcut toggle
2. **Hero Banner**:
   - Centered headline: *"Premium Fabrics. Timeless Elegance."*
   - Subtitle: *"Discover thoughtfully selected fabrics for your style, your creativity, and every occasion."*
   - Call-to-action button: *"Explore Collection"*
3. **Category Cards Section** (`#categories-section`):
   - Curated cards for Cotton, Premium Fabrics, Formal Fabrics, and Winter Weaves
   - Click-to-filter straight into catalog
4. **Featured Fabrics** (`#featured-section`):
   - Signature fabric highlights with quick view and direct add-to-cart
5. **Shop Catalog** (`#catalog-section`):
   - Filter by Collection, Season, Audience, and instant search query
   - Unstitched yardage specifications (4.0m & 4.5m)
6. **About SARUS** (`#about-section`):
   - Authentic Urdu botanical artwork
   - Brand heritage story of Suleman Sarwar in Sadiqabad
   - 100% pure fabrics guarantee & nationwide Cash on Delivery promise
7. **Footer & Contact** (`#contact-section`):
   - Support phone: `0326-3512202`
   - WhatsApp concierge: `0326-3512202`
   - Physical address: `Sadiqabad Tibbi Wighawar, Near Madni Masjid, Sadiqabad, Punjab, Pakistan`

---

## 3. Dedicated Admin Portal (`/admin`)

Access the admin dashboard at `/admin` or via the top-bar "Admin Portal" button.

- **Initial Admin Password**: `@@Usman143`
- **Security**: Server-side timing-safe password verification, HMAC-SHA256 signed session cookie (`sarus_admin_session`, `httpOnly`, `SameSite=Strict`), and brute-force rate limiting (5 attempts per IP per 15 minutes).
- **Password Updates**: The owner can securely change the password at any time via **Settings > Change Admin Password**.

### Admin Modules:
1. **Overview & KPIs** (`/admin/dashboard`):
   - Real-time commercial analytics in Asia/Karachi (PKT)
   - Total fabrics, categories, orders, net revenue, low stock alerts
2. **Fabrics & Catalog** (`/admin/products`):
   - Add new fabric listings
   - Edit pricing, sale price, yardage cut, fabric composition, and tags
   - Delete fabrics with confirmation
   - Image upload directly to disk storage
3. **Categories & Weaves** (`/admin/categories`):
   - Add new fabric categories
   - Edit category titles, descriptions, and cover images
   - Delete categories with safety check (prevents deletion if products are assigned)
4. **Orders & Fulfillment** (`/admin/orders`):
   - Filter by status (`pending_confirmation`, `confirmed`, `processing`, `packed`, `shipped`, `delivered`, `cancelled`)
   - Dispatch to couriers (Trax, Call Courier, TCS, Leopards) with tracking reference
   - Record cash collected upon delivery
5. **Store Settings** (`/admin/settings`):
   - Update phone, WhatsApp number, store address, shipping rates, and announcement banner

---

## 4. Persistent Database & File Storage

- **Database File**: `data/sarus_database.json`
  - Atomic read/write operations using temporary file swap.
  - Zero external database dependencies required.
- **Image Uploads**: `public/uploads/`
  - Statically served at `/uploads/*`
  - Persists uploaded fabric and category images to disk.

---

## 5. Running the Application

### Development Server:
```bash
npm run dev
```
The application runs on `http://localhost:3000`.

### Production Build:
```bash
npm run build
npm start
```
