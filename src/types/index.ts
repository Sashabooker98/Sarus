/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'owner' | 'admin' | 'product_manager' | 'order_manager' | 'content_editor' | 'support' | 'analyst';

export type Audience = 'men' | 'women' | 'kids' | 'unisex';

export type Season = 'summer' | 'winter' | 'all_season';

export type ProductStatus = 'draft' | 'active' | 'inactive' | 'archived';

export type VariantStatus = 'active' | 'inactive' | 'archived';

export type CollectionType = 'summer' | 'winter' | 'all_season' | 'campaign';

export type CollectionStatus = 'draft' | 'scheduled' | 'published' | 'expired' | 'archived';

export type OrderStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refunded';

export type PaymentMethod = 'cod' | 'jazzcash' | 'easypaisa';

export type PaymentStatus =
  | 'initiated'
  | 'pending'
  | 'verified'
  | 'failed'
  | 'expired'
  | 'cod_awaiting'
  | 'cod_collected'
  | 'void'
  | 'review_required';

export type ShipmentStatus =
  | 'created'
  | 'dispatched'
  | 'in_transit'
  | 'delivered'
  | 'failed_delivery'
  | 'returned_to_sender';

export type ReturnStatus =
  | 'requested'
  | 'approved'
  | 'rejected'
  | 'in_transit'
  | 'received'
  | 'inspected'
  | 'resolved'
  | 'cancelled';

export type ReturnResolution = 'refund' | 'exchange' | 'store_credit' | 'rejected';

export type InspectionOutcome = 'resellable' | 'damaged' | 'not_received';

export type RefundStatus = 'pending' | 'approved' | 'processing' | 'completed' | 'failed' | 'rejected';

export type MovementType =
  | 'restock'
  | 'correction'
  | 'reservation'
  | 'reservation_release'
  | 'fulfilment'
  | 'return_restock'
  | 'cancellation_release'
  | 'import_adjustment'
  | 'damage_writeoff';

export type CouponType = 'percentage' | 'fixed_amount' | 'free_shipping';

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: {
    name: string;
    hex: string;
  };
  status: VariantStatus;
  priceOverride?: number;
  costOverride?: number;
  stockOnHand: number;
  stockReserved: number;
  lowStockThreshold: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  colorValue?: string;
  sortRank: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  productSku: string;
  description: string;
  audience: Audience;
  season: Season;
  category: string;
  collectionIds: string[];
  tags: string[];
  keywords?: string[];
  fabric: string;
  fit: string;
  careInstructions: string[];
  images: ProductImage[];
  price: number; // PKR integer
  salePrice?: number; // PKR integer
  saleStartAt?: string;
  saleEndAt?: string;
  costPrice: number; // PKR integer, private
  status: ProductStatus;
  isFeatured?: boolean;
  isPublished?: boolean;
  stock?: number;
  variants: ProductVariant[];
  ratingSummary?: {
    count: number;
    average: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  isVisible: boolean;
  sortOrder: number;
  createdAt?: string;
}

