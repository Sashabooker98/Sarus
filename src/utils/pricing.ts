/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Coupon } from '../types/index.ts';

export interface PricingItemInput {
  unitPrice: number;
  salePrice?: number;
  quantity: number;
}

export interface PricingCalculationOptions {
  items: PricingItemInput[];
  coupon?: Coupon | null;
  shippingFee: number;
  freeShippingThreshold: number;
  loyaltyPointsToRedeem?: number;
  loyaltyPointValuePkr?: number;
  loyaltyMaxRedeemPercent?: number;
}

export interface PricingResult {
  merchandiseGross: number;
  promotionDiscount: number;
  couponDiscount: number;
  merchandiseNet: number;
  shipping: number;
  codFee: number;
  loyaltyRedeem: number;
  total: number;
  loyaltyPointsEarned: number;
}

/**
 * Calculates order totals strictly following integer PKR rules and deterministic order of operations:
 * 1. Line effective price = salePrice ?? unitPrice
 * 2. Merchandise Gross = sum(unitPrice * qty)
 * 3. Promotion Discount = sum((unitPrice - effectivePrice) * qty)
 * 4. Apply coupon discount to subtotal
 * 5. Determine shipping fee (0 if free shipping coupon or merchandiseNet >= threshold)
 * 6. Apply loyalty points redemption (capped to max percent of merchandiseNet)
 * 7. Total = merchandiseNet + shipping + codFee - loyaltyRedeem (minimum 0)
 */
export function calculateOrderPricing(options: PricingCalculationOptions): PricingResult {
  const {
    items,
    coupon,
    shippingFee,
    freeShippingThreshold,
    loyaltyPointsToRedeem = 0,
    loyaltyPointValuePkr = 1,
    loyaltyMaxRedeemPercent = 20,
  } = options;

  let merchandiseGross = 0;
  let promotionDiscount = 0;
  let subtotalAfterPromo = 0;

  for (const item of items) {
    const qty = Math.max(1, Math.floor(item.quantity));
    const unitPrice = Math.max(0, Math.floor(item.unitPrice));
    const effectiveUnitPrice =
      item.salePrice !== undefined && item.salePrice < unitPrice
        ? Math.max(0, Math.floor(item.salePrice))
        : unitPrice;

    const lineGross = unitPrice * qty;
    const lineEffective = effectiveUnitPrice * qty;

    merchandiseGross += lineGross;
    promotionDiscount += lineGross - lineEffective;
    subtotalAfterPromo += lineEffective;
  }

  // Calculate coupon discount
  let couponDiscount = 0;
  let isFreeShippingCoupon = false;

  if (coupon && coupon.status === 'active') {
    const minSubtotal = coupon.minSubtotal ?? 0;
    if (subtotalAfterPromo >= minSubtotal) {
      if (coupon.type === 'percentage') {
        const rawDiscount = Math.floor((subtotalAfterPromo * coupon.value) / 100);
        couponDiscount = coupon.maxDiscount
          ? Math.min(rawDiscount, coupon.maxDiscount)
          : rawDiscount;
      } else if (coupon.type === 'fixed_amount') {
        couponDiscount = Math.min(coupon.value, subtotalAfterPromo);
      } else if (coupon.type === 'free_shipping') {
        isFreeShippingCoupon = true;
      }
    }
  }

  const merchandiseNet = Math.max(0, subtotalAfterPromo - couponDiscount);

  // Determine shipping
  let shipping = shippingFee;
  if (isFreeShippingCoupon || (freeShippingThreshold > 0 && merchandiseNet >= freeShippingThreshold)) {
    shipping = 0;
  }

  // Calculate loyalty redemption
  let loyaltyRedeem = 0;
  if (loyaltyPointsToRedeem > 0) {
    const requestedPkr = loyaltyPointsToRedeem * loyaltyPointValuePkr;
    const maxAllowedPkr = Math.floor((merchandiseNet * loyaltyMaxRedeemPercent) / 100);
    loyaltyRedeem = Math.min(requestedPkr, maxAllowedPkr, merchandiseNet);
  }

  const codFee = 0; // Standard no additional COD fee
  const total = Math.max(0, merchandiseNet + shipping + codFee - loyaltyRedeem);

  // Planned loyalty earning: 1 point per 100 PKR of merchandiseNet
  const loyaltyPointsEarned = Math.floor(merchandiseNet / 100);

  return {
    merchandiseGross,
    promotionDiscount,
    couponDiscount,
    merchandiseNet,
    shipping,
    codFee,
    loyaltyRedeem,
    total,
    loyaltyPointsEarned,
  };
}
