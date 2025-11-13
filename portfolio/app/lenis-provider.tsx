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
        lerp: 0.08,      // smaller = more responsive, bigger = more floaty
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
