/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { STORE_CONTACT, buildWhatsAppLink } from '../../config/storeContact.ts';

export const WhatsAppButton: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const { settings } = useStore();
  const rawNumber = settings.whatsappNumber || STORE_CONTACT.whatsapp;
  const link = buildWhatsAppLink(
    rawNumber,
    'Assalam o Alaikum SARUS Premium Fabrics! Mujhe aap ke fabric collections ke bare mein maloomat chahiye.'
  );

  return (
    <div className="fixed bottom-6 left-6 z-40 group pointer-events-auto">
      {/* Soft Pulsing Accent Glow Ring */}
      <motion.div
        animate={
          prefersReduced
            ? {}
            : {
                scale: [1, 1.28, 1],
                opacity: [0.6, 0.15, 0.6],
              }
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -inset-1.5 rounded-full border border-[#8A7864] pointer-events-none shadow-[0_0_16px_rgba(138,120,100,0.4)]"
      />

      <motion.a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with SARUS Premium Fabrics on WhatsApp"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-[#FFFFFF] shadow-lg shadow-black/15 hover:shadow-[0_10px_25px_rgba(37,211,102,0.4)] transition-shadow duration-300 cursor-pointer border border-white/30"
      >
        <MessageCircle size={24} className="fill-current text-[#FFFFFF]" />

        {/* Small Green "Online" Dot with Pulse in Corner */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white shadow-2xs">
          {!prefersReduced && (
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
          )}
        </span>

        {/* Tooltip on Desktop Hover */}
        <span className="absolute left-full ml-3 px-3 py-1 bg-[#1A1816] text-[#FAF8F5] text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md tracking-wider uppercase hidden sm:block">
          WhatsApp Concierge
        </span>
      </motion.a>
    </div>
  );
};
