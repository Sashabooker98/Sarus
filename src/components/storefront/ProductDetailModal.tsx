/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Heart,
  ShoppingBag,
  Check,
  Ruler,
} from 'lucide-react';
import { Product, ProductVariant } from '../../types/index.ts';
import { useStore } from '../../context/StoreContext.tsx';
import { getEmptyProductImagePlaceholder } from '../../data/mockData.ts';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForModal,
    setSelectedProductForModal,
    addToCart,
    toggleWishlist,
    isInWishlist,
    reviews,
    addProductReview,
    setIsSizeGuideOpen,
  } = useStore();

  const product = selectedProductForModal;

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'reviews'>('details');

  // Interactive review form states
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewFit, setNewReviewFit] = useState<'true_to_size' | 'boxy_oversized' | 'runs_small'>('true_to_size');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Group variants by color
  const colorVariants = useMemo(() => {
    if (!product || !product.variants) return [];
    if (!selectedColor) return product.variants;
    return product.variants.filter((v) => v.color.name === selectedColor);
  }, [product, selectedColor]);

  // Unique colors available
  const availableColors = useMemo(() => {
    if (!product || !product.variants) return [];
    const colorMap = new Map<string, { name: string; hex: string }>();
    product.variants.forEach((v) => {
      if (!colorMap.has(v.color.name)) {
        colorMap.set(v.color.name, v.color);
      }
    });
    return Array.from(colorMap.values());
  }, [product]);

  // Current active variant
  const activeVariant: ProductVariant | undefined = useMemo(() => {
    if (!product || !product.variants || product.variants.length === 0) return undefined;
    return (
      colorVariants.find((v) => v.size === selectedSize) ||
      colorVariants[0] ||
      product.variants[0]
    );
  }, [colorVariants, selectedSize, product]);

  const isFavorited = product ? isInWishlist(product.id) : false;
  const isPriced = Boolean(product && product.price !== null && product.price !== undefined && product.price > 0);
  const hasDiscount = Boolean(isPriced && product && product.salePrice && product.salePrice < product.price!);

  const availableStock = activeVariant
    ? Math.max(0, activeVariant.stockOnHand - activeVariant.stockReserved)
    : 0;

  const isSoldOut = !isPriced || availableStock <= 0;
  const isLowStock = isPriced && !isSoldOut && availableStock <= 4;

  const productReviews = product ? reviews.filter((r) => r.productId === product.id) : [];

  const primaryImage = product
    ? (product.images?.[selectedImageIndex]?.url?.trim() ||
       product.images?.[0]?.url?.trim() ||
       getEmptyProductImagePlaceholder(product.name))
    : '';

  const handleAddToCart = () => {
    if (!product || !isPriced) return;
    if (!activeVariant || isSoldOut) return;

    const res = addToCart(product.id, activeVariant.id, quantity);
    if (res.success) {
      setFeedbackMessage(`Added ${quantity} × ${product.name} to bag!`);
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setSelectedProductForModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdp-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#FFFFFF] text-[#1A1816] rounded-xs border border-[#DED6CA] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            {/* Top Accent Line */}
            <div className="h-1 bg-[#1A1816]" />

            {/* Close Button */}
            <button
              onClick={() => setSelectedProductForModal(null)}
              className="absolute top-4 right-4 z-30 p-2 bg-[#FFFFFF] border border-[#DED6CA] rounded-full text-[#685F54] hover:text-[#1A1816] hover:border-[#1A1816] transition-colors cursor-pointer shadow-xs"
              aria-label="Close product view"
            >
              <X size={18} />
            </button>

        <div className="overflow-y-auto p-4 sm:p-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Gallery Column */}
            <div className="md:col-span-6 space-y-4">
              <div className="relative aspect-[4/5] bg-[#EFE8DC] rounded-xs overflow-hidden border border-[#DED6CA]">
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {isLowStock && (
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-[#8A7864] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-xs shadow-xs">
                    Only {availableStock} yards / lengths available
                  </span>
                )}
                {!isPriced && (
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-[#FFFFFF] border border-[#DED6CA] text-[#685F54] text-xs font-medium uppercase tracking-wider rounded-xs shadow-xs">
                    Price Pending · Admin Ready
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-20 rounded-xs overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        selectedImageIndex === idx ? 'border-[#1A1816]' : 'border-[#DED6CA] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details & Selection Column */}
            <div className="md:col-span-6 space-y-5">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-[#8A7864] font-medium tracking-[0.2em] uppercase mb-1">
                  <span>{product.audience}</span>
                  <span>·</span>
                  <span>{product.category || 'Fabric'}</span>
                  {product.productSku && (
                    <>
                      <span>·</span>
                      <span className="font-mono text-[10px]">{product.productSku}</span>
                    </>
                  )}
                </div>

                <h1 id="pdp-title" className="font-display text-2xl sm:text-3xl font-normal text-[#1A1816]">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-2 tabular-nums">
                  {isPriced ? (
                    hasDiscount ? (
                      <>
                        <span className="font-bold text-2xl text-[#1A1816]">
                          Rs {product.salePrice?.toLocaleString()}
                        </span>
                        <span className="text-sm text-[#8A7E72] line-through">
                          Rs {product.price.toLocaleString()}
                        </span>
                        <span className="px-2 py-0.5 bg-[#1A1816] text-[#F7F4EE] text-xs font-semibold uppercase rounded-xs">
                          Save Rs {(product.price - product.salePrice!).toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-2xl text-[#1A1816]">
                        Rs {product.price.toLocaleString()}
                      </span>
                    )
                  ) : (
                    <span className="text-xs font-medium text-[#8A7864] uppercase tracking-wider">
                      Price Unset / Pending Administrator Configuration
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#685F54] leading-relaxed">
                {product.description || 'Authentic pure fabric textile curated for contemporary South Asian apparel. Soft handle, refined drape, and breathable weave structure.'}
              </p>

              {/* Color Selector */}
              {availableColors.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#DED6CA]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold uppercase tracking-wider text-[#1A1816]">
                      Shade / Color: <span className="text-[#8A7864]">{selectedColor || activeVariant?.color.name}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((c) => {
                      const isSel = (selectedColor || activeVariant?.color.name) === c.name;
                      return (
                        <button
                          key={c.name}
                          onClick={() => {
                            setSelectedColor(c.name);
                            setSelectedSize(null);
                          }}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xs text-xs font-medium border transition-all cursor-pointer ${
                            isSel
                              ? 'border-[#1A1816] bg-[#1A1816] text-[#F7F4EE]'
                              : 'border-[#DED6CA] bg-[#FFFFFF] text-[#685F54] hover:border-[#1A1816]'
                          }`}
                        >
                          <span
                            style={{ backgroundColor: c.hex }}
                            className="w-3.5 h-3.5 rounded-full border border-black/20 inline-block"
                          />
                          <span>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cut / Length / Size Selector */}
              {colorVariants.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#DED6CA]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold uppercase tracking-wider text-[#1A1816]">
                      Fabric Cut / Size: <span className="text-[#8A7864]">{selectedSize || activeVariant?.size}</span>
                    </span>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs text-[#8A7864] hover:text-[#1A1816] flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Ruler size={13} />
                      <span>Yardage Guide</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {colorVariants.map((v) => {
                      const stock = Math.max(0, v.stockOnHand - v.stockReserved);
                      const isVariantSoldOut = stock <= 0;
                      const isSelected = (selectedSize || activeVariant?.size) === v.size;

                      return (
                        <button
                          key={v.id}
                          disabled={isVariantSoldOut}
                          onClick={() => setSelectedSize(v.size)}
                          className={`py-2 px-2 text-xs font-medium rounded-xs border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#1A1816] text-[#F7F4EE] border-[#1A1816] shadow-xs'
                              : isVariantSoldOut
                              ? 'bg-[#EFE8DC]/50 border-[#DED6CA] text-[#8A7E72]/40 cursor-not-allowed line-through'
                              : 'bg-[#FFFFFF] border-[#DED6CA] text-[#1A1816] hover:border-[#1A1816]'
                          }`}
                        >
                          {v.size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#DED6CA] space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  {isPriced && !isSoldOut && (
                    <div className="flex items-center border border-[#DED6CA] rounded-xs bg-[#FFFFFF]">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 text-xs font-medium hover:bg-[#EFE8DC] text-[#1A1816] cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 py-2 text-xs font-semibold tabular-nums min-w-[30px] text-center text-[#1A1816]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                        disabled={quantity >= availableStock}
                        className="px-3 py-2 text-xs font-medium hover:bg-[#EFE8DC] text-[#1A1816] disabled:opacity-30 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  )}

                  {/* Add to Bag Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isSoldOut || !isPriced}
                    className="flex-1 py-3 px-6 bg-[#1A1816] hover:bg-[#35302A] text-[#F7F4EE] font-medium text-xs uppercase tracking-[0.2em] rounded-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <ShoppingBag size={15} />
                    <span>
                      {!isPriced
                        ? 'Unavailable (Price Pending)'
                        : isSoldOut
                        ? 'Sold Out'
                        : `Add to Bag · Rs ${((product.salePrice ?? product.price ?? 0) * quantity).toLocaleString()}`}
                    </span>
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-3 bg-[#FFFFFF] border border-[#DED6CA] hover:border-[#1A1816] rounded-xs text-[#1A1816] transition-colors cursor-pointer"
                    aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart size={18} className={isFavorited ? 'fill-red-600 text-red-600' : ''} />
                  </button>
                </div>

                {feedbackMessage && (
                  <div className="p-2.5 bg-[#EFE8DC] border border-[#DED6CA] text-[#1A1816] text-xs font-medium rounded-xs flex items-center gap-2 animate-in fade-in">
                    <Check size={14} className="text-[#8A7864]" />
                    <span>{feedbackMessage}</span>
                  </div>
                )}
              </div>

              {/* Fabric Specs & Tabs */}
              <div className="pt-4 border-t border-[#DED6CA]">
                <div className="flex border-b border-[#DED6CA] text-xs font-medium uppercase tracking-[0.15em]">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2 px-3 transition-colors cursor-pointer ${
                      activeTab === 'details'
                        ? 'border-b-2 border-[#1A1816] text-[#1A1816] font-semibold'
                        : 'text-[#685F54] hover:text-[#1A1816]'
                    }`}
                  >
                    Fabric & Weave
                  </button>
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`pb-2 px-3 transition-colors cursor-pointer ${
                      activeTab === 'care'
                        ? 'border-b-2 border-[#1A1816] text-[#1A1816] font-semibold'
                        : 'text-[#685F54] hover:text-[#1A1816]'
                    }`}
                  >
                    Washing & Care
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2 px-3 transition-colors cursor-pointer ${
                      activeTab === 'reviews'
                        ? 'border-b-2 border-[#1A1816] text-[#1A1816] font-semibold'
                        : 'text-[#685F54] hover:text-[#1A1816]'
                    }`}
                  >
                    Reviews ({productReviews.length})
                  </button>
                </div>

                <div className="py-3 text-xs text-[#685F54] leading-relaxed">
                  {activeTab === 'details' && (
                    <div className="space-y-2">
                      <p>
                        <strong className="text-[#1A1816]">Weave Specification:</strong> {product.fabric || '100% Pure Combed Cotton Weave'}
                      </p>
                      <p>
                        <strong className="text-[#1A1816]">Drape / Finish:</strong> {product.fit || 'Structured natural drape with smooth breathable finish'}
                      </p>
                    </div>
                  )}

                  {activeTab === 'care' && (
                    <ul className="list-disc pl-4 space-y-1">
                      {product.careInstructions && product.careInstructions.length > 0 ? (
                        product.careInstructions.map((c, i) => <li key={i}>{c}</li>)
                      ) : (
                        <>
                          <li>Gentle wash in cold water with mild detergent</li>
                          <li>Line dry in shaded natural breeze to preserve fabric luster</li>
                          <li>Warm iron on reverse side while slightly damp</li>
                        </>
                      )}
                    </ul>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#DED6CA]">
                        <span className="font-semibold text-[#1A1816] uppercase text-xs">
                          Customer Feedback
                        </span>
                        <button
                          onClick={() => setIsWritingReview(!isWritingReview)}
                          className="px-2.5 py-1 bg-[#1A1816] text-[#F7F4EE] text-[11px] font-medium uppercase tracking-wider rounded-xs cursor-pointer hover:bg-[#35302A] transition-colors"
                        >
                          {isWritingReview ? 'Cancel' : '+ Write Review'}
                        </button>
                      </div>

                      {/* Interactive Review Form */}
                      {isWritingReview && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;
                            addProductReview({
                              productId: product.id,
                              author: newReviewAuthor.trim(),
                              city: newReviewCity.trim() || 'Pakistan',
                              rating: newReviewRating,
                              fitExperience: newReviewFit,
                              fabricQuality: newReviewRating,
                              comment: newReviewComment.trim(),
                            });
                            setIsWritingReview(false);
                            setNewReviewAuthor('');
                            setNewReviewComment('');
                          }}
                          className="p-3 bg-[#F7F4EE] rounded-xs border border-[#DED6CA] space-y-2.5 text-xs"
                        >
                          <span className="font-semibold text-[#1A1816] uppercase text-[11px] block">
                            Write Client Feedback
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-medium text-[#685F54] mb-0.5">Your Name *</label>
                              <input
                                type="text"
                                required
                                value={newReviewAuthor}
                                onChange={(e) => setNewReviewAuthor(e.target.value)}
                                placeholder="e.g. Tariq"
                                className="w-full p-1.5 bg-[#FFFFFF] border border-[#DED6CA] text-[#1A1816] rounded-xs text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-medium text-[#685F54] mb-0.5">City</label>
                              <input
                                type="text"
                                value={newReviewCity}
                                onChange={(e) => setNewReviewCity(e.target.value)}
                                placeholder="e.g. Lahore / Sadiqabad"
                                className="w-full p-1.5 bg-[#FFFFFF] border border-[#DED6CA] text-[#1A1816] rounded-xs text-xs"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-[#685F54] mb-0.5">Fabric Quality Rating</label>
                            <select
                              value={newReviewRating}
                              onChange={(e) => setNewReviewRating(Number(e.target.value))}
                              className="w-full p-1.5 bg-[#FFFFFF] border border-[#DED6CA] text-[#1A1816] rounded-xs text-xs"
                            >
                              <option value={5}>5 Stars - Exquisite Purity & Drape</option>
                              <option value={4}>4 Stars - Great Fabric</option>
                              <option value={3}>3 Stars - Average Quality</option>
                              <option value={2}>2 Stars - Below Expectation</option>
                              <option value={1}>1 Star - Unsatisfactory</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-[#685F54] mb-0.5">Review Details *</label>
                            <textarea
                              rows={3}
                              required
                              value={newReviewComment}
                              onChange={(e) => setNewReviewComment(e.target.value)}
                              placeholder="Describe the fabric texture, breathability, and feel..."
                              className="w-full p-1.5 bg-[#FFFFFF] border border-[#DED6CA] text-[#1A1816] rounded-xs text-xs"
                            />
                          </div>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#1A1816] text-[#F7F4EE] font-medium uppercase tracking-wider rounded-xs text-xs hover:bg-[#35302A]"
                          >
                            Submit Review
                          </button>
                        </form>
                      )}

                      {/* Display reviews or exact requested empty state */}
                      {productReviews.length > 0 ? (
                        <div className="space-y-2">
                          {productReviews.map((r) => (
                            <div key={r.id} className="p-3 bg-[#FFFFFF] border border-[#DED6CA] rounded-xs space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-[#1A1816]">{r.author}</span>
                                <span className="text-[10px] text-[#8A7864]">{r.city}</span>
                              </div>
                              <p className="text-xs text-[#685F54]">{r.comment}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-xs text-[#685F54] border border-[#DED6CA] rounded-xs bg-[#F7F4EE]">
                          <p className="font-semibold text-[#1A1816] uppercase">No Reviews Yet</p>
                          <p className="text-[11px] text-[#8A7864] mt-1">Be the first client to leave authentic feedback for this fabric.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
