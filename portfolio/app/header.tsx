"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "@studio-freight/react-lenis";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Momo_Trust_Display, Momo_Trust_Sans } from "next/font/google";

// Fonts
const momoDisplay = Momo_Trust_Display({ subsets: ["latin"], weight: ["400"] });
const momoSans = Momo_Trust_Sans({ subsets: ["latin"], weight: ["400"] });

// Navigation links
const links = [
  { href: "/projects", label: "PROJECTS" },
  { href: "/about", label: "ABOUT" },
];

export default function Header() {
  const pathname = usePathname();

  // Header visibility state
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollRef = useRef(0);

  // Hide/show on scroll
  useLenis(({ scroll }) => {
    const last = lastScrollRef.current;
    const diff = scroll - last;
    const threshold = 100;

    if (scroll < 100) {
      setShowHeader(true);
    } else if (diff > threshold) {
      setShowHeader(false); // scroll down → hide
      lastScrollRef.current = scroll;
    } else if (diff < -threshold) {
      setShowHeader(true); // scroll up → show
      lastScrollRef.current = scroll;
    }
  });

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-20 
        flex items-center justify-between
        px-[25px] py-5
        transition-transform duration-300
        bg-gradient-to-b from-black/10 to-transparent
        text-white

        ${showHeader ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      {/* Logo (click → go home) */}
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={200}
          className="
            object-contain 
            ml-2 md:ml-15
            w-10 h-auto
            md:w-16 md:h-auto
          "
         />
      </Link>

      {/* Navigation */}
      <nav
        className={`
          flex gap-10 pl-10
          text-[12px] md:text-[16px]
          tracking-widest md:tracking-wide
          md:mr-20 md:gap-25
          ${momoSans.className}
        `}
      >
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <div key={link.href} className="relative">
              <Link href={link.href} className="hover:opacity-50">
                {link.label}
              </Link>

              {/* Animated underline under active link */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute left-0 right-0 -bottom-1 h-[2px] bg-white"
                  />
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </header>
  );
}
