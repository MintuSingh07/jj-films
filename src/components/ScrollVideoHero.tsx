"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TOTAL_FRAMES = 240;

export default function ScrollVideoHero() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Preload all frames on mount
  useEffect(() => {
    let active = true;
    const images: HTMLImageElement[] = [];
    let count = 0;

    const handleImageLoad = () => {
      if (!active) return;
      count++;
      setLoadedCount(count);
      if (count === TOTAL_FRAMES) {
        setIsLoaded(true);
      }
    };

    const handleImageError = () => {
      if (!active) return;
      setLoadError(true);
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(3, "0");
      img.src = `/frames/frame-${frameNum}.webp`;
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      active = false;
    };
  }, []);

  // Setup GSAP ScrollTrigger and Canvas rendering once images are loaded
  useEffect(() => {
    if (!isLoaded) return;

    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    const trigger = triggerRef.current;
    if (!canvas || !trigger) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Helper to draw current frame using 'object-cover' logic
    const drawFrame = (frameIndex: number) => {
      const img = imagesRef.current[frameIndex - 1];
      if (!img || !img.complete) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const imgWidth = img.width;
      const imgHeight = img.height;

      const canvasRatio = canvasWidth / canvasHeight;
      const imgRatio = imgWidth / imgHeight;

      let sX = 0;
      let sY = 0;
      let sWidth = imgWidth;
      let sHeight = imgHeight;

      if (imgRatio > canvasRatio) {
        // Image is wider than canvas -> crop left/right sides
        sWidth = imgHeight * canvasRatio;
        sX = (imgWidth - sWidth) / 2;
      } else {
        // Image is taller than canvas -> crop top/bottom
        sHeight = imgWidth / canvasRatio;
        sY = (imgHeight - sHeight) / 2;
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, sX, sY, sWidth, sHeight, 0, 0, canvasWidth, canvasHeight);
    };

    // Resize canvas dynamically to match viewport
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(Math.round(playhead.frame));
    };

    const playhead = { frame: 1 };

    // Initial canvas sizing
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(1);

    window.addEventListener("resize", handleResize);

    // Timeline to animate the virtual frame playhead index and overlays on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: "top top",
        end: "bottom+=350% top", // Scrub distance
        scrub: 1.0, // Smooth interpolation lag
        pin: true,
        invalidateOnRefresh: true,
        onLeave: () => {
          gsap.set(canvas, { display: "none" });
        },
        onEnterBack: () => {
          gsap.set(canvas, { display: "block" });
        },
      },
    });

    // Playhead animation duration of 12
    tl.to(playhead, {
      frame: TOTAL_FRAMES,
      snap: "frame", // Snaps to integer frame values
      ease: "none",
      duration: 12,
      onUpdate: () => {
        drawFrame(Math.round(playhead.frame));
      },
    }, 0);

    // Fade out scroll guide early in the scroll progress
    tl.to(".scroll-guide", {
      opacity: 0,
      y: 20,
      duration: 1.5,
      ease: "power2.out",
    }, 0.2);

    // Text Block 1 animations
    tl.fromTo(".text-block-1",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 2, ease: "power2.out" },
      1.5
    );
    tl.to(".text-block-1",
      { opacity: 0, y: -40, duration: 1.5, ease: "power2.in" },
      4.5
    );

    // Text Block 2 animations
    tl.fromTo(".text-block-2",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 2, ease: "power2.out" },
      5.5
    );
    tl.to(".text-block-2",
      { opacity: 0, y: -40, duration: 1.5, ease: "power2.in" },
      8.5
    );

    // Text Block 3 animations
    tl.fromTo(".text-block-3",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 2, ease: "power2.out" },
      9.5
    );
    tl.to(".text-block-3",
      { opacity: 0, y: -40, duration: 1.5, ease: "power2.in" },
      11.5
    );

    // Zoom and fade out the canvas at the end of the scroll progress (starts at 10.5, completes at 12)
    tl.to(canvas, {
      scale: 2.2,
      opacity: 0,
      duration: 1.5,
      ease: "power1.inOut",
    }, 10.5);

    return () => {
      window.removeEventListener("resize", handleResize);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [isLoaded]);

  // Percentage value for loading indicator
  const loadPercentage = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <div ref={triggerRef} className="relative w-screen h-screen bg-background overflow-hidden">
      {/* Loading Screen Overlay */}
      {!isLoaded && !loadError && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-background">
          <div className="font-mono text-xs text-accent tracking-[0.3em] uppercase">
            DEVELOPING CELLULOID METADATA // {loadPercentage}%
          </div>
          <div className="h-0.5 w-48 bg-border-color mt-4 overflow-hidden relative">
            <div 
              className="absolute left-0 top-0 bg-accent h-full transition-all duration-100 ease-out" 
              style={{ width: `${loadPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Frame Loading Error state */}
      {loadError && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-background">
          <div className="font-mono text-xs text-red-500 tracking-[0.2em] uppercase">
            ERROR LOADING CELLULOID REEL
          </div>
        </div>
      )}

      {/* HTML5 Canvas Element */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none opacity-100 origin-center"
      />

      {/* Cinematic Text Overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none p-10 md:p-24 flex items-end justify-start overflow-hidden">
        {/* Text Block 1 */}
        <div className="absolute text-left opacity-0 translate-y-10 text-block-1 select-none bottom-20 md:bottom-32 left-10 md:left-24">
          <h2 className="font-display text-4xl md:text-7xl font-light italic tracking-[0.15em] text-[#eae6e1]">
            Cinematic Vision
          </h2>
          <p className="font-body text-[10px] md:text-xs tracking-[0.4em] text-[#7c7c82] mt-3 uppercase">
            Every frame, a crafted legacy
          </p>
        </div>

        {/* Text Block 2 */}
        <div className="absolute text-left opacity-0 translate-y-10 text-block-2 select-none bottom-20 md:bottom-32 left-10 md:left-24">
          <h2 className="font-display text-4xl md:text-7xl font-light italic tracking-[0.15em] text-[#eae6e1]">
            Uncompromising Detail
          </h2>
          <p className="font-body text-[10px] md:text-xs tracking-[0.4em] text-[#7c7c82] mt-3 uppercase">
            Pristine 4K celluloid clarity
          </p>
        </div>

        {/* Text Block 3 */}
        <div className="absolute text-left opacity-0 translate-y-10 text-block-3 select-none bottom-20 md:bottom-32 left-10 md:left-24">
          <h2 className="font-display text-5xl md:text-8xl font-medium uppercase tracking-[0.2em] text-accent drop-shadow-[0_0_30px_rgba(197,168,128,0.25)]">
            JJ FILMS
          </h2>
          <p className="font-body text-[10px] md:text-xs tracking-[0.5em] text-[#eae6e1] mt-4 uppercase">
            Redefining modern cinema
          </p>
        </div>
      </div>

      {/* Floating Scroll Guide */}
      <div className="scroll-guide absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3.5 font-body text-[10px] tracking-[0.3em] text-[#7c7c82] select-none text-center">
        <span className="uppercase text-[9px] text-[#eae6e1]/60 tracking-[0.35em] transition-colors duration-500 hover:text-accent">
          SCROLL TO REVEAL MAGIC
        </span>
        <div className="w-[20px] h-[32px] border border-[#7c7c82]/40 rounded-[10px] flex justify-center p-1.5 opacity-80 hover:opacity-100 transition-opacity duration-300">
          <div className="w-[3px] h-[6px] bg-[#facc15] rounded-full mouse-wheel" />
        </div>
      </div>

      <style jsx>{`
        .mouse-wheel {
          animation: mouseWheel 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
        }
        @keyframes mouseWheel {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          60% {
            opacity: 1;
          }
          100% {
            transform: translateY(8px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
