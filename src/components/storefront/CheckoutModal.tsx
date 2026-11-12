/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  ShieldCheck,
  Truck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Banknote,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { normalizePakistaniPhone } from '../../utils/phoneValidator.ts';
import { calculateOrderPricing } from '../../utils/pricing.ts';

export const CheckoutModal: React.FC = () => {
  const {
    cartLines,
    products,
    appliedCoupon,
    shippingZones,
    settings,
    isCheckoutOpen,
    setIsCheckoutOpen,
    placeOrder,
    loyaltyBalance,
  } = useStore();

  // 4 Steps: 1: Address, 2: Delivery, 3: Payment, 4: Review
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State - Starts completely blank as required
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [province, setProvince] = useState('Punjab');
  const [city, setCity] = useState('Lahore');
  const [streetAddress, setStreetAddress] = useState('');
  const [instructions, setInstructions] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'jazzcash' | 'easypaisa'>('cod');
  const [redeemPoints, setRedeemPoints] = useState<number>(0);
  const [agreedTerms, setAgreedTerms] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Find matching shipping zone based on city
  const activeZone = useMemo(() => {
    const found = shippingZones.find((z) => z.cities.includes(city));
    return found || shippingZones[shippingZones.length - 1];
  }, [city, shippingZones]);

  // Pricing recomputation with loyalty redemption
  const checkoutPricing = useMemo(() => {
    const items = cartLines.map((line) => {
      const prod = products.find((p) => p.id === line.productId);
      const v = prod?.variants.find((v) => v.id === line.variantId);
      return {
        unitPrice: v?.priceOverride ?? prod?.price ?? 0,
        salePrice: prod?.salePrice,
        quantity: line.quantity,
      };
    });

    return calculateOrderPricing({
      items,
      coupon: appliedCoupon,
      shippingFee: activeZone.fee,
      freeShippingThreshold: settings.freeShippingThreshold,
      loyaltyPointsToRedeem: redeemPoints,
    });
  }, [cartLines, products, appliedCoupon, activeZone, settings.freeShippingThreshold, redeemPoints]);

  if (!isCheckoutOpen) return null;

  const handleValidateStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full delivery recipient name.');
      return;
    }

    const phoneValidation = normalizePakistaniPhone(phone);
    if (!phoneValidation.isValid) {
      setErrorMessage(phoneValidation.error || 'Please enter a valid Pakistani mobile number.');
      return;
    }

    if (!streetAddress.trim() || streetAddress.trim().length < 6) {
      setErrorMessage('Please enter a complete street address, house/flat number, and sector.');
      return;
    }

    setStep(2);
  };

  const handlePlaceFinalOrder = async () => {
    if (!agreedTerms) {
      setErrorMessage('Please confirm your delivery acknowledgment checkbox before proceeding.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = placeOrder({
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim() || undefined,
        address: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          province: province.trim(),
          city: city.trim(),
          line1: streetAddress.trim(),
          instructions: instructions.trim() || undefined,
        },
        loyaltyPointsToRedeem: redeemPoints,
      });

      if (result.success) {
        setIsCheckoutOpen(false);
      } else {
        setErrorMessage(result.error || 'Order placement failed. Please verify your details.');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Order placement failed. Please verify your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 bg-[#1A1816]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={() => setIsCheckoutOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#FFFFFF] text-[#1A1816] border border-[#DED6CA] rounded-xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Subtle Botanical Header Band */}
        <div className="h-1 bg-gradient-to-r from-[#DED6CA] via-[#8A7864] to-[#DED6CA]" />

        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#DED6CA] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A7864] font-medium">
                SARUS · پریمیم فیبرکس
              </span>
              <span className="text-[10px] text-[#C4B7A6]">|</span>
              <span className="text-[10px] tracking-widest text-[#8A7864] uppercase">Secure Checkout</span>
            </div>
            <h2 id="checkout-modal-title" className="font-display text-2xl font-normal tracking-tight text-[#1A1816] mt-0.5">
              Complete Your Fabric Order
            </h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-[#8A7864] hover:text-[#1A1816] hover:bg-[#EFE8DC] rounded-full cursor-pointer transition-colors"
            aria-label="Close checkout"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Indicator Progress */}
        <div className="bg-[#FFFFFF] border-b border-[#DED6CA] px-4 py-3 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-[#1A1816] text-[#FAF8F5]' : 'bg-[#EFE8DC] text-[#8A7864]'}`}>
              1
            </span>
            <span className={step === 1 ? 'text-[#1A1816] font-semibold' : 'text-[#8A7864]'}>Address</span>
          </div>

          <span className="text-[#DED6CA]">―</span>

          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-[#1A1816] text-[#FAF8F5]' : 'bg-[#EFE8DC] text-[#8A7864]'}`}>
              2
            </span>
            <span className={step === 2 ? 'text-[#1A1816] font-semibold' : 'text-[#8A7864]'}>Delivery</span>
          </div>

          <span className="text-[#DED6CA]">―</span>

          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 3 ? 'bg-[#1A1816] text-[#FAF8F5]' : 'bg-[#EFE8DC] text-[#8A7864]'}`}>
              3
            </span>
            <span className={step === 3 ? 'text-[#1A1816] font-semibold' : 'text-[#8A7864]'}>Payment</span>
          </div>

          <span className="text-[#DED6CA]">―</span>

          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 4 ? 'bg-[#1A1816] text-[#FAF8F5]' : 'bg-[#EFE8DC] text-[#8A7864]'}`}>
              4
            </span>
            <span className={step === 4 ? 'text-[#1A1816] font-semibold' : 'text-[#8A7864]'}>Review</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-[#FAF8F5]">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium flex items-center gap-2">
              <AlertCircle size={15} className="text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Address */}
          {step === 1 && (
            <form onSubmit={handleValidateStep1} className="space-y-4">
              <div className="border-b border-[#DED6CA] pb-2">
                <h3 className="font-display text-lg font-normal tracking-tight text-[#1A1816]">
                  Step 1: Nationwide Shipping Destination
                </h3>
                <p className="text-xs text-[#685F54]">Please enter your authentic delivery contact details.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#685F54] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter recipient full name"
                    className="w-full bg-[#FFFFFF] border border-[#DED6CA] rounded-lg p-2.5 text-xs text-[#1A1816] placeholder-[#A09586] focus:outline-none focus:border-[#1A1816]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#685F54] mb-1">
                    Mobile Phone (Pakistani) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0326-3512202"
                    className="w-full bg-[#FFFFFF] border border-[#DED6CA] rounded-lg p-2.5 text-xs font-mono text-[#1A1816] placeholder-[#A09586] focus:outline-none focus:border-[#1A1816]"
                  />
                  <p className="text-[10px] text-[#8A7864] mt-0.5">Rider calls this number for doorstep parcel verification</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#685F54] mb-1">Province / Region *</label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#DED6CA] rounded-lg p-2.5 text-xs text-[#1A1816] focus:outline-none focus:border-[#1A1816] cursor-pointer"
                  >
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                    <option value="Islamabad Capital Territory">Islamabad Capital Territory</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Azad Jammu and Kashmir">Azad Jammu and Kashmir</option>
                    <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#685F54] mb-1">Destination City *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#DED6CA] rounded-lg p-2.5 text-xs text-[#1A1816] focus:outline-none focus:border-[#1A1816] cursor-pointer"
                  >
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Sialkot">Sialkot</option>
                    <option value="Gujranwala">Gujranwala</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Quetta">Quetta</option>
                    <option value="Abbottabad">Abbottabad</option>
                    <option value="Sadiqabad">Sadiqabad</option>
                    <option value="Rahim Yar Khan">Rahim Yar Khan</option>
                    <option value="Other Cities">Other Cities (Rest of Pakistan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#685F54] mb-1">
                  Complete Street Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="House/Plot #, Street #, Sector / Mohallah / Block, Landmark"
                  className="w-full bg-[#FFFFFF] border border-[#DED6CA] rounded-lg p-2.5 text-xs text-[#1A1816] placeholder-[#A09586] focus:outline-none focus:border-[#1A1816]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#685F54] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="For instant tracking updates"
                    className="w-full bg-[#FFFFFF] border border-[#DED6CA] rounded-lg p-2.5 text-xs text-[#1A1816] placeholder-[#A09586] focus:outline-none focus:border-[#1A1816]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#685F54] mb-1">
                    Courier Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Ring bell, leave with guard, call first"
                    className="w-full bg-[#FFFFFF] border border-[#DED6CA] rounded-lg p-2.5 text-xs text-[#1A1816] placeholder-[#A09586] focus:outline-none focus:border-[#1A1816]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1A1816] text-[#FAF8F5] text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-[#332E27] flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <span>Continue to Delivery</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Delivery */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="border-b border-[#DED6CA] pb-2">
                <h3 className="font-display text-lg font-normal tracking-tight text-[#1A1816]">
                  Step 2: Shipping Method & Transit Estimation
                </h3>
                <p className="text-xs text-[#685F54]">Zone calculated for destination: <strong className="text-[#1A1816]">{city}, {province}</strong>.</p>
              </div>

              <div className="p-4 bg-[#FFFFFF] border border-[#DED6CA] rounded-xl flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-[#FAF8F5] text-[#1A1816] border border-[#DED6CA] rounded-lg">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#1A1816]">
                      Standard Express (Trax Logistics & Call Courier)
                    </h4>
                    <p className="text-xs text-[#685F54] mt-0.5">
                      Estimated transit: <strong className="text-[#1A1816]">{activeZone.etaMinDays}–{activeZone.etaMaxDays} working days</strong>
                    </p>
                    <p className="text-[11px] text-[#8A7864] mt-1">
                      Direct tracked dispatch across Pakistan from Sadiqabad warehouse.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  {checkoutPricing.shipping === 0 ? (
                    <span className="px-2 py-0.5 bg-[#EFE8DC] text-[#1A1816] text-xs font-semibold uppercase rounded">
                      FREE DELIVERY
                    </span>
                  ) : (
                    <span className="font-semibold text-sm text-[#1A1816]">
                      Rs {checkoutPricing.shipping.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-[#DED6CA] text-[#1A1816] text-xs font-medium uppercase rounded-lg hover:border-[#1A1816] flex items-center gap-1.5 cursor-pointer bg-[#FFFFFF]"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-[#1A1816] text-[#FAF8F5] text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-[#332E27] flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="border-b border-[#DED6CA] pb-2">
                <h3 className="font-display text-lg font-normal tracking-tight text-[#1A1816]">
                  Step 3: Payment Method
                </h3>
                <p className="text-xs text-[#685F54]">Safe and authentic Cash on Delivery nationwide.</p>
              </div>

              <div className="space-y-3">
                <label className="p-4 bg-[#FFFFFF] border-2 border-[#1A1816] rounded-xl flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-[#1A1816] focus:ring-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Banknote size={16} className="text-[#1A1816]" />
                        <span className="font-semibold text-xs uppercase text-[#1A1816]">Cash on Delivery (COD)</span>
                        <span className="px-1.5 py-0.5 bg-[#EFE8DC] text-[#1A1816] text-[9px] font-bold rounded uppercase">Recommended</span>
                      </div>
                      <p className="text-[11px] text-[#685F54] mt-0.5">Pay in cash to courier at your doorstep after parcel delivery.</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#8A7864]">Rs 0 Surcharge</span>
                </label>

                {/* Unconfigured gateways - clean informational display */}
                <div className="p-3.5 bg-[#FAF8F5] border border-[#DED6CA] rounded-xl flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-[#8A7864]" />
                    <span className="text-xs font-medium text-[#685F54]">JazzCash / EasyPaisa / Bank Transfer</span>
                  </div>
                  <span className="text-[10px] text-[#8A7864] font-mono uppercase">Available on Request via WhatsApp</span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-[#DED6CA] text-[#1A1816] text-xs font-medium uppercase rounded-lg hover:border-[#1A1816] flex items-center gap-1.5 cursor-pointer bg-[#FFFFFF]"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 bg-[#1A1816] text-[#FAF8F5] text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-[#332E27] flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <span>Review Final Order</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-[#DED6CA] pb-2">
                <h3 className="font-display text-lg font-normal tracking-tight text-[#1A1816]">
                  Step 4: Final Order Summary
                </h3>
                <p className="text-xs text-[#685F54]">Please confirm your order details and delivery destination.</p>
              </div>

              {/* Recipient & Address summary */}
              <div className="p-3.5 bg-[#FFFFFF] border border-[#DED6CA] rounded-xl space-y-1">
                <div className="flex justify-between font-semibold text-[#1A1816]">
                  <span>Delivery Recipient:</span>
                  <span className="text-[#1A1816]">{fullName} ({phone})</span>
                </div>
                <p className="text-[#685F54]">{streetAddress}, {city}, {province}</p>
                {instructions && <p className="text-[11px] text-[#8A7864]">Courier Note: {instructions}</p>}
              </div>

              {/* Items summary */}
              <div className="p-3.5 bg-[#FFFFFF] border border-[#DED6CA] rounded-xl space-y-2">
                <span className="font-semibold uppercase tracking-wider text-[#8A7864] text-[11px] block">
                  Ordered Fabrics ({cartLines.length})
                </span>
                {cartLines.map((line) => {
                  const prod = products.find((p) => p.id === line.productId);
                  const v = prod?.variants.find((v) => v.id === line.variantId);
                  const price = v?.priceOverride ?? prod?.salePrice ?? prod?.price ?? 0;
                  return (
                    <div key={line.variantId} className="flex justify-between items-center py-1.5 border-b border-[#EFE8DC] last:border-b-0">
                      <div>
                        <p className="font-medium text-[#1A1816]">{prod?.name}</p>
                        <p className="text-[10px] text-[#8A7864]">Length {v?.size} · {v?.color.name} · Qty {line.quantity}</p>
                      </div>
                      <span className="font-mono text-[#1A1816] font-semibold">Rs {(price * line.quantity).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation */}
              <div className="p-3.5 bg-[#FFFFFF] border border-[#DED6CA] rounded-xl space-y-2 font-mono">
                <div className="flex justify-between text-[#685F54]">
                  <span>Subtotal</span>
                  <span>Rs {checkoutPricing.merchandiseGross.toLocaleString()}</span>
                </div>
                {checkoutPricing.promotionDiscount > 0 && (
                  <div className="flex justify-between text-[#8A7864]">
                    <span>Seasonal Privilege</span>
                    <span>-Rs {checkoutPricing.promotionDiscount.toLocaleString()}</span>
                  </div>
                )}
                {checkoutPricing.couponDiscount > 0 && (
                  <div className="flex justify-between text-[#8A7864]">
                    <span>Voucher ({appliedCoupon?.code})</span>
                    <span>-Rs {checkoutPricing.couponDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#685F54]">
                  <span>Nationwide Express Delivery</span>
                  <span>{checkoutPricing.shipping === 0 ? 'FREE' : `Rs ${checkoutPricing.shipping.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#1A1816] border-t border-[#DED6CA] pt-2">
                  <span>Total Payable on Delivery</span>
                  <span className="text-[#1A1816]">Rs {checkoutPricing.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2 text-xs text-[#685F54] cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[#DED6CA] bg-[#FFFFFF] text-[#1A1816] focus:ring-0"
                />
                <span>
                  I confirm that the mobile phone number and delivery address provided are authentic. I agree to pay the total amount via Cash on Delivery upon parcel arrival.
                </span>
              </label>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 border border-[#DED6CA] text-[#1A1816] text-xs font-medium uppercase rounded-lg hover:border-[#1A1816] flex items-center gap-1.5 cursor-pointer bg-[#FFFFFF]"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handlePlaceFinalOrder}
                  disabled={isSubmitting || !agreedTerms}
                  className="px-8 py-3 bg-[#1A1816] text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest rounded-lg hover:bg-[#332E27] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <ShieldCheck size={16} />
                  <span>{isSubmitting ? 'Confirming Order...' : 'Place Order (Cash on Delivery)'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
