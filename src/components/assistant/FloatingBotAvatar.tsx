"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue, useReducedMotion } from "framer-motion";
import { MessageSquare, Sparkles } from "lucide-react";

export default function FloatingBotAvatar({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [hasHovered, setHasHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Vertical straight-line movement tracking pointer Y
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight * 0.65 : 400);
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 180 });

  // Eye gaze tracking
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const botRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Clamp Y along a vertical straight line on right edge
      const margin = 100;
      const maxY = window.innerHeight - 120;
      const clampedY = Math.max(margin, Math.min(e.clientY - 30, maxY));
      mouseY.set(clampedY);

      // Eye gaze calculation relative to bot position
      if (botRef.current) {
        const rect = botRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const dist = Math.hypot(dx, dy) || 1;
        setEyeOffset({
          x: Math.max(-3, Math.min(3, (dx / dist) * 3)),
          y: Math.max(-2.5, Math.min(2.5, (dy / dist) * 2.5)),
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseY, shouldReduceMotion]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasHovered) setShowTooltip(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, [hasHovered]);

  if (isOpen) return null;

  return (
    <motion.div
      style={shouldReduceMotion ? { bottom: 24, right: 24 } : { top: smoothY, right: 24 }}
      className="fixed z-40 flex items-center gap-2 select-none"
    >
      {/* Tooltip speech bubble */}
      {(showTooltip || hasHovered) && (
        <motion.div
          initial={{ opacity: 0, x: 12, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="hidden sm:flex items-center gap-1.5 rounded-xl border border-trust/40 bg-surface/90 dark:bg-elevated/95 px-3 py-1.5 shadow-xl backdrop-blur-md text-xs font-semibold text-primary"
        >
          <Sparkles className="h-3 w-3 text-ai animate-pulse" />
          <span>Ask TaxWise Bot</span>
        </motion.div>
      )}

      {/* The Animated Bot Companion */}
      <motion.button
        ref={botRef}
        type="button"
        onClick={onClick}
        onMouseEnter={() => {
          setHasHovered(true);
          setShowTooltip(true);
        }}
        onMouseLeave={() => setHasHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="group relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-trust/50 bg-gradient-to-br from-trust/90 via-trust to-blue-900 text-white shadow-xl backdrop-blur-md transition-shadow hover:shadow-2xl hover:border-ai focus-visible:outline-none"
        aria-label="Open TaxWise AI Assistant"
      >
        {/* Antenna */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="h-2 w-2 rounded-full bg-ai animate-ping" />
          <span className="h-2 w-[2px] bg-trust/80" />
        </div>

        {/* Robot Face & Eyes */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Eyes Visor */}
          <div className="flex items-center gap-2 rounded-full bg-overlay px-2 py-1 border border-border">
            {/* Left Eye */}
            <div className="relative h-2.5 w-2.5 rounded-full bg-ai flex items-center justify-center shadow-xs">
              <motion.div
                style={{ x: eyeOffset.x, y: eyeOffset.y }}
                className="h-1 w-1 rounded-full bg-[var(--glass-highlight)]"
              />
            </div>
            {/* Right Eye */}
            <div className="relative h-2.5 w-2.5 rounded-full bg-ai flex items-center justify-center shadow-xs">
              <motion.div
                style={{ x: eyeOffset.x, y: eyeOffset.y }}
                className="h-1 w-1 rounded-full bg-[var(--glass-highlight)]"
              />
            </div>
          </div>

          {/* Smile line */}
          <div className="mt-1 h-0.5 w-3 rounded-full bg-[var(--glass-highlight)]/70" />
        </div>

        {/* Online Indicator Badge */}
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-surface bg-success" />
        </span>
      </motion.button>
    </motion.div>
  );
}
