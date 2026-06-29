"use client";

import React from "react";

interface PartnerLogoProps {
  name: string;
  logo: React.ReactNode;
}

function PartnerLogo({ name, logo }: PartnerLogoProps) {
  return (
    <div className="flex items-center gap-3 opacity-30 hover:opacity-85 text-foreground hover:text-accent transition-all duration-500 cursor-default select-none group py-3">
      <div className="w-8 h-8 flex items-center justify-center text-current group-hover:scale-105 transition-transform duration-500">
        {logo}
      </div>
      <span className="font-display text-base md:text-lg tracking-[0.25em] font-light uppercase">
        {name}
      </span>
    </div>
  );
}

export default function PartnersStrip() {
  const partners = [
    {
      name: "Aether",
      // Overlapping triangles
      logo: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-full h-full"
         >
          <path d="M12 3L2 21h20L12 3Z" />
          <path d="M12 9l-6 10h12L12 9Z" />
        </svg>
      ),
    },
    {
      name: "Valo",
      // V inside a square frame
      logo: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-full h-full"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 8l5 8 5-8" />
        </svg>
      ),
    },
    {
      name: "Lumen",
      // Minimalist aperture circle
      logo: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-full h-full"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
        </svg>
      ),
    },
    {
      name: "Vortex",
      // Interlocking geometric chevrons
      logo: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-full h-full"
        >
          <path d="M12 2a10 10 0 0 0-10 10h4a6 6 0 0 1 6-6V2ZM12 22a10 10 0 0 0 10-10h-4a6 6 0 0 1-6 6v4Z" />
        </svg>
      ),
    },
    {
      name: "Apex",
      // Triple chevron peak
      logo: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-full h-full"
        >
          <path d="M4 18l8-10 8 10M8 18l4-5 4 5M12 18V6" />
        </svg>
      ),
    },
  ];

  // Duplicate list to achieve seamless infinite scroll loops
  const marqueeItems = [...partners, ...partners];

  return (
    <div className="w-full bg-[#0d0d10] border-t border-b border-accent/10 py-8 md:py-10 my-6 md:my-10 relative z-30">
      
      {/* Decorative viewfinder brackets in the corners */}
      <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-accent/20" />
      <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-accent/20" />
      <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b border-l border-accent/20" />
      <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b border-r border-accent/20" />

      {/* Subtle corner ambient lighting */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-accent/[0.07] blur-3xl pointer-events-none select-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-accent/[0.07] blur-3xl pointer-events-none select-none" />

      {/* Internal flex container aligned wide-bleed */}
      <div className="w-full px-6 md:px-16 lg:px-20 flex flex-col items-center gap-6">
        
        {/* Label Header */}
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[11px] sm:text-xs md:text-sm tracking-[0.3em] uppercase text-accent/70 font-semibold select-none">
            Trusted Partners & Collaborators
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        </div>

        {/* Marquee viewport */}
        <div className="w-full overflow-hidden relative py-2 mt-2">


          {/* Scrolling Track (tighter gaps for cohesive visual stream) */}
          <div className="flex w-max gap-8 md:gap-14 items-center animate-marquee-ltr hover:[animation-play-state:paused]">
            {marqueeItems.map((partner, idx) => (
              <PartnerLogo
                key={idx}
                name={partner.name}
                logo={partner.logo}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Scoped CSS marquee animation */}
      <style>{`
        @keyframes marquee-ltr {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-marquee-ltr {
          animation: marquee-ltr 22s linear infinite;
        }
      `}</style>
    </div>
  );
}
