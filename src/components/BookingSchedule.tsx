"use client";

import React from "react";

interface BookingScheduleProps {
  onBtnClick?: () => void;
  btnHref?: string;
}

export default function BookingSchedule({ onBtnClick, btnHref = "/#details-contact" }: BookingScheduleProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onBtnClick) {
      e.preventDefault();
      onBtnClick();
    } else if (btnHref.startsWith("#") || btnHref.startsWith("/#")) {
      const targetId = btnHref.split("#")[1];
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="details-cta"
      className="relative py-14 md:py-20 px-8 md:px-24 bg-[#030303] overflow-hidden border-t border-b border-white/5"
    >
      {/* Subtle corner ambient lighting */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-accent/[0.07] blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent/[0.07] blur-[120px] pointer-events-none select-none" />
      {/* Subtle golden backdrop flares */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Glowing vertical bars on sides */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 h-[60%] w-[1px] bg-gradient-to-b from-transparent via-accent/30 to-transparent opacity-40 hidden md:block" />
      <div className="absolute right-6 top-1/2 -translate-y-1/2 h-[60%] w-[1px] bg-gradient-to-b from-transparent via-accent/30 to-transparent opacity-40 hidden md:block" />

      <div className="max-w-4xl mx-auto relative z-10 text-center flex flex-col items-center gap-8">
        <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-accent uppercase block animate-pulse">
          PRODUCTION SCHEDULE // NOW BOOKING Q3 &amp; Q4
        </span>

        <h2 className="font-display text-4xl md:text-7xl font-light tracking-tight text-foreground leading-[1.1] max-w-3xl">
          Ready to direct your{" "}
          <span className="italic font-serif text-accent">
            visual masterpiece
          </span>
          ?
        </h2>

        <p className="font-body text-sm md:text-base text-[#eae6e1]/70 max-w-xl leading-relaxed">
          Secure your production date with our award-winning
          cinematography team. Drop a brief or call directly to
          review storyboarding and custom camera treatments.
        </p>

        {onBtnClick ? (
          <button
            onClick={handleClick}
            className="inline-flex items-center justify-center font-mono text-[9px] tracking-[0.25em] uppercase border border-accent hover:bg-accent hover:text-background text-accent px-8 py-4 rounded-[4px] transition-all duration-500 font-semibold cursor-pointer outline-none bg-transparent"
          >
            Secure Production Date
          </button>
        ) : (
          <a
            href={btnHref}
            className="inline-flex items-center justify-center font-mono text-[9px] tracking-[0.25em] uppercase border border-accent hover:bg-accent hover:text-background text-accent px-8 py-4 rounded-[4px] transition-all duration-500 font-semibold cursor-pointer outline-none bg-transparent"
          >
            Secure Production Date
          </a>
        )}
      </div>
    </section>
  );
}
