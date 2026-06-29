"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WhatsAppButton from "@/components/WhatsAppButton";
import TrustStrip from "@/components/TrustStrip";
import PartnersStrip from "@/components/PartnersStrip";
import BookingSchedule from "@/components/BookingSchedule";


const SERVICES_LIST = [
  {
    title: "Property Photography",
    description: "High-quality interior and exterior photography for residential, commercial, and luxury properties.",
  },
  {
    title: "Real Estate Videography",
    description: "Cinematic property walkthrough videos designed to showcase spaces and increase buyer engagement.",
  },
  {
    title: "Drone Photography & Videography",
    description: "Aerial photography and cinematic drone footage highlighting location, scale, surroundings, and amenities.",
  },
  {
    title: "Luxury Property Films",
    description: "Premium storytelling videos for luxury villas, penthouses, resorts, and high-end developments.",
  },
  {
    title: "Builder & Developer Project Shoots",
    description: "Marketing visuals for ongoing and completed residential and commercial projects.",
  },
  {
    title: "Architectural Photography",
    description: "Professional photography focusing on design, materials, lighting, and architectural details.",
  },
  {
    title: "Interior Photography",
    description: "Showcasing interiors, furnishings, decor, and spatial aesthetics for designers and developers.",
  },
  {
    title: "Property Marketing Reels",
    description: "Short-form Instagram, Facebook, and YouTube reels optimized for social media marketing.",
  },
  {
    title: "Virtual Property Tours",
    description: "Immersive walkthrough experiences allowing potential buyers to explore remotely.",
  },
  {
    title: "Construction Progress Documentation",
    description: "Periodic photography and videography to track project development milestones.",
  },
  {
    title: "360° Virtual Tours",
    description: "Interactive virtual walkthroughs that allow viewers to explore properties remotely from any device.",
  },
];

