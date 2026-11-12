/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Product,
  CartLine,
  Order,
  Coupon,
  ShippingZone,
  StoreSettings,
  Role,
  OrderStatus,
  AuditLog,
  ReturnRequest,
  LoyaltyLedgerEntry,
  OrderItemSnapshot,
  CustomerRecord,
  CustomerNote,
  ProductReview,
  CategoryItem,
} from '../types/index.ts';
import {
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_SHIPPING_ZONES,
  INITIAL_SETTINGS,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_RETURNS,
  INITIAL_CUSTOMERS,
  INITIAL_REVIEWS,
  DEFAULT_CATEGORIES,
} from '../data/mockData.ts';
import { calculateOrderPricing, PricingResult } from '../utils/pricing.ts';
import { canTransitionOrder } from '../utils/orderMachine.ts';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: Role | 'customer';
}

const STORE_USERS: Record<string, UserProfile> = {
  customer: {
    uid: 'usr-guest',
    name: 'Customer',
    email: '',
    phone: '',
    role: 'customer',
  },
  order_manager: {
    uid: 'usr-staff-mgr',
    name: 'Order Operations',
    email: 'operations@sarusclothes.pk',
    phone: '',
    role: 'order_manager',
  },
  owner: {
    uid: 'usr-admin-owner',
    name: 'SARUS Administrator',
    email: 'admin@sarusclothes.pk',
    phone: '',
    role: 'owner',
  },
};

// Safe demo record detection helpers
const DEMO_PRODUCT_IDS = new Set(['prod-001', 'prod-002', 'prod-003', 'prod-004', 'prod-005', 'prod-006']);
const DEMO_ORDER_IDS = new Set(['ord-101', 'ord-102', 'ord-103']);
const DEMO_CUSTOMER_IDS = new Set(['cust-001', 'cust-002', 'cust-003', 'cust-004']);
const DEMO_REVIEW_IDS = new Set(['rev-001', 'rev-002', 'rev-003', 'rev-004']);

function sanitizeProducts(prods: Product[]): Product[] {
  return prods.filter((p) => !DEMO_PRODUCT_IDS.has(p.id) && !p.name?.includes('Heavyweight Washed Mineral') && !p.name?.includes('Modular Tactical') && !p.name?.includes('Acid Wash Boxy') && !p.name?.includes('Down Puffer') && !p.name?.includes('Cropped Boxy') && !p.name?.includes('Minimalist Tracksuit'));
}
function sanitizeOrders(ords: Order[]): Order[] {
  return ords.filter((o) => !DEMO_ORDER_IDS.has(o.id) && !o.customer?.phone?.includes('8451299'));
}
function sanitizeCustomers(custs: CustomerRecord[]): CustomerRecord[] {
  return custs.filter((c) => !DEMO_CUSTOMER_IDS.has(c.id) && !c.phone?.includes('8451299'));
}
function sanitizeReviews(revs: ProductReview[]): ProductReview[] {
  return revs.filter((r) => !DEMO_REVIEW_IDS.has(r.id));
}

interface StoreContextType {
  // Products
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  // Categories
  categories: string[];
  addCategory: (categoryName: string) => boolean;
  deleteCategory: (categoryName: string) => boolean;
  categoryItems: CategoryItem[];
  addCategoryItem: (cat: Omit<CategoryItem, 'id'>) => Promise<boolean>;
  updateCategoryItem: (id: string, updates: Partial<CategoryItem>) => Promise<boolean>;
  deleteCategoryItem: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshData: () => Promise<void>;

