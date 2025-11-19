"use client";

import Link from "next/link";
import { projects } from "@/lib/projects";
import { motion } from "framer-motion";
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

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-32">
          {/* Back Button */}
          <Link 
            href="/" 
            className="group inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-12"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>

          {/* Title & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={`text-6xl md:text-7xl lg:text-8xl font-bold mb-6 ${momoDisplay.className}`}>
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Projects
              </span>
            </h1>
            <p className={`text-lg md:text-xl text-white/70 max-w-2xl ${momoSans.className}`}>
              A curated selection of work across web development, crypto, and innovative product experiments.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="relative mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="group relative block h-full"
              >
                {/* Card */}
                <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2">
                  {/* Hover Gradient Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Project Number */}
                    <div className="mb-4 text-5xl font-bold text-white/5 transition-all duration-500 group-hover:text-white/10">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Title */}
                    <h2 className={`text-2xl md:text-3xl font-bold mb-3 transition-colors group-hover:text-purple-300 ${momoDisplay.className}`}>
                      {project.title}
                    </h2>

                    {/* Tagline */}
                    <p className={`text-sm md:text-base text-white/60 mb-6 leading-relaxed ${momoSans.className}`}>
                      {project.tagline}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {project.year}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>{project.role}</span>
                    </div>

                    {/* Arrow Icon */}
                    <div className="absolute bottom-8 right-8 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 transition-all duration-500 group-hover:bg-white/10 group-hover:scale-110">
                      <svg className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="relative mx-auto max-w-7xl px-6 pb-32">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 p-12 md:p-16 text-center">
          <h3 className={`text-3xl md:text-4xl font-bold mb-4 ${momoDisplay.className}`}>
            Want to work together?
          </h3>
          <p className={`text-white/60 mb-8 ${momoSans.className}`}>
            Let's create something amazing
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all hover:scale-105"
          >
            Get in touch
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
