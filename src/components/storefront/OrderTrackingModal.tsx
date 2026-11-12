/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Search, Package, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { Order } from '../../types/index.ts';

export const OrderTrackingModal: React.FC = () => {
  const { isTrackingModalOpen, setIsTrackingModalOpen, orders, lastPlacedOrder } = useStore();

  const [orderQuery, setOrderQuery] = useState(lastPlacedOrder?.orderNumber || '');
  const [phoneQuery, setPhoneQuery] = useState(lastPlacedOrder?.customer?.phone || '');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isTrackingModalOpen) return null;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);

    const cleanOrderNo = orderQuery.trim().toUpperCase();
    const cleanPhone = phoneQuery.replace(/[\s\-()]/g, '');

    const found = orders.find((o) => {
      const matchNo = o.orderNumber.toUpperCase() === cleanOrderNo;
      const orderCleanPhone = (o.customer?.phone || '').replace(/[\s\-()]/g, '');
      const matchPhone = cleanPhone ? orderCleanPhone.includes(cleanPhone) || cleanPhone.includes(orderCleanPhone) : true;
      return matchNo && matchPhone;
    });

    setSearchedOrder(found || null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tracking-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1A1816]/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#FFFFFF] text-[#1A1816] rounded-xl border border-[#DED6CA] shadow-2xl overflow-hidden my-auto p-5 sm:p-7 space-y-6"
      >
        {/* Subtle Botanical Header Band */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DED6CA] via-[#8A7864] to-[#DED6CA]" />

        <div className="flex items-center justify-between border-b border-[#DED6CA] pb-3">
          <div className="flex items-center gap-2.5">
            <Package size={20} className="text-[#1A1816]" />
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A7864] block">SARUS · پریمیم فیبرکس</span>
              <h2 id="tracking-title" className="font-display text-2xl font-normal tracking-tight text-[#1A1816]">
                Track Fabric Consignment
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsTrackingModalOpen(false)}
            className="p-1.5 text-[#8A7864] hover:text-[#1A1816] hover:bg-[#EFE8DC] rounded-full cursor-pointer transition-colors"
            aria-label="Close tracking"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleTrackSubmit} className="space-y-3 bg-[#FAF8F5] p-4 rounded-xl border border-[#DED6CA]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#685F54] mb-1">
                Order Reference Number *
              </label>
              <input
                type="text"
                required
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="e.g. SC-20261028-4M2PT1"
                className="w-full bg-[#FFFFFF] border border-[#DED6CA] rounded-lg px-3 py-2 text-xs font-mono font-medium text-[#1A1816] placeholder-[#A09586] focus:outline-none focus:border-[#1A1816] uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#685F54] mb-1">
                Recipient Phone Number *
              </label>
              <input
                type="text"
                required
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                placeholder="0326-3512202"
                className="w-full bg-[#FFFFFF] border border-[#DED6CA] rounded-lg px-3 py-2 text-xs font-medium text-[#1A1816] placeholder-[#A09586] focus:outline-none focus:border-[#1A1816]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#1A1816] text-[#FAF8F5] text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-[#332E27] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            <Search size={14} />
            <span>Search Consignment Records</span>
          </button>
        </form>

        {/* Results */}
        {hasSearched && (
          <div>
            {searchedOrder ? (
              <div className="space-y-4 bg-[#FAF8F5] p-5 rounded-xl border border-[#DED6CA] animate-fade-in">
                {/* Header status */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DED6CA] pb-3">
                  <div>
                    <span className="text-[10px] text-[#8A7864] uppercase tracking-wider">Consignment Reference</span>
                    <h3 className="font-mono text-base font-semibold text-[#1A1816]">{searchedOrder.orderNumber}</h3>
                  </div>

                  <span className="px-3 py-1 bg-[#EFE8DC] text-[#1A1816] text-xs font-semibold uppercase tracking-wider rounded-lg border border-[#DED6CA]">
                    Status: {searchedOrder.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Courier Details if Dispatched */}
                {searchedOrder.courierName && (
                  <div className="p-3 bg-[#FFFFFF] rounded-lg border border-[#DED6CA] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#685F54] block">Fulfillment Logistics:</span>
                      <strong className="text-[#1A1816]">{searchedOrder.courierName}</strong>
                    </div>
                    {searchedOrder.trackingRef && (
                      <div className="text-right">
                        <span className="text-[#685F54] block">Airway Bill / Tracking:</span>
                        <strong className="font-mono text-[#1A1816]">{searchedOrder.trackingRef}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* Event Timeline */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8A7864] block">
                    Parcel Dispatch Timeline
                  </span>

                  <div className="space-y-2 border-l-2 border-[#DED6CA] ml-2 pl-4">
                    {searchedOrder.events?.map((ev, i) => (
                      <div key={ev.id || i} className="relative text-xs">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#1A1816] border-2 border-[#FAF8F5]" />
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-[#1A1816] uppercase tracking-wider text-[11px]">
                            {ev.type.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] text-[#8A7864] tabular-nums font-mono">
                            {new Date(ev.createdAt).toLocaleString()}
                          </span>
                        </div>
                        {ev.note && <p className="text-[11px] text-[#685F54] mt-0.5">{ev.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Destination */}
                <div className="pt-3 border-t border-[#DED6CA] flex justify-between text-xs text-[#685F54]">
                  <span>Destination: {searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.province}</span>
                  <span className="font-mono text-[#1A1816] font-semibold">Total COD: Rs {searchedOrder.totals.total.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-[#FAF8F5] border border-[#DED6CA] rounded-xl text-center space-y-2">
                <AlertCircle size={24} className="mx-auto text-[#8A7864]" />
                <h4 className="font-semibold text-sm text-[#1A1816] uppercase tracking-wide">No Matching Consignment Found</h4>
                <p className="text-xs text-[#685F54] max-w-sm mx-auto">
                  Please verify your order number and mobile phone number. Real-time courier dispatch records will appear here once an order is placed.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
