"use client";

import {
  useRef,
  useLayoutEffect,
  useState,
  useEffect,
} from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useLenis } from "@studio-freight/react-lenis";
import {
  Momo_Trust_Display,
  Momo_Trust_Sans,
} from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

const momoDisplay = Momo_Trust_Display({
  subsets: ["latin"],
  weight: ["400"],
});
const momoSans = Momo_Trust_Sans({
  subsets: ["latin"],
  weight: ["400"],
});

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const [scrollY, setScrollY] = useState(0);
  const [hintThreshold, setHintThreshold] = useState(300);
  const lastScrollRef = useRef(0);

  // Intro / loader states
  const [progress, setProgress] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [enableIntro, setEnableIntro] = useState(false);

  // decide if we should show intro at all (only first visit)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.sessionStorage.getItem("seenIntro");
    if (!seen) {
      setEnableIntro(true);
    }
  }, []);

  // threshold for "scroll for more"
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHintThreshold(window.innerHeight * 0.8);
    }
  }, []);

  // watch video load only for the intro
  useEffect(() => {
    if (!enableIntro) return;

    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      setIsVideoReady(true);
    };

    video.addEventListener("loadeddata", handleLoaded);
    return () => {
      video.removeEventListener("loadeddata", handleLoaded);
    };
  }, [enableIntro]);

  // progress 0 → 100 only when intro enabled
  useEffect(() => {
    if (!enableIntro) return;

    let frameId: number;
    let start: number | null = null;
    const duration = 1200; // ms

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const next = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(next);
      if (elapsed < duration) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [enableIntro]);

  const introFinished = progress >= 100 && isVideoReady;
  const showLoader = enableIntro && !introFinished;

  // Once intro is fully done, mark as seen so we never show it again
  useEffect(() => {
    if (!enableIntro) return;
    if (introFinished && typeof window !== "undefined") {
      window.sessionStorage.setItem("seenIntro", "1");
    }
  }, [enableIntro, introFinished]);

  // Lenis → video scrub + scroll state
  useLenis(({ scroll }) => {
    const video = videoRef.current;

    if (video && video.duration && !isNaN(video.duration)) {
      const TOTAL_SCROLL = window.innerHeight * 8;
      const clamped = Math.max(0, Math.min(scroll, TOTAL_SCROLL));
      const p = clamped / TOTAL_SCROLL;
      video.currentTime = p * video.duration;
    }

    setScrollY(scroll);

    const last = lastScrollRef.current;
    const diff = scroll - last;
    const threshold = 100;

    if (scroll < 100) {
      // fine at top
    } else if (diff > threshold || diff < -threshold) {
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

  const hintOpacity = Math.max(0, 1 - scrollY / hintThreshold);

  return (
    <>
      {/* LOADER (only on very first visit) */}
      <AnimatePresence>
        {showLoader && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              initial={{ scale: 0.8, borderRadius: 32, opacity: 0 }}
              animate={{ scale: 1, borderRadius: 24, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="px-8 py-4 border border-white/20 bg-black/70"
            >
              <span
                className={`${momoDisplay.className} text-3xl tracking-[0.25em]`}
              >
                {progress}%
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT with intro scale-up */}
      <motion.main
        className={`relative min-h-screen overflow-x-hidden text-white ${
          enableIntro && !introFinished
            ? "flex items-center justify-center"
            : ""
        }`}
        initial={{
          scale: enableIntro ? 0.8 : 1,
          borderRadius: enableIntro ? 32 : 0,
          opacity: enableIntro ? 0 : 1,
        }}
        animate={{
          scale: !enableIntro || introFinished ? 1 : 0.8,
          borderRadius: !enableIntro || introFinished ? 0 : 32,
          opacity: !enableIntro || introFinished ? 1 : 0,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Background video: fixed to viewport */}
        <video
          ref={videoRef}
          className="fixed top-0 left-0 w-screen h-screen object-cover -z-10"
          src="/bg.webm"
          muted
          playsInline
          preload="metadata"
        />

        {/* Content wrapper */}
        <div className="flex min-h-screen flex-col relative z-10">
          <section
            ref={heroRef}
            className="flex flex-1 flex-col justify-center px-6 pt-24 py-12 md:px-10 lg:px-40 text-center md:text-left"
          >
            <h1
              className={`${momoDisplay.className} max-w-3xl text-4xl font-bold md:text-6xl mx-auto md:mx-0`}
            >
              I design &amp; build clean, minimal web experiences.
            </h1>

            <p
              className={`${momoSans.className} mt-4 max-w-xl mx-auto md:mx-0 text-base md:text-lg text-gray-100/90`}
            >
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

            {/* Scroll hint */}
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

        {/* SCROLL AREA for video scrub */}
        <div style={{ height: "800vh" }} />
      </motion.main>
    </>
  );
}