  // Cart
  cartLines: CartLine[];
  addToCart: (productId: string, variantId: string, quantity?: number) => { success: boolean; message?: string };
  updateCartQuantity: (variantId: string, quantity: number) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Pricing & Coupon
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  shippingZones: ShippingZone[];
  selectedZone: ShippingZone;
  setSelectedZone: (zone: ShippingZone) => void;
  cartPricing: PricingResult;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (orderPayload: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    address: {
      fullName: string;
      phone: string;
      province: string;
      city: string;
      line1: string;
      instructions?: string;
    };
    loyaltyPointsToRedeem?: number;
  }) => { success: boolean; order?: Order; error?: string };
  transitionOrder: (
    orderId: string,
    toStatus: OrderStatus,
    reason?: string,
    extraData?: { courierName?: string; trackingRef?: string; codCollected?: number }
  ) => { success: boolean; error?: string };

  // Current persona & Auth
  currentUser: UserProfile;
  switchUserRole: (persona: 'customer' | 'order_manager' | 'owner') => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  adminLogin: (password: string) => Promise<{ success: boolean; error?: string; status?: number }>;
  adminLogout: () => Promise<void>;

  // Loyalty
  loyaltyBalance: { available: number; pending: number };
  loyaltyLedger: LoyaltyLedgerEntry[];

  // Returns
  returns: ReturnRequest[];
  submitReturn: (orderId: string, reason: string, items: { variantId: string; quantity: number }[]) => boolean;
  updateReturnStatus: (returnId: string, status: ReturnRequest['status'], note?: string) => void;

  // Customers & CRM
  customers: CustomerRecord[];
  addCustomerNote: (customerId: string, content: string) => void;

  // Reviews
  reviews: ProductReview[];
  addProductReview: (review: Omit<ProductReview, 'id' | 'createdAt' | 'verifiedBuyer'>) => void;

  // Settings & Audit
  settings: StoreSettings;
  updateSettings: (newSettings: StoreSettings) => void;
  auditLogs: AuditLog[];

  // App View & Navigation States
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (prod: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;
  isTrackingModalOpen: boolean;
  setIsTrackingModalOpen: (open: boolean) => void;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  isStylistOpen: boolean;
  setIsStylistOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  policyModal: string | null;
  setPolicyModal: (policy: string | null) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterAudience: string;
  setFilterAudience: (aud: string) => void;
  filterSeason: string;
  setFilterSeason: (season: string) => void;
  filterCategory: string;
  setFilterCategory: (cat: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // One-time safe demo data cleanup in browser localStorage
  useEffect(() => {
    try {
      const purged = localStorage.getItem('sarus_purged_demo_v6');
      if (!purged) {
        // Clean out demo records from keys
        const rawProds = localStorage.getItem('sarus_products');
        if (rawProds) {
          const parsed = JSON.parse(rawProds);
          const cleaned = sanitizeProducts(parsed);
          localStorage.setItem('sarus_products', JSON.stringify(cleaned));
        }

        const rawOrds = localStorage.getItem('sarus_orders');
        if (rawOrds) {
          const parsed = JSON.parse(rawOrds);
          const cleaned = sanitizeOrders(parsed);
          localStorage.setItem('sarus_orders', JSON.stringify(cleaned));
        }

        const rawCusts = localStorage.getItem('sarus_customers');
        if (rawCusts) {
          const parsed = JSON.parse(rawCusts);
          const cleaned = sanitizeCustomers(parsed);
          localStorage.setItem('sarus_customers', JSON.stringify(cleaned));
        }

        const rawRevs = localStorage.getItem('sarus_reviews');
        if (rawRevs) {
          const parsed = JSON.parse(rawRevs);
          const cleaned = sanitizeReviews(parsed);
          localStorage.setItem('sarus_reviews', JSON.stringify(cleaned));
        }

        // Clear demo wishlist
        const rawWish = localStorage.getItem('sarus_wishlist');
        if (rawWish) {
          const parsed: string[] = JSON.parse(rawWish);
          const cleaned = parsed.filter((id) => !DEMO_PRODUCT_IDS.has(id));
          localStorage.setItem('sarus_wishlist', JSON.stringify(cleaned));
        }

        localStorage.setItem('sarus_purged_demo_v6', 'true');
      }
    } catch {
      // Storage error gracefully handled
    }
  }, []);

  // Categories state (streamlined structured categories)
  const [categoryItems, setCategoryItems] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('sarus_category_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return [
        {
          id: 'cat-cotton',
          name: 'Cotton',
          slug: 'cotton',
          description: 'Pure long-staple combed cottons, royal Egyptian Giza weaves, and pristine crisp traditional latha.',
          imageUrl: '/assets/aistudio/SARUS_Premium_Fabrics_Logo-removebg-preview_2b5db1d0.png',
          isVisible: true,
          sortOrder: 1,
        },
        {
          id: 'cat-premium',
          name: 'Premium Fabrics',
          slug: 'premium-fabrics',
          description: 'Certified organic Belgian flax linens, fine twills, and refined luxury textiles for understated elegance.',
          imageUrl: '/assets/aistudio/Minimalist_Sarus_Premium_Fabrics_Label_9e7661c8.png',
          isVisible: true,
          sortOrder: 2,
        },
        {
          id: 'cat-formal',
          name: 'Formal Fabrics',
          slug: 'formal-fabrics',
          description: 'Embroidered festive raw silks, lustrous jacquards, and celebratory suit lengths crafted for timeless prestige.',
          imageUrl: '/assets/aistudio/SARUS_Premium_Fabric_Label_7e6c150f.png',
          isVisible: true,
          sortOrder: 3,
        },
        {
          id: 'cat-winter',
          name: 'Winter Weaves',
          slug: 'winter-weaves',
          description: 'Authentic handloom winter Karandi, artisanal heavy khaddar, and fine Australian wool blends.',
          imageUrl: '/assets/aistudio/Minimal_Urdu_Botanical_Label_4b635bb9.png',
          isVisible: true,
          sortOrder: 4,
        },
      ];
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState<string[]>(() => {
    return ['All Collections', ...categoryItems.map((c) => c.name)];
  });

  useEffect(() => {
    localStorage.setItem('sarus_category_items', JSON.stringify(categoryItems));
    setCategories(['All Collections', ...categoryItems.filter((c) => c.isVisible !== false).map((c) => c.name)]);
  }, [categoryItems]);

  const addCategory = (name: string): boolean => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) return false;
    const newItem: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: trimmed,
      slug: trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: `${trimmed} fabric collection`,
      imageUrl: '/assets/aistudio/SARUS_Premium_Fabrics_Logo-removebg-preview_2b5db1d0.png',
      isVisible: true,
      sortOrder: categoryItems.length + 1,
    };
    setCategoryItems((prev) => [...prev, newItem]);
    return true;
  };

  const deleteCategory = (name: string): boolean => {
    if (name === 'All Collections' || name === 'All Fabrics') return false;
    setCategoryItems((prev) => prev.filter((c) => c.name !== name));
    return true;
  };

  const addCategoryItem = async (cat: Omit<CategoryItem, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat),
      });
      if (res.ok) {
        const created: CategoryItem = await res.json();
        setCategoryItems((prev) => [...prev, created]);
        return true;
      }
    } catch {
      // Offline fallback
    }
    const localCreated: CategoryItem = {
      ...cat,
      id: `cat-${Date.now()}`,
      slug: cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      isVisible: cat.isVisible !== false,
      sortOrder: categoryItems.length + 1,
    };
    setCategoryItems((prev) => [...prev, localCreated]);
    return true;
  };

  const updateCategoryItem = async (id: string, updates: Partial<CategoryItem>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setCategoryItems((prev) => prev.map((c) => (c.id === id ? updated : c)));
        return true;
      }
    } catch {
      // Offline fallback
    }
    setCategoryItems((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    return true;
  };

  const deleteCategoryItem = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const target = categoryItems.find((c) => c.id === id);
    if (!target) return { success: false, error: 'Category not found' };

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to delete category' };
      }
    } catch {
      // Offline fallback
    }

    setCategoryItems((prev) => prev.filter((c) => c.id !== id));
    return { success: true };
  };

  // Products state (loads from localStorage or populates with initial dummy collection)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const v2Purged = localStorage.getItem('sarus_products_clean_v2');
      if (!v2Purged) {
        localStorage.setItem('sarus_products_clean_v2', 'true');
        localStorage.setItem('sarus_products', JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      const saved = localStorage.getItem('sarus_products');
      if (!saved) return INITIAL_PRODUCTS;
      const parsed = JSON.parse(saved);
      const cleaned = sanitizeProducts(parsed);
      return cleaned.length > 0 ? cleaned : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cartLines, setCartLines] = useState<CartLine[]>(() => {
    try {
      const saved = localStorage.getItem('sarus_cart');
      if (!saved) return [];
      const parsed: CartLine[] = JSON.parse(saved);
      return parsed.filter((l) => !DEMO_PRODUCT_IDS.has(l.productId));
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sarus_wishlist');
      if (!saved) return [];
      const parsed: string[] = JSON.parse(saved);
      return parsed.filter((id) => !DEMO_PRODUCT_IDS.has(id));
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('sarus_orders');
      if (!saved) return INITIAL_ORDERS;
      const parsed = JSON.parse(saved);
      return sanitizeOrders(parsed);
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('sarus_audit_logs');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [returns, setReturns] = useState<ReturnRequest[]>(() => {
    try {
      const saved = localStorage.getItem('sarus_returns');
      return saved ? JSON.parse(saved) : INITIAL_RETURNS;
    } catch {
      return INITIAL_RETURNS;
    }
  });

  const [customers, setCustomers] = useState<CustomerRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sarus_customers');
      if (!saved) return INITIAL_CUSTOMERS;
      const parsed = JSON.parse(saved);
      return sanitizeCustomers(parsed);
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem('sarus_reviews');
      if (!saved) return INITIAL_REVIEWS;
      const parsed = JSON.parse(saved);
      return sanitizeReviews(parsed);
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('sarus_settings');
      if (!saved) return INITIAL_SETTINGS;
      const parsed = JSON.parse(saved);
      // Clean out fake addresses/phones from old sessions and fall back to INITIAL_SETTINGS if empty
      const cleanPhone = parsed.phone?.includes('8451299') ? '' : (parsed.phone || '');
      const cleanWhatsapp = parsed.whatsappNumber?.includes('8451299') || parsed.whatsappNumber?.includes('0000000') ? '' : (parsed.whatsappNumber || '');
      const cleanAddress = parsed.storeAddress?.includes('Gulberg') ? '' : (parsed.storeAddress || '');
      return {
        ...INITIAL_SETTINGS,
        ...parsed,
        phone: cleanPhone || INITIAL_SETTINGS.phone,
        whatsappNumber: cleanWhatsapp || INITIAL_SETTINGS.whatsappNumber,
        storeAddress: cleanAddress || INITIAL_SETTINGS.storeAddress,
      };
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [coupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [shippingZones] = useState<ShippingZone[]>(INITIAL_SHIPPING_ZONES);
  const [selectedZone, setSelectedZone] = useState<ShippingZone>(INITIAL_SHIPPING_ZONES[0]);

  const [currentUser, setCurrentUser] = useState<UserProfile>(STORE_USERS.owner);

  // Authentication & Admin State (Real Server-Side Cookie Session)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true') return true;
      if (window.location.pathname.startsWith('/admin') || window.location.hash.startsWith('#admin')) return true;
      return localStorage.getItem('sarus_admin_mode') === 'true';
    }
    return false;
  });

  const refreshData = async () => {
    try {
      const [catRes, prodRes, setRes] = await Promise.allSettled([
        fetch('/api/categories'),
        fetch('/api/products'),
        fetch('/api/settings'),
      ]);

      if (catRes.status === 'fulfilled' && catRes.value.ok) {
        const catData = await catRes.value.json();
        if (Array.isArray(catData) && catData.length > 0) {
          setCategoryItems(catData);
          setCategories(['All Collections', ...catData.filter((c: CategoryItem) => c.isVisible !== false).map((c: CategoryItem) => c.name)]);
        }
      }

      if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
        const prodData = await prodRes.value.json();
        if (Array.isArray(prodData) && prodData.length > 0) {
          setProducts(prodData);
        }
      }

      if (setRes.status === 'fulfilled' && setRes.value.ok) {
        const setData = await setRes.value.json();
        if (setData && typeof setData === 'object') {
          setSettings((prev) => ({ ...prev, ...setData }));
        }
      }

      // If authenticated, also fetch authoritative orders
      const ordersRes = await fetch('/api/orders').catch(() => null);
      if (ordersRes && ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (Array.isArray(ordersData) && ordersData.length > 0) {
          setOrders(ordersData);
        }
      }
    } catch {
      // Gracefully maintain client data if network drops
    }
  };

  // Check server admin session & sync data on app load
  useEffect(() => {
    let isMounted = true;
    try {
      localStorage.removeItem('sarus_admin_auth');
    } catch {
      // Storage unavailable
    }

    const checkAdminSession = async () => {
      try {
        const res = await fetch('/api/admin/session');
        const data = await res.json();
        if (isMounted) {
          if (data.authenticated) {
            setIsAdminAuthenticated(true);
            setCurrentUser(STORE_USERS.owner);
          } else {
            setIsAdminAuthenticated(false);
            if (typeof window !== 'undefined' && (window.location.pathname.startsWith('/admin') || window.location.hash.startsWith('#admin'))) {
              setIsAdminLoginModalOpen(true);
            }
          }
        }
      } catch {
        if (isMounted) {
          setIsAdminAuthenticated(false);
        }
      }
    };

    checkAdminSession();
    refreshData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('sarus_admin_mode', String(isAdminMode));
  }, [isAdminMode]);

  const adminLogin = async (password: string): Promise<{ success: boolean; error?: string; status?: number }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setIsAdminAuthenticated(true);
        setCurrentUser(STORE_USERS.owner);
        refreshData();
        return { success: true };
      }
      return {
        success: false,
        error: res.status === 429 ? 'Too many attempts, try again later' : (data.error || 'Incorrect password'),
        status: res.status,
      };
    } catch {
      return { success: false, error: 'Connection error. Please try again.' };
    }
  };

  const adminLogout = async (): Promise<void> => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
    setIsAdminAuthenticated(false);
    setIsAdminMode(false);
    setCurrentUser(STORE_USERS.customer);
  };

  const [loyaltyBalance, setLoyaltyBalance] = useState({ available: 0, pending: 0 });
  const [loyaltyLedger, setLoyaltyLedger] = useState<LoyaltyLedgerEntry[]>([]);

  // UI modal and navigation states
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState<boolean>(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [isStylistOpen, setIsStylistOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [policyModal, setPolicyModal] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterAudience, setFilterAudience] = useState<string>('all');
  const [filterSeason, setFilterSeason] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sarus_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sarus_cart', JSON.stringify(cartLines));
  }, [cartLines]);

  useEffect(() => {
    localStorage.setItem('sarus_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('sarus_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sarus_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('sarus_returns', JSON.stringify(returns));
  }, [returns]);

  useEffect(() => {
    localStorage.setItem('sarus_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('sarus_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('sarus_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Pricing Engine calculations for active cart
  const cartPricing = useMemo(() => {
    const items = cartLines.map((line) => {
      const product = products.find((p) => p.id === line.productId);
      const variant = product?.variants?.find((v) => v.id === line.variantId);
      const unitPrice = variant?.priceOverride ?? product?.price ?? 0;
      const salePrice = product?.salePrice;
      return {
        unitPrice,
        salePrice,
        quantity: line.quantity,
      };
    });

    return calculateOrderPricing({
      items,
      coupon: appliedCoupon,
      shippingFee: selectedZone.fee,
      freeShippingThreshold: settings.freeShippingThreshold,
      loyaltyPointsToRedeem: 0,
    });
  }, [cartLines, products, appliedCoupon, selectedZone, settings.freeShippingThreshold]);

  // Product Actions
  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        actor: { name: currentUser.name, role: currentUser.role as Role },
        action: 'product.update',
        entityType: 'product',
        entityId: updated.id,
        diff: `Updated product ${updated.name}`,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const addProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        actor: { name: currentUser.name, role: currentUser.role as Role },
        action: 'product.create',
        entityType: 'product',
        entityId: newProd.id,
        diff: `Created new product ${newProd.name}`,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCartLines((prev) => prev.filter((l) => l.productId !== productId));
    setWishlist((prev) => prev.filter((id) => id !== productId));
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        actor: { name: currentUser.name, role: currentUser.role as Role },
        action: 'product.delete',
        entityType: 'product',
        entityId: productId,
        diff: `Deleted product ${productId}`,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // Cart actions
  const addToCart = (productId: string, variantId: string, quantity = 1) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return { success: false, message: 'Product not found.' };

    if (!product.price || product.price <= 0) {
      return { success: false, message: 'This item is not yet available for purchase.' };
    }

    const variant = product.variants?.find((v) => v.id === variantId);
    if (!variant) return { success: false, message: 'Variant not found.' };

    const available = variant.stockOnHand - variant.stockReserved;
    if (available <= 0) {
      return { success: false, message: 'Selected variant is currently sold out.' };
    }

    setCartLines((prev) => {
      const existing = prev.find((line) => line.variantId === variantId);
      if (existing) {
        const nextQty = Math.min(available, existing.quantity + quantity);
        return prev.map((line) =>
          line.variantId === variantId ? { ...line, quantity: nextQty } : line
        );
      }
      return [
        ...prev,
        {
          productId,
          variantId,
          quantity: Math.min(available, quantity),
          addedAt: new Date().toISOString(),
        },
      ];
    });

    setIsCartOpen(true);
    return { success: true };
  };

  const updateCartQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    let cappedQty = quantity;
    for (const prod of products) {
      const variant = prod.variants?.find((v) => v.id === variantId);
      if (variant) {
        const available = variant.stockOnHand - variant.stockReserved;
        cappedQty = Math.min(available, quantity);
        break;
      }
    }

    setCartLines((prev) =>
      prev.map((line) =>
        line.variantId === variantId ? { ...line, quantity: cappedQty } : line
      )
    );
  };

  const removeFromCart = (variantId: string) => {
    setCartLines((prev) => prev.filter((line) => line.variantId !== variantId));
  };

  const clearCart = () => {
    setCartLines([]);
    setAppliedCoupon(null);
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === normalized);
    if (!found) {
      return { success: false, message: 'Invalid promo code.' };
    }
    if (found.status !== 'active') {
      return { success: false, message: 'This promo code has expired.' };
    }

    const subtotal = cartPricing.merchandiseGross - cartPricing.promotionDiscount;
    if (found.minSubtotal && subtotal < found.minSubtotal) {
      return {
        success: false,
        message: `Minimum spend of Rs ${found.minSubtotal.toLocaleString()} required for this code.`,
      };
    }

    setAppliedCoupon(found);
    return { success: true, message: `Promo code ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Place Order
  const placeOrder = (orderPayload: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    address: {
      fullName: string;
      phone: string;
      province: string;
      city: string;
      line1: string;
      instructions?: string;
    };
    loyaltyPointsToRedeem?: number;
  }) => {
    if (cartLines.length === 0) {
      return { success: false, error: 'Your cart is empty.' };
    }

    const orderItems: OrderItemSnapshot[] = [];
    for (const line of cartLines) {
      const prod = products.find((p) => p.id === line.productId);
      const variant = prod?.variants?.find((v) => v.id === line.variantId);
      if (!prod || !variant) {
        return { success: false, error: 'An item in your cart is no longer available.' };
      }
      const available = variant.stockOnHand - variant.stockReserved;
      if (available < line.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${prod.name} (${variant.size}). Only ${available} available.`,
        };
      }

      const unitPrice = variant.priceOverride ?? prod.price;
      const effectiveUnitPrice = prod.salePrice ?? unitPrice;

      orderItems.push({
        id: `item-${Date.now()}-${variant.id}`,
        productId: prod.id,
        variantId: variant.id,
        productSku: prod.productSku,
        variantSku: variant.sku,
        name: prod.name,
        size: variant.size,
        color: variant.color.name,
        imageUrl: prod.images[0]?.url || '',
        unitPrice,
        effectiveUnitPrice,
        quantity: line.quantity,
        lineTotal: effectiveUnitPrice * line.quantity,
        costPriceSnapshot: variant.costOverride ?? prod.costPrice,
      });
    }

    const pricing = calculateOrderPricing({
      items: orderItems.map((i) => ({
        unitPrice: i.unitPrice,
        salePrice: i.effectiveUnitPrice,
        quantity: i.quantity,
      })),
      coupon: appliedCoupon,
      shippingFee: selectedZone.fee,
      freeShippingThreshold: settings.freeShippingThreshold,
      loyaltyPointsToRedeem: orderPayload.loyaltyPointsToRedeem ?? 0,
    });

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderNumber = `${settings.orderPrefix || 'SC-'}${dateStr}-${randSuffix}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      status: 'pending_confirmation',
      version: 1,
      userId: currentUser.uid,
      customer: {
        name: orderPayload.customerName,
        phone: orderPayload.customerPhone,
        email: orderPayload.customerEmail,
      },
      shippingAddress: {
        fullName: orderPayload.address.fullName,
        phone: orderPayload.address.phone,
        province: orderPayload.address.province,
        city: orderPayload.address.city,
        line1: orderPayload.address.line1,
        instructions: orderPayload.address.instructions,
      },
      items: orderItems,
      totals: pricing,
      currency: 'PKR',
      paymentMethod: 'cod',
      paymentStatus: 'cod_awaiting',
      couponCode: appliedCoupon?.code,
      loyaltyPointsRedeemed: pricing.loyaltyRedeem,
      loyaltyPointsEarnPlanned: pricing.loyaltyPointsEarned,
      events: [
        {
          id: `ev-${Date.now()}`,
          type: 'placed',
          toStatus: 'pending_confirmation',
          actor: { type: 'customer', name: orderPayload.customerName },
          note: 'Order placed via Cash on Delivery (COD). Awaiting dispatch confirmation.',
          customerVisible: true,
          createdAt: new Date().toISOString(),
        },
      ],
      placedAt: new Date().toISOString(),
    };

    setProducts((prev) =>
      prev.map((prod) => ({
        ...prod,
        variants: prod.variants.map((v) => {
          const matchingItem = orderItems.find((i) => i.variantId === v.id);
          if (matchingItem) {
            return {
              ...v,
              stockReserved: v.stockReserved + matchingItem.quantity,
            };
          }
          return v;
        }),
      }))
    );

    setOrders((prev) => [newOrder, ...prev]);

    // Persist to authoritative server database
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: orderPayload.customerName,
        customerPhone: orderPayload.customerPhone,
        customerEmail: orderPayload.customerEmail,
        shippingAddress: orderPayload.address,
        items: orderItems.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity,
          unitPrice: i.effectiveUnitPrice,
          totalPrice: i.lineTotal,
          size: i.size,
          imageUrl: i.imageUrl,
        })),
        subtotal: pricing.merchandiseGross,
        shippingFee: pricing.shipping,
        totalAmount: pricing.total,
        paymentMethod: 'cod',
      }),
    }).catch(() => {
      // Fallback already saved in state
    });

    if (pricing.loyaltyRedeem > 0) {
      setLoyaltyBalance((prev) => ({
        ...prev,
        available: Math.max(0, prev.available - pricing.loyaltyRedeem),
      }));
    }

    setCustomers((prev) => {
      const existing = prev.find((c) => c.phone === orderPayload.customerPhone);
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalOrders: c.totalOrders + 1,
                totalSpentPkr: c.totalSpentPkr + pricing.total,
              }
            : c
        );
      }
      const newCust: CustomerRecord = {
        id: `cust-${Date.now()}`,
        name: orderPayload.customerName,
        phone: orderPayload.customerPhone,
        email: orderPayload.customerEmail,
        city: orderPayload.address.city,
        province: orderPayload.address.province,
        totalOrders: 1,
        totalSpentPkr: pricing.total,
        loyaltyPoints: Math.max(0, pricing.loyaltyPointsEarned - (orderPayload.loyaltyPointsToRedeem || 0)),
        isPhoneVerified: true,
        supportNotes: [],
        createdAt: new Date().toISOString(),
      };
      return [newCust, ...prev];
    });

    clearCart();
    setLastPlacedOrder(newOrder);
    return { success: true, order: newOrder };
  };

  const transitionOrder = (
    orderId: string,
    toStatus: OrderStatus,
    reason?: string,
    extraData?: { courierName?: string; trackingRef?: string; codCollected?: number }
  ) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return { success: false, error: 'Order not found.' };

    const validation = canTransitionOrder(targetOrder.status, toStatus, currentUser.role);
    if (!validation.allowed) {
      return { success: false, error: validation.reason || 'Transition not permitted.' };
    }

    const fromStatus = targetOrder.status;

    if (toStatus === 'cancelled' && (fromStatus === 'pending_confirmation' || fromStatus === 'confirmed' || fromStatus === 'processing' || fromStatus === 'packed')) {
      setProducts((prev) =>
        prev.map((prod) => ({
          ...prod,
          variants: prod.variants.map((v) => {
            const item = targetOrder.items.find((i) => i.variantId === v.id);
            if (item) {
              return {
                ...v,
                stockReserved: Math.max(0, v.stockReserved - item.quantity),
              };
            }
            return v;
          }),
        }))
      );
    } else if (toStatus === 'shipped' && fromStatus === 'packed') {
      setProducts((prev) =>
        prev.map((prod) => ({
          ...prod,
          variants: prod.variants.map((v) => {
            const item = targetOrder.items.find((i) => i.variantId === v.id);
            if (item) {
              return {
                ...v,
                stockOnHand: Math.max(0, v.stockOnHand - item.quantity),
                stockReserved: Math.max(0, v.stockReserved - item.quantity),
              };
            }
            return v;
          }),
        }))
      );
    } else if (toStatus === 'returned') {
      setProducts((prev) =>
        prev.map((prod) => ({
          ...prod,
          variants: prod.variants.map((v) => {
            const item = targetOrder.items.find((i) => i.variantId === v.id);
            if (item) {
              return {
                ...v,
                stockOnHand: v.stockOnHand + item.quantity,
              };
            }
            return v;
          }),
        }))
      );
    }

    const nowStr = new Date().toISOString();
    const updatedOrder: Order = {
      ...targetOrder,
      status: toStatus,
      version: targetOrder.version + 1,
      courierName: extraData?.courierName ?? targetOrder.courierName,
      trackingRef: extraData?.trackingRef ?? targetOrder.trackingRef,
      cancelReason: toStatus === 'cancelled' ? reason : targetOrder.cancelReason,
      paymentStatus:
        toStatus === 'delivered' ? 'cod_collected' : targetOrder.paymentStatus,
      confirmedAt: toStatus === 'confirmed' ? nowStr : targetOrder.confirmedAt,
      shippedAt: toStatus === 'shipped' ? nowStr : targetOrder.shippedAt,
      deliveredAt: toStatus === 'delivered' ? nowStr : targetOrder.deliveredAt,
      cancelledAt: toStatus === 'cancelled' ? nowStr : targetOrder.cancelledAt,
      events: [
        ...targetOrder.events,
        {
          id: `ev-${Date.now()}`,
          type: toStatus,
          fromStatus,
          toStatus,
          actor: {
            type: currentUser.role === 'customer' ? 'customer' : 'staff',
            name: currentUser.name,
            role: currentUser.role as Role,
          },
          note: reason || `Order status updated to ${toStatus.replace(/_/g, ' ')}`,
          customerVisible: true,
          createdAt: nowStr,
        },
      ],
    };

    setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        actor: { name: currentUser.name, role: currentUser.role as Role },
        action: 'order.transition',
        entityType: 'order',
        entityId: targetOrder.orderNumber,
        diff: `Status: ${fromStatus} -> ${toStatus}. ${reason ? `Note: ${reason}` : ''}`,
        createdAt: nowStr,
      },
      ...prev,
    ]);

    return { success: true };
  };

  const switchUserRole = (persona: 'customer' | 'order_manager' | 'owner') => {
    setCurrentUser(STORE_USERS[persona]);
  };

  const submitReturn = (orderId: string, reason: string, items: { variantId: string; quantity: number }[]) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return false;

    const returnReq: ReturnRequest = {
      id: `ret-${Date.now()}`,
      orderId: targetOrder.id,
      orderNumber: targetOrder.orderNumber,
      userId: currentUser.uid,
      customerName: targetOrder.customer.name,
      customerPhone: targetOrder.customer.phone,
      items: items.map((it) => ({
        orderItemId: `item-${it.variantId}`,
        variantId: it.variantId,
        quantity: it.quantity,
        reason,
      })),
      status: 'requested',
      resolutionType: 'exchange',
      requestedAt: new Date().toISOString(),
    };

    setReturns((prev) => [returnReq, ...prev]);
    transitionOrder(orderId, 'return_requested', `Return requested: ${reason}`);
    return true;
  };

  const updateReturnStatus = (returnId: string, status: ReturnRequest['status'], note?: string) => {
    setReturns((prev) =>
      prev.map((r) =>
        r.id === returnId
          ? {
              ...r,
              status,
              resolvedAt: status === 'resolved' || status === 'rejected' ? new Date().toISOString() : r.resolvedAt,
              decisionReason: note,
            }
          : r
      )
    );
  };

  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        actor: { name: currentUser.name, role: currentUser.role as Role },
        action: 'settings.update',
        entityType: 'settings',
        entityId: 'store',
        diff: 'Updated store configuration',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const addCustomerNote = (customerId: string, content: string) => {
    const newNote: CustomerNote = {
      id: `note-${Date.now()}`,
      author: currentUser.name,
      role: currentUser.role as Role,
      content,
      createdAt: new Date().toISOString(),
    };
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId ? { ...c, supportNotes: [newNote, ...c.supportNotes] } : c
      )
    );
  };

  const addProductReview = (
    reviewData: Omit<ProductReview, 'id' | 'createdAt' | 'verifiedBuyer'>
  ) => {
    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      ...reviewData,
      verifiedBuyer: true,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newRev, ...prev]);

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === reviewData.productId) {
          const prodReviews = [...reviews.filter((r) => r.productId === p.id), newRev];
          const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
          return {
            ...p,
            ratingSummary: {
              count: prodReviews.length,
              average: parseFloat(avg.toFixed(1)),
            },
          };
        }
        return p;
      })
    );
  };

  return (
    <StoreContext.Provider
      value={{
        customers,
        addCustomerNote,
        reviews,
        addProductReview,
        products,
        setProducts,
        updateProduct,
        addProduct,
        deleteProduct,
        categories,
        addCategory,
        deleteCategory,
        categoryItems,
        addCategoryItem,
        updateCategoryItem,
        deleteCategoryItem,
        refreshData,
        cartLines,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        shippingZones,
        selectedZone,
        setSelectedZone,
        cartPricing,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        placeOrder,
        transitionOrder,
        currentUser,
        switchUserRole,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        adminLogin,
        adminLogout,
        loyaltyBalance,
        loyaltyLedger,
        returns,
        submitReturn,
        updateReturnStatus,
        settings,
        updateSettings,
        auditLogs,
        isAdminMode,
        setIsAdminMode,
        selectedProductForModal,
        setSelectedProductForModal,
        isCheckoutOpen,
        setIsCheckoutOpen,
        lastPlacedOrder,
        setLastPlacedOrder,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        isAccountModalOpen,
        setIsAccountModalOpen,
        isStylistOpen,
        setIsStylistOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        policyModal,
        setPolicyModal,
        searchQuery,
        setSearchQuery,
        filterAudience,
        setFilterAudience,
        filterSeason,
        setFilterSeason,
        filterCategory,
        setFilterCategory,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
