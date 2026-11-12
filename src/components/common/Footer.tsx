/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Truck, RotateCcw, ShieldCheck, ArrowRight, Check, PackageCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { STORE_CONTACT, buildWhatsAppLink, buildTelLink } from '../../config/storeContact.ts';

export const Footer: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const { setPolicyModal, setIsSizeGuideOpen, setIsTrackingModalOpen, settings, setFilterCategory } = useStore();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) return;
    setSubscribed(true);
  };

  const handleCategoryClick = (category: string) => {
    setFilterCategory(category);
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const trustItems = [
    {
      icon: ShieldCheck,
      title: 'Cash on Delivery',
      desc: 'Inspect on arrival & pay cash at your doorstep nationwide across Pakistan.',
    },
    {
      icon: Truck,
      title: 'Nationwide Delivery in 3-5 Business Days',
      desc: 'Fast tracked dispatch with SMS tracking updates from Sadiqabad hub.',
    },
    {
      icon: RotateCcw,
      title: '7-Day Size Exchange',
      desc: 'Compliant with our official 7-day exchange window for unstitched fabric yardage.',
    },
  ];

  return (
    <footer className="bg-[#EFE8DC] text-[#1A1816] border-t border-[#DED6CA] mt-20">
      {/* 1. Trust Strip with Fade/Slide In on Scroll */}
      <div className="border-b border-[#DED6CA] py-8 px-4 sm:px-6 lg:px-8 bg-[#F7F4EE]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#FFFFFF] border border-[#DED6CA] shadow-2xs hover:border-[#8A7864] hover:shadow-sm transition-all"
              >
                <div className="p-3 bg-[#FAF8F5] text-[#1A1816] rounded-lg shrink-0 font-bold border border-[#DED6CA]">
                  <Icon size={22} className="text-[#8A7864]" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs tracking-wider uppercase text-[#1A1816]">{item.title}</h4>
                  <p className="text-xs text-[#685F54] mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 2. Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center">
            <img
              src="/assets/aistudio/SARUS_Premium_Fabrics_Logo-removebg-preview_2b5db1d0.png"
              alt="SARUS Premium Fabrics"
              className="h-14 w-auto object-contain"
            />
          </div>

          <p className="text-xs text-[#685F54] leading-relaxed max-w-sm">
            {settings.brandInfo ||
              'SARUS Premium Fabrics (سیرس) — Crafted with Care, Made to Inspire. Artisanal fine cottons, pure European linens, and heritage Pakistani handloom weaves.'}
          </p>

          <div className="text-xs text-[#685F54] space-y-1.5 pt-2">
            <p>
              Direct Concierge:{' '}
              <a
                href={buildTelLink(settings.phone || STORE_CONTACT.phone)}
                className="text-[#1A1816] font-mono font-medium hover:underline"
              >
                {settings.phone || STORE_CONTACT.phone}
              </a>
            </p>
            <p>
              WhatsApp Support:{' '}
              <a
                href={buildWhatsAppLink(
                  settings.whatsappNumber || STORE_CONTACT.whatsapp,
                  'Assalam o Alaikum SARUS Clothes, mujhe ek inquiry karni hai.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A1816] font-mono font-medium hover:underline"
              >
                {settings.whatsappNumber || STORE_CONTACT.whatsapp}
              </a>
            </p>
            {settings.emailAddress && settings.emailAddress.trim() !== '' && (
              <p>
                Official Inquiries:{' '}
                <a
                  href={`mailto:${settings.emailAddress}`}
                  className="text-[#1A1816] hover:underline"
                >
                  {settings.emailAddress}
                </a>
              </p>
            )}
            <p>
              Store Location:{' '}
              <span className="text-[#1A1816]">
                {settings.storeAddress || STORE_CONTACT.address}
              </span>
            </p>
          </div>
        </div>

        {/* Collections */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-semibold text-xs uppercase tracking-[0.2em] text-[#8A7864]">Collections</h4>
          <ul className="space-y-2 text-xs text-[#685F54]">
            <li><button onClick={() => handleCategoryClick("Men's Collection")} className="hover:text-[#1A1816] transition-colors cursor-pointer text-left">Men's Collection</button></li>
            <li><button onClick={() => handleCategoryClick("Women's Collection")} className="hover:text-[#1A1816] transition-colors cursor-pointer text-left">Women's Collection</button></li>
            <li><button onClick={() => handleCategoryClick('Pure Cottons & Linens')} className="hover:text-[#1A1816] transition-colors cursor-pointer text-left">Pure Cottons & Linens</button></li>
            <li><button onClick={() => handleCategoryClick('Winter & Heritage Weaves')} className="hover:text-[#1A1816] transition-colors cursor-pointer text-left">Winter & Heritage Weaves</button></li>
          </ul>
        </div>

        {/* Customer Help & Policies */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-semibold text-xs uppercase tracking-[0.2em] text-[#8A7864]">Client Concierge</h4>
          <ul className="space-y-2 text-xs text-[#685F54]">
            <li><button onClick={() => setIsTrackingModalOpen(true)} className="hover:text-[#1A1816] transition-colors cursor-pointer">Track COD Parcel</button></li>
            <li><button onClick={() => setIsSizeGuideOpen(true)} className="hover:text-[#1A1816] transition-colors cursor-pointer">Fabric & Yardage Guide</button></li>
            <li><button onClick={() => setPolicyModal('shipping')} className="hover:text-[#1A1816] transition-colors cursor-pointer">Shipping & Delivery Rates</button></li>
            <li><button onClick={() => setPolicyModal('returns')} className="hover:text-[#1A1816] transition-colors cursor-pointer">7-Day Inspection Policy</button></li>
            <li><button onClick={() => setPolicyModal('faq')} className="hover:text-[#1A1816] transition-colors cursor-pointer">Frequently Asked Questions</button></li>
            <li><button onClick={() => setPolicyModal('terms')} className="hover:text-[#1A1816] transition-colors cursor-pointer">Terms & Conditions</button></li>
          </ul>
        </div>

        {/* Newsletter Signup (Unticked Consent) */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="font-semibold text-xs uppercase tracking-[0.2em] text-[#8A7864]">The SARUS Journal</h4>
          <p className="text-xs text-[#685F54] leading-relaxed">
            Receive private announcements for limited seasonal releases and fabric restocks.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-[#FFFFFF] border border-[#DED6CA] rounded-xs px-3 py-2 text-xs text-[#1A1816] placeholder-[#685F54]/50 focus:outline-none focus:border-[#1A1816]"
                />
                <button
                  type="submit"
                  disabled={!consent}
                  className="px-4 py-2 bg-[#1A1816] text-[#F7F4EE] font-medium text-xs rounded-xs hover:bg-[#35302A] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <span>Join</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Explicit unticked marketing consent checkbox */}
              <label className="flex items-start gap-2 text-[11px] text-[#685F54] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-[#DED6CA] text-[#1A1816] focus:ring-0 bg-[#FFFFFF]"
                />
                <span>I agree to receive seasonal fabric collection releases and accept the Privacy Policy.</span>
              </label>
            </form>
          ) : (
            <div className="p-3 bg-[#FFFFFF] border border-[#DED6CA] rounded-xs text-xs text-[#1A1816] flex items-center gap-2">
              <Check size={16} className="text-[#8A7864]" />
              <span>You have been added to the SARUS private fabric registry.</span>
            </div>
          )}
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-[#DED6CA] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#685F54]">
        <p>© 2026 SARUS Premium Fabrics. All Rights Reserved. Sadiqabad, Punjab, Pakistan.</p>
        <div className="flex items-center gap-4">
          <button onClick={() => setPolicyModal('terms')} className="hover:text-[#1A1816]">Terms</button>
          <span>·</span>
          <button onClick={() => setPolicyModal('privacy')} className="hover:text-[#1A1816]">Privacy</button>
          <span>·</span>
          <button onClick={() => setPolicyModal('shipping')} className="hover:text-[#1A1816]">Shipping</button>
        </div>
      </div>
    </footer>
  );
};
