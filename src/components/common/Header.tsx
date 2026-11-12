/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Sparkles,
  Package,
  Layers,
  ChevronDown,
  X,
  Lock,
  LogOut,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export const Header: React.FC = () => {
  const {
    cartLines,
    wishlist,
    setIsCartOpen,
    setIsTrackingModalOpen,
    setIsAccountModalOpen,
    setIsStylistOpen,
    isAdminMode,
    setIsAdminMode,
    isAdminAuthenticated,
    adminLogout,
    setIsAdminLoginModalOpen,
    currentUser,
    searchQuery,
    setSearchQuery,
    setFilterAudience,
    setFilterSeason,
    setFilterCategory,
    settings,
    categories,
  } = useStore();

  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const cartCount = cartLines.reduce((acc, line) => acc + line.quantity, 0);
  const prevCartCountRef = useRef(cartCount);
  const [cartBadgeBounce, setCartBadgeBounce] = useState(false);

  const [activeSection, setActiveSection] = useState<'home' | 'shop' | 'categories' | 'about' | 'contact'>('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const scrollPos = window.scrollY + 250;
      const contactEl = document.getElementById('contact-section');
      const aboutEl = document.getElementById('about-section');
      const catalogEl = document.getElementById('catalog-section');
      const categoriesEl = document.getElementById('categories-section');

      if (contactEl && scrollPos >= contactEl.offsetTop) {
        setActiveSection('contact');
      } else if (aboutEl && scrollPos >= aboutEl.offsetTop) {
        setActiveSection('about');
      } else if (catalogEl && scrollPos >= catalogEl.offsetTop) {
        setActiveSection('shop');
      } else if (categoriesEl && scrollPos >= categoriesEl.offsetTop) {
        setActiveSection('categories');
      } else {
        setActiveSection('home');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      setCartBadgeBounce(true);
      const timer = setTimeout(() => setCartBadgeBounce(false), 600);
      return () => clearTimeout(timer);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  const scrollToSection = (id: string) => {
    if (isAdminMode) setIsAdminMode(false);
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('home');
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (audience?: string, season?: string, category?: string) => {
    if (audience !== undefined) setFilterAudience(audience);
    if (season !== undefined) setFilterSeason(season);
    if (category !== undefined) setFilterCategory(category);
    scrollToSection('catalog-section');
  };

  const handleAdminClick = () => {
    if (!isAdminAuthenticated) {
      setIsAdminLoginModalOpen(true);
    } else {
      setIsAdminMode(!isAdminMode);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-[#F7F4EE]/95 backdrop-blur-md border-b border-[#DED6CA] transition-all duration-300 ${
        isScrolled ? 'shadow-sm bg-[#F7F4EE]/98' : ''
      }`}
    >
      {/* 1. Announcement Bar */}
      {!announcementDismissed && settings.bannerEnabled && (
        <div className="bg-[#EFE8DC] text-[#685F54] text-xs font-medium py-1.5 px-4 flex items-center justify-between border-b border-[#DED6CA]/60">
          <div className="w-6" />
          <div className="flex items-center gap-2 text-center overflow-hidden">
            <span className="font-semibold text-[#1A1816] tracking-[0.15em] uppercase text-[11px]">
              {settings.bannerText || 'CRAFTED WITH CARE · MADE TO INSPIRE'}
            </span>
            <span className="text-[#8A7864] text-[10px]">✤</span>
            <span className="text-[#685F54] hidden sm:inline text-[11px] tracking-wider uppercase">
              {settings.bannerSubtext || 'PREMIUM FABRICS · CASH ON DELIVERY NATIONWIDE'}
            </span>
            <span className="text-[#685F54] sm:hidden text-[10px] tracking-wider uppercase">CASH ON DELIVERY NATIONWIDE</span>
          </div>
          <button
            onClick={() => setAnnouncementDismissed(true)}
            className="text-[#8A7864] hover:text-[#1A1816] p-0.5 rounded cursor-pointer transition-colors"
            aria-label="Dismiss announcement"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. Top Bar: Wordmark — Nav Links — Actions */}
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 transition-all duration-300 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}
      >
        {/* Zone 1: Brand Logo with Glowing Accent Ring */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => {
              setFilterAudience('all');
              setFilterSeason('all');
              setFilterCategory('all');
              setSearchQuery('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group text-left cursor-pointer focus:outline-none flex items-center py-1"
            aria-label="SARUS Home"
          >
            <div className="relative p-1 rounded-full border border-[#8A7864]/40 shadow-[0_0_12px_rgba(138,120,100,0.25)] group-hover:border-[#8A7864] group-hover:shadow-[0_0_20px_rgba(138,120,100,0.45)] transition-all duration-300 bg-[#FAF8F5]/90">
              <img
                src="/assets/aistudio/SARUS_Premium_Fabrics_Logo-removebg-preview_2b5db1d0.png"
                alt="SARUS Premium Fabrics"
                className={`w-auto object-contain transition-all duration-300 group-hover:scale-104 ${
                  isScrolled ? 'h-9 sm:h-11' : 'h-11 sm:h-13'
                }`}
              />
            </div>
          </button>

          {/* Quick Admin Toggle */}
          <button
            onClick={handleAdminClick}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded uppercase tracking-wider transition-all cursor-pointer border ${
              isAdminMode
                ? 'bg-[#1A1816] text-[#F7F4EE] border-[#1A1816] font-semibold shadow-xs'
                : 'bg-[#FFFFFF] text-[#685F54] border-[#DED6CA] hover:border-[#1A1816] hover:text-[#1A1816]'
            }`}
          >
            {isAdminAuthenticated ? <Layers size={13} /> : <Lock size={13} />}
            <span>{isAdminMode ? 'Storefront View' : 'Admin Portal'}</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Active item shown as filled accent pill) */}
        {!isAdminMode ? (
          <nav className="hidden lg:flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase">
            {[
              { id: 'home', label: 'Home', target: 'hero' },
              { id: 'shop', label: 'Shop', target: 'catalog-section' },
              { id: 'categories', label: 'Categories', target: 'categories-section' },
              { id: 'about', label: 'About Us', target: 'about-section' },
              { id: 'contact', label: 'Contact Us', target: 'contact-section' },
            ].map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.target)}
                  className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap text-xs font-medium ${
                    isActive
                      ? 'bg-[#8A7864] text-[#FAF8F5] shadow-2xs font-semibold'
                      : 'text-[#685F54] hover:text-[#1A1816] hover:bg-[#EFE8DC]/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        ) : (
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-[#8A7864]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#8A7864] animate-pulse"></span>
            <span>SARUS ADMINISTRATIVE CONSOLE // OPS ACTIVE</span>
          </div>
        )}

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* AI Fabric & Silhouette Advisor Button */}
          <button
            onClick={() => setIsStylistOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFFFF] text-[#1A1816] border border-[#DED6CA] hover:border-[#1A1816] hover:bg-[#EFE8DC] text-xs font-medium transition-all cursor-pointer shadow-xs group"
            title="Fabric & Tailoring Advisor"
          >
            <Sparkles size={13} className="text-[#8A7864]" />
            <span className="hidden sm:inline">Fabric Advisor</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => setShowSearchInput(!showSearchInput)}
            className="p-2 text-[#1A1816] hover:text-[#8A7864] hover:bg-[#EFE8DC] rounded-full transition-colors cursor-pointer"
            aria-label="Search fabric catalog"
          >
            <Search size={19} />
          </button>

          {/* Track Order */}
          <button
            onClick={() => setIsTrackingModalOpen(true)}
            className="hidden sm:flex items-center gap-1 p-2 text-[#1A1816] hover:text-[#8A7864] hover:bg-[#EFE8DC] rounded-full transition-colors cursor-pointer"
            title="Track COD Parcel"
            aria-label="Track COD Parcel"
          >
            <Package size={19} />
          </button>

          {/* Wishlist */}
          <button
            onClick={() => setIsAccountModalOpen(true)}
            className="relative p-2 text-[#1A1816] hover:text-[#8A7864] hover:bg-[#EFE8DC] rounded-full transition-colors cursor-pointer"
            aria-label="Wishlist"
          >
            <Heart size={19} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#1A1816] text-[#F7F4EE] text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Account / Admin Menu */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-[#EFE8DC] text-xs font-medium text-[#1A1816] transition-colors cursor-pointer border border-[#DED6CA] bg-[#FFFFFF]"
              title="User Account & Navigation"
            >
              <User size={15} className="text-[#8A7864]" />
              <span className="hidden md:inline max-w-[100px] truncate">
                {isAdminAuthenticated ? 'Admin' : 'Account'}
              </span>
              <ChevronDown size={12} className="opacity-60 text-[#685F54]" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] border border-[#DED6CA] shadow-xl rounded-md py-2 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1.5 border-b border-[#DED6CA] mb-1 bg-[#F7F4EE]/50">
                  <p className="text-[10px] font-semibold text-[#8A7864] uppercase tracking-wider">Account Portal</p>
                  <p className="text-xs font-bold text-[#1A1816]">
                    {isAdminAuthenticated ? currentUser.name : 'Guest Customer'}
                  </p>
                  <p className="text-[10px] text-[#685F54]">
                    {isAdminAuthenticated ? 'VERIFIED STORE OWNER' : 'CLIENT PROFILE'}
                  </p>
                </div>

                <div className="px-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setIsAccountModalOpen(true);
                      setRoleMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#685F54] hover:text-[#1A1816] hover:bg-[#F7F4EE] rounded flex items-center justify-between cursor-pointer"
                  >
                    <span>My Saved Fabrics & Orders</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsTrackingModalOpen(true);
                      setRoleMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#685F54] hover:text-[#1A1816] hover:bg-[#F7F4EE] rounded flex items-center justify-between cursor-pointer"
                  >
                    <span>Track COD Parcel</span>
                  </button>
                </div>

                <div className="border-t border-[#DED6CA] mt-1 pt-1 px-1">
                  {isAdminAuthenticated ? (
                    <>
                      <button
                        onClick={() => {
                          setIsAdminMode(!isAdminMode);
                          setRoleMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs font-semibold text-[#1A1816] hover:bg-[#F7F4EE] rounded cursor-pointer flex items-center gap-1.5"
                      >
                        <Layers size={13} className="text-[#8A7864]" />
                        <span>{isAdminMode ? 'Switch to Storefront' : 'Open Admin Portal'}</span>
                      </button>
                      <button
                        onClick={() => {
                          adminLogout();
                          setRoleMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded cursor-pointer flex items-center gap-1.5"
                      >
                        <LogOut size={13} />
                        <span>Sign Out of Admin</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setIsAdminLoginModalOpen(true);
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs font-semibold text-[#1A1816] hover:bg-[#F7F4EE] rounded cursor-pointer flex items-center gap-1.5"
                    >
                      <Lock size={13} className="text-[#8A7864]" />
                      <span>Admin Sign In</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart Bag */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#FFFFFF] border border-[#DED6CA] hover:border-[#1A1816] text-[#1A1816] rounded-md text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={16} className="text-[#8A7864]" />
            <motion.span
              animate={cartBadgeBounce ? { scale: [1, 1.45, 0.85, 1.15, 1] } : { scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="tabular-nums font-mono text-[#1A1816] font-bold inline-block"
            >
              {cartCount}
            </motion.span>
          </button>
        </div>
      </div>

      {/* 3. Slow Marquee Strip under the Header (Part 2 #7: pauses on hover) */}
      {!isAdminMode && (
        <div className="relative overflow-hidden bg-[#EFE8DC]/80 border-t border-[#DED6CA]/70 py-1 text-[11px] font-sans font-medium text-[#685F54] select-none">
          <div className="animate-marquee-strip flex cursor-default whitespace-nowrap">
            {[1, 2, 3, 4].map((idx) => (
              <span key={idx} className="inline-flex items-center gap-4 px-6 uppercase tracking-[0.2em]">
                <span className="text-[#1A1816] font-semibold">Free delivery above Rs. 3,500</span>
                <span className="text-[#8A7864]">✤</span>
                <span>Cash on Delivery</span>
                <span className="text-[#8A7864]">✤</span>
                <span className="text-[#1A1816] font-semibold">Nationwide Delivery</span>
                <span className="text-[#8A7864]">✤</span>
                <span className="font-urdu tracking-normal text-xs" dir="rtl">
                  سیرس پریمیم فیبرکس
                </span>
                <span className="text-[#8A7864]">✤</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Navigation Strip */}
      {!isAdminMode && (
        <div className="lg:hidden bg-[#FAF8F5] border-t border-[#DED6CA] px-4 py-2.5 overflow-x-auto scrollbar-none">
          <nav className="flex items-center justify-start gap-4 text-[11px] font-semibold text-[#685F54] uppercase tracking-wider whitespace-nowrap min-w-max">
            <button onClick={() => scrollToSection('hero')} className="hover:text-[#1A1816] cursor-pointer">
              Home
            </button>
            <span className="text-[#DED6CA]">·</span>
            <button onClick={() => scrollToSection('catalog-section')} className="hover:text-[#1A1816] cursor-pointer">
              Shop
            </button>
            <span className="text-[#DED6CA]">·</span>
            <button onClick={() => scrollToSection('categories-section')} className="hover:text-[#1A1816] cursor-pointer">
              Categories
            </button>
            <span className="text-[#DED6CA]">·</span>
            <button onClick={() => scrollToSection('about-section')} className="hover:text-[#1A1816] cursor-pointer">
              About Us
            </button>
            <span className="text-[#DED6CA]">·</span>
            <button onClick={() => scrollToSection('contact-section')} className="hover:text-[#1A1816] cursor-pointer">
              Contact Us
            </button>
          </nav>
        </div>
      )}

      {/* Instant Search Bar Overlay */}
      {showSearchInput && (
        <div className="border-t border-[#DED6CA] bg-[#FFFFFF] px-4 py-3 shadow-md animate-in fade-in slide-in-from-top-1">
          <div className="max-w-3xl mx-auto space-y-2">
            <div className="flex items-center gap-3">
              <Search size={18} className="text-[#8A7864]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pure cottons, organic linen, karandi, khaddar, raw silk..."
                className="w-full text-sm font-normal bg-transparent border-none outline-none focus:ring-0 text-[#1A1816] placeholder-[#685F54]/50"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#685F54] hover:text-[#1A1816] cursor-pointer font-medium"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setShowSearchInput(false)}
                className="p-1 text-[#685F54] hover:text-[#1A1816] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Keyword Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-[#8A7864] text-[10px] uppercase tracking-wider font-semibold">Trending:</span>
              {[
                'Egyptian Giza Cotton',
                'Crisp White Latha',
                'Handloom Karandi',
                'Belgian Linen',
                'Festive Raw Silk',
                'Summer Lawn 3-Piece',
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    setShowSearchInput(false);
                    const el = document.getElementById('catalog-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-2 py-0.5 rounded-full border border-[#DED6CA] bg-[#FAF8F5] hover:bg-[#1A1816] hover:text-[#F7F4EE] hover:border-[#1A1816] text-[10px] text-[#685F54] transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
