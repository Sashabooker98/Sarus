/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Check, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { getEmptyProductImagePlaceholder } from '../../data/mockData.ts';

export const CartDrawer: React.FC = () => {
  const {
    cartLines,
    products,
    updateCartQuantity,
    removeFromCart,
    isCartOpen,
    setIsCartOpen,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartPricing,
    settings,
    setIsCheckoutOpen,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  const freeDeliveryDelta = Math.max(
    0,
    settings.freeShippingThreshold - cartPricing.merchandiseNet
  );
  const freeDeliveryProgress = Math.min(
    100,
    Math.round((cartPricing.merchandiseNet / settings.freeShippingThreshold) * 100)
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => setIsCartOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
          className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#FFFFFF] text-[#1A1816] h-full shadow-2xl flex flex-col justify-between border-l border-[#DED6CA]"
          >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#DED6CA] flex items-center justify-between bg-[#F7F4EE]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#8A7864]" />
            <h2 id="cart-drawer-title" className="font-display text-xl font-normal tracking-tight text-[#1A1816]">
              Your Selection ({cartLines.reduce((s, l) => s + l.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-[#685F54] hover:text-[#1A1816] hover:bg-[#EFE8DC] rounded-full cursor-pointer transition-colors"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#EFE8DC] border-b border-[#DED6CA] p-3 text-xs">
          {freeDeliveryDelta === 0 ? (
            <p className="font-semibold text-[#1A1816] flex items-center gap-1.5">
              <Check size={14} className="text-[#8A7864]" />
              <span>You have unlocked FREE Delivery across Pakistan!</span>
            </p>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-[#685F54]">
                <span>Add <strong className="text-[#1A1816]">Rs {freeDeliveryDelta.toLocaleString()}</strong> more for FREE shipping</span>
                <span className="tabular-nums font-mono text-[#1A1816] font-semibold">{freeDeliveryProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#FFFFFF] rounded-full overflow-hidden border border-[#DED6CA]">
                <div
                  style={{ width: `${freeDeliveryProgress}%` }}
                  className="h-full bg-[#1A1816] transition-all duration-300"
                />
              </div>
            </div>
          )}
        </div>

        {/* Lines Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartLines.length > 0 ? (
            cartLines.map((line) => {
              const product = products.find((p) => p.id === line.productId);
              const variant = product?.variants?.find((v) => v.id === line.variantId);
              if (!product || !variant) return null;

              const available = variant.stockOnHand - variant.stockReserved;
              const unitPrice = variant.priceOverride ?? product.salePrice ?? product.price ?? 0;
              const imgUrl = product.images?.[0]?.url || getEmptyProductImagePlaceholder(product.name);

              return (
                <div
                  key={line.variantId}
                  className="p-3 bg-[#F7F4EE] border border-[#DED6CA] rounded-xs flex gap-3 relative shadow-2xs"
                >
                  <img
                    src={imgUrl}
                    alt={product.name}
                    className="w-18 h-22 object-cover rounded-xs bg-[#EFE8DC] border border-[#DED6CA] shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-[#1A1816] line-clamp-1">{product.name}</h4>
                        <button
                          onClick={() => removeFromCart(line.variantId)}
                          className="text-[#685F54] hover:text-red-600 cursor-pointer p-0.5"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#685F54] uppercase mt-0.5">
                        <span>Cut/Size: <strong className="text-[#1A1816]">{variant.size}</strong></span>
                        <span>·</span>
                        <span>{variant.color.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#DED6CA] rounded-xs bg-[#FFFFFF]">
                        <button
                          onClick={() => updateCartQuantity(line.variantId, line.quantity - 1)}
                          className="px-2 py-0.5 text-xs font-medium text-[#1A1816] hover:bg-[#EFE8DC] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-semibold text-[#1A1816] tabular-nums min-w-[24px] text-center">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(line.variantId, line.quantity + 1)}
                          disabled={line.quantity >= available}
                          className="px-2 py-0.5 text-xs font-medium text-[#1A1816] hover:bg-[#EFE8DC] disabled:opacity-30 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right tabular-nums">
                        <span className="text-xs font-bold text-[#1A1816]">
                          Rs {(unitPrice * line.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-24 space-y-3">
              <ShoppingBag size={40} className="mx-auto text-[#8A7864]/40" />
              <p className="font-display text-xl font-normal text-[#1A1816]">Your bag is currently empty</p>
              <p className="text-xs text-[#685F54] max-w-xs mx-auto">
                Discover our curated selections of pure cottons, organic linens, and traditional Pakistani khaddar.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2.5 bg-[#1A1816] text-[#F7F4EE] text-xs font-medium uppercase tracking-wider rounded-xs hover:bg-[#35302A] cursor-pointer"
              >
                Browse Fabrics
              </button>
            </div>
          )}
        </div>

        {/* Promo Code & Order Summary Footer */}
        {cartLines.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#F7F4EE] border-t border-[#DED6CA] space-y-4">
            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#FFFFFF] border border-[#DED6CA] rounded-xs text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[#1A1816]">
                    <Tag size={13} className="text-[#8A7864]" />
                    <span>{appliedCoupon.code} applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter promo coupon"
                      className="flex-1 bg-[#FFFFFF] border border-[#DED6CA] rounded-xs px-3 py-1.5 text-xs font-medium uppercase text-[#1A1816] placeholder:normal-case placeholder-[#685F54]/50 focus:outline-none focus:border-[#1A1816]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#1A1816] text-[#F7F4EE] font-medium text-xs uppercase tracking-wider rounded-xs hover:bg-[#35302A] cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium pt-0.5">
                      <AlertCircle size={12} />
                      <span>{couponError}</span>
                    </p>
                  )}
                  {couponSuccess && (
                    <p className="text-[11px] text-[#1A1816] flex items-center gap-1 font-medium pt-0.5">
                      <Check size={12} className="text-[#8A7864]" />
                      <span>{couponSuccess}</span>
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs border-t border-[#DED6CA] pt-2">
              <div className="flex justify-between text-[#685F54]">
                <span>Merchandise Subtotal</span>
                <span className="tabular-nums font-mono text-[#1A1816]">Rs {cartPricing.merchandiseGross.toLocaleString()}</span>
              </div>

              {cartPricing.promotionDiscount > 0 && (
                <div className="flex justify-between text-[#8A7864] font-medium">
                  <span>Special Drop Discount</span>
                  <span className="tabular-nums font-mono">-Rs {cartPricing.promotionDiscount.toLocaleString()}</span>
                </div>
              )}

              {cartPricing.couponDiscount > 0 && (
                <div className="flex justify-between text-[#8A7864] font-medium">
                  <span>Promo Code Discount</span>
                  <span className="tabular-nums font-mono">-Rs {cartPricing.couponDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-[#685F54]">
                <span>Estimated Shipping</span>
                <span className="tabular-nums font-mono text-[#1A1816]">
                  {cartPricing.shipping === 0 ? (
                    <strong className="text-[#1A1816] uppercase">FREE</strong>
                  ) : (
                    `Rs ${cartPricing.shipping.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-semibold text-[#1A1816] border-t border-[#DED6CA] pt-2">
                <span>Total (PKR)</span>
                <span className="tabular-nums text-lg font-bold">Rs {cartPricing.total.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-[#685F54] text-right">Tax included · Doorstep Cash on Delivery available</p>
            </div>

            {/* Checkout Action */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleProceedToCheckout}
              className="btn-shine w-full py-3.5 px-4 bg-[#1A1816] text-[#F7F4EE] font-medium text-xs uppercase tracking-[0.2em] rounded-xs hover:bg-[#35302A] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={15} />
            </motion.button>
          </div>
        )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
