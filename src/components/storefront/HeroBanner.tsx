/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Search,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { POPULAR_SEARCH_KEYWORDS } from '../../data/mockData.ts';
import { STORE_CONTACT, buildWhatsAppLink } from '../../config/storeContact.ts';

interface HeroSlide {
  id: string;
  badge: string;
  urduBadge: string;
  firstWord: string;
  accentWord: string;
  subtitle: string;
  category: string;
  tag: string;
  image: string;
  ctaText: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-giza',
    badge: 'ROYAL EGYPTIAN GIZA',
    urduBadge: 'مصری گیزا کاٹن',
    firstWord: 'Timeless',
    accentWord: 'Elegance.',
    subtitle:
      'Extra-long staple Egyptian Giza yarns woven for a silken hand-feel, understated lustre, and all-season breathability.',
    category: 'Cotton',
    tag: '4.5m Bespoke Cut',
    image: '/assets/aistudio/Minimalist_Sarus_Premium_Fabrics_Label_9e7661c8.png',
    ctaText: 'Explore Egyptian Cotton',
  },
  {
    id: 'slide-karandi',
    badge: 'HERITAGE WINTER WEAVES',
    urduBadge: 'ہینڈلوم کرنڈی',
    firstWord: 'Artisanal',
    accentWord: 'Karandi.',
    subtitle:
      'Artisanal handloom winter karandi featuring rich slub textures that trap natural warmth with bespoke tailoring structure.',
    category: 'Winter Weaves',
    tag: 'Pure Handloom',
    image: '/assets/aistudio/SARUS_Premium_Fabric_Label_7e6c150f.png',
    ctaText: 'Explore Winter Weaves',
  },
  {
    id: 'slide-silk',
    badge: 'FESTIVE PURE SILK',
    urduBadge: 'خالص را سِلک',
    firstWord: 'Opulent',
    accentWord: 'Festivity.',
    subtitle:
      '100% pure mulberry raw silk unstitched yardage celebrating South Asian ceremonial heritage and refined drape.',
    category: 'Formal Fabrics',
    tag: 'Celebratory Lustre',
    image: '/assets/aistudio/Minimal_Urdu_Botanical_Label_4b635bb9.png',
    ctaText: 'Explore Formal Fabrics',
  },
  {
    id: 'slide-linen',
    badge: 'SUMMER LAWN & BELGIAN LINEN',
    urduBadge: 'آرگینک لینن و لان',
    firstWord: 'Bespoke',
    accentWord: 'Simplicity.',
    subtitle:
      'Crisp compact white latha, certified Belgian flax linen, and combed 80s Swiss lawn calibrated for cool everyday luxury.',
    category: 'Premium Fabrics',
    tag: 'Organic Comfort',
    image: '/assets/aistudio/Minimalist_Sarus_Premium_Fabrics_Label_9e7661c8.png',
    ctaText: 'Explore Pure Linens',
  },
];

