/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useStore } from '../../context/StoreContext.tsx';

// Splash duration in milliseconds (configurable between 5000 and 7000ms)
export const SPLASH_DURATION_MS = 6000;
const REDUCED_MOTION_DURATION_MS = 2500;

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const { isAdminMode } = useStore();
  const prefersReduced = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);
  const [showSkip, setShowSkip] = useState(false);

  // If already in admin mode, do not render splash
  if (isAdminMode) {
    return null;
  }

  const effectiveDuration = prefersReduced ? REDUCED_MOTION_DURATION_MS : SPLASH_DURATION_MS;

  useEffect(() => {
    // Lock scroll during splash presentation
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Show skip button after 2 seconds
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 2000);

    // Auto-dismiss after duration
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, effectiveDuration);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(dismissTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, [effectiveDuration]);

  const handleDismiss = () => {
    setIsVisible(false);
    document.body.style.overflow = '';
    if (onComplete) {
      onComplete();
    }
  };

  // Text breakdown: "SARUS PREMIUM FABRICS BY SULEMAN SARWAR"
  const line1 = 'SARUS'.split('');
  const line2 = 'PREMIUM FABRICS'.split('');
  const line3 = 'BY SULEMAN SARWAR'.split('');

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <div
          role="dialog"
          aria-label="Welcome to SARUS Premium Fabrics"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-hidden pointer-events-auto select-none"
        >
          {/* Split Exit Panels: Left Panel */}
          <motion.div
            initial={{ x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { x: '-100%', opacity: 0 }}
            transition={{
              duration: prefersReduced ? 0.6 : 1.1,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#121110] z-10 border-r border-[#8A7864]/20"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, rgba(200, 184, 158, 0.025) 0px, rgba(200, 184, 158, 0.025) 2px, transparent 2px, transparent 10px),
                                repeating-linear-gradient(-45deg, rgba(200, 184, 158, 0.025) 0px, rgba(200, 184, 158, 0.025) 2px, transparent 2px, transparent 10px)`,
            }}
          />

          {/* Split Exit Panels: Right Panel */}
          <motion.div
            initial={{ x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { x: '100%', opacity: 0 }}
            transition={{
              duration: prefersReduced ? 0.6 : 1.1,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute top-0 bottom-0 right-0 w-1/2 bg-[#121110] z-10 border-l border-[#8A7864]/20"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, rgba(200, 184, 158, 0.025) 0px, rgba(200, 184, 158, 0.025) 2px, transparent 2px, transparent 10px),
                                repeating-linear-gradient(-45deg, rgba(200, 184, 158, 0.025) 0px, rgba(200, 184, 158, 0.025) 2px, transparent 2px, transparent 10px)`,
            }}
          />

          {/* Center Brand Stage */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: prefersReduced ? 1 : 0.96 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="relative z-20 w-full h-full flex flex-col items-center justify-center px-4"
          >
            {/* Drifting subtle woven thread ambient light glow */}
            {!prefersReduced && (
              <motion.div
                animate={{
                  transform: ['translate(-50%, -50%) scale(1)', 'translate(-48%, -52%) scale(1.12)', 'translate(-50%, -50%) scale(1)'],
                  opacity: [0.18, 0.32, 0.18],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-1/2 left-1/2 w-[340px] sm:w-[540px] h-[340px] sm:h-[540px] rounded-full bg-gradient-to-tr from-[#8A7864]/25 via-[#C8B89E]/20 to-transparent blur-3xl pointer-events-none"
              />
            )}

            {/* Urdu Calligraphic Brand Emblem Watermark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 0.12, scale: 1 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              className="absolute font-urdu text-8xl sm:text-9xl text-[#C8B89E] select-none pointer-events-none -translate-y-6"
              dir="rtl"
            >
              سیرس
            </motion.div>

            {/* Brand Presentation Container */}
            <div className="relative flex flex-col items-center text-center max-w-2xl mx-auto overflow-hidden px-6 py-8">
              {/* Shimmer light sweep overlay across the text */}
              {!prefersReduced && (
                <motion.div
                  initial={{ x: '-120%', opacity: 0 }}
                  animate={{ x: '180%', opacity: [0, 0.85, 0] }}
                  transition={{
                    delay: 2.2,
                    duration: 1.5,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="absolute inset-y-0 w-36 pointer-events-none bg-gradient-to-r from-transparent via-[#F7F4EE]/30 to-transparent skew-x-12 z-30"
                />
              )}

              {/* Line 1: SARUS (Big, Letter by Letter Stagger) */}
              <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-normal text-[#F7F4EE] tracking-[0.25em] pl-[0.25em] flex justify-center leading-none mb-3">
                {line1.map((char, index) => (
                  <motion.span
                    key={`l1-${index}`}
                    initial={
                      prefersReduced
                        ? { opacity: 0 }
                        : { opacity: 0, y: 16, filter: 'blur(6px)' }
                    }
                    animate={
                      prefersReduced
                        ? { opacity: 1 }
                        : { opacity: 1, y: 0, filter: 'blur(0px)' }
                    }
                    transition={{
                      delay: prefersReduced ? 0.1 : 0.4 + index * 0.08,
                      duration: prefersReduced ? 0.3 : 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>

              {/* Center Expanding Gold Accent Line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: prefersReduced ? 0.2 : 0.9,
                  duration: prefersReduced ? 0.4 : 1.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-36 sm:w-56 h-[1.5px] bg-gradient-to-r from-transparent via-[#C8B89E] to-transparent my-3 origin-center"
              />

              {/* Line 2: PREMIUM FABRICS (Medium, Letter by Letter Stagger) */}
              <h2 className="text-xs sm:text-base md:text-lg font-sans font-medium uppercase tracking-[0.38em] pl-[0.38em] text-[#C8B89E] flex justify-center leading-relaxed mb-2.5">
                {line2.map((char, index) => (
                  <motion.span
                    key={`l2-${index}`}
                    initial={
                      prefersReduced
                        ? { opacity: 0 }
                        : { opacity: 0, y: 10, filter: 'blur(4px)' }
                    }
                    animate={
                      prefersReduced
                        ? { opacity: 1 }
                        : { opacity: 1, y: 0, filter: 'blur(0px)' }
                    }
                    transition={{
                      delay: prefersReduced ? 0.25 : 1.2 + index * 0.04,
                      duration: prefersReduced ? 0.3 : 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </h2>

              {/* Line 3: BY SULEMAN SARWAR (Small, Letter by Letter Stagger) */}
              <h3 className="text-[10px] sm:text-xs font-sans font-semibold uppercase tracking-[0.32em] pl-[0.32em] text-[#8A7864] flex justify-center">
                {line3.map((char, index) => (
                  <motion.span
                    key={`l3-${index}`}
                    initial={
                      prefersReduced
                        ? { opacity: 0 }
                        : { opacity: 0, y: 8, filter: 'blur(4px)' }
                    }
                    animate={
                      prefersReduced
                        ? { opacity: 1 }
                        : { opacity: 1, y: 0, filter: 'blur(0px)' }
                    }
                    transition={{
                      delay: prefersReduced ? 0.4 : 1.8 + index * 0.035,
                      duration: prefersReduced ? 0.3 : 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </h3>
            </div>

            {/* Skip Button: Fades in after 2 seconds */}
            {showSkip && (
              <motion.button
                onClick={handleDismiss}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full border border-[#8A7864]/40 bg-[#1A1816]/70 backdrop-blur-md text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:border-[#FAF8F5]/60 hover:bg-[#1A1816] text-[11px] font-sans font-medium uppercase tracking-[0.2em] transition-all cursor-pointer shadow-sm z-30"
              >
                Skip
              </motion.button>
            )}

            {/* Bottom Thread Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-20">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: effectiveDuration / 1000,
                  ease: 'linear',
                }}
                className="h-full bg-gradient-to-r from-[#8A7864] via-[#C8B89E] to-[#F7F4EE] origin-left"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
