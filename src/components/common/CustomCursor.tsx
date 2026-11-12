/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export const CustomCursor: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Smooth lerp coordinates for trailing ring
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Check if pointer is fine (mouse/trackpad, not touch) and user hasn't requested reduced motion
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!finePointer || reducedMotion) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Instantly position the small dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`;
      }

      // Check hover target
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = target.closest('a, button, [role="button"], input[type="submit"], input[type="checkbox"], input[type="radio"], select, .group, .cursor-pointer');
        const isInput = target.closest('input[type="text"], input[type="search"], input[type="tel"], input[type="email"], input[type="password"], textarea, [contenteditable="true"]');

        setIsTextInput(Boolean(isInput));
        setIsHovered(Boolean(isInteractive && !isInput));
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const newRipple: Ripple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev.slice(-3), newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 500);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth animation loop for ring using lerp
    const renderLoop = () => {
      const lerpFactor = 0.18;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpFactor;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpFactor;

      if (ringRef.current) {
        const radius = isHovered ? 22 : 14;
        ringRef.current.style.transform = `translate3d(${ringPos.current.x - radius}px, ${ringPos.current.y - radius}px, 0) scale(${isHovered ? 1.6 : 1})`;
      }

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    animFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isVisible, isHovered]);

  if (!isEnabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9990] overflow-hidden" aria-hidden="true">
      {/* Small Solid Lead Dot */}
      <div
        ref={dotRef}
        style={{
          opacity: isVisible && !isTextInput ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#8A7864] will-change-transform shadow-2xs"
      />

      {/* Trailing Lag Ring with Hover Expansion */}
      <div
        ref={ringRef}
        style={{
          opacity: isVisible && !isTextInput ? (isHovered ? 0.9 : 0.6) : 0,
          backgroundColor: isHovered ? 'rgba(138, 120, 100, 0.16)' : 'transparent',
          borderColor: '#8A7864',
          transition: 'opacity 0.2s ease, background-color 0.25s ease, border-color 0.25s ease',
        }}
        className="fixed top-0 left-0 w-7 h-7 rounded-full border border-[#8A7864] will-change-transform"
      />

      {/* Click Ripple Circles */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            top: ripple.y - 16,
            left: ripple.x - 16,
          }}
          className="fixed w-8 h-8 rounded-full border border-[#8A7864] animate-ping opacity-60 will-change-transform"
        />
      ))}
    </div>
  );
};
