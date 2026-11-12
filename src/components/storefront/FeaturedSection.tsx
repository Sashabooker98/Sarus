/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Eye, Plus, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export const FeaturedSection: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const { products, setSelectedProductForModal, addToCart, setFilterCategory } = useStore();

  // Get products marked as featured, or top 4 active products if none explicitly marked
  const featuredProducts = products.filter((p) => p.status === 'active' && p.isFeatured);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts.slice(0, 4) : products.filter((p) => p.status === 'active').slice(0, 4);

  if (displayProducts.length === 0) return null;

  const handleBrowseAll = () => {
    setFilterCategory('all');
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="featured-section" className="py-16 sm:py-22 bg-[#F7F4EE] border-b border-[#DED6CA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with Monospaced Numbered Label + Vertical Line + Browse All Link */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#DED6CA]/70">
          <div className="flex items-start gap-4">
            {/* Vertical Accent Line on Left that Draws Itself */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-1 self-stretch bg-[#8A7864] origin-top rounded-full"
            />
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#8A7864] mb-1">
                <span>02. SIGNATURE PICKS</span>
                <span>✤</span>
                <span className="font-urdu normal-case text-xs tracking-normal" dir="rtl">
                  خصوصی فیبرکس
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1A1816]">
                Featured Fabrics
              </h2>
            </div>
          </div>

          {/* Browse all link on the right with sliding arrow */}
          <motion.button
            whileHover={{ x: 3 }}
            onClick={handleBrowseAll}
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1A1816] hover:text-[#8A7864] transition-colors cursor-pointer self-start md:self-end"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight size={15} className="text-[#8A7864] group-hover:translate-x-1.5 transition-transform duration-200" />
          </motion.button>
        </div>

        {/* Featured Products Grid with 60ms Staggered Entrance, 6px Hover Lift, Soft Glow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product, idx) => {
            const isAvailable = product.variants.some((v) => v.stockOnHand - v.stockReserved > 0) || (product.stock && product.stock > 0);
            const primaryImage = product.images?.[0]?.url || '/assets/aistudio/SARUS_Premium_Fabrics_Logo-removebg-preview_2b5db1d0.png';
            const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;

            return (
              <motion.div
                key={product.id}
                initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
                whileInView={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={
                  prefersReduced
                    ? {}
                    : {
                        y: -6,
                        transition: { duration: 0.25, ease: 'easeOut' },
                      }
                }
                className="group bg-[#FFFFFF] border border-[#DED6CA] hover:border-[#8A7864] rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-[0_14px_32px_-8px_rgba(138,120,100,0.3)] relative"
              >
                {/* Image */}
                <div
                  onClick={() => setSelectedProductForModal(product)}
                  className="aspect-[4/5] bg-[#EFE8DC] relative overflow-hidden cursor-pointer"
                >
                  <img
                    src={primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    <span className="px-2.5 py-0.5 bg-[#1A1816] text-[#FAF8F5] text-[10px] font-semibold uppercase tracking-wider rounded-full shadow-xs">
                      Featured
                    </span>
                    {product.salePrice && product.salePrice < product.price && (
                      <span className="px-2.5 py-0.5 bg-[#8A7864] text-[#FAF8F5] text-[10px] font-semibold uppercase tracking-wider rounded-full shadow-xs">
                        Special Offer
                      </span>
                    )}
                  </div>

                  {/* Stock status indicator */}
                  <div className="absolute bottom-3 right-3 bg-[#FFFFFF]/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-[#DED6CA] text-[10px] font-medium text-[#1A1816]">
                    {isAvailable ? 'In Stock' : 'Sold Out'}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#8A7864] font-semibold block mb-1">
                      {product.category}
                    </span>
                    <h3
                      onClick={() => setSelectedProductForModal(product)}
                      className="font-display text-lg font-medium text-[#1A1816] group-hover:text-[#8A7864] transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#685F54] line-clamp-2 mt-1">
                      {product.description || 'Premium grade yardage with exceptional hand-feel.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#DED6CA]/60 flex items-center justify-between">
                    <div>
                      {price && price > 0 ? (
                        <div className="flex items-baseline gap-2">
                          <span className="font-display text-lg font-semibold text-[#1A1816]">
                            Rs {price.toLocaleString()}
                          </span>
                          {product.salePrice && product.salePrice < product.price && (
                            <span className="text-xs text-[#8A7864] line-through">
                              Rs {product.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-[#8A7864] font-medium italic">Inquire for pricing</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedProductForModal(product)}
                        className="p-2 text-[#685F54] hover:text-[#1A1816] hover:bg-[#FAF8F5] rounded-full border border-[#DED6CA] transition-colors cursor-pointer"
                        title="View Fabric Specs"
                      >
                        <Eye size={15} />
                      </motion.button>
                      {isAvailable && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            const firstVariant = product.variants.find((v) => v.stockOnHand - v.stockReserved > 0) || product.variants[0];
                            if (firstVariant) {
                              addToCart(product.id, firstVariant.id, 1);
                            } else {
                              setSelectedProductForModal(product);
                            }
                          }}
                          className="btn-shine px-3 py-1.5 bg-[#1A1816] hover:bg-[#8A7864] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider rounded-md transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                          title="Quick Select"
                        >
                          <Plus size={13} />
                          <span>Select</span>
                        </motion.button>
                      )}
                    </div>
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
