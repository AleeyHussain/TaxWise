"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import FloatingBotAvatar from "./FloatingBotAvatar";
import QuickAssistantChat from "./QuickAssistantChat";

export default function GlobalAssistantBot() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <FloatingBotAvatar
        isOpen={isOpen}
        onClick={() => setIsOpen(true)}
      />

      <AnimatePresence>
        {isOpen && (
          <QuickAssistantChat onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
