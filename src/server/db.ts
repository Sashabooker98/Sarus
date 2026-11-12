/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { calculateServerShippingFee } from '../config/shipping.ts';

dotenv.config({ override: true });

export interface DBProduct {
  id: string;
  name: string;
  slug: string;
  productSku: string;
  description: string;
  price: number; // PKR
  salePrice?: number; // PKR
  category: string;
  audience: 'men' | 'women' | 'unisex';
  season: 'summer' | 'winter' | 'all_season';
  fabric: string;
  fit: string; // Yardage / standard cut (e.g. 4.5 Meters Full Suit)
  stock: number;
  isPublished: boolean;
  isFeatured: boolean;
  images: Array<{ id: string; url: string; alt: string }>;
  tags: string[];
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DBCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface DBOrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  size?: string;
  imageUrl?: string;
}

export interface DBOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    province: string;
    city: string;
    line1: string;
    instructions?: string;
  };
  items: DBOrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'cod';
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DBSettings {
  storeName: string;
  tagline: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  country: string;
  currency: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  aboutHeading: string;
  aboutText: string;
  instagramUrl: string;
  facebookUrl: string;
}

export interface DBData {
  products: DBProduct[];
  categories: DBCategory[];
  orders: DBOrder[];
  settings: DBSettings;
  admin: {
    passwordHash: string;
    salt: string;
    passwordChanged: boolean;
  };
}

const DB_FILE = path.resolve(process.cwd(), 'data', 'sarus_database.json');

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

// Initial Seed Data
const INITIAL_SETTINGS: DBSettings = {
  storeName: 'SARUS Premium Fabrics',
  tagline: 'Premium Fabrics. Timeless Elegance.',
  ownerName: 'Suleman Sarwar',
  phone: '0326-3512202',
  whatsapp: '0326-3512202',
  email: 'sulemansarwar.sarus@gmail.com',
  address: 'Sadiqabad Tibbi Wighawar, Near Madni Masjid, Sadiqabad, Punjab, Pakistan',
  city: 'Sadiqabad',
  country: 'Pakistan',
  currency: 'PKR',
  freeShippingThreshold: 5000,
  standardShippingFee: 250,
  aboutHeading: 'Thoughtfully Selected. Beautifully Presented.',
  aboutText:
    'Founded by Suleman Sarwar in Sadiqabad, Punjab, SARUS Premium Fabrics celebrates the timeless heritage of South Asian dressing. Each length of fabric is thoughtfully inspected and curated—from extra-long staple Egyptian Giza cottons and crisp snow-white latha to authentic handloom winter karandi and festive pure mulberry silks. Delivered with care to doorsteps across Pakistan.',
  instagramUrl: 'https://instagram.com/sarusfabrics',
  facebookUrl: 'https://facebook.com/sarusfabrics',
};

