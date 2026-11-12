/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, Package, Truck, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export const OrderConfirmation: React.FC = () => {
  const { lastPlacedOrder, setLastPlacedOrder, setIsTrackingModalOpen } = useStore();

  if (!lastPlacedOrder) return null;

  const handleTrack = () => {
    setIsTrackingModalOpen(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1A1816]/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#FFFFFF] text-[#1A1816] rounded-xl border border-[#DED6CA] shadow-2xl overflow-hidden my-auto p-6 sm:p-8 space-y-6 text-center animate-fade-in"
      >
        {/* Subtle Botanical Header Band */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DED6CA] via-[#8A7864] to-[#DED6CA]" />

        <div className="flex justify-center mb-1">
          <img
            src="/assets/aistudio/SARUS_Premium_Fabrics_Logo-removebg-preview_2b5db1d0.png"
            alt="SARUS Premium Fabrics"
            className="h-12 w-auto object-contain"
          />
        </div>

        <div className="w-14 h-14 bg-[#FAF8F5] border border-[#DED6CA] rounded-full flex items-center justify-center mx-auto text-[#1A1816] shadow-xs">
          <CheckCircle2 size={32} />
        </div>

        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#8A7864] font-medium bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#DED6CA]">
            Cash on Delivery Confirmed · سیرس
          </span>
          <h2 id="confirmation-title" className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[#1A1816] mt-3">
            Order #{lastPlacedOrder.orderNumber}
          </h2>
          <p className="text-xs sm:text-sm text-[#685F54] mt-1.5 max-w-md mx-auto">
            Thank you, <strong>{lastPlacedOrder.customer.name}</strong>. Your SARUS premium fabric consignment has been successfully registered.
          </p>
        </div>

        {/* Expected Next Steps Box */}
        <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#DED6CA] text-left space-y-2 text-xs">
          <h4 className="font-semibold text-[#1A1816] uppercase tracking-wider flex items-center gap-1.5">
            <Truck size={15} className="text-[#1A1816]" />
            <span>Fulfillment & Dispatch Process</span>
          </h4>
          <ol className="list-decimal pl-4 space-y-1 text-[#685F54]">
            <li>Our textile inspection team will cut, measure, and pack your fabric in our signature gift presentation box.</li>
            <li>You will receive courier verification updates via call/SMS prior to dispatch from Sadiqabad.</li>
            <li>
              When the rider arrives at <strong>{lastPlacedOrder.shippingAddress.line1}, {lastPlacedOrder.shippingAddress.city}</strong>,
              please pay <strong>Rs {lastPlacedOrder.totals.total.toLocaleString()}</strong> in cash upon receipt.
            </li>
          </ol>
        </div>

        {/* Items Summary */}
        <div className="border-t border-[#DED6CA] pt-4 text-left space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A7864] block">
            Fabrics in Order ({lastPlacedOrder.items.length})
          </span>
          <div className="space-y-2 max-h-36 overflow-y-auto">
            {lastPlacedOrder.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs bg-[#FAF8F5] p-3 rounded-lg border border-[#DED6CA]">
                <div>
                  <p className="font-medium text-[#1A1816]">{item.name}</p>
                  <p className="text-[11px] text-[#8A7864]">Length: {item.size} · Color: {item.color} · Qty: {item.quantity}</p>
                </div>
                <span className="font-mono text-[#1A1816] font-semibold">Rs {item.lineTotal.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleTrack}
            className="flex-1 py-3 px-4 bg-[#1A1816] hover:bg-[#332E27] text-[#FAF8F5] font-medium text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            <Package size={15} />
            <span>Track Order Status</span>
          </button>

          <button
            onClick={() => setLastPlacedOrder(null)}
            className="py-3 px-6 bg-[#FFFFFF] border border-[#DED6CA] text-[#1A1816] hover:border-[#1A1816] font-medium text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
