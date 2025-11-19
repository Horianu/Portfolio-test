// @ts-nocheck
"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import React from "react";

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,           // Increased from 0.05 for smoother easing
        duration: 1.2,       // Scroll animation duration in seconds
        smoothWheel: true,
        smoothTouch: false,  // Better for mobile
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