const INITIAL_CATEGORIES: DBCategory[] = [
  {
    id: 'cat-cotton',
    name: 'Cotton',
    slug: 'cotton',
    description: 'Pure long-staple combed cottons, royal Egyptian Giza weaves, and pristine crisp traditional latha.',
    imageUrl: '/assets/aistudio/SARUS_Premium_Fabrics_Logo-removebg-preview_2b5db1d0.png',
    isVisible: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-premium',
    name: 'Premium Fabrics',
    slug: 'premium-fabrics',
    description: 'Certified organic Belgian flax linens, fine twills, and refined luxury textiles for understated elegance.',
    imageUrl: '/assets/aistudio/Minimalist_Sarus_Premium_Fabrics_Label_9e7661c8.png',
    isVisible: true,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-formal',
    name: 'Formal Fabrics',
    slug: 'formal-fabrics',
    description: 'Opulent pure mulberry raw silks, Swiss-embroidered lawn sets, and celebratory festive ensembles.',
    imageUrl: '/assets/aistudio/SARUS_Premium_Fabric_Label_7e6c150f.png',
    isVisible: true,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-winter',
    name: 'Winter Weaves',
    slug: 'winter-weaves',
    description: 'Authentic textured handloom Karandi, superfine merino pashmina wool, and rustic hand-spun khaddar.',
    imageUrl: '/assets/aistudio/Minimal_Urdu_Botanical_Label_4b635bb9.png',
    isVisible: true,
    sortOrder: 4,
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_PRODUCTS: DBProduct[] = [
  {
    id: 'prod-giza-cotton',
    name: 'Royal Egyptian Giza Cotton (4.5m Unstitched Suit)',
    slug: 'royal-egyptian-giza-cotton',
    productSku: 'SR-GIZA-01',
    description:
      'Woven from extra-long staple Egyptian Giza cotton yarns for exceptional softness, subtle natural luster, and superior breathability in all seasons. Cut generously for a full men’s or women’s shalwar kameez.',
    price: 4950,
    salePrice: 4450,
    category: 'Cotton',
    audience: 'unisex',
    season: 'all_season',
    fabric: '100% Combed Egyptian Giza Cotton (120/2 yarn count)',
    fit: 'Generous 4.5m Unstitched Suit Length (54" Arz)',
    stock: 45,
    isPublished: true,
    isFeatured: true,
    images: [
      {
        id: 'img-giza-1',
        url: '/assets/aistudio/Minimalist_Sarus_Premium_Fabrics_Label_9e7661c8.png',
        alt: 'Royal Egyptian Giza Cotton Unstitched Suit',
      },
    ],
    tags: ['cotton', 'giza', 'unstitched suit', 'all season'],
    keywords: ['cotton', 'giza', 'egyptian cotton', 'white', 'shalwar kameez', 'unstitched suit'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-royal-latha',
    name: "Royal Crisp Latha Cotton (Men's Traditional 4.5m)",
    slug: 'royal-crisp-latha-cotton',
    productSku: 'SR-LTH-07',
    description:
      'The definitive Pakistani white suit fabric. Crisp, stiff yet breathable combed cotton latha with a pristine snow finish. Tailors cleanly into sharp shalwar kameez collars and cuffs.',
    price: 4200,
    salePrice: undefined,
    category: 'Cotton',
    audience: 'men',
    season: 'all_season',
    fabric: '100% Combed Compact White Cotton Latha',
    fit: '4.5 Meters Single-Width (36" Arz Traditional Cut)',
    stock: 50,
    isPublished: true,
    isFeatured: true,
    images: [
      {
        id: 'img-lth-1',
        url: '/assets/aistudio/SARUS_Premium_Fabric_Label_7e6c150f.png',
        alt: 'Royal Crisp Latha Cotton',
      },
    ],
    tags: ['latha', 'men', 'cotton', 'traditional', 'crisp'],
    keywords: ['latha', 'crisp latha', 'white latha', 'pure cotton', 'men shalwar kameez', 'snow white'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-festive-silk',
    name: 'Embroidered Festive Raw Silk Suit Length',
    slug: 'festive-raw-silk-suit-length',
    productSku: 'SR-SLK-04',
    description:
      'Opulent raw silk unstitched fabric featuring a rich woven texture and subtle aristocratic sheen. Designed for celebratory weddings, festive Eid celebrations, and formal gatherings.',
    price: 9800,
    salePrice: 8950,
    category: 'Formal Fabrics',
    audience: 'women',
    season: 'all_season',
    fabric: '100% Pure Mulberry Raw Silk',
    fit: '4.0 Meters (50" Arz)',
    stock: 18,
    isPublished: true,
    isFeatured: true,
    images: [
      {
        id: 'img-slk-1',
        url: '/assets/aistudio/Minimal_Urdu_Botanical_Label_4b635bb9.png',
        alt: 'Festive Raw Silk Suit Length',
      },
    ],
    tags: ['raw silk', 'festive', 'luxury', 'formal', 'women'],
    keywords: ['silk', 'raw silk', 'festive', 'wedding', 'formal', 'emerald', 'party wear'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-winter-karandi',
    name: 'Heritage Handloom Winter Karandi (4.0m Suit)',
    slug: 'heritage-handloom-winter-karandi',
    productSku: 'SR-KAR-02',
    description:
      'Authentic textured winter Karandi woven on heritage handlooms. Features distinctive spun slub textures with natural thermal insulation for cold winter evenings across Pakistan.',
    price: 6850,
    salePrice: undefined,
    category: 'Winter Weaves',
    audience: 'men',
    season: 'winter',
    fabric: 'Pure Spun Karandi Cotton & Wool Slub Blend',
    fit: '4.0 Meters Double-Width (54" Arz)',
    stock: 28,
    isPublished: true,
    isFeatured: true,
    images: [
      {
        id: 'img-kar-1',
        url: '/assets/aistudio/SARUS_Premium_Fabric_Label_7e6c150f.png',
        alt: 'Heritage Winter Karandi Unstitched Suit',
      },
    ],
    tags: ['karandi', 'winter', 'handloom', 'unstitched suit', 'men'],
    keywords: ['karandi', 'winter', 'handloom', 'slub', 'warm', 'camel', 'tan', 'pakistani'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-belgian-linen',
    name: 'Organic Belgian Flax Linen Ensemble',
    slug: 'organic-belgian-flax-linen',
    productSku: 'SR-LIN-03',
    description:
      'Luxurious pure Belgian flax linen known for its effortless relaxed drape, exceptional air permeability, and natural cooling properties. Ideal for sophisticated summer ensembles.',
    price: 5750,
    salePrice: 5200,
    category: 'Premium Fabrics',
    audience: 'unisex',
    season: 'summer',
    fabric: '100% Certified Organic Belgian Flax Linen',
    fit: '4.0 Meters Double-Width (54" Arz)',
    stock: 35,
    isPublished: true,
    isFeatured: false,
    images: [
      {
        id: 'img-lin-1',
        url: '/assets/aistudio/Minimalist_Sarus_Premium_Fabrics_Label_9e7661c8.png',
        alt: 'Organic Belgian Flax Linen Ensemble',
      },
    ],
    tags: ['flax linen', 'organic', 'summer', 'luxury'],
    keywords: ['linen', 'belgian linen', 'flax', 'organic', 'summer', 'breathable', 'sand'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-merino-wool',
    name: 'Superfine Merino Pashmina Wool Blend',
    slug: 'superfine-merino-pashmina-wool-blend',
    productSku: 'SR-WOL-05',
    description:
      'Impeccably woven winter fabric combining superfine Australian merino wool with delicate cashmere yarns. Offers supreme warmth with weightless, fluid drape.',
    price: 8500,
    salePrice: undefined,
    category: 'Winter Weaves',
    audience: 'men',
    season: 'winter',
    fabric: '85% Superfine Merino Wool, 15% Cashmere',
    fit: '4.0 Meters Double-Width (56" Arz)',
    stock: 22,
    isPublished: true,
    isFeatured: false,
    images: [
      {
        id: 'img-wol-1',
        url: '/assets/aistudio/Minimal_Urdu_Botanical_Label_4b635bb9.png',
        alt: 'Superfine Merino Pashmina Wool Blend',
      },
    ],
    tags: ['merino wool', 'winter', 'pashmina', 'bespoke', 'men'],
    keywords: ['wool', 'merino', 'pashmina', 'cashmere', 'charcoal', 'winter', 'warm'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-summer-lawn',
    name: 'Artisanal Printed & Embroidered Summer Lawn',
    slug: 'artisanal-printed-embroidered-summer-lawn',
    productSku: 'SR-LWN-06',
    description:
      'Ultra-fine combed lawn with delicate Swiss-embroidered neck patch and matching chiffon dupatta. Crafted for effortless elegance in the Pakistani heat.',
    price: 5450,
    salePrice: undefined,
    category: 'Formal Fabrics',
    audience: 'women',
    season: 'summer',
    fabric: '100% Combed Swiss Lawn (80s Yarn) with Pure Silk Chiffon Dupatta',
    fit: '3-Piece Complete Unstitched (Shirt 3m, Trouser 2.5m, Dupatta 2.5m)',
    stock: 40,
    isPublished: true,
    isFeatured: false,
    images: [
      {
        id: 'img-lwn-1',
        url: '/assets/aistudio/Minimalist_Sarus_Premium_Fabrics_Label_9e7661c8.png',
        alt: 'Artisanal Printed & Embroidered Summer Lawn',
      },
    ],
    tags: ['lawn', 'summer', 'embroidered', '3-piece', 'women'],
    keywords: ['lawn', 'summer lawn', '3 piece', 'chiffon dupatta', 'embroidered', 'swiss lawn'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-artisanal-khaddar',
    name: 'Artisanal Spun Khaddar (Warm Rustic 4.0m Length)',
    slug: 'artisanal-spun-khaddar',
    productSku: 'SR-KHD-08',
    description:
      'Hand-spun natural khaddar woven in the heart of Punjab. Rich tactile grain with cozy warmth, offering authentic Pakistani heritage in every stitch.',
    price: 4800,
    salePrice: undefined,
    category: 'Winter Weaves',
    audience: 'men',
    season: 'winter',
    fabric: '100% Hand-Spun Textured Cotton Khaddar',
    fit: '4.0 Meters Double-Width (54" Arz)',
    stock: 32,
    isPublished: true,
    isFeatured: false,
    images: [
      {
        id: 'img-khd-1',
        url: '/assets/aistudio/SARUS_Premium_Fabric_Label_7e6c150f.png',
        alt: 'Artisanal Spun Khaddar Length',
      },
    ],
    tags: ['khaddar', 'hand-spun', 'winter', 'heritage', 'men'],
    keywords: ['khaddar', 'kamalia khaddar', 'hand spun', 'winter', 'rustic', 'earthy'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

class DatabaseService {
  private data: DBData;

  constructor() {
    this.data = this.loadData();
    this.syncAdminPasswordFromEnv();
  }

  private loadData(): DBData {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('[DB] Failed to read database file, initializing fresh:', e);
    }

    const initialData: DBData = {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      orders: [],
      settings: INITIAL_SETTINGS,
      admin: {
        passwordHash: '',
        salt: '',
        passwordChanged: false,
      },
    };

    this.persist(initialData);
    return initialData;
  }

  private syncAdminPasswordFromEnv(): void {
    if (this.data.admin && this.data.admin.passwordChanged) {
      // Owner has changed the password via admin panel. Database hash is authoritative.
      return;
    }

    const envPassword = process.env.ADMIN_PASSWORD;
    if (!envPassword || envPassword.length < 10) {
      console.warn(
        '[SECURITY WARNING] ADMIN_PASSWORD environment variable is missing or shorter than 10 characters. Admin logins will be refused.'
      );
      this.data.admin = {
        passwordHash: '',
        salt: '',
        passwordChanged: false,
      };
      this.persist();
      return;
    }

    // Hash the env ADMIN_PASSWORD with a fresh random salt and store it
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(envPassword, salt);
    this.data.admin = {
      passwordHash,
      salt,
      passwordChanged: false,
    };
    this.persist();
  }

  private persist(dataToSave?: DBData): void {
    const toWrite = dataToSave || this.data;
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempFile = `${DB_FILE}.${Date.now()}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(toWrite, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  }

  // Admin Auth Methods
  public verifyAdminPassword(password: string): boolean {
    if (!password || typeof password !== 'string') {
      return false;
    }
    if (!this.data.admin || !this.data.admin.passwordHash || !this.data.admin.salt) {
      return false;
    }
    // If password was never changed in DB, ADMIN_PASSWORD env must be present and >= 10 chars
    if (!this.data.admin.passwordChanged) {
      const envPassword = process.env.ADMIN_PASSWORD;
      if (!envPassword || envPassword.length < 10) {
        return false;
      }
    }
    const calculatedHash = hashPassword(password, this.data.admin.salt);
    const bufCalc = Buffer.from(calculatedHash, 'hex');
    const bufSaved = Buffer.from(this.data.admin.passwordHash, 'hex');
    if (bufCalc.length !== bufSaved.length) {
      return false;
    }
    return crypto.timingSafeEqual(bufCalc, bufSaved);
  }

  public changeAdminPassword(newPassword: string): void {
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(newPassword, salt);
    this.data.admin = {
      passwordHash,
      salt,
      passwordChanged: true,
    };
    this.persist();
  }

  public getAdminStatus(): { passwordChanged: boolean } {
    return { passwordChanged: this.data.admin ? this.data.admin.passwordChanged : false };
  }

  // Product Methods
  public getProducts(options?: { category?: string; isPublished?: boolean; isFeatured?: boolean; search?: string }): DBProduct[] {
    let list = [...this.data.products];

    if (options?.isPublished !== undefined) {
      list = list.filter((p) => p.isPublished === options.isPublished);
    }

    if (options?.isFeatured !== undefined) {
      list = list.filter((p) => p.isFeatured === options.isFeatured);
    }

    if (options?.category && options.category !== 'all' && options.category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === options.category!.toLowerCase());
    }

    if (options?.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      const qWords = q.split(/\s+/).filter(Boolean);
      list = list.filter((p) => {
        const textBlob = `${p.name} ${p.category} ${p.description} ${p.fabric} ${p.fit} ${(p.tags || []).join(' ')} ${(p.keywords || []).join(' ')}`.toLowerCase();
        return qWords.every((w) => textBlob.includes(w));
      });
    }

    return list;
  }

  public getProductById(id: string): DBProduct | null {
    return this.data.products.find((p) => p.id === id) || null;
  }

  public createProduct(data: Omit<DBProduct, 'id' | 'createdAt' | 'updatedAt'>): DBProduct {
    const id = `prod-${Date.now()}`;
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const productSku = data.productSku || `SR-${slug.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const newProduct: DBProduct = {
      ...data,
      id,
      slug,
      productSku,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.products.unshift(newProduct);
    this.persist();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<DBProduct>): DBProduct | null {
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = this.data.products[index];
    const updated: DBProduct = {
      ...existing,
      ...updates,
      id: existing.id,
      updatedAt: new Date().toISOString(),
    };

    this.data.products[index] = updated;
    this.persist();
    return updated;
  }

  public deleteProduct(id: string): boolean {
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.data.products.splice(index, 1);
    this.persist();
    return true;
  }

  // Category Methods
  public getCategories(): DBCategory[] {
    return [...this.data.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public createCategory(data: { name: string; description: string; imageUrl?: string }): DBCategory {
    const id = `cat-${Date.now()}`;
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCategory: DBCategory = {
      id,
      name: data.name.trim(),
      slug,
      description: data.description.trim(),
      imageUrl: data.imageUrl || '/assets/aistudio/SARUS_Premium_Fabrics_Logo-removebg-preview_2b5db1d0.png',
      isVisible: true,
      sortOrder: this.data.categories.length + 1,
      createdAt: new Date().toISOString(),
    };

    this.data.categories.push(newCategory);
    this.persist();
    return newCategory;
  }

  public updateCategory(id: string, updates: Partial<DBCategory>): DBCategory | null {
    const index = this.data.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const existing = this.data.categories[index];
    const updated: DBCategory = {
      ...existing,
      ...updates,
      id: existing.id,
    };

    this.data.categories[index] = updated;
    this.persist();
    return updated;
  }

  public deleteCategory(id: string): { success: boolean; productsCount?: number } {
    const cat = this.data.categories.find((c) => c.id === id);
    if (!cat) return { success: false };

    // Check if any product belongs to this category
    const count = this.data.products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;
    if (count > 0) {
      return { success: false, productsCount: count };
    }

    this.data.categories = this.data.categories.filter((c) => c.id !== id);
    this.persist();
    return { success: true };
  }

  // Order Methods
  public getOrders(): DBOrder[] {
    return [...this.data.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(id: string): DBOrder | null {
    return this.data.orders.find((o) => o.id === id || o.orderNumber === id) || null;
  }

  public createOrder(payload: any): { success: boolean; order?: DBOrder; error?: string } {
    if (!payload || typeof payload !== 'object') {
      return { success: false, error: 'Invalid order request payload.' };
    }

    const customerName = typeof payload.customerName === 'string' ? payload.customerName.trim() : '';
    if (customerName.length < 2 || customerName.length > 80) {
      return { success: false, error: 'Customer name must be between 2 and 80 characters.' };
    }

    const customerPhone = typeof payload.customerPhone === 'string' ? payload.customerPhone.trim() : '';
    const pakistaniPhoneRegex = /^(?:03\d{9}|\+923\d{9})$/;
    if (!pakistaniPhoneRegex.test(customerPhone)) {
      return { success: false, error: 'Customer phone must be a valid Pakistani mobile number (03XXXXXXXXX or +923XXXXXXXXX).' };
    }

    const customerEmail = typeof payload.customerEmail === 'string' ? payload.customerEmail.trim() : undefined;
    if (customerEmail && customerEmail.length > 100) {
      return { success: false, error: 'Customer email is too long (maximum 100 characters).' };
    }

    const addr = payload.shippingAddress;
    if (!addr || typeof addr !== 'object') {
      return { success: false, error: 'Shipping address is required.' };
    }

    const addrFullName = typeof addr.fullName === 'string' ? addr.fullName.trim() : customerName;
    if (addrFullName.length < 2 || addrFullName.length > 80) {
      return { success: false, error: 'Delivery recipient name must be between 2 and 80 characters.' };
    }

    const addrPhone = typeof addr.phone === 'string' ? addr.phone.trim() : customerPhone;
    if (!pakistaniPhoneRegex.test(addrPhone)) {
      return { success: false, error: 'Delivery recipient phone must be a valid Pakistani mobile number.' };
    }

    const province = typeof addr.province === 'string' ? addr.province.trim() : 'Punjab';
    if (province.length > 50) {
      return { success: false, error: 'Province name is too long (maximum 50 characters).' };
    }

    const city = typeof addr.city === 'string' ? addr.city.trim() : '';
    if (city.length < 1 || city.length > 60) {
      return { success: false, error: 'City is required (maximum 60 characters).' };
    }

    const line1 = typeof addr.line1 === 'string' ? addr.line1.trim() : '';
    if (line1.length < 5 || line1.length > 200) {
      return { success: false, error: 'Delivery address line must be between 5 and 200 characters.' };
    }

    const instructions = typeof addr.instructions === 'string' ? addr.instructions.trim() : undefined;
    if (instructions && instructions.length > 300) {
      return { success: false, error: 'Delivery instructions are too long (maximum 300 characters).' };
    }

    const notes = typeof payload.notes === 'string' ? payload.notes.trim() : undefined;
    if (notes && notes.length > 500) {
      return { success: false, error: 'Order notes are too long (maximum 500 characters).' };
    }

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      return { success: false, error: 'Your cart is empty. Please add items before placing an order.' };
    }

    if (payload.items.length > 20) {
      return { success: false, error: 'Order cannot exceed 20 unique line items.' };
    }

    // Step 1: Validate ALL items and check stock for ALL of them BEFORE deducting any stock
    interface ValidatedItem {
      product: DBProduct;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      size: string;
      imageUrl: string;
    }

    const validatedItems: ValidatedItem[] = [];
    let subtotal = 0;

    for (let i = 0; i < payload.items.length; i++) {
      const item = payload.items[i];
      if (!item || typeof item !== 'object') {
        return { success: false, error: `Invalid item structure at item ${i + 1}.` };
      }

      if (typeof item.productId !== 'string' || !item.productId.trim()) {
        return { success: false, error: `Product ID must be a non-empty string at item ${i + 1}.` };
      }

      const quantity = item.quantity;
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        return {
          success: false,
          error: `Item quantity must be a whole integer between 1 and 20 (received: ${quantity}) at item ${i + 1}.`,
        };
      }

      const size = typeof item.size === 'string' ? item.size.trim() : '';
      if (size.length > 50) {
        return { success: false, error: `Item size description cannot exceed 50 characters at item ${i + 1}.` };
      }

      const product = this.getProductById(item.productId.trim());
      if (!product) {
        return { success: false, error: `Product not found: "${item.productId}" at item ${i + 1}.` };
      }

      if (product.stock < quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${product.name}". Requested ${quantity}, but only ${product.stock} available.`,
        };
      }

      const unitPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
      const totalPrice = unitPrice * quantity;
      subtotal += totalPrice;

      validatedItems.push({
        product,
        quantity,
        unitPrice,
        totalPrice,
        size: size || product.fit,
        imageUrl: product.images[0]?.url || '',
      });
    }

    // Step 2: All items are strictly valid and stock is verified; now atomically deduct stock
    const orderItems: DBOrderItem[] = [];
    for (const v of validatedItems) {
      v.product.stock -= v.quantity;
      orderItems.push({
        productId: v.product.id,
        name: v.product.name,
        quantity: v.quantity,
        unitPrice: v.unitPrice,
        totalPrice: v.totalPrice,
        size: v.size,
        imageUrl: v.imageUrl,
      });
    }

    // Step 3: Shared city-based shipping calculation (server remains source of truth)
    const shippingFee = calculateServerShippingFee(city, subtotal);
    const totalAmount = subtotal + shippingFee;

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    const orderNumber = `SR-${dateStr}-${randStr}`;

    const newOrder: DBOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress: {
        fullName: addrFullName,
        phone: addrPhone,
        province,
        city,
        line1,
        instructions,
      },
      items: orderItems,
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod: 'cod',
      status: 'pending',
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.orders.unshift(newOrder);
    this.persist();
    return { success: true, order: newOrder };
  }

  public updateOrderStatus(id: string, status: DBOrder['status']): DBOrder | null {
    const order = this.data.orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.persist();
    return order;
  }

  // Settings Methods
  public getSettings(): DBSettings {
    return { ...this.data.settings };
  }

  public updateSettings(updates: Partial<DBSettings>): DBSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
    };
    this.persist();
    return this.data.settings;
  }

  // Dashboard Stats
  public getDashboardStats() {
    const totalProducts = this.data.products.length;
    const totalCategories = this.data.categories.length;
    const totalOrders = this.data.orders.length;
    const pendingOrders = this.data.orders.filter((o) => o.status === 'pending').length;
    const lowStockProducts = this.data.products.filter((p) => p.stock <= 5).length;
    const totalRevenue = this.data.orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      totalProducts,
      totalCategories,
      totalOrders,
      pendingOrders,
      lowStockProducts,
      totalRevenue,
    };
  }
}

export const db = new DatabaseService();
