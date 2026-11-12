/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export const AiStylistDrawer: React.FC = () => {
  const { isStylistOpen, setIsStylistOpen, products, setSelectedProductForModal } = useStore();

  const [query, setQuery] = useState('');
  const [season, setSeason] = useState('All-Season Pure Cotton');
  const [garmentType, setGarmentType] = useState('Full 2-Piece / 3-Piece Shalwar Kameez');
  const [isLoading, setIsLoading] = useState(false);
  const [stylingResponse, setStylingResponse] = useState<string | null>(null);

  if (!isStylistOpen) return null;

  const handleConsultStylist = async (customQuery?: string) => {
    const q = customQuery ?? query;
    setIsLoading(true);
    setStylingResponse(null);

    try {
      const res = await fetch('/api/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          season,
          garmentType,
        }),
      });

      const data = await res.json();
      setStylingResponse(
        data.response ||
        'For a timeless unstitched ensemble, we recommend 4.0 meters of pure woven karandi or soft Egyptian cotton. Pre-shrink gently in cold water before tailoring for the cleanest drape.'
      );
    } catch {
      setStylingResponse(
        '**SARUS Fabric & Tailoring Guide (سیرس · پریمیم فیبرکس)**\n\n' +
        '• **Shalwar Kameez (Full Suit):** 4.0 meters (double-width 54") or 4.5 meters (regular 36" width) provides comfortable, generous fall.\n' +
        '• **Kurta / Shirt Only:** 2.25 to 2.5 meters for standard men\'s and women\'s cuts.\n' +
        '• **Pure Karandi & Khaddar:** Crafted from 100% pure fabrics and handloom yarns. Pre-shrink in cold water before stitching for lifetime longevity.\n' +
        '• **Organic Linen & Egyptian Cotton:** Exceptional breathability in warm climates; iron slightly damp for an effortless crisp finish.\n\n' +
        'Crafted with Care · Made to Inspire.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="stylist-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden bg-[#1A1816]/60 backdrop-blur-xs flex justify-end animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#FFFFFF] text-[#1A1816] h-full shadow-2xl flex flex-col justify-between border-l border-[#DED6CA]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#DED6CA] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FFFFFF] text-[#1A1816] border border-[#DED6CA] rounded-xl shadow-xs">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 id="stylist-drawer-title" className="font-display text-xl font-normal tracking-tight text-[#1A1816]">
                  Fabric & Drape Consultant
                </h2>
                <span className="font-urdu text-xs text-[#8A7864]">سیرس</span>
              </div>
              <p className="text-[11px] text-[#8A7864] font-medium tracking-wide">
                Bespoke Yardage & Weave Guidance for SARUS Fabrics
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsStylistOpen(false)}
            className="p-1.5 text-[#8A7864] hover:text-[#1A1816] hover:bg-[#EFE8DC] rounded-full cursor-pointer transition-colors"
            aria-label="Close fabric consultant"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content & Interactive Consultation */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FAF8F5]">
          {/* Quick Styling Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A7864]">
                Popular Fabric Inquiries
              </span>
              <span className="text-xs text-[#8A7864]">— ✤ —</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setSeason('Winter Karandi & Woolens');
                  setGarmentType('Full 2-Piece / 3-Piece Shalwar Kameez');
                  handleConsultStylist('What is the best fabric for winter Pakistani weddings and evening events?');
                }}
                className="p-3 bg-[#FFFFFF] border border-[#DED6CA] hover:border-[#1A1816] rounded-xl text-left font-medium transition-all cursor-pointer text-[#1A1816] shadow-xs hover:shadow-sm"
              >
                ❄️ Winter Karandi & Festive Suits
              </button>
              <button
                onClick={() => {
                  setSeason('Summer Pure Cotton');
                  setGarmentType('Bespoke Kurta');
                  handleConsultStylist('Recommend breathable pure cotton or linen for hot humid Pakistani summers');
                }}
                className="p-3 bg-[#FFFFFF] border border-[#DED6CA] hover:border-[#1A1816] rounded-xl text-left font-medium transition-all cursor-pointer text-[#1A1816] shadow-xs hover:shadow-sm"
              >
                ☀️ Breathable Summer Lawn & Linen
              </button>
              <button
                onClick={() => {
                  handleConsultStylist('How many meters of fabric do I need for a men’s shalwar kameez vs waistcoat?');
                }}
                className="p-3 bg-[#FFFFFF] border border-[#DED6CA] hover:border-[#1A1816] rounded-xl text-left font-medium transition-all cursor-pointer text-[#1A1816] shadow-xs hover:shadow-sm"
              >
                📏 Unstitched Yardage Estimator
              </button>
              <button
                onClick={() => {
                  handleConsultStylist('How should I care for and shrink pure unstitched cotton before stitching?');
                }}
                className="p-3 bg-[#FFFFFF] border border-[#DED6CA] hover:border-[#1A1816] rounded-xl text-left font-medium transition-all cursor-pointer text-[#1A1816] shadow-xs hover:shadow-sm"
              >
                🧺 Pre-Shrink & Fabric Care Rules
              </button>
            </div>
          </div>

          {/* Form Preferences */}
          <div className="p-4 bg-[#FFFFFF] rounded-xl border border-[#DED6CA] space-y-3 text-xs shadow-xs">
            <span className="font-semibold uppercase tracking-wider text-[#1A1816] text-[11px] block">
              Tailoring Preferences
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#685F54] font-medium mb-1">Fabric Preference</label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#DED6CA] rounded-lg p-2 text-xs font-medium text-[#1A1816] cursor-pointer focus:outline-none focus:border-[#1A1816]"
                >
                  <option value="All-Season Pure Cotton">All-Season Pure Cotton</option>
                  <option value="Winter Karandi & Woolens">Winter Karandi & Woolens</option>
                  <option value="Organic Flax Linen">Organic Flax Linen</option>
                  <option value="Festive Raw Silk">Festive Raw Silk</option>
                </select>
              </div>

              <div>
                <label className="block text-[#685F54] font-medium mb-1">Garment Type</label>
                <select
                  value={garmentType}
                  onChange={(e) => setGarmentType(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#DED6CA] rounded-lg p-2 text-xs font-medium text-[#1A1816] cursor-pointer focus:outline-none focus:border-[#1A1816]"
                >
                  <option value="Full 2-Piece / 3-Piece Shalwar Kameez">Full Shalwar Kameez (4.0m)</option>
                  <option value="Bespoke Kurta">Bespoke Kurta (2.5m)</option>
                  <option value="Waistcoat Fabric">Waistcoat Only (1.25m)</option>
                  <option value="Trousers / Shalwar Only">Trousers / Shalwar (2.25m)</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Response Display */}
          {isLoading && (
            <div className="p-6 bg-[#FFFFFF] border border-[#DED6CA] rounded-xl text-center space-y-2 animate-pulse shadow-xs">
              <Loader2 size={24} className="animate-spin mx-auto text-[#1A1816]" />
              <p className="font-medium text-xs uppercase tracking-wider text-[#1A1816]">
                SARUS Fabric Advisor Analyzing Weave & Drape...
              </p>
              <p className="text-[11px] text-[#8A7864]">Consulting yarn count, drape weights and regional tailoring norms.</p>
            </div>
          )}

          {stylingResponse && (
            <div className="p-4 bg-[#FFFFFF] border border-[#DED6CA] rounded-xl space-y-3 animate-fade-in shadow-xs">
              <div className="flex items-center justify-between border-b border-[#EFE8DC] pb-2">
                <span className="font-display text-sm font-normal text-[#1A1816] flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#8A7864]" />
                  <span>Curated Fabric Recommendation</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#8A7864] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#DED6CA]">
                  SARUS ADVICE
                </span>
              </div>

              <div className="text-xs text-[#1A1816] leading-relaxed whitespace-pre-line space-y-2 font-normal">
                {stylingResponse}
              </div>

              {products.length > 0 && (
                <div className="pt-2 border-t border-[#EFE8DC] flex justify-end">
                  <button
                    onClick={() => {
                      setIsStylistOpen(false);
                      if (products[0]) setSelectedProductForModal(products[0]);
                    }}
                    className="px-3.5 py-1.5 bg-[#1A1816] text-[#FAF8F5] rounded-lg text-xs font-medium uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:bg-[#332E27] transition-all"
                  >
                    <span>Browse Fabric Collection</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-[#DED6CA]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConsultStylist();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything: e.g. 'How much yardage for a tall men\'s shalwar kameez?'"
              className="flex-1 bg-[#FFFFFF] border border-[#DED6CA] rounded-lg px-3 py-2 text-xs text-[#1A1816] placeholder-[#A09586] focus:outline-none focus:border-[#1A1816] font-medium"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#1A1816] text-[#FAF8F5] font-medium rounded-lg hover:bg-[#332E27] disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
