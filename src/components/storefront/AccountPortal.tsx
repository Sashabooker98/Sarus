/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Package,
  Award,
  Heart,
  RotateCcw,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { getEmptyProductImagePlaceholder } from '../../data/mockData.ts';

export const AccountPortal: React.FC = () => {
  const {
    isAccountModalOpen,
    setIsAccountModalOpen,
    currentUser,
    orders,
    wishlist,
    products,
    loyaltyBalance,
    returns,
    submitReturn,
    transitionOrder,
    setSelectedProductForModal,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'loyalty' | 'wishlist' | 'returns'>('orders');

  if (!isAccountModalOpen) return null;

  const myOrders = orders.filter((o) => o.userId === currentUser.uid || o.customer?.phone === currentUser.phone);
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1A1816]/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#FFFFFF] text-[#1A1816] rounded-xl border border-[#DED6CA] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Subtle Botanical Header Band */}
        <div className="h-1 bg-gradient-to-r from-[#DED6CA] via-[#8A7864] to-[#DED6CA]" />

        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#FAF8F5] border-b border-[#DED6CA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/SARUS_Premium_Fabrics_Logo-removebg-preview_2b5db1d0.png"
              alt="SARUS"
              className="h-10 w-auto object-contain hidden sm:block"
            />
            <div className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#DED6CA] text-[#1A1816] flex items-center justify-center font-display text-lg shadow-xs">
              {currentUser.name ? currentUser.name.charAt(0) : 'S'}
            </div>
            <div>
              <h2 id="account-modal-title" className="font-display text-xl sm:text-2xl font-normal tracking-tight text-[#1A1816]">
                {currentUser.name || 'SARUS Patron Portal'}
              </h2>
              <p className="text-xs text-[#8A7864]">
                {currentUser.email || 'SARUS Fabric Concierge · Crafted with Care'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAccountModalOpen(false)}
            className="p-1.5 text-[#8A7864] hover:text-[#1A1816] hover:bg-[#EFE8DC] rounded-full cursor-pointer transition-colors"
            aria-label="Close account"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#FFFFFF] border-b border-[#DED6CA] px-4 flex items-center gap-2 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'orders' ? 'border-[#1A1816] text-[#1A1816] font-semibold' : 'border-transparent text-[#8A7864] hover:text-[#1A1816]'
            }`}
          >
            <Package size={14} />
            <span>Fabric Orders ({myOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('loyalty')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'loyalty' ? 'border-[#1A1816] text-[#1A1816] font-semibold' : 'border-transparent text-[#8A7864] hover:text-[#1A1816]'
            }`}
          >
            <Award size={14} />
            <span>Patron Privilege ({loyaltyBalance.available} Pts)</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'wishlist' ? 'border-[#1A1816] text-[#1A1816] font-semibold' : 'border-transparent text-[#8A7864] hover:text-[#1A1816]'
            }`}
          >
            <Heart size={14} />
            <span>Saved Fabrics ({wishlistProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('returns')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'returns' ? 'border-[#1A1816] text-[#1A1816] font-semibold' : 'border-transparent text-[#8A7864] hover:text-[#1A1816]'
            }`}
          >
            <RotateCcw size={14} />
            <span>Exchanges ({returns.length})</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-[#FAF8F5]">
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {myOrders.length > 0 ? (
                myOrders.map((ord) => {
                  const canCancel = ord.status === 'pending_confirmation';

                  return (
                    <div
                      key={ord.id}
                      className="p-4 bg-[#FFFFFF] border border-[#DED6CA] rounded-xl space-y-3 shadow-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFE8DC] pb-2">
                        <div>
                          <span className="font-mono text-sm font-semibold text-[#1A1816]">{ord.orderNumber}</span>
                          <span className="text-[11px] text-[#8A7864] block">
                            Placed on {new Date(ord.placedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 bg-[#EFE8DC] text-[#1A1816] text-xs font-semibold uppercase rounded-lg border border-[#DED6CA]">
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {ord.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-xs">
                            <span className="text-[#1A1816]">{item.name} ({item.size}) × {item.quantity}</span>
                            <span className="font-mono text-[#1A1816] font-medium">Rs {item.lineTotal.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-[#EFE8DC] text-xs font-semibold">
                        <span className="text-[#685F54]">Total Payable on Delivery:</span>
                        <span className="font-mono text-sm text-[#1A1816]">Rs {ord.totals.total.toLocaleString()}</span>
                      </div>

                      {canCancel && (
                        <button
                          onClick={() => transitionOrder(ord.id, 'cancelled', 'Customer requested cancellation')}
                          className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 text-xs font-medium uppercase rounded-lg hover:bg-red-100 cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16 text-xs text-[#685F54] border border-[#DED6CA] rounded-xl bg-[#FFFFFF]">
                  <Package size={32} className="mx-auto text-[#8A7864] mb-2" />
                  <p className="font-semibold text-[#1A1816] uppercase tracking-wide text-sm">No Orders Yet</p>
                  <p className="text-[11px] text-[#8A7864] mt-1">Your placed fabric orders and shipment tracking will appear here.</p>
                </div>
              )}
            </div>
          )}

          {/* LOYALTY TAB */}
          {activeTab === 'loyalty' && (
            <div className="space-y-4">
              <div className="p-5 bg-[#FFFFFF] border border-[#DED6CA] rounded-xl flex justify-between items-center shadow-xs">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8A7864]">Privilege Points</span>
                  <p className="font-display text-4xl font-normal text-[#1A1816] mt-1">{loyaltyBalance.available}</p>
                </div>
                <div className="text-right text-xs text-[#685F54]">
                  <p>1 Point = Rs 1.00 PKR</p>
                  <p className="text-[11px] text-[#8A7864] mt-0.5">Directly redeemable towards future fabric lengths</p>
                </div>
              </div>
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {wishlistProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProductForModal(p)}
                      className="p-3 bg-[#FFFFFF] border border-[#DED6CA] rounded-xl flex gap-3 cursor-pointer hover:border-[#1A1816] transition-colors shadow-xs"
                    >
                      <img
                        src={p.images?.[0]?.url || getEmptyProductImagePlaceholder(p.name)}
                        alt={p.name}
                        className="w-16 h-20 object-cover rounded-lg bg-[#FAF8F5]"
                      />
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="font-medium text-xs text-[#1A1816]">{p.name}</h4>
                        <p className="font-mono text-xs text-[#1A1816] font-semibold mt-1">Rs {p.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-xs text-[#685F54] border border-[#DED6CA] rounded-xl bg-[#FFFFFF]">
                  <Heart size={32} className="mx-auto text-[#8A7864] mb-2" />
                  <p className="font-semibold text-[#1A1816] uppercase tracking-wide text-sm">No Saved Fabrics Yet</p>
                  <p className="text-[11px] text-[#8A7864] mt-1">Bookmark your favorite unstitched weaves while exploring the catalog.</p>
                </div>
              )}
            </div>
          )}

          {/* RETURNS TAB */}
          {activeTab === 'returns' && (
            <div className="space-y-4">
              {returns.length > 0 ? (
                returns.map((ret) => (
                  <div key={ret.id} className="p-4 bg-[#FFFFFF] border border-[#DED6CA] rounded-xl space-y-2 shadow-xs">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-semibold text-[#1A1816]">Order: {ret.orderNumber}</span>
                      <span className="px-2 py-0.5 bg-[#EFE8DC] text-[#1A1816] font-semibold rounded uppercase text-[10px]">
                        {ret.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#685F54]">Requested resolution: {ret.resolutionType}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-xs text-[#685F54] border border-[#DED6CA] rounded-xl bg-[#FFFFFF]">
                  <RotateCcw size={32} className="mx-auto text-[#8A7864] mb-2" />
                  <p className="font-semibold text-[#1A1816] uppercase tracking-wide text-sm">No Exchange Requests</p>
                  <p className="text-[11px] text-[#8A7864] mt-1">7-Day unstitched fabric exchange records will appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
