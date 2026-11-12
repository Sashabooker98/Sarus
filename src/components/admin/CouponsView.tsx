/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Tag, Plus, Check, AlertCircle, TicketPercent } from 'lucide-react';
import { INITIAL_COUPONS } from '../../data/mockData.ts';
import { Coupon, CouponType } from '../../types/index.ts';

export const CouponsView: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<CouponType>('percentage');
  const [value, setValue] = useState<number | ''>('');
  const [minSubtotal, setMinSubtotal] = useState<number | ''>('');
  const [maxDiscount, setMaxDiscount] = useState<number | ''>('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || value === '') return;

    const newCoupon: Coupon = {
      id: `cp-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim() || `${code.toUpperCase()} Promo`,
      type,
      value: Number(value),
      minSubtotal: minSubtotal !== '' ? Number(minSubtotal) : undefined,
      maxDiscount: type === 'percentage' && maxDiscount !== '' ? Number(maxDiscount) : undefined,
      startAt: new Date().toISOString(),
      endAt: '2026-12-31T23:59:59Z',
      usageLimitTotal: 500,
      usageCount: 0,
      status: 'active',
    };

    setCoupons((prev) => [newCoupon, ...prev]);
    setIsModalOpen(false);
    setCode('');
    setName('');
    setValue('');
    setMinSubtotal('');
    setMaxDiscount('');
  };

  const toggleStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c
      )
    );
  };

  return (
    <div className="space-y-6 text-[#F5F5F5]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3323] pb-4">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-[#F5F5F5]">
            Coupons & Seasonal Promotions
          </h1>
          <p className="text-xs text-[#B5B5B5]">
            Create and track promotional discount codes with subtotal conditions and usage caps.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#D4AF37] text-[#090909] rounded text-xs font-bold uppercase tracking-wider hover:bg-[#F3E5C0] flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Plus size={15} />
          <span>Create New Promo Code</span>
        </button>
      </div>

      {coupons.length === 0 ? (
        <div className="p-16 bg-[#171717] border border-[#3A3323] rounded-lg text-center max-w-xl mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-full bg-[#202020] border border-[#3A3323] text-[#D4AF37] flex items-center justify-center mx-auto mb-4">
            <TicketPercent size={28} />
          </div>
          <h3 className="font-display text-2xl font-bold uppercase text-[#F5F5F5]">
            No Coupons Created Yet
          </h3>
          <p className="text-xs text-[#B5B5B5] max-w-sm mx-auto mt-2 leading-relaxed">
            All demo promotion codes have been removed. Use the button above to configure your genuine promotional codes and launch discounts.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 px-5 py-2.5 bg-[#D4AF37] hover:bg-[#F3E5C0] text-[#090909] text-xs font-bold uppercase tracking-wider rounded cursor-pointer shadow-md inline-flex items-center gap-2"
          >
            <Plus size={14} />
            <span>Create Original Promo Code</span>
          </button>
        </div>
      ) : (
        <div className="bg-[#171717] rounded border border-[#3A3323] overflow-hidden">
          <table className="w-full text-left text-xs tabular-nums text-[#F5F5F5]">
            <thead className="bg-[#090909] uppercase text-[10px] text-[#A88732] tracking-wider border-b border-[#3A3323]">
              <tr>
                <th className="p-3">Coupon Code</th>
                <th className="p-3">Discount Type & Value</th>
                <th className="p-3">Minimum Order Spend</th>
                <th className="p-3">Max Cap</th>
                <th className="p-3">Redemptions Used</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A3323]">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-[#202020]/50">
                  <td className="p-3 font-mono font-bold text-sm text-[#D4AF37]">{c.code}</td>
                  <td className="p-3">
                    <span className="font-bold text-[#F5F5F5]">
                      {c.type === 'percentage'
                        ? `${c.value}% Off`
                        : c.type === 'fixed_amount'
                        ? `Rs ${c.value} Flat Off`
                        : 'Free Shipping'}
                    </span>
                  </td>
                  <td className="p-3 text-[#B5B5B5]">
                    {c.minSubtotal ? `Rs ${c.minSubtotal.toLocaleString()}` : 'None'}
                  </td>
                  <td className="p-3 text-[#B5B5B5]">
                    {c.maxDiscount ? `Rs ${c.maxDiscount.toLocaleString()}` : '—'}
                  </td>
                  <td className="p-3 font-mono">{c.usageCount}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        c.status === 'active'
                          ? 'bg-[#D4AF37] text-[#090909]'
                          : 'bg-[#202020] text-[#B5B5B5]'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => toggleStatus(c.id)}
                      className="px-2.5 py-1 text-[11px] font-bold border border-[#3A3323] hover:border-[#D4AF37] rounded cursor-pointer"
                    >
                      {c.status === 'active' ? 'Pause' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCoupon}
            className="bg-[#171717] border border-[#3A3323] text-[#F5F5F5] rounded max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="border-b border-[#3A3323] pb-2 flex justify-between items-center">
              <h4 className="font-bold text-sm uppercase text-[#D4AF37]">Create Original Coupon</h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#B5B5B5] hover:text-[#F5F5F5]"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#B5B5B5] mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. VIP20"
                className="w-full bg-[#090909] border border-[#3A3323] text-[#F5F5F5] rounded p-2 text-xs font-mono uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#B5B5B5] mb-1">Discount Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as CouponType)}
                  className="w-full bg-[#090909] border border-[#3A3323] text-[#F5F5F5] rounded p-2 text-xs"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed_amount">Fixed Amount (PKR)</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#B5B5B5] mb-1">Value *</label>
                <input
                  type="number"
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder={type === 'percentage' ? '15' : '500'}
                  className="w-full bg-[#090909] border border-[#3A3323] text-[#F5F5F5] rounded p-2 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#B5B5B5] mb-1">Min Subtotal (PKR)</label>
                <input
                  type="number"
                  value={minSubtotal}
                  onChange={(e) => setMinSubtotal(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 2500"
                  className="w-full bg-[#090909] border border-[#3A3323] text-[#F5F5F5] rounded p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#B5B5B5] mb-1">Max Cap (PKR)</label>
                <input
                  type="number"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 1000"
                  className="w-full bg-[#090909] border border-[#3A3323] text-[#F5F5F5] rounded p-2 text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#3A3323]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 text-xs text-[#B5B5B5] border border-[#3A3323] rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-[#090909] bg-[#D4AF37] hover:bg-[#F3E5C0] rounded"
              >
                Create Code
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
