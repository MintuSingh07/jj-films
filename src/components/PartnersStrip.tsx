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
      <span className="font-display text-sm tracking-[0.25em] font-light uppercase">
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

  return (
    <div className="w-[94%] max-w-7xl mx-auto my-6 md:my-10 relative z-30">
      {/* Visual thin ribbon wrapper */}
      <div className="w-full py-8 md:py-10 border-t border-b border-accent/10 bg-black/10 backdrop-blur-md rounded-[4px] px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Label */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-accent/70 font-semibold">
            Trusted Partners & Collaborators
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        </div>

        {/* Logos Container */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-14">
          {partners.map((partner, idx) => (
            <PartnerLogo key={idx} name={partner.name} logo={partner.logo} />
          ))}
        </div>

      </div>
    </div>
  );
}
