"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


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
        const cards = gridRef.current.children;
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

      {/* Services Section */}
      <section
        ref={servicesSecRef}
        className="relative py-24 md:py-32 px-8 md:px-24 border-t border-accent/5 bg-background"
      >
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
          <p className="font-body text-xs md:text-sm text-[#7c7c82] max-w-md leading-relaxed">
            From high-end luxury villa features to interactive virtual spaces, explore our specialized suites designed to scale developer property assets.
          </p>
        </div>

        {/* Services Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {SERVICES_LIST.map((service, index) => {
            const num = String(index + 1).padStart(2, "0");
            return (
              <div
                key={index}
                className="group relative bg-[#0a0a0c]/40 border border-accent/10 p-8 md:p-10 rounded-[4px] overflow-hidden flex flex-col justify-between min-h-[220px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#121215]/70 hover:border-accent/40 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_-15px_rgba(197,168,128,0.15)]"
              >
                {/* Micro focus corner brackets for camera viewfinder aesthetic */}
                <div className="absolute top-4 left-4 w-1.5 h-1.5 border-t border-l border-accent/0 group-hover:border-accent/30 transition-colors duration-500" />
                <div className="absolute top-4 right-4 w-1.5 h-1.5 border-t border-r border-accent/0 group-hover:border-accent/30 transition-colors duration-500" />
                <div className="absolute bottom-4 left-4 w-1.5 h-1.5 border-b border-l border-accent/0 group-hover:border-accent/30 transition-colors duration-500" />
                <div className="absolute bottom-4 right-4 w-1.5 h-1.5 border-b border-r border-accent/0 group-hover:border-accent/30 transition-colors duration-500" />

                {/* Service Header Info */}
                <div className="flex justify-between items-start gap-4">
                  <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-accent/80 group-hover:text-accent transition-colors duration-500 font-semibold">
                    [{num}]
                  </span>
                  {/* Large background watermark number */}
                  <span className="font-display font-extrabold text-7xl text-foreground/5 group-hover:text-accent/5 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] select-none absolute right-6 top-4 group-hover:-translate-y-1">
                    {num}
                  </span>
                </div>

                {/* Service Body content */}
                <div className="mt-8 relative z-10">
                  <h3 className="font-display text-2xl md:text-3xl font-light text-[#eae6e1] group-hover:text-foreground transition-colors duration-500">
                    {service.title}
                  </h3>
                  <p className="font-body text-xs md:text-sm text-foreground/60 mt-4 leading-relaxed group-hover:text-foreground/75 transition-colors duration-500">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Placeholder Section */}
      <section
        ref={bottomSecRef}
        className="relative min-h-[50vh] md:min-h-[60vh] bg-black/40 border-t border-accent/5 flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Technical Focus Grid Graphic in Background */}
        <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
          <div className="w-[80%] h-[80%] border border-accent/50 rounded-full relative flex items-center justify-center">
            <div className="absolute w-[10px] h-[10px] border-t border-l border-accent/80 -top-[5px] -left-[5px]" />
            <div className="absolute w-[10px] h-[10px] border-t border-r border-accent/80 -top-[5px] -right-[5px]" />
            <div className="absolute w-[10px] h-[10px] border-b border-l border-accent/80 -bottom-[5px] -left-[5px]" />
            <div className="absolute w-[10px] h-[10px] border-b border-r border-accent/80 -bottom-[5px] -right-[5px]" />
            
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          </div>
        </div>

        {/* Text Label */}
        <div className="text-center z-10 p-8 select-none">
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.45em] text-accent/35 uppercase">
            [ SECTION II — FUTURE EXPANSION ]
          </span>
          <p className="font-body text-[10px] text-foreground/30 mt-4 max-w-xs mx-auto leading-relaxed uppercase tracking-[0.2em]">
            Asset galleries, builder showcases, and interactive 3D elements coming soon.
          </p>
        </div>
      </section>
    </main>
  );
}
