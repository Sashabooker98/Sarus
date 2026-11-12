/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none bg-transparent"
      aria-hidden="true"
    >
      <motion.div
        style={{ scaleX }}
        className="h-full w-full bg-gradient-to-r from-[#8A7864] via-[#685F54] to-[#1A1816] origin-left shadow-xs"
      />
    </div>
  );
};
