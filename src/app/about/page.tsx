"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import BookingSchedule from "@/components/BookingSchedule";

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.0, ease: "power3.out", delay: 0.4 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <main className="relative min-h-screen bg-[#030303] text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#030303]/80 backdrop-blur-md border-b border-white/[0.06] px-8 md:px-24 flex items-center justify-between h-16">
        <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-accent uppercase select-none">
          JJ FILMS
        </span>
        <ul className="flex items-center gap-6 md:gap-10">
          {[
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
            { label: "Real Estate", href: "/real-estate" },
          ].map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-foreground/50 hover:text-accent transition-colors duration-300"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/"
          className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-foreground/40 hover:text-foreground transition-colors duration-300 flex items-center gap-2"
        >
          <span>&larr;</span>
          <span className="hidden md:inline">Back</span>
        </Link>
      </nav>

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative h-[60vh] md:h-[70vh] flex items-end px-8 md:px-24 pb-16 md:pb-24 bg-[#030303] overflow-hidden pt-16"
      >
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-accent/[0.06] blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent/[0.05] blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-accent/30" />
          <div className="absolute top-0 left-1/4 h-full w-[1px] bg-accent/20" />
          <div className="absolute top-0 left-3/4 h-full w-[1px] bg-accent/20" />
        </div>
        <div className="relative z-10 max-w-5xl">
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.45em] text-accent uppercase block mb-5">
            ABOUT US // JJ FILMS
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light italic tracking-wide text-foreground leading-[0.95]">
            Vision through
            <br />
            <span className="text-accent not-italic">the lens</span>
          </h1>
        </div>
      </section>

      {/* Content */}
      <div ref={contentRef} className="relative bg-[#0d0d10] border-t border-white/5">
        {/* Brand Story */}
        <section className="px-8 md:px-24 py-24 md:py-32 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-5 flex flex-col gap-4">
              <span className="font-mono text-[9px] tracking-[0.4em] text-accent uppercase">01 // STUDIO</span>
              <h2 className="font-display text-3xl md:text-4xl font-light tracking-wide text-foreground">
                Where cinematic craft meets real-world storytelling
              </h2>
            </div>
            <div className="lg:col-span-7 flex flex-col gap-6 justify-center">
              <p className="font-body text-base md:text-lg text-foreground/60 leading-relaxed">
                JJ Films is a premium visual production studio specialising in real estate, luxury property, and architectural media. We blend documentary sensibility with editorial precision — turning properties into stories that move buyers, inspire investors, and elevate brands.
              </p>
              <p className="font-body text-base md:text-lg text-foreground/60 leading-relaxed">
                Every shoot is crafted around light, geometry, and atmosphere. We do not just document spaces — we give them a voice.
              </p>
            </div>
          </div>
        </section>

        <div className="w-full h-[1px] bg-white/5" />

        {/* Values */}
        <section className="relative px-8 md:px-24 py-24 md:py-32 bg-[#030303] overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-accent/[0.06] blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent/[0.06] blur-[120px] pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-16">
              <span className="font-mono text-[9px] tracking-[0.4em] text-accent uppercase">02 // PHILOSOPHY</span>
              <h2 className="font-display text-3xl md:text-4xl font-light tracking-wide text-foreground mt-3">
                What we believe in
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  num: "01",
                  title: "Light is everything",
                  body: "We treat natural and artificial light as our primary medium — shaping mood, depth, and narrative in every frame.",
                },
                {
                  num: "02",
                  title: "Details define luxury",
                  body: "From the texture of a stone facade to the grain of a hardwood floor — we capture what others overlook.",
                },
                {
                  num: "03",
                  title: "Story over specification",
                  body: "Buyers do not fall in love with square footage — they fall in love with how a space makes them feel. We tell that story.",
                },
              ].map(({ num, title, body }) => (
                <div key={num} className="flex flex-col gap-4 border-t border-white/5 pt-8">
                  <span className="font-mono text-[8px] tracking-[0.3em] text-accent/60 uppercase">[{num}]</span>
                  <h3 className="font-display text-xl md:text-2xl font-light text-[#eae6e1]">{title}</h3>
                  <p className="font-body text-sm md:text-base text-foreground/50 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="w-full h-[1px] bg-white/5" />

        {/* CTA */}
        <BookingSchedule btnHref="/#details-contact" />
      </div>
    </main>
  );
}
