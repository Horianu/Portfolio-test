"use client";

import {
  useRef,
  useLayoutEffect,
  useState,
  useEffect,
} from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@studio-freight/react-lenis";
import {
  Momo_Trust_Display,
  Momo_Trust_Sans,
} from "next/font/google";

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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  
  // Add ref for smooth video time interpolation
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const animationFrameRef = useRef<number>(0);
  const featuredRef = useRef(null);

  const [scrollY, setScrollY] = useState(0);
  const [hintThreshold] = useState(300);

  // Loading states - only show on first visit
  const [progress, setProgress] = useState(0);
  const [showIntro, setShowIntro] = useState(false);

  // Register GSAP
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Check if first visit using sessionStorage
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisitedHome');
    
    if (!hasVisited) {
      setShowIntro(true);
      sessionStorage.setItem('hasVisitedHome', 'true');
    }
  }, []);

  // Loading animation logic
  useEffect(() => {
    if (!showIntro) return;

    let progressInterval: NodeJS.Timeout;
    let timeoutFallback: NodeJS.Timeout;

    timeoutFallback = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setShowIntro(false), 300);
    }, 3000);

    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 100);

    const video = videoRef.current;
    if (video) {
      const handleCanPlay = () => {
        setProgress(100);
        clearInterval(progressInterval);
        clearTimeout(timeoutFallback);
        setTimeout(() => setShowIntro(false), 500);
      };

      video.addEventListener('canplaythrough', handleCanPlay);
      video.addEventListener('loadeddata', handleCanPlay);

      return () => {
        video.removeEventListener('canplaythrough', handleCanPlay);
        video.removeEventListener('loadeddata', handleCanPlay);
        clearInterval(progressInterval);
        clearTimeout(timeoutFallback);
      };
    }

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeoutFallback);
    };
  }, [showIntro]);

  // Smooth video time interpolation loop
  useEffect(() => {
    const smoothVideoUpdate = () => {
      const video = videoRef.current;
      if (!video) return;

      // Lerp the current time towards the target time for smooth transitions
      const lerpFactor = 0.1; // Adjust for smoothness (0.05-0.15)
      currentTimeRef.current += (targetTimeRef.current - currentTimeRef.current) * lerpFactor;
      
      // Only update if there's a meaningful difference
      if (Math.abs(video.currentTime - currentTimeRef.current) > 0.01) {
        video.currentTime = currentTimeRef.current;
      }

      animationFrameRef.current = requestAnimationFrame(smoothVideoUpdate);
    };

    animationFrameRef.current = requestAnimationFrame(smoothVideoUpdate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Inside useLayoutEffect:
gsap.fromTo(
  featuredRef.current,
  { opacity: 0, y: 100 },
  {
    scrollTrigger: {
      trigger: featuredRef.current,
      start: "top 20%",    // When the top of "Featured Work" hits 80% of viewport
      end: "top 60%",      // When "Featured Work" is further up
      scrub: 0.5,
    },
    opacity: 1,
    y: 0,
    ease: "power2.out"
  }
);

  // Scroll-based video scrubbing with smooth interpolation
  useLenis(({ scroll }) => {
    setScrollY(scroll);

    const video = videoRef.current;
    const hero = heroRef.current;

    if (!video || !hero || !video.duration || isNaN(video.duration)) return;

    const heroHeight = hero.offsetHeight;
    const totalScrollHeight = heroHeight * 1;

    const clamped = Math.max(0, Math.min(scroll, totalScrollHeight));
    const progress = clamped / totalScrollHeight;

    // Update target time instead of directly setting currentTime
    targetTimeRef.current = progress * video.duration;
  });

  // GSAP animations with text fade out
  useLayoutEffect(() => {
    if (showIntro) return;

    const ctx = gsap.context(() => {
      // Hero fade in
      gsap.from(heroRef.current, {
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      });

      // Scroll hint animation
      gsap.to(".scroll-hint", {
        y: -10,
        opacity: 0.7,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      // Video scale animation on scroll
      if (videoRef.current && heroRef.current) {
        gsap.to(videoRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
          scale: 1.1,
          ease: "none"
        });
      }

      // Text fade out and move up as you scroll
      if (titleRef.current && heroRef.current) {
        gsap.to(titleRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 20%",
            end: "10% top",
            scrub: 1,
          },
          opacity: 0,
          y: -450,
          ease: "power2.in"
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, [showIntro]);

  const showScrollHint = scrollY < hintThreshold && !showIntro;

  return (
    <div ref={containerRef} className="relative bg-black">
      {/* Loading Screen */}
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="text-center">
            <div className={`text-6xl font-bold text-white mb-4 ${momoDisplay.className}`}>
              {Math.floor(progress)}%
            </div>
            <div className="h-1 w-64 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative h-[1000vh]"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <video
            ref={videoRef}
            src="/bg.webm"
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />

          {/* Hero content - Will fade out as you scroll */}
          <div 
            ref={titleRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          >
            <h1 
              className={`text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 ${momoDisplay.className}`}
            >
              Your Portfolio
            </h1>
            <p className={`text-lg md:text-xl text-white/80 max-w-2xl ${momoSans.className}`}>
              Creative developer & designer
            </p>
          </div>

          {/* Scroll hint */}
          {showScrollHint && (
            <div className="scroll-hint absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
              <span className={`text-sm text-white/60 uppercase tracking-wider ${momoSans.className}`}>
                Scroll
              </span>
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                <div className="w-1 h-3 bg-white/50 rounded-full animate-wobble" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content sections */}
      <section className="relative z-10 bg-black min-h-screen py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-4xl md:text-5xl font-bold text-white mb-8 ${momoDisplay.className}`}>
            Featured Work
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href="/projects"
              className="group relative inline-flex h-20 px-8 items-center justify-center rounded-lg bg-white/10 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300 focus:outline-none"
            >
              <span className={`relative z-10 text-lg font-medium text-white transition-colors duration-300 ${momoSans.className}`}>
                View Projects
              </span>
              {/* Underline animate-in */}
              <span className="absolute left-1/2 -translate-x-1/2 bottom-2 w-0 h-0.5 bg-gradient-to-r from-purple-400 via-blue-400 to-orange-400 rounded transition-all duration-300 group-hover:w-2/3"></span>
            </Link>

            <Link
              href="/about"
              className="group relative inline-flex h-20 px-8 items-center justify-center rounded-lg bg-white/10 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300 focus:outline-none"
            >
              <span className={`relative z-10 text-lg font-medium text-white transition-colors duration-300 ${momoSans.className}`}>
                About Me
              </span>
              {/* Underline animate-in */}
              <span className="absolute left-1/2 -translate-x-1/2 bottom-2 w-0 h-0.5 bg-gradient-to-r from-purple-400 via-blue-400 to-orange-400 rounded transition-all duration-300 group-hover:w-2/3"></span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