export default function RealEstatePage() {
  const [showAll, setShowAll] = useState(false);
  const [hoveredRect, setHoveredRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const servicesSecRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const bottomSecRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Entrance animations using GSAP
    const ctx = gsap.context(() => {
      // 1. Hero entrance
      gsap.fromTo(
        heroRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power3.out" }
      );

      gsap.fromTo(
        [subtitleRef.current, titleRef.current, descRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.3,
        }
      );

      // 2. Services section entrance trigger
      gsap.fromTo(
        servicesSecRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: servicesSecRef.current,
            start: "top 80%",
          },
        }
      );

      // 3. Grid cards staggered entrance
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll(".service-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // 4. Bottom empty section subtle fade
      gsap.fromTo(
        bottomSecRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.0,
          scrollTrigger: {
            trigger: bottomSecRef.current,
            start: "top 90%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation Back Button */}
      <nav className="absolute top-8 left-8 md:top-12 md:left-16 z-40">
        <Link
          href="/?scroll=cards&transition=close"
          className="group inline-flex items-center gap-3.5 font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-foreground/60 transition-colors duration-500 hover:text-accent"
        >
          <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-2">
            ←
          </span>
          <span>Back to Cinema</span>
        </Link>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-[80vh] md:h-[90vh] flex items-center justify-start px-8 md:px-24 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: "url('/images/real_estate_hero.png')",
        }}
      >
        {/* Cinematic Vignette/Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40 z-10" />
        
        {/* Dynamic backdrop grid lines for high-end look */}
        <div className="absolute inset-0 z-15 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-accent/25" />
          <div className="absolute top-0 left-1/4 h-full w-[1px] bg-accent/25" />
          <div className="absolute top-0 left-3/4 h-full w-[1px] bg-accent/25" />
        </div>

        {/* Hero Copy */}
        <div className="relative z-20 max-w-3xl mt-12">
          <span
            ref={subtitleRef}
            className="font-mono text-[10px] md:text-xs tracking-[0.45em] text-accent uppercase block mb-4"
          >
            Architectural Spaces, Elevated
          </span>
          <h1
            ref={titleRef}
            className="font-display text-5xl md:text-8xl font-light italic tracking-normal text-foreground leading-[1.05]"
          >
            Real Estate<br />Cinematic Vision
          </h1>
          <p
            ref={descRef}
            className="font-body text-xs md:text-base text-foreground/75 mt-8 leading-relaxed max-w-xl"
          >
            We document luxury estates, residential masterpieces, and commercial developments with pristine clarity. Every angle is carefully composed using cinematic camera motion, volumetric lighting, and advanced stabilizations to deliver absolute visual prestige.
          </p>
        </div>
      </section>

      <TrustStrip />

      {/* Services Section */}
      <section
        ref={servicesSecRef}
        className="relative py-24 md:py-32 px-8 md:px-24 border-t border-accent/5 bg-background overflow-hidden"
      >
        {/* Subtle corner ambient lighting */}
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-accent/[0.07] blur-[120px] pointer-events-none select-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent/[0.07] blur-[120px] pointer-events-none select-none" />
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-6">
          <div>
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-accent uppercase">
              EXPERTISE & CAPABILITIES
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-light italic tracking-wide text-foreground mt-3">
              Real Estate Services
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-6">
            <p className="font-body text-sm md:text-base text-foreground/80 max-w-md leading-relaxed md:text-right">
              From high-end luxury villa features to interactive virtual spaces, explore our specialized suites designed to scale developer property assets.
            </p>
            {!showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="group inline-flex items-center gap-2.5 font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-accent border border-accent/30 hover:border-accent bg-transparent px-7 py-3 rounded-[4px] transition-all duration-500 hover:bg-accent/10 cursor-pointer outline-none font-semibold shadow-sm"
              >
                <span>View more</span>
                <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5">
                  →
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Services Grid */}
        <div
          ref={gridRef}
          className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
          onMouseLeave={() => setHoveredRect(null)}
        >
          {/* Liquid Flow Overlay */}
          <div
            className="absolute pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.25,1,0.3,1)] z-20 bg-white"
            style={{
              left: hoveredRect ? hoveredRect.left : 0,
              top: hoveredRect ? hoveredRect.top : 0,
              width: hoveredRect ? hoveredRect.width : 0,
              height: hoveredRect ? hoveredRect.height : 0,
              opacity: hoveredRect ? 1 : 0,
              transform: hoveredRect ? "scale(1.02)" : "scale(0.95)",
              mixBlendMode: "difference",
              borderRadius: "4px",
              animation: "morphLiquid 6s ease-in-out infinite alternate",
            }}
          />

          {(showAll ? SERVICES_LIST : SERVICES_LIST.slice(0, 8)).map((service, index) => {
            const num = String(index + 1).padStart(2, "0");
            return (
              <div
                key={index}
                className="service-card group relative flex flex-col bg-[#0a0a0c]/60 border border-accent/15 rounded-[4px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#121215]/80 hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_rgba(197,168,128,0.15)]"
                onMouseEnter={(e) => {
                  const card = e.currentTarget;
                  setHoveredRect({
                    left: card.offsetLeft,
                    top: card.offsetTop,
                    width: card.offsetWidth,
                    height: card.offsetHeight,
                  });
                }}
              >
                {/* Image Placeholder Area */}
                <div className="relative aspect-[4/3] w-full bg-[#070709] overflow-hidden flex items-center justify-center">
                  {/* Placeholder reticle/crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    <div className="relative w-10 h-10 flex items-center justify-center opacity-20 group-hover:opacity-45 transition-opacity duration-500">
                      <div className="absolute inset-0 border border-dashed border-accent rounded-full group-hover:rotate-45 transition-transform duration-1000" />
                      <div className="w-1 h-1 rounded-full bg-accent" />
                    </div>
                  </div>

                  {/* Technical camera data label */}
                  <div className="absolute top-3 left-4 font-mono text-[7px] text-[#7c7c82]/60 uppercase tracking-widest pointer-events-none select-none">
                    FRAME // {num}
                  </div>
                  <div className="absolute bottom-3 right-4 font-mono text-[7px] text-accent/50 uppercase tracking-widest pointer-events-none select-none group-hover:text-accent transition-colors duration-500">
                    [ PENDING IMAGE ]
                  </div>

                  {/* Viewfinder focus brackets */}
                  <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-accent/20 group-hover:border-accent/60 transition-colors duration-500" />
                  <div className="absolute top-3 right-3 w-1.5 h-1.5 border-t border-r border-accent/20 group-hover:border-accent/60 transition-colors duration-500" />
                  <div className="absolute bottom-3 left-3 w-1.5 h-1.5 border-b border-l border-accent/20 group-hover:border-accent/60 transition-colors duration-500" />
                  <div className="absolute bottom-3 right-3 w-1.5 h-1.5 border-b border-r border-accent/20 group-hover:border-accent/60 transition-colors duration-500" />
                </div>

                {/* Card Info Section */}
                <div className="p-5 border-t border-accent/5 bg-black/20">
                  <h3 className="font-display text-base md:text-lg font-light text-[#eae6e1] group-hover:text-foreground transition-colors duration-500 tracking-wide truncate">
                    {service.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <PartnersStrip />

      {/* Bottom Placeholder Section */}
      {/* Booking Schedule CTA Section */}
      <BookingSchedule btnHref="/#details-contact" />
      <WhatsAppButton />
    </main>
  );
}