export interface CartLine {
  variantId: string;
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface OrderItemSnapshot {
  id: string;
  productId: string;
  variantId: string;
  productSku: string;
  variantSku: string;
  name: string;
  size: string;
  color: string;
  imageUrl: string;
  unitPrice: number;
  effectiveUnitPrice: number;
  quantity: number;
  lineTotal: number;
  costPriceSnapshot: number;
}

export interface OrderEvent {
  id: string;
  type: string;
  fromStatus?: OrderStatus;
  toStatus?: OrderStatus;
  actor: {
    type: 'customer' | 'staff' | 'system';
    name?: string;
    role?: Role;
  };
  note?: string;
  customerVisible: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  version: number;
  userId?: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  shippingAddress: {
    fullName: string;
    phone: string;
    province: string;
    city: string;
    line1: string;
    line2?: string;
    postalCode?: string;
    instructions?: string;
  };
  items: OrderItemSnapshot[];
  totals: {
    merchandiseGross: number;
    promotionDiscount: number;
    couponDiscount: number;
    loyaltyRedeem: number;
    merchandiseNet: number;
    shipping: number;
    codFee: number;
    total: number;
  };
  currency: 'PKR';
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  couponCode?: string;
  loyaltyPointsRedeemed?: number;
  loyaltyPointsEarnPlanned: number;
  events: OrderEvent[];
  courierName?: string;
  trackingRef?: string;
  cancelReason?: string;
  placedAt: string;
  createdAt?: string;
  totalAmount?: number;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

export interface InventoryMovement {
  id: string;
  variantId: string;
  productId: string;
  sku: string;
  type: MovementType;
  deltaOnHand: number;
  deltaReserved: number;
  before: { onHand: number; reserved: number };
  after: { onHand: number; reserved: number };
  reason: string;
  actor: { type: string; name?: string };
  orderId?: string;
  returnId?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  type: CouponType;
  value: number; // percentage (1-100) or fixed amount in PKR
  maxDiscount?: number;
  minSubtotal?: number;
  startAt: string;
  endAt: string;
  usageLimitTotal?: number;
  usageCount: number;
  status: 'active' | 'paused' | 'expired';
}

export interface LoyaltyAccount {
  userId: string;
  balanceAvailable: number;
  balancePending: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
}

export interface LoyaltyLedgerEntry {
  id: string;
  userId: string;
  type: 'earn_pending' | 'earn_available' | 'redeem' | 'redeem_reversal' | 'earn_reversal' | 'expire' | 'manual_adjust';
  points: number;
  balanceAfter: number;
  orderId?: string;
  reason?: string;
  createdAt: string;
}

export interface ReturnItem {
  orderItemId: string;
  variantId: string;
  quantity: number;
  reason: string;
  comment?: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  items: ReturnItem[];
  status: ReturnStatus;
  resolutionType: ReturnResolution;
  requestedAt: string;
  resolvedAt?: string;
  decisionReason?: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  cities: string[];
  fee: number;
  freeThreshold: number;
  etaMinDays: number;
  etaMaxDays: number;
}

export interface StoreSettings {
  storeName: string;
  ownerName?: string;
  orderPrefix: string;
  freeShippingThreshold: number;
  defaultShippingFee: number;
  currency: 'PKR';
  timezone: 'Asia/Karachi';
  returnWindowDays: number;
  loyaltyEarnPer100Pkr: number;
  loyaltyPointValuePkr: number;
  loyaltyMinRedeem: number;
  loyaltyMaxRedeemPercent: number;
  payments: {
    cod: { enabled: boolean; status: 'live' };
    jazzcash: { enabled: boolean; status: 'not_configured' };
    easypaisa: { enabled: boolean; status: 'not_configured' };
  };
  bannerEnabled?: boolean;
  bannerText?: string;
  bannerSubtext?: string;
  brandInfo?: string;
  phone?: string;
  whatsappNumber?: string;
  emailAddress?: string;
  storeAddress?: string;
  operatingHours?: string;
  aboutHeading?: string;
  aboutText?: string;
}

export interface AuditLog {
  id: string;
  actor: {
    name: string;
    role: Role;
  };
  action: string;
  entityType: string;
  entityId: string;
  diff?: string;
  createdAt: string;
}

export interface CustomerNote {
  id: string;
  author: string;
  role: Role;
  content: string;
  createdAt: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  province: string;
  totalOrders: number;
  totalSpentPkr: number;
  loyaltyPoints: number;
  isPhoneVerified: boolean;
  supportNotes: CustomerNote[];
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  city: string;
  rating: number; // 1-5
  fitExperience: 'true_to_size' | 'boxy_oversized' | 'runs_small';
  fabricQuality: number; // 1-5
  comment: string;
  verifiedBuyer: boolean;
  createdAt: string;
}

