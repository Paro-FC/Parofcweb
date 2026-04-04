"use client";

import { useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Standings", href: "/standings" },
  { label: "Shop", href: "/shop" },
  { label: "Photos", href: "/photos" },
  { label: "Players", href: "/players" },
  { label: "News", href: "/news" },
  { label: "Calendar", href: "/calendar" },
];

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-[60]"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-dark-charcoal shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-14 flex-shrink-0">
              <Link href="/" onClick={onClose} className="flex-shrink-0">
                <Image
                  src="/assets/logo.webp"
                  alt="Paro FC"
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain"
                />
              </Link>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="h-px bg-white/5" />

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-4">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.03 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-center justify-between px-5 py-4 cursor-pointer"
                  >
                    <span className="text-sm font-bold text-white/60 uppercase tracking-widest group-hover:text-barca-gold transition-colors duration-200">
                      {item.label}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-white/10 group-hover:text-barca-gold transition-colors duration-200"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer accent */}
            <div className="h-px bg-gradient-to-r from-barca-red via-barca-gold to-bronze" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
