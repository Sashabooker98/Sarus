/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOrderPricing } from './pricing.ts';
import { Coupon } from '../types/index.ts';

test('calculates basic order without discount or coupons', () => {
  const result = calculateOrderPricing({
    items: [{ unitPrice: 3000, quantity: 2 }],
    shippingFee: 200,
    freeShippingThreshold: 5000,
  });

  assert.equal(result.merchandiseGross, 6000);
  assert.equal(result.promotionDiscount, 0);
  assert.equal(result.couponDiscount, 0);
  assert.equal(result.merchandiseNet, 6000);
  assert.equal(result.shipping, 0); // Above 5000 threshold
  assert.equal(result.total, 6000);
  assert.equal(result.loyaltyPointsEarned, 60);
});

test('applies sale promotion discount correctly', () => {
  const result = calculateOrderPricing({
    items: [{ unitPrice: 4000, salePrice: 3200, quantity: 1 }],
    shippingFee: 200,
    freeShippingThreshold: 5000,
  });

  assert.equal(result.merchandiseGross, 4000);
  assert.equal(result.promotionDiscount, 800);
  assert.equal(result.merchandiseNet, 3200);
  assert.equal(result.shipping, 200); // 3200 is below 5000
  assert.equal(result.total, 3400);
});

test('applies percentage coupon with max discount cap', () => {
  const coupon: Coupon = {
    id: 'c1',
    code: 'SALE20',
    name: '20% Off',
    type: 'percentage',
    value: 20,
    maxDiscount: 500,
    minSubtotal: 2000,
    startAt: '2026-01-01',
    endAt: '2026-12-31',
    usageCount: 0,
    status: 'active',
  };

  const result = calculateOrderPricing({
    items: [{ unitPrice: 4000, quantity: 1 }],
    coupon,
    shippingFee: 200,
    freeShippingThreshold: 5000,
  });

  // 20% of 4000 is 800, capped at 500
  assert.equal(result.couponDiscount, 500);
  assert.equal(result.merchandiseNet, 3500);
  assert.equal(result.total, 3700);
});

test('caps loyalty points redemption to max allowed percent', () => {
  const result = calculateOrderPricing({
    items: [{ unitPrice: 5000, quantity: 1 }],
    shippingFee: 0,
    freeShippingThreshold: 3500,
    loyaltyPointsToRedeem: 2000, // Wants Rs 2,000 off
    loyaltyPointValuePkr: 1,
    loyaltyMaxRedeemPercent: 20, // Max 20% of 5,000 = Rs 1,000
  });

  assert.equal(result.merchandiseNet, 5000);
  assert.equal(result.loyaltyRedeem, 1000);
  assert.equal(result.total, 4000);
});
