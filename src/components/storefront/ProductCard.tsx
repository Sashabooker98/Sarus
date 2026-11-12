/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Plus, Eye, Check } from 'lucide-react';
import { Product } from '../../types/index.ts';
import { useStore } from '../../context/StoreContext.tsx';
import { getEmptyProductImagePlaceholder } from '../../data/mockData.ts';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { setSelectedProductForModal, toggleWishlist, isInWishlist, addToCart } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  // Calculate overall availability across variants
  const totalAvailable = product.variants.reduce(
    (sum, v) => sum + Math.max(0, v.stockOnHand - v.stockReserved),
    0
  );

  const isSoldOut = totalAvailable <= 0;
  const isLowStock = !isSoldOut && totalAvailable <= 5;

  const isPriced = product.price !== null && product.price !== undefined && product.price > 0;
  const hasDiscount = isPriced && product.salePrice && product.salePrice < product.price!;
  const discountPercent = hasDiscount && product.price
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  // Primary image fallback to light-mode botanical placeholder if empty or not uploaded
  const primaryImage = product.images?.[0]?.url?.trim()
    ? product.images[0].url
    : getEmptyProductImagePlaceholder(product.name || 'SARUS Fabric');

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPriced) {
      setSelectedProductForModal(product);
      return;
    }
    const firstAvailable = product.variants.find((v) => v.stockOnHand - v.stockReserved > 0);
    if (firstAvailable) {
      addToCart(product.id, firstAvailable.id, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1400);
    } else {
      setSelectedProductForModal(product);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 12) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      onClick={() => setSelectedProductForModal(product)}
      className="group flex flex-col bg-[#FFFFFF] border border-[#DED6CA] hover:border-[#8A7864] rounded-xl overflow-hidden transition-all duration-300 cursor-pointer shadow-xs hover:shadow-[0_14px_32px_-8px_rgba(138,120,100,0.3)] relative"
    >
      {/* 4:5 Aspect Ratio Image Container */}
      <div className="relative aspect-[4/5] bg-[#EFE8DC] overflow-hidden">
        <img
          src={primaryImage}
          alt={product.images?.[0]?.alt || product.name}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Wishlist Button with Heart Pop (Scale Bounce) */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#FFFFFF]/90 backdrop-blur-xs border border-[#DED6CA] hover:border-[#8A7864] flex items-center justify-center text-[#1A1816] hover:text-red-600 transition-all cursor-pointer shadow-xs z-10"
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <motion.div
            key={isFavorited ? 'fav' : 'unfav'}
            animate={isFavorited ? { scale: [1, 1.45, 0.85, 1.15, 1] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Heart size={15} className={isFavorited ? 'fill-red-600 text-red-600' : ''} />
          </motion.div>
        </motion.button>

        {/* Stock, Discount and NEW Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isFeatured && (
            <span className="px-2 py-0.5 bg-[#1A1816] text-[#F7F4EE] text-[9px] font-semibold uppercase tracking-wider rounded-xs shadow-xs">
              NEW
            </span>
          )}

          {isSoldOut ? (
            <span className="px-2 py-0.5 bg-[#1A1816]/90 text-[#F7F4EE] text-[10px] font-semibold uppercase tracking-wider rounded-xs">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 bg-[#8A7864] text-[#FFFFFF] text-[10px] font-semibold uppercase tracking-wider rounded-xs">
              Limited Yards
            </span>
          ) : null}

          {hasDiscount && (
            <span className="px-2 py-0.5 bg-[#8A7864] text-[#FAF8F5] text-[10px] font-semibold uppercase tracking-wider rounded-xs shadow-xs">
              -{discountPercent}%
            </span>
          )}

          {!isPriced && (
            <span className="px-2 py-0.5 bg-[#FFFFFF]/95 border border-[#DED6CA] text-[#685F54] text-[10px] font-medium uppercase tracking-wider rounded-xs shadow-xs">
              Price Pending
            </span>
          )}
        </div>

        {/* Added to Bag Toast Pill overlay */}
        <AnimatePresence>
          {justAdded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-[#1A1816]/75 backdrop-blur-xs flex flex-col items-center justify-center text-[#FAF8F5] z-20 gap-1.5 pointer-events-none"
            >
              <div className="w-9 h-9 rounded-full bg-[#8A7864] flex items-center justify-center text-[#FAF8F5]">
                <Check size={18} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest">Added to Bag</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add to Cart / Quick Select Button: Slides up on desktop hover, brightens to accent */}
        {!isSoldOut && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleQuickAdd}
            className="btn-shine absolute bottom-2.5 left-2.5 right-2.5 py-2.5 px-3 bg-[#1A1816] hover:bg-[#8A7864] text-[#F7F4EE] hover:text-[#FAF8F5] text-xs font-medium uppercase tracking-wider rounded-xs opacity-95 sm:opacity-0 sm:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md cursor-pointer z-10"
          >
            {isPriced ? (
              <>
                <Plus size={14} />
                <span>Add to Cart</span>
              </>
            ) : (
              <>
                <Eye size={14} />
                <span>View Fabric Specs</span>
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2 bg-[#FFFFFF]">
        <div>
          {/* Zero-Pill Clean Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#8A7864] uppercase tracking-wider font-medium mb-1">
            <span>{product.audience}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category || 'Fabric'}</span>
          </div>

          <h3 className="font-display text-base sm:text-lg font-medium text-[#1A1816] leading-snug line-clamp-1 group-hover:text-[#8A7864] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Pricing Block with Pakistani Rupees format */}
        <div className="pt-2 border-t border-[#DED6CA]/60 flex items-baseline justify-between">
          <div>
            {isPriced ? (
              <div className="flex items-baseline gap-2">
                <span className="font-display text-base sm:text-lg font-semibold text-[#1A1816]">
                  Rs {product.salePrice && product.salePrice > 0 ? product.salePrice.toLocaleString() : product.price!.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-[#8A7864] line-through font-normal">
                    Rs {product.price!.toLocaleString()}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs text-[#8A7864] font-medium italic">
                Inquire on WhatsApp
              </span>
            )}
          </div>

          {/* Quick Yardage indicator */}
          <span className="text-[10px] text-[#685F54] font-mono uppercase tracking-wider">
            {product.variants?.[0]?.size ? `${product.variants[0].size}` : '4.5m suit'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
