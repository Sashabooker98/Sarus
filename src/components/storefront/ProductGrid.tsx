/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, X, ArrowUpDown, PlusCircle, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { ProductCard } from './ProductCard.tsx';

// Elegant skeleton card with subtle shimmering weave effect
const SkeletonCard: React.FC = () => (
  <div className="flex flex-col bg-[#FFFFFF] border border-[#DED6CA] rounded-xl overflow-hidden shadow-xs animate-pulse">
    <div className="relative aspect-[4/5] bg-gradient-to-br from-[#EFE8DC] via-[#FAF8F5] to-[#EFE8DC]" />
    <div className="p-3.5 sm:p-4 space-y-2.5">
      <div className="h-3 w-1/3 bg-[#EFE8DC] rounded-xs" />
      <div className="h-5 w-4/5 bg-[#EFE8DC] rounded-xs" />
      <div className="pt-2 border-t border-[#DED6CA]/40 flex justify-between items-center">
        <div className="h-4 w-1/3 bg-[#EFE8DC] rounded-xs" />
        <div className="h-3 w-1/4 bg-[#EFE8DC] rounded-xs" />
      </div>
    </div>
  </div>
);

export const ProductGrid: React.FC = () => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    filterAudience,
    setFilterAudience,
    filterSeason,
    setFilterSeason,
    filterCategory,
    setFilterCategory,
    categories,
    setIsAdminMode,
    setIsAdminLoginModalOpen,
    isAdminAuthenticated,
  } = useStore();

  const [sortOption, setSortOption] = useState<'newest' | 'price_asc' | 'price_desc' | 'discount'>('newest');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Briefly trigger transition shimmer when filters change
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 220);
    return () => clearTimeout(timer);
  }, [filterCategory, filterSeason, filterAudience, inStockOnly, sortOption]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (p.status !== 'active') return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const qWords = q.split(/\s+/).filter(Boolean);

          const matchName = p.name?.toLowerCase().includes(q);
          const matchCategory = p.category?.toLowerCase().includes(q);
          const matchSku = p.productSku?.toLowerCase().includes(q);
          const matchFabric = p.fabric?.toLowerCase().includes(q);
          const matchFit = p.fit?.toLowerCase().includes(q);
          const matchDescription = p.description?.toLowerCase().includes(q);
          const matchTag = p.tags?.some((t) => t.toLowerCase().includes(q) || q.includes(t.toLowerCase()));
          const matchKeyword = p.keywords?.some((k) => k.toLowerCase().includes(q) || q.includes(k.toLowerCase()));

          const searchableText = `${p.name} ${p.category} ${p.fabric} ${p.fit} ${p.description} ${p.productSku} ${(p.tags || []).join(' ')} ${(p.keywords || []).join(' ')}`.toLowerCase();
          const matchAllWords = qWords.every((w) => searchableText.includes(w));

          if (!matchName && !matchCategory && !matchSku && !matchFabric && !matchFit && !matchDescription && !matchTag && !matchKeyword && !matchAllWords) {
            return false;
          }
        }

        // Audience
        if (filterAudience !== 'all' && p.audience !== filterAudience && p.audience !== 'unisex') {
          return false;
        }

        // Season
        if (filterSeason !== 'all' && p.season !== filterSeason && p.season !== 'all_season') {
          return false;
        }

        // Category
        if (filterCategory !== 'all' && p.category?.toLowerCase() !== filterCategory.toLowerCase()) {
          return false;
        }

        // In stock only
        if (inStockOnly) {
          const avail = p.variants?.reduce((s, v) => s + Math.max(0, v.stockOnHand - v.stockReserved), 0) ?? 0;
          if (avail <= 0) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'price_asc') {
          const pA = a.salePrice ?? a.price ?? 0;
          const pB = b.salePrice ?? b.price ?? 0;
          return pA - pB;
        }
        if (sortOption === 'price_desc') {
          const pA = a.salePrice ?? a.price ?? 0;
          const pB = b.salePrice ?? b.price ?? 0;
          return pB - pA;
        }
        if (sortOption === 'discount') {
          const dA = a.salePrice && a.price ? a.price - a.salePrice : 0;
          const dB = b.salePrice && b.price ? b.price - b.salePrice : 0;
          return dB - dA;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, searchQuery, filterAudience, filterSeason, filterCategory, inStockOnly, sortOption]);

  const hasActiveFilters =
    filterAudience !== 'all' ||
    filterSeason !== 'all' ||
    filterCategory !== 'all' ||
    inStockOnly ||
    searchQuery.trim().length > 0;

  const resetAllFilters = () => {
    setFilterAudience('all');
    setFilterSeason('all');
    setFilterCategory('all');
    setInStockOnly(false);
    setSearchQuery('');
  };

  const handleOpenAdminAddProduct = () => {
    if (!isAdminAuthenticated) {
      setIsAdminLoginModalOpen(true);
    } else {
      setIsAdminMode(true);
    }
  };

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header with Monospaced Numbered Label + Vertical Line + Browse All Link */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#DED6CA]"
      >
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
              <span>03. FABRIC ARCHIVE</span>
              <span>✤</span>
              <span className="font-urdu normal-case text-xs tracking-normal" dir="rtl">
                فیبرک کیٹلاگ
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1A1816]">
              Curated Collections & Textiles
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-[#FFFFFF] border border-[#DED6CA] text-[#1A1816] rounded-xs text-xs font-medium cursor-pointer shadow-xs"
          >
            <SlidersHorizontal size={14} className="text-[#8A7864]" />
            <span>Filters</span>
          </button>

          {/* Sort Control */}
          <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#DED6CA] rounded-xs px-3 py-1.5 text-xs font-medium shadow-xs">
            <ArrowUpDown size={14} className="text-[#8A7864]" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="bg-transparent border-none outline-none focus:ring-0 text-[#1A1816] cursor-pointer text-xs"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="discount">Special Offers</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Interactive Filter Bars */}
      <div className="py-5 space-y-3">
        {/* Season & Audience tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Season Selector */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EFE8DC] border border-[#DED6CA] rounded-md shadow-xs">
            {[
              { id: 'all', label: 'All Seasons' },
              { id: 'summer', label: 'Summer Lightweight' },
              { id: 'winter', label: 'Winter Warmth' },
              { id: 'all_season', label: 'All-Season Weaves' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterSeason(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-all cursor-pointer whitespace-nowrap ${
                  filterSeason === tab.id
                    ? 'bg-[#FFFFFF] text-[#1A1816] font-semibold shadow-xs'
                    : 'text-[#685F54] hover:text-[#1A1816]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Audience Selector */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EFE8DC] border border-[#DED6CA] rounded-md shadow-xs">
            {[
              { id: 'all', label: 'All Wear' },
              { id: 'men', label: "Men's Fabric" },
              { id: 'women', label: "Women's Fabric" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterAudience(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-all cursor-pointer whitespace-nowrap ${
                  filterAudience === tab.id
                    ? 'bg-[#FFFFFF] text-[#1A1816] font-semibold shadow-xs'
                    : 'text-[#685F54] hover:text-[#1A1816]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* In Stock Only Checkbox */}
          <label className="flex items-center gap-2 text-xs font-medium text-[#1A1816] cursor-pointer select-none bg-[#FFFFFF] px-3 py-1.5 border border-[#DED6CA] rounded hover:border-[#1A1816] transition-colors shadow-xs">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded border-[#DED6CA] text-[#1A1816] focus:ring-0"
            />
            <span>In-Stock Only</span>
          </label>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {categories.map((cat) => {
            const isAll = cat === 'All Collections' || cat === 'All Fabrics';
            const isSelected = (filterCategory === 'all' && isAll) || filterCategory.toLowerCase() === cat.toLowerCase();
            return (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.96 }}
                onClick={() => setFilterCategory(isAll ? 'all' : cat)}
                className={`px-4 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1A1816] text-[#F7F4EE] border-[#1A1816] font-semibold shadow-xs'
                    : 'bg-[#FFFFFF] text-[#685F54] border-[#DED6CA] hover:border-[#1A1816] hover:text-[#1A1816]'
                }`}
              >
                {cat}
              </motion.button>
            );
          })}
        </div>

        {/* Quick Search Keyword Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-[#8A7864] font-medium text-[11px] uppercase tracking-wider mr-1">Trending Tags:</span>
          {[
            'Egyptian Giza Cotton',
            'Crisp White Latha',
            'Handloom Karandi',
            'Belgian Linen',
            'Festive Raw Silk',
            'Merino Wool',
            'Summer Lawn 3-Piece',
            'Kamalia Khaddar',
          ].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSearchQuery(tag);
                setFilterCategory('all');
              }}
              className={`px-2.5 py-0.5 rounded-full border text-[11px] font-medium transition-colors cursor-pointer ${
                searchQuery.toLowerCase() === tag.toLowerCase()
                  ? 'bg-[#1A1816] text-[#F7F4EE] border-[#1A1816]'
                  : 'bg-[#FAF8F5] text-[#685F54] border-[#DED6CA] hover:border-[#8A7864] hover:text-[#1A1816]'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Active Filter Indicators & Count */}
        <div className="flex items-center justify-between text-xs text-[#685F54] pt-2">
          <p>
            Showing <span className="font-bold text-[#1A1816] tabular-nums">{filteredProducts.length}</span> fabric selections
            {searchQuery && <span> for "{searchQuery}"</span>}
          </p>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-xs font-medium text-[#8A7864] hover:text-[#1A1816] cursor-pointer"
            >
              <X size={13} />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Grid or Skeleton Shimmer or Clean Empty State */}
      {isTransitioning ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Clean empty state for authentic brand catalog */
        <div className="text-center py-16 px-4 bg-[#FFFFFF] border border-[#DED6CA] rounded-sm my-8 max-w-2xl mx-auto shadow-sm">
          {/* Brand Ornament */}
          <div className="w-14 h-14 rounded-full bg-[#F7F4EE] border border-[#DED6CA] text-[#8A7864] flex items-center justify-center mx-auto mb-4">
            <span className="text-xl">✤</span>
          </div>

          <span className="text-[11px] font-sans tracking-[0.25em] text-[#8A7864] uppercase font-semibold block mb-1">
            CRAFTED WITH CARE · MADE TO INSPIRE
          </span>

          <h3 className="font-display text-2xl sm:text-3xl font-normal text-[#1A1816]">
            No Fabrics Added Yet
          </h3>

          <p className="text-sm text-[#685F54] max-w-md mx-auto mt-2.5 mb-6 leading-relaxed">
            The SARUS storefront is prepared for your genuine fabric collections. All demo products and placeholder data have been purged. Add your original fabrics, lengths, prices, and upload authentic photographs via the Admin Portal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleOpenAdminAddProduct}
              className="btn-shine px-6 py-3 bg-[#1A1816] hover:bg-[#35302A] text-[#F7F4EE] font-medium text-xs uppercase tracking-[0.2em] rounded transition-all cursor-pointer shadow-sm flex items-center gap-2"
            >
              <PlusCircle size={15} />
              <span>Add Fabrics via Admin Portal</span>
            </motion.button>
          </div>

          <p className="text-[11px] text-[#8A7864] mt-5 font-mono">
            SARUS Premium Fabrics // Sadiqabad, Punjab, Pakistan
          </p>
        </div>
      ) : (
        /* Filter returned 0 results */
        <div className="text-center py-16 bg-[#FFFFFF] border border-[#DED6CA] rounded-sm my-6">
          <p className="font-display text-xl font-normal text-[#1A1816]">No fabrics match your active filters</p>
          <p className="text-xs text-[#685F54] max-w-sm mx-auto mt-2 mb-6">
            Try adjusting your weave category, season, or search keywords.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={resetAllFilters}
            className="btn-shine px-5 py-2.5 bg-[#1A1816] text-[#F7F4EE] font-medium text-xs uppercase tracking-wider rounded hover:bg-[#35302A] cursor-pointer"
          >
            Reset Filters
          </motion.button>
        </div>
      )}
    </section>
  );
};
