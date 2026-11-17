"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

export interface BotFaceProps {
  size?: number;
  isHovered?: boolean;
  eyeOffset?: { x: number; y: number };
}

export function BotFaceSVG({
  size = 48,
  isHovered = false,
  eyeOffset = { x: 0, y: 0 },
}: BotFaceProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <svg width={size} height={size} viewBox="-16 -20 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="bot-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-ai, #06B6D4)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="0" cy="-2" r="15" fill="url(#bot-glow)" />
      {/* Antenna */}
      <line x1="0" y1="-10" x2="0" y2="-15" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="0" cy="-16" r="2" fill="var(--accent-ai)" />
      {/* Head Container */}
      <rect x="-11" y="-10" width="22" height="18" rx="6" fill="var(--bg-surface, #1E293B)" stroke="var(--accent-primary)" strokeWidth="1.5" />
      <rect x="-8.5" y="-7.5" width="17" height="13" rx="4" fill="var(--bg-base, #0F172A)" />
      {/* Two cheeks — opacity 0.15 */}
      <circle cx="-6" cy="2" r="1.5" fill="var(--accent-primary)" opacity="0.15" />
      <circle cx="6" cy="2" r="1.5" fill="var(--accent-primary)" opacity="0.15" />
      {/* Two eyes with blinking animation */}
      <motion.g
        animate={shouldReduceMotion ? {} : { scaleY: [1, 1, 0.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 2.5, times: [0, 0.93, 0.96, 1], ease: "easeInOut" }}
        style={{ transformOrigin: "0px -1px" }}
      >
        <circle cx={-4 + (shouldReduceMotion ? 0 : eyeOffset.x * 0.4)} cy={-1 + (shouldReduceMotion ? 0 : eyeOffset.y * 0.3)} r="1.5" fill="currentColor" />
        <circle cx={4 + (shouldReduceMotion ? 0 : eyeOffset.x * 0.4)} cy={-1 + (shouldReduceMotion ? 0 : eyeOffset.y * 0.3)} r="1.5" fill="currentColor" />
      </motion.g>
      {/* A smile — morphs to wider curve M -4 2 Q 0 5.5 4 2 on hover */}
      <motion.path
        animate={{ d: isHovered ? "M -4 2 Q 0 5.5 4 2" : "M -3 2 Q 0 4.5 3 2" }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function BotCursor({ isOpen = false, onClick }: { isOpen?: boolean; onClick?: () => void }) {
  const shouldReduceMotion = useReducedMotion();
  const [hasHovered, setHasHovered] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight * 0.65 : 400);
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 180 });
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const botRef = useRef<HTMLButtonElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (shouldReduceMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      setIsIdle(false);
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setIsIdle(true), 3000);
      const margin = 100;
      const maxY = window.innerHeight - 120;
      mouseY.set(Math.max(margin, Math.min(e.clientY - 30, maxY)));

      if (botRef.current) {
        const rect = botRef.current.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        setEyeOffset({ x: Math.max(-3, Math.min(3, (dx / dist) * 3)), y: Math.max(-2.5, Math.min(2.5, (dy / dist) * 2.5)) });
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(idleTimerRef.current);
    };
  }, [mouseY, shouldReduceMotion]);

  useEffect(() => {
    const timer = setTimeout(() => { if (!hasHovered) setShowTooltip(false); }, 6000);
    return () => clearTimeout(timer);
  }, [hasHovered]);

  if (isOpen) return null;

  return (
    <motion.div
      style={shouldReduceMotion ? { bottom: 24, right: 24 } : { top: smoothY, right: 24 }}
      className="fixed z-40 flex items-center gap-2 select-none"
    >
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
      {/* Gentle bob animation when idle >3s */}
      <motion.div
        animate={isIdle && !shouldReduceMotion ? { y: [0, -2, 0] } : { y: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.button
          ref={botRef}
          type="button"
          onClick={onClick}
          onMouseEnter={() => { setHasHovered(true); setShowTooltip(true); }}
          onMouseLeave={() => setHasHovered(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="group relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-border-strong glass-2 text-primary shadow-xl hover:shadow-2xl hover:border-accent transition-all focus-visible:outline-none"
          style={{
            boxShadow: hasHovered
              ? "0 0 24px var(--accent-primary-glow, rgba(37, 99, 235, 0.4))"
              : "0 8px 24px var(--shadow-color)",
          }}
          aria-label="Open TaxWise AI Assistant"
        >
          <BotFaceSVG size={42} isHovered={hasHovered} eyeOffset={eyeOffset} />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-surface bg-success" />
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
