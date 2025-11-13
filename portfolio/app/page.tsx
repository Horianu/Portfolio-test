"use client";

import { useRef, useLayoutEffect, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useLenis } from "@studio-freight/react-lenis";


export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const [scrollY, setScrollY] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollRef = useRef(0);
  const [hintThreshold, setHintThreshold] = useState(300);

  // set threshold relative to viewport height (how fast hint fades out)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHintThreshold(window.innerHeight * 0.8);
    }
  }, []);

  // Lenis → video scrub + header show/hide + hint fade
  useLenis(({ scroll }) => {
    const video = videoRef.current;

    // video scrub
    if (video && video.duration && !isNaN(video.duration)) {
      const TOTAL_SCROLL = window.innerHeight * 8; // adjust if you want
      const clamped = Math.max(0, Math.min(scroll, TOTAL_SCROLL));
      const progress = clamped / TOTAL_SCROLL;
      video.currentTime = progress * video.duration;
    }

    // store scroll for hint opacity
    setScrollY(scroll);

    // header show/hide logic
    const last = lastScrollRef.current;
    const diff = scroll - last;
    const threshold = 100; // small deadzone so it doesn't flicker

    if (scroll < 100) {
      // always show at very top
      setShowHeader(true);
    } else if (diff > threshold) {
      // scrolling down → hide
      setShowHeader(false);
      lastScrollRef.current = scroll;
    } else if (diff < -threshold) {
      // scrolling up → show
      setShowHeader(true);
      lastScrollRef.current = scroll;
    }
  });

  // GSAP hero intro
  useLayoutEffect(() => {
    if (!heroRef.current) return;

    gsap.fromTo(
      heroRef.current,
      { autoAlpha: 0, y: 40 },
      { autoAlpha: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );
  }, []);

  // opacity for "Scroll for more" + arrow
  const hintOpacity = Math.max(0, 1 - scrollY / hintThreshold);

  return (
    <main className="relative min-h-screen overflow-x-hidden text-white">
      {/* Background video: fixed to viewport */}
      <video
        ref={videoRef}
        className="fixed top-0 left-0 w-screen h-screen object-cover -z-10"
        src="/bg.webm"
        muted
        playsInline
        preload="metadata"
      />

      {/* HEADER (hide on scroll down, show on scroll up) */}
      <header
        className={`fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-[25px] py-5 transition-transform duration-300 
          bg-gradient-to-b from-black/10 to-transparent

          ${showHeader ? "translate-y-0" : "-translate-y-full"}
          `}
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={771 / 15}
          height={473 / 2}
          className="object-contain"
        />

        <nav className="flex gap-6 text-sm md:text-base">
          <Link href="/projects" className="hover:opacity-50">
            Projects
          </Link>
        </nav>
      </header>

      {/* Content wrapper */}
      <div className="flex min-h-screen flex-col relative z-10">
        {/* Hero section (animated by GSAP) */}
        <section
          ref={heroRef}
          className="flex flex-1 flex-col justify-center px-6 pt-24 py-12 md:px-16 lg:px-24 text-center md:text-left"
        >
          <h1 className={"${momo.className} max-w-3xl text-4xl font-bold md:text-6xl mx-auto md:mx-0"}>
            I design & build clean, minimal web experiences.
          </h1>

          <p className="mt-4 max-w-xl mx-auto md:mx-0 text-base md:text-lg text-gray-100/90">
            A modern portfolio with scroll-controlled motion.
          </p>

          <div className="mt-8 flex justify-center md:justify-start">
            <Link
              href="/projects"
              className="rounded-full bg-white px-6 py-2 text-sm font-medium text-black hover:bg-gray-100"
            >
              View projects
            </Link>
          </div>

          {/* Scroll hint (fades out on scroll) */}
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center transition-opacity duration-200"
            style={{
              opacity: hintOpacity,
              pointerEvents: hintOpacity <= 0 ? "none" : "auto",
            }}
          >
            <span className="text-sm mb-2 tracking-wide">
              Scroll for more
            </span>
            <div className="animate-wobble">
              <div className="h-8 w-8 border-b-2 border-r-2 border-white rotate-45" />
            </div>
          </div>
        </section>
      </div>

      {/* Extra space for scrolling through the video */}
      <div style={{ height: "800vh" }} />
    </main>
  );
}
