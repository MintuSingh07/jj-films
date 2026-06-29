"use client";

import React from "react";

export default function TrustStrip() {
  const items = [
    {
      // Experience Award Badge Icon
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.2"
          stroke="currentColor"
          className="w-7 h-7 text-accent"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
          />
        </svg>
      ),
      value: "8+ Years",
      label: "Cinematic Craft",
    },
    {
      // Video Camera / Film Reel Icon
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.2"
          stroke="currentColor"
          className="w-7 h-7 text-accent"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      ),
      value: "150+ Projects",
      label: "Estates & Campaigns",
    },
    {
      // Star / Rating Icon
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.2"
          stroke="currentColor"
          className="w-7 h-7 text-accent"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499c.195-.39.73-.39.925 0l2.09 4.184 4.593.669c.432.063.605.59.292.896l-3.323 3.24 1.107 4.577c.104.43-.356.766-.74.56l-4.133-2.172-4.133 2.172c-.384.206-.844-.13-.74-.56l1.107-4.577-3.323-3.24c-.313-.306-.14-.833.292-.896l4.593-.669 2.09-4.184Z"
          />
        </svg>
      ),
      value: "5.0 Rating",
      label: "Client Reviews",
    },
    {
      // Drone / Aerial Globe Icon
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.2"
          stroke="currentColor"
          className="w-7 h-7 text-accent"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.003 9.003 0 0 1 8.716 6.747M12 3a9.003 9.003 0 0 0-8.716 6.747M3 12h18"
          />
        </svg>
      ),
      value: "FAA Part 107",
      label: "Certified Aerial Ops",
    },
  ];

  return (
    <div className="w-full bg-[#0d0d10] backdrop-blur-xl border-t border-b border-accent/15 py-8 md:py-10 my-8 md:my-14 relative z-30">
      {/* Subtle decorative corner viewfinder brackets inside */}
      <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-accent/25" />
      <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-accent/25" />
      <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b border-l border-accent/25" />
      <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b border-r border-accent/25" />

      {/* Ambient background light leaks */}
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-accent/3 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-accent/3 blur-3xl pointer-events-none" />

      {/* Grid container spanning full bleed with custom inner padding */}
      <div className="w-full px-6 md:px-16 lg:px-20 flex flex-col md:flex-row items-stretch justify-between gap-6 md:gap-2">
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            {/* Trust item container */}
            <div className="flex-1 flex items-center justify-center md:justify-start gap-5 px-4 py-2 group hover:-translate-y-0.5 transition-all duration-500 select-none">
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-500 relative">
                {/* Glow behind icon on hover */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,_var(--color-accent)_0%,_transparent_75%)] pointer-events-none filter blur-xs" />
                {item.icon}
              </div>

              {/* Value and label */}
              <div className="flex flex-col gap-1.5 text-left">
                <span className="font-display text-3xl md:text-4xl font-light italic tracking-wide text-foreground group-hover:text-accent transition-colors duration-500 leading-none">
                  {item.value}
                </span>
                <span className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-foreground/45 group-hover:text-foreground/75 transition-colors duration-500 uppercase">
                  {item.label}
                </span>
              </div>
            </div>

            {/* Vertical separator line between items on desktop */}
            {idx < items.length - 1 && (
              <div className="hidden md:block w-[1px] bg-accent/15 self-stretch opacity-60" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
