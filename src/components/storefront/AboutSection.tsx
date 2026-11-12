/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { ShieldCheck, Truck, Scissors, ArrowRight, Award } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { STORE_CONTACT, buildWhatsAppLink } from '../../config/storeContact.ts';

// Stat counter hook for smooth number counting animation
const CounterStat: React.FC<{ target: number; suffix?: string; label: string; sublabel: string }> = ({
  target,
  suffix = '',
  label,
  sublabel,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const stepTime = 25;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div ref={ref} className="p-4 bg-[#FAF8F5] border border-[#DED6CA] rounded-xl space-y-1 text-center sm:text-left transition-all hover:border-[#8A7864] hover:shadow-sm">
      <div className="font-display text-2xl sm:text-3xl font-normal text-[#1A1816]">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="font-semibold text-xs text-[#1A1816] uppercase tracking-wider">{label}</div>
      <div className="text-[11px] text-[#685F54]">{sublabel}</div>
    </div>
  );
};

export const AboutSection: React.FC = () => {
  const { settings, setFilterCategory } = useStore();

  const handleExplore = () => {
    setFilterCategory('all');
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about-section" className="py-20 sm:py-24 bg-[#FFFFFF] border-b border-[#DED6CA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual: Authentic Urdu Botanical Artwork */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-md bg-[#FAF8F5] border border-[#DED6CA] rounded-2xl p-6 sm:p-8 shadow-xl text-center group hover:shadow-2xl transition-all duration-500">
              <div className="h-1 bg-gradient-to-r from-[#DED6CA] via-[#8A7864] to-[#DED6CA] rounded-full mb-6" />

              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#EFE8DC]/40 flex items-center justify-center p-4">
                <img
                  src="/assets/aistudio/Minimal_Urdu_Botanical_Label_4b635bb9.png"
                  alt="SARUS Botanical Artwork سیرس"
                  className="w-full h-full object-contain drop-shadow-md group-hover:scale-104 transition-transform duration-700 ease-out"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-[#DED6CA] flex items-center justify-between text-xs text-[#685F54]">
                <span className="font-mono text-[10px] tracking-widest uppercase">PUNJAB, PAKISTAN</span>
                <span className="font-urdu text-sm text-[#1A1816]" dir="rtl">سیرس · پریمیم فیبرکس</span>
              </div>
            </div>
          </motion.div>

          {/* Editorial Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-1 self-stretch bg-[#8A7864] origin-top rounded-full"
              />
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#8A7864] mb-1">
                  <span>04. BRAND HERITAGE</span>
                  <span>✤</span>
                  <span className="font-urdu normal-case text-xs tracking-normal" dir="rtl">
                    روایت و پہچان
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1A1816] leading-tight">
                  {settings.aboutHeading || 'Thoughtfully Selected. Beautifully Presented.'}
                </h2>
              </div>
            </div>

            {/* Self-drawing underline divider */}
            <div className="flex items-center gap-3 max-w-sm py-1">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="h-[1px] flex-1 bg-[#DED6CA] origin-left"
              />
              <span className="text-xs text-[#8A7864]">✤</span>
              <span className="text-[10px] font-sans tracking-[0.25em] text-[#8A7864] uppercase font-semibold">
                CURATED BY SULEMAN SARWAR
              </span>
              <span className="text-xs text-[#8A7864]">✤</span>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="h-[1px] flex-1 bg-[#DED6CA] origin-right"
              />
            </div>

            <p className="text-sm sm:text-base text-[#685F54] leading-relaxed">
              {settings.aboutText ||
                'Founded by Suleman Sarwar in Sadiqabad, Punjab, SARUS Premium Fabrics celebrates the timeless heritage of South Asian dressing. Each length of fabric is thoughtfully inspected and curated—from extra-long staple Egyptian Giza cottons and crisp snow-white latha to authentic handloom winter karandi and festive pure mulberry silks. Delivered with care to doorsteps across Pakistan.'}
            </p>

            {/* Core Values Strip with Animated Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#DED6CA]">
              <CounterStat
                target={100}
                suffix="%"
                label="Pure Fabrics"
                sublabel="Zero synthetic blends in our pure cottons, linens, and karandi."
              />
              <CounterStat
                target={4}
                suffix=".5m"
                label="Suit Lengths"
                sublabel="Generous cut calibrated for traditional Pakistani tailoring."
              />
              <CounterStat
                target={100}
                suffix="%"
                label="COD Across PK"
                sublabel="Open parcel inspection & door-step Cash on Delivery."
              />
            </div>

            {/* Feature Highlights Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs text-[#685F54]">
              <div className="flex items-center gap-2">
                <Scissors size={14} className="text-[#8A7864] shrink-0" />
                <span>Bespoke master cut yardage</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#8A7864] shrink-0" />
                <span>Thread & colorfast verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-[#8A7864] shrink-0" />
                <span>Fast express dispatch</span>
              </div>
            </div>

            {/* Call to Actions with Shine & Tap compression */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleExplore}
                className="btn-shine px-6 py-3 bg-[#1A1816] hover:bg-[#332E27] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-sm flex items-center gap-2"
              >
                <span>Browse the Fabric Catalog</span>
                <ArrowRight size={14} />
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                href={buildWhatsAppLink(
                  settings.whatsappNumber || STORE_CONTACT.whatsapp,
                  'Assalam o Alaikum Suleman Bhai, mujhe SARUS fabrics ke baare mein inquiry karni hai.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#FAF8F5] hover:bg-[#EFE8DC] border border-[#DED6CA] text-[#1A1816] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-2xs"
              >
                Direct WhatsApp Inquiry
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
