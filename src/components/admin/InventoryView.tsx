/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Boxes, Plus, AlertCircle, CheckCircle, ArrowUpDown, History } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { MovementType, InventoryMovement } from '../../types/index.ts';

export const InventoryView: React.FC = () => {
  const { products, setProducts, currentUser } = useStore();

  const [search, setSearch] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [adjustType, setAdjustType] = useState<MovementType>('restock');
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('');
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Clean real movement log starting empty - zero fake records
  const [movements, setMovements] = useState<InventoryMovement[]>([]);

  // Flatten all variants with product info
  const allVariants = products.flatMap((p) =>
    (p.variants || []).map((v) => ({
      ...v,
      productName: p.name,
      productId: p.id,
      parentSku: p.productSku,
      available: Math.max(0, v.stockOnHand - v.stockReserved),
    }))
  );

  const filteredVariants = allVariants.filter(
    (v) =>
      v.sku?.toLowerCase().includes(search.toLowerCase()) ||
      v.productName?.toLowerCase().includes(search.toLowerCase()) ||
      v.color?.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.size?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!selectedVariantId) {
      setModalError('Please choose a garment variant.');
      return;
    }

    if (!adjustReason.trim() || adjustReason.length < 5) {
      setModalError('A documented reason of at least 5 characters is mandatory.');
      return;
    }

    const targetVariant = allVariants.find((v) => v.id === selectedVariantId);
    if (!targetVariant) return;

    let deltaOnHand = 0;
    if (adjustType === 'restock') {
      deltaOnHand = Math.abs(adjustQty);
    } else if (adjustType === 'damage_writeoff') {
      deltaOnHand = -Math.abs(adjustQty);
    } else if (adjustType === 'correction') {
      deltaOnHand = adjustQty;
    }

    const nextOnHand = targetVariant.stockOnHand + deltaOnHand;
    if (nextOnHand < targetVariant.stockReserved) {
      setModalError(
        `Cannot reduce stock below reserved quantity (${targetVariant.stockReserved} units currently locked in orders).`
      );
      return;
    }

    // Update variant stock in products state
    setProducts((prev) =>
      prev.map((prod) => ({
        ...prod,
        variants: prod.variants.map((v) =>
          v.id === selectedVariantId ? { ...v, stockOnHand: nextOnHand } : v
        ),
      }))
    );

    // Record real inventory movement
    const newMovement: InventoryMovement = {
      id: `mov-${Date.now()}`,
      variantId: targetVariant.id,
      productId: targetVariant.productId,
      sku: targetVariant.sku,
      type: adjustType,
      deltaOnHand,
      deltaReserved: 0,
      before: { onHand: targetVariant.stockOnHand, reserved: targetVariant.stockReserved },
      after: { onHand: nextOnHand, reserved: targetVariant.stockReserved },
      reason: adjustReason.trim(),
      actor: { type: 'staff', name: currentUser.name },
      createdAt: new Date().toISOString(),
    };

    setMovements((prev) => [newMovement, ...prev]);
    setIsAdjustModalOpen(false);
    setAdjustReason('');
  };

  if (allVariants.length === 0) {
    return (
      <div className="space-y-6 text-[#F5F5F5]">
        <div className="border-b border-[#3A3323] pb-4">
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-[#F5F5F5]">
            Inventory & Warehouse Restock
          </h1>
          <p className="text-xs text-[#B5B5B5]">Manage SKU stock levels, reservations, and physical ledger movements.</p>
        </div>

        <div className="p-16 bg-[#171717] border border-[#3A3323] rounded-lg text-center max-w-xl mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-full bg-[#202020] border border-[#3A3323] text-[#D4AF37] flex items-center justify-center mx-auto mb-4">
            <Boxes size={28} />
          </div>
          <h3 className="font-display text-2xl font-bold uppercase text-[#F5F5F5]">
            No Inventory Records Yet
          </h3>
          <p className="text-xs text-[#B5B5B5] max-w-sm mx-auto mt-2 leading-relaxed">
            Create products in the Products & Catalog section to begin tracking physical inventory on hand, reserved orders, and warehouse restock movements.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#F5F5F5]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3323] pb-4">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-[#F5F5F5]">
            Inventory & Warehouse Restock
          </h1>
          <p className="text-xs text-[#B5B5B5]">
            Dual-quantity tracking: Physical On-Hand vs. Net Available (On-Hand minus Reserved).
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedVariantId(allVariants[0]?.id || '');
            setAdjustQty(10);
            setAdjustReason('');
            setModalError(null);
            setIsAdjustModalOpen(true);
          }}
          className="px-4 py-2.5 bg-[#D4AF37] text-[#090909] rounded text-xs font-bold uppercase tracking-wider hover:bg-[#F3E5C0] flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Plus size={15} />
          <span>Record Inventory Adjustment</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-[#171717] p-3.5 rounded border border-[#3A3323] flex items-center gap-2">
        <ArrowUpDown size={16} className="text-[#A88732]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by SKU, garment name, size, or colorway..."
          className="w-full text-xs bg-transparent border-none outline-none focus:ring-0 text-[#F5F5F5] placeholder-[#B5B5B5]/50"
        />
      </div>

      {/* Variants Inventory Matrix */}
      <div className="bg-[#171717] rounded border border-[#3A3323] overflow-hidden">
        <div className="p-3 bg-[#090909] border-b border-[#3A3323] flex justify-between items-center text-xs font-bold uppercase text-[#A88732]">
          <span>Variant Stock Matrix ({filteredVariants.length})</span>
          <span>Availability</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs tabular-nums text-[#F5F5F5]">
            <thead className="bg-[#202020] uppercase text-[10px] text-[#A88732] tracking-wider border-b border-[#3A3323]">
              <tr>
                <th className="p-3">SKU</th>
                <th className="p-3">Garment & Variant</th>
                <th className="p-3">Size</th>
                <th className="p-3">Color</th>
                <th className="p-3">Stock On Hand</th>
                <th className="p-3">Stock Reserved</th>
                <th className="p-3">Available To Sell</th>
                <th className="p-3">Stock Health</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A3323]">
              {filteredVariants.map((v) => {
                const isOut = v.available <= 0;
                const isLow = !isOut && v.available <= v.lowStockThreshold;

                return (
                  <tr key={v.id} className="hover:bg-[#202020]/50">
                    <td className="p-3 font-mono text-[11px] font-bold text-[#D4AF37]">{v.sku}</td>
                    <td className="p-3">
                      <p className="font-bold text-[#F5F5F5]">{v.productName}</p>
                      <span className="text-[10px] text-[#B5B5B5] font-mono">{v.parentSku}</span>
                    </td>
                    <td className="p-3 font-bold">{v.size}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          style={{ backgroundColor: v.color.hex }}
                          className="w-3 h-3 rounded-full border border-black/40 inline-block"
                        />
                        <span>{v.color.name}</span>
                      </div>
                    </td>
                    <td className="p-3 font-bold text-[#F5F5F5]">{v.stockOnHand}</td>
                    <td className="p-3 text-[#F3E5C0] font-bold">{v.stockReserved}</td>
                    <td className="p-3 font-bold text-sm">
                      <span className={isOut ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-[#D4AF37]'}>
                        {v.available}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                          isOut
                            ? 'bg-red-950/60 text-red-400 border border-red-800/40'
                            : isLow
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                            : 'bg-[#202020] text-[#D4AF37] border border-[#3A3323]'
                        }`}
                      >
                        {isOut ? 'Sold Out' : isLow ? 'Low Stock' : 'Optimal'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedVariantId(v.id);
                          setAdjustQty(10);
                          setAdjustReason('');
                          setIsAdjustModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold text-[#090909] bg-[#D4AF37] hover:bg-[#F3E5C0] rounded cursor-pointer transition-colors"
                      >
                        Adjust
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement Ledger History */}
      <div className="bg-[#171717] rounded border border-[#3A3323] overflow-hidden">
        <div className="p-4 bg-[#090909] border-b border-[#3A3323] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={16} className="text-[#D4AF37]" />
            <h3 className="font-bold text-sm uppercase tracking-wide text-[#F5F5F5]">
              Authoritative Inventory Audit Stream
            </h3>
          </div>
          <span className="text-xs text-[#B5B5B5]">{movements.length} logged events</span>
        </div>

        {movements.length > 0 ? (
          <div className="divide-y divide-[#3A3323]">
            {movements.map((m) => (
              <div key={m.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#D4AF37]">{m.sku}</span>
                    <span className="px-1.5 py-0.5 bg-[#202020] border border-[#3A3323] text-[#F3E5C0] rounded uppercase text-[10px]">
                      {m.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-[#B5B5B5] mt-1">{m.reason} · by {m.actor.name}</p>
                </div>
                <div className="text-right tabular-nums">
                  <span className={`font-bold font-mono text-sm ${m.deltaOnHand >= 0 ? 'text-[#D4AF37]' : 'text-red-400'}`}>
                    {m.deltaOnHand >= 0 ? `+${m.deltaOnHand}` : m.deltaOnHand} units
                  </span>
                  <span className="text-[10px] text-[#A88732] block font-mono">
                    {new Date(m.createdAt).toLocaleTimeString('en-PK')} PKT
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#B5B5B5]">
            No inventory adjustment transactions recorded yet.
          </div>
        )}
      </div>

      {/* Adjustment Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAdjustSubmit}
            className="bg-[#171717] border border-[#3A3323] text-[#F5F5F5] rounded max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="border-b border-[#3A3323] pb-2 flex justify-between items-center">
              <h4 className="font-bold text-sm uppercase text-[#D4AF37]">Record Stock Adjustment</h4>
              <button
                type="button"
                onClick={() => setIsAdjustModalOpen(false)}
                className="text-[#B5B5B5] hover:text-[#F5F5F5]"
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-950/40 border border-red-800/50 rounded flex items-center gap-2 text-xs text-red-300">
                <AlertCircle size={15} className="text-red-400 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#B5B5B5] mb-1">Target Garment Variant</label>
              <select
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                className="w-full bg-[#090909] border border-[#3A3323] text-[#F5F5F5] rounded p-2 text-xs"
              >
                {allVariants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.productName} ({v.size} · {v.color.name}) — SKU: {v.sku}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#B5B5B5] mb-1">Movement Type</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as MovementType)}
                  className="w-full bg-[#090909] border border-[#3A3323] text-[#F5F5F5] rounded p-2 text-xs"
                >
                  <option value="restock">Restock Batch (+)</option>
                  <option value="correction">Inventory Correction (±)</option>
                  <option value="damage_writeoff">Damage Write-off (-)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#B5B5B5] mb-1">Quantity</label>
                <input
                  type="number"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full bg-[#090909] border border-[#3A3323] text-[#F5F5F5] rounded p-2 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#B5B5B5] mb-1">Documented Reason *</label>
              <input
                type="text"
                required
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="Document batch/receipt reference (min 5 characters)"
                className="w-full bg-[#090909] border border-[#3A3323] text-[#F5F5F5] rounded p-2 text-xs placeholder-[#B5B5B5]/40"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#3A3323]">
              <button
                type="button"
                onClick={() => setIsAdjustModalOpen(false)}
                className="px-3 py-1.5 text-xs text-[#B5B5B5] border border-[#3A3323] rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-[#090909] bg-[#D4AF37] hover:bg-[#F3E5C0] rounded"
              >
                Apply Adjustment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
