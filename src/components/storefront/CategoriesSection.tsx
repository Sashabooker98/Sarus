/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export const CategoriesSection: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const { categoryItems, setFilterCategory, products } = useStore();

  const handleCategorySelect = (categoryName: string) => {
    setFilterCategory(categoryName);
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const visibleCategories = categoryItems.filter((c) => c.isVisible !== false);

  if (visibleCategories.length === 0) return null;

  return (
    <section id="categories-section" className="py-16 sm:py-22 bg-[#FAF8F5] border-b border-[#DED6CA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading: Monospaced Numbered Label + Large Serif + Vertical Accent Line + Browse All Link */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#DED6CA]/70">
          <div className="flex items-start gap-4">
            {/* Self-drawing vertical accent line on the left */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-1 self-stretch bg-[#8A7864] origin-top rounded-full"
            />
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#8A7864] mb-1">
                <span>01. FABRIC COLLECTIONS</span>
                <span>✤</span>
                <span className="font-urdu normal-case text-xs tracking-normal" dir="rtl">
                  کلیکشنز
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1A1816]">
                Curated Categories
              </h2>
            </div>
          </div>

          {/* Browse all link on the right with sliding arrow */}
          <motion.button
            whileHover={{ x: 3 }}
            onClick={() => handleCategorySelect('all')}
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1A1816] hover:text-[#8A7864] transition-colors cursor-pointer self-start md:self-end"
          >
            <span>Browse All Categories</span>
            <ArrowRight size={15} className="text-[#8A7864] group-hover:translate-x-1.5 transition-transform duration-200" />
          </motion.button>
        </div>

        {/* Category Cards: Dark/Brand-Colored with Item-Count Badge in Corner, Hover Lift 4px, Accent Border & Soft Glow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleCategories.map((cat, idx) => {
            const count = products.filter(
              (p) => p.category?.toLowerCase() === cat.name.toLowerCase() && p.status === 'active'
            ).length;

            return (
              <motion.div
                key={cat.id}
                initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
                whileInView={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                whileHover={
                  prefersReduced
                    ? {}
                    : {
                        y: -4,
                        transition: { duration: 0.25, ease: 'easeOut' },
                      }
                }
                onClick={() => handleCategorySelect(cat.name)}
                className="group bg-[#1E1B18] text-[#FAF8F5] border border-[#35302A] hover:border-[#8A7864] rounded-xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-[0_12px_28px_-6px_rgba(138,120,100,0.35)] relative"
              >
                {/* Visual Area with Authentic Label / Logo Artwork */}
                <div className="aspect-[4/3] bg-[#2A2622] relative overflow-hidden flex items-center justify-center p-6 border-b border-[#35302A]">
                  <img
                    src={cat.imageUrl || '/assets/aistudio/SARUS_Premium_Fabrics_Logo-removebg-preview_2b5db1d0.png'}
                    alt={cat.name}
                    className="w-full h-full object-contain group-hover:scale-106 transition-transform duration-500 ease-out brightness-95 group-hover:brightness-105"
                    loading="lazy"
                  />

                  {/* Corner Item-Count Badge */}
                  <div className="absolute top-3 right-3 bg-[#1A1816]/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-[#8A7864]/60 text-[10px] font-mono text-[#DED6CA] shadow-sm">
                    {count} Fabrics
                  </div>

                  {/* Corner Botanical Ornament */}
                  <div className="absolute bottom-2 left-3 text-xs text-[#8A7864]/50 pointer-events-none">
                    ✤
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col justify-between flex-1 bg-[#1E1B18]">
                  <div>
                    <h3 className="font-display text-xl font-medium text-[#FAF8F5] group-hover:text-[#C5B39C] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#A89E91] mt-1.5 leading-relaxed line-clamp-2">
                      {cat.description || 'Pure fabric selections calibrated for master bespoke tailoring.'}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-[#35302A] flex items-center justify-between text-xs font-semibold text-[#DED6CA] group-hover:text-[#FAF8F5] transition-colors">
                    <span className="tracking-[0.16em] uppercase text-[10px] text-[#8A7864] group-hover:text-[#DED6CA]">
                      Explore {cat.name}
                    </span>
                    <ArrowRight size={14} className="text-[#8A7864] group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