export const HeroBanner: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const {
    setFilterSeason,
    setFilterAudience,
    setFilterCategory,
    setIsStylistOpen,
    searchQuery,
    setSearchQuery,
    settings,
  } = useStore();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const touchStartX = useRef<number | null>(null);
  const autoPlayTimer = useRef<number | null>(null);

  const totalSlides = HERO_SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-advance every 5 seconds, pausing on hover and background tab
  useEffect(() => {
    if (isPaused) return;

    autoPlayTimer.current = window.setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isPaused, nextSlide]);

  // Pause when browser tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Keyboard navigation with Arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;

    if (deltaX > 45) {
      prevSlide();
    } else if (deltaX < -45) {
      nextSlide();
    }
    touchStartX.current = null;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeywordSelect = (keyword: string) => {
    setLocalSearch(keyword);
    setSearchQuery(keyword);
    setFilterCategory('all');
    setFilterAudience('all');
    setFilterSeason('all');
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSlideExplore = (category: string) => {
    setFilterCategory(category);
    setFilterAudience('all');
    setFilterSeason('all');
    setSearchQuery('');
    setLocalSearch('');
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const activeSlideData = HERO_SLIDES[currentSlide];

  return (
    <section
      id="hero-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative bg-[#F7F4EE] text-[#1A1816] overflow-hidden border-b border-[#DED6CA] min-h-[560px] sm:min-h-[620px] flex flex-col justify-between select-none"
    >
      {/* Background Ambience with Ken Burns Zoom */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          key={`bg-${activeSlideData.id}`}
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: prefersReduced ? 1 : 1.08, opacity: 0.28 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 5, ease: 'easeOut' }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${activeSlideData.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F4EE]/90 via-[#F7F4EE]/70 to-[#F7F4EE]" />
      </div>

      {/* Main Content Area */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-14 sm:pb-12 text-center z-10 flex-1 flex flex-col justify-center">
        {/* Animated Slide Elements with Staggered Left Slide-In */}
        <AnimatePresence mode="wait">
          <div key={activeSlideData.id} className="space-y-4 sm:space-y-6">
            {/* 1. Badge */}
            <motion.div
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -25 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFFFFF] rounded-full text-xs font-medium tracking-[0.22em] text-[#8A7864] border border-[#DED6CA] shadow-2xs uppercase"
            >
              <Sparkles size={12} className="text-[#8A7864]" />
              <span>{activeSlideData.badge}</span>
              <span className="text-[10px]">✤</span>
              <span className="font-urdu normal-case text-xs tracking-normal" dir="rtl">
                {activeSlideData.urduBadge}
              </span>
            </motion.div>

            {/* 2. Headline with Accent-Colored Second Word */}
            <motion.h1
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -30 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 25 }}
              transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#1A1816] leading-[1.08] max-w-4xl mx-auto"
            >
              <span>{activeSlideData.firstWord} </span>
              <span className="italic font-normal text-[#8A7864]">{activeSlideData.accentWord}</span>
            </motion.h1>

            {/* 3. Self-drawing center divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="flex items-center justify-center gap-3 max-w-xs mx-auto py-1 origin-center"
            >
              <div className="h-[1px] flex-1 bg-[#DED6CA]" />
              <span className="text-xs text-[#8A7864]">✤</span>
              <span className="text-[10px] font-sans tracking-[0.25em] text-[#8A7864] uppercase font-semibold">
                {activeSlideData.tag}
              </span>
              <span className="text-xs text-[#8A7864]">✤</span>
              <div className="h-[1px] flex-1 bg-[#DED6CA]" />
            </motion.div>

            {/* 4. Subtitle */}
            <motion.p
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -25 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm sm:text-base text-[#685F54] max-w-2xl mx-auto font-normal leading-relaxed"
            >
              {activeSlideData.subtitle}
            </motion.p>

            {/* 5. Slide CTA Buttons */}
            <motion.div
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -20 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center justify-center gap-3 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSlideExplore(activeSlideData.category)}
                className="btn-shine px-6 py-3 bg-[#1A1816] hover:bg-[#35302A] text-[#F7F4EE] font-medium text-xs uppercase tracking-[0.2em] rounded-md transition-all cursor-pointer shadow-sm flex items-center gap-2"
              >
                <span>{activeSlideData.ctaText}</span>
                <ArrowRight size={14} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsStylistOpen(true)}
                className="btn-shine flex items-center gap-2 px-5 py-3 bg-[#FFFFFF] hover:bg-[#EFE8DC] text-[#1A1816] border border-[#DED6CA] hover:border-[#1A1816] rounded-md text-xs font-medium uppercase tracking-[0.15em] transition-all cursor-pointer shadow-xs"
              >
                <Sparkles size={14} className="text-[#8A7864]" />
                <span>Fabric Advisor</span>
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                href={buildWhatsAppLink(
                  settings.whatsappNumber || STORE_CONTACT.whatsapp,
                  `Assalam o Alaikum SARUS, mujhe ${activeSlideData.badge} collection ke baare mein inquire karna hai.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine hidden sm:flex items-center gap-2 px-5 py-3 bg-[#FFFFFF] hover:bg-[#EFE8DC] text-[#1A1816] border border-[#DED6CA] hover:border-[#1A1816] rounded-md text-xs font-medium uppercase tracking-[0.15em] transition-all cursor-pointer shadow-xs"
              >
                <MessageCircle size={14} className="text-[#8A7864]" />
                <span>WhatsApp Concierge</span>
              </motion.a>
            </motion.div>
          </div>
        </AnimatePresence>

        {/* Global Fast Search Bar */}
        <div className="max-w-2xl mx-auto w-full mt-8 sm:mt-10">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center bg-[#FFFFFF] border border-[#DED6CA] rounded-full shadow-sm focus-within:border-[#8A7864] focus-within:ring-2 focus-within:ring-[#8A7864]/20 transition-all p-1.5 pl-5"
          >
            <Search size={18} className="text-[#8A7864] shrink-0 mr-3" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search weaves: Egyptian Giza, White Latha, Winter Karandi, Raw Silk..."
              className="w-full bg-transparent text-xs sm:text-sm text-[#1A1816] placeholder-[#9E9385] focus:outline-none"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  setSearchQuery('');
                }}
                className="text-xs text-[#685F54] hover:text-[#1A1816] mr-2 px-2 py-1 font-medium cursor-pointer"
              >
                Clear
              </button>
            )}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="btn-shine px-5 py-2 bg-[#1A1816] hover:bg-[#35302A] text-[#F7F4EE] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5"
            >
              <span>Search</span>
              <ArrowRight size={13} />
            </motion.button>
          </form>

          {/* Quick Trending Tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2.5 text-xs">
            <span className="text-[#8A7864] font-medium text-[11px] uppercase tracking-wider mr-1">
              Popular:
            </span>
            {POPULAR_SEARCH_KEYWORDS.slice(0, 6).map((keyword: string) => (
              <button
                key={keyword}
                onClick={() => handleKeywordSelect(keyword)}
                className="px-2.5 py-0.5 bg-[#FFFFFF] hover:bg-[#1A1816] text-[#685F54] hover:text-[#F7F4EE] border border-[#DED6CA] hover:border-[#1A1816] rounded-full text-[11px] font-medium transition-all cursor-pointer shadow-2xs"
              >
                #{keyword}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Slider Controls: Arrows & Stretched Pill Indicators */}
      <div className="relative z-20 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6 flex items-center justify-between">
        {/* Left Arrow Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={prevSlide}
          aria-label="Previous slide"
          className="w-10 h-10 rounded-full bg-[#FFFFFF]/90 hover:bg-[#8A7864] hover:text-[#FAF8F5] text-[#1A1816] border border-[#DED6CA] hover:border-[#8A7864] transition-all flex items-center justify-center cursor-pointer shadow-xs"
        >
          <ChevronLeft size={18} />
        </motion.button>

        {/* Clickable Dots with Active Pill Stretch */}
        <div className="flex items-center gap-2">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}: ${slide.badge}`}
                className="group p-1.5 cursor-pointer focus:outline-none"
              >
                <motion.div
                  layout
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  className={`h-2 rounded-full transition-colors ${
                    isActive
                      ? 'w-8 bg-[#8A7864]'
                      : 'w-2 bg-[#DED6CA] group-hover:bg-[#8A7864]/60'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={nextSlide}
          aria-label="Next slide"
          className="w-10 h-10 rounded-full bg-[#FFFFFF]/90 hover:bg-[#8A7864] hover:text-[#FAF8F5] text-[#1A1816] border border-[#DED6CA] hover:border-[#8A7864] transition-all flex items-center justify-center cursor-pointer shadow-xs"
        >
          <ChevronRight size={18} />
        </motion.button>
      </div>

      {/* Subtle Scroll Down Indicator */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 pointer-events-none opacity-60 hidden sm:block">
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={14} className="text-[#8A7864]" />
        </motion.div>
      </div>
    </section>
  );
};
