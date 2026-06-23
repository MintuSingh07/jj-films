"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TOTAL_FRAMES = 240;
const HISTOGRAM_HEIGHTS = [30, 55, 45, 75, 40, 65, 50, 85, 35, 60, 25, 70];

export default function ScrollVideoHero() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
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

    // Loader exit transition timeline: empty contents -> hold -> lift staggered curtain strips
    const loaderExitTl = gsap.timeline({
      onComplete: () => {
        setShowLoader(false);
      },
    });

    loaderExitTl
      // 1. Fade out all loader text overlays and UI metrics to empty the loader
      .to(".loader-content", {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out",
      })
      // 2. Staggered lifting of the vertical curtain strips starts immediately after text vanish completes
      .to(
        ".loader-strip",
        {
          yPercent: -100,
          duration: 0.8,
          stagger: 0.05,
          ease: "power3.inOut",
        }
      )
      // 3. Smooth reveal / lens zoom-out transition of the background canvas (increased intensity)
      .fromTo(
        canvas,
        { scale: 1.3, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 1.4, ease: "power2.out" },
        "-=0.7", // starts shortly after curtain strips start lifting
      );

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
      ctx.drawImage(
        img,
        sX,
        sY,
        sWidth,
        sHeight,
        0,
        0,
        canvasWidth,
        canvasHeight,
      );
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

    // Set initial states for services elements
    gsap.set(".services-overlay", { opacity: 0, pointerEvents: "none" });
    gsap.set(".services-left", { xPercent: -100 });
    gsap.set(".services-right", { xPercent: 100 });
    gsap.set(".services-border", { scale: 0.96, opacity: 0 });
    gsap.set(".services-content", { y: 30, opacity: 0 });
    gsap.set(".services-num", { scale: 0.8, opacity: 0 });
    gsap.set(".services-footer", { y: 20, opacity: 0 });

    // Create the timed cards timeline for automated animation
    const cardsTimeline = gsap.timeline({ paused: true });
    cardsTimeline
      // Automatically zoom and fade out the canvas
      .to(
        canvas,
        {
          scale: 2.2,
          opacity: 0,
          duration: 1.0,
          ease: "power1.inOut",
        },
        0,
      )
      // Automatically reveal cards overlay
      .to(
        ".services-overlay",
        {
          opacity: 1,
          pointerEvents: "auto",
          duration: 0.1,
        },
        0.2,
      )
      .to(
        ".services-left",
        {
          xPercent: 0,
          duration: 1.2,
          ease: "power3.out",
        },
        0.2,
      )
      .to(
        ".services-right",
        {
          xPercent: 0,
          duration: 1.2,
          ease: "power3.out",
        },
        0.2,
      )
      .to(
        ".services-border",
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        0.5,
      )
      .to(
        ".services-num",
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.1,
        },
        0.6,
      )
      .to(
        ".services-content",
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
        },
        0.7,
      )
      .to(
        ".services-footer",
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        1.0,
      );

    // Timeline to animate the virtual frame playhead index and overlays on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: "top top",
        end: "bottom+=350% top", // Scrub distance
        scrub: 1.0, // Smooth interpolation lag
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Trigger cardsTimeline to play/reverse automatically at 85% progress
          if (self.progress >= 0.85) {
            cardsTimeline.play();
          } else {
            cardsTimeline.reverse();
          }
        },
        onLeave: () => {
          gsap.set(canvas, { display: "none" });
        },
        onEnterBack: () => {
          gsap.set(canvas, { display: "block" });
        },
      },
    });

    // Playhead animation (frames 1 to 240) finishes at 85% of the scroll timeline (duration 10.2)
    tl.to(
      playhead,
      {
        frame: TOTAL_FRAMES,
        snap: "frame", // Snaps to integer frame values
        ease: "none",
        duration: 10.2,
        onUpdate: () => {
          drawFrame(Math.round(playhead.frame));
        },
      },
      0,
    );

    // Dummy spacer to extend scroll timeline to 12.0
    tl.to({}, { duration: 1.8 }, 10.2);

    // Fade out scroll guide early in the scroll progress
    tl.to(
      ".scroll-guide",
      {
        opacity: 0,
        y: 20,
        duration: 1.5,
        ease: "power2.out",
      },
      0.2,
    );

    // Text Block 1 animations
    tl.fromTo(
      ".text-block-1",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 2, ease: "power2.out" },
      1.5,
    );
    tl.to(
      ".text-block-1",
      { opacity: 0, y: -40, duration: 1.5, ease: "power2.in" },
      4.5,
    );

    // Text Block 2 animations
    tl.fromTo(
      ".text-block-2",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 2, ease: "power2.out" },
      5.5,
    );
    tl.to(
      ".text-block-2",
      { opacity: 0, y: -40, duration: 1.5, ease: "power2.in" },
      8.5,
    );

    // Text Block 3 animations
    tl.fromTo(
      ".text-block-3",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 2, ease: "power2.out" },
      9.5,
    );
    tl.to(
      ".text-block-3",
      { opacity: 0, y: -40, duration: 1.5, ease: "power2.in" },
      10.2, // Fades out exactly when video finishes scrubbing
    );

    return () => {
      window.removeEventListener("resize", handleResize);
      tl.scrollTrigger?.kill();
      tl.kill();
      cardsTimeline.kill();
      loaderExitTl.kill();
    };
  }, [isLoaded]);

  // Percentage value for loading indicator
  const loadPercentage = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <div
      ref={triggerRef}
      className="relative w-screen h-screen bg-background overflow-hidden"
    >
      {/* Loading Screen Overlay */}
      {showLoader && !loadError && (
        <div className="loader-overlay absolute inset-0 z-50 overflow-hidden bg-transparent pointer-events-none">
          {/* Background Curtain Strips (Solid Black) */}
          <div className="absolute inset-0 flex z-0 pointer-events-none">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="loader-strip h-full bg-[#030303] flex-1 border-none outline-none"
              />
            ))}
          </div>

          {/* Loader Overlay Metadata & Visual Elements */}
          <div className="loader-content absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none">
            {/* Ambient Cinematic Light Leaks */}
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-accent/4 blur-[130px] pointer-events-none animate-lensFlare select-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/2 blur-[120px] pointer-events-none animate-lensFlareReverse select-none" />

            {/* Film Strip Sprocket Holes (Left/Right margins) */}
            <div className="absolute left-3 top-0 bottom-0 w-3 flex flex-col justify-between py-6 opacity-10 pointer-events-none select-none">
              {[...Array(14)].map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 h-3.5 border border-accent/40 rounded-xs"
                />
              ))}
            </div>
            <div className="absolute right-3 top-0 bottom-0 w-3 flex flex-col justify-between py-6 opacity-10 pointer-events-none select-none">
              {[...Array(14)].map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 h-3.5 border border-accent/40 rounded-xs"
                />
              ))}
            </div>

            {/* Rule of Thirds Viewfinder Grid */}
            <div className="absolute inset-8 border border-accent/5 pointer-events-none">
              {/* Vertical grid lines */}
              <div className="absolute top-0 bottom-0 left-1/3 border-l border-dashed border-accent/5" />
              <div className="absolute top-0 bottom-0 right-1/3 border-l border-dashed border-accent/5" />
              {/* Horizontal grid lines */}
              <div className="absolute left-0 right-0 top-1/3 border-t border-dashed border-accent/5" />
              <div className="absolute left-0 right-0 bottom-1/3 border-t border-dashed border-accent/5" />
            </div>

            {/* Viewfinder Crop Marks */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-accent/20 pointer-events-none" />
            <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-accent/20 pointer-events-none" />
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-accent/20 pointer-events-none" />
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-accent/20 pointer-events-none" />

            {/* Viewfinder Aspect Ratio Guide */}
            <div className="absolute inset-8 border border-accent/5 pointer-events-none" />

            {/* Center Focus Reticle & Auto-Focus Brackets */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
              {/* Dotted outer focus ring */}
              <div className="w-24 h-24 border border-dashed border-accent/15 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute w-8 h-8 border border-accent/20 rounded-full" />
              <div className="absolute w-4 h-[1px] bg-accent/30" />
              <div className="absolute w-[1px] h-4 bg-accent/30" />

              {/* Focus hunting brackets */}
              <div className="absolute w-32 h-32 animate-focusPulse">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-accent/40" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-accent/40" />
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-accent/40" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-accent/40" />
              </div>
            </div>

            {/* Top Metadata Row */}
            <div className="absolute top-12 left-12 flex flex-col gap-1 pointer-events-none select-none font-mono text-[9px] md:text-[10px] text-foreground/40 tracking-[0.25em]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="text-foreground/80 font-bold">REC</span>
              </div>
              <div>CAM_A // RAW 4K</div>
              <div>SHUTTER 180°</div>
              <div>PROGRESS // FPS 24</div>
            </div>

            <div className="absolute top-12 right-12 flex flex-col items-end gap-1 pointer-events-none select-none font-mono text-[9px] md:text-[10px] text-foreground/40 tracking-[0.25em]">
              <div className="text-foreground/80 font-bold">
                TC 00:00:
                {Math.floor(loadedCount / 24)
                  .toString()
                  .padStart(2, "0")}
                :{(loadedCount % 24).toString().padStart(2, "0")}
              </div>
              <div>ISO 800 // F2.8</div>
              <div>WHITE BAL // 5600K</div>
            </div>

            {/* Bottom Left: Massive Progress Number */}
            <div className="absolute bottom-[1%] left-[-1%] select-none pointer-events-none">
              <span className="font-loader text-[26vw] md:text-[26vw] leading-[0.75] text-[#eae6e1] opacity-80 font-bold block tracking-[-0.07em]">
                {loadPercentage.toString().padStart(2, "0")}
              </span>
            </div>

            {/* Bottom Right: Storage, VU Meter, and Histogram */}
            <div className="absolute bottom-12 right-12 flex flex-col items-end gap-2 pointer-events-none select-none font-mono text-[9px] md:text-[10px] text-foreground/40 tracking-[0.25em]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-ping" />
                <span>DEVEL_SYS // BUSY</span>
              </div>
              <div>SSD 100% // 2.3h</div>

              {/* Mini Camera Histogram Scope */}
              <div className="flex gap-[2px] items-end h-8 w-24 border-b border-l border-accent/15 p-[2px] mt-2 opacity-35">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-accent/40 w-full rounded-t-xs"
                    style={{
                      animation: `histogramPulse 1.2s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.08}s`,
                      height: `${HISTOGRAM_HEIGHTS[i % HISTOGRAM_HEIGHTS.length]}%`,
                    }}
                  />
                ))}
              </div>

              {/* Audio VU Meter */}
              <div className="flex flex-col gap-1 w-24 mt-2">
                <div className="flex gap-1 items-center">
                  <span className="text-[7px] w-3 text-foreground/30">L</span>
                  <div className="flex gap-[1px] h-1 flex-1 items-center bg-neutral-900/50 rounded-sm overflow-hidden">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-full bg-accent/60"
                        style={{
                          animation: `audioPulse 0.6s ease-in-out infinite alternate`,
                          animationDelay: `${i * 0.04}s`,
                          transformOrigin: "bottom",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="text-[7px] w-3 text-foreground/30">R</span>
                  <div className="flex gap-[1px] h-1 flex-1 items-center bg-neutral-900/50 rounded-sm overflow-hidden">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-full bg-accent/60"
                        style={{
                          animation: `audioPulse 0.5s ease-in-out infinite alternate`,
                          animationDelay: `${i * 0.03}s`,
                          transformOrigin: "bottom",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Frame Loading Error state */}
      {loadError && (
        <div className="absolute inset-0 z-60 flex flex-col items-center justify-center bg-background">
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

      {/* Services Split-Screen Panels (revealed at the end of the scroll) */}
      <div className="services-overlay absolute inset-0 z-30 opacity-0 pointer-events-none flex flex-col md:flex-row">
        {/* Thin Gold Viewport Border Overlay */}
        <div className="services-border absolute inset-4 md:inset-6 border border-accent/25 pointer-events-none z-30" />

        {/* Decorative Viewport Camera Dot */}
        <div className="absolute top-8 left-8 z-30 pointer-events-none select-none flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 animate-pulse" />
        </div>

        {/* Left Panel: Real Estate */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden flex items-end justify-start p-8 md:p-20 group border-b md:border-b-0 md:border-r border-accent/10 services-left">
          {/* Background Zoom Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out scale-100 group-hover:scale-105"
            style={{ backgroundImage: "url('/images/real_estate.png')" }}
          />
          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 z-10" />

          {/* Section Large Number */}
          <div className="services-num absolute top-10 left-10 z-10 font-display text-7xl md:text-9xl text-foreground/5 font-extrabold select-none">
            01
          </div>

          {/* Text Details */}
          <div className="services-content relative z-20 text-left max-w-lg">
            <span className="font-body text-[9px] md:text-[10px] tracking-[0.45em] text-foreground/50 uppercase">
              Photography
            </span>
            <h3 className="font-display text-3xl md:text-6xl text-foreground mt-2 font-light tracking-wide">
              Real Estate
            </h3>
            <p className="font-display italic text-[#7c7c82] mt-4 text-xs md:text-sm leading-relaxed max-w-sm">
              Architectural spaces, elevated.
              <br />
              Every property at its absolute best.
            </p>
          </div>
        </div>

        {/* Right Panel: Wedding Films */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden flex items-end justify-end p-8 md:p-20 group services-right">
          {/* Background Zoom Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out scale-100 group-hover:scale-105"
            style={{ backgroundImage: "url('/images/wedding_films.png')" }}
          />
          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/35 z-10" />

          {/* Section Large Number */}
          <div className="services-num absolute top-10 right-10 z-10 font-display text-7xl md:text-9xl text-foreground/5 font-extrabold select-none">
            02
          </div>

          {/* Text Details */}
          <div className="services-content relative z-20 text-right max-w-lg">
            <span className="font-body text-[9px] md:text-[10px] tracking-[0.45em] text-foreground/50 uppercase">
              Events & Films
            </span>
            <h3 className="font-display text-3xl md:text-6xl text-foreground mt-2 font-light tracking-wide">
              Wedding Films
            </h3>
            <p className="font-display italic text-[#7c7c82] mt-4 text-xs md:text-sm leading-relaxed max-w-sm ml-auto">
              Every stolen glance, every joyful
              <br />
              tear — yours forever.
            </p>
          </div>
        </div>

        {/* Bottom Footer Info */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 font-body text-[8px] md:text-[9px] tracking-[0.3em] text-[#7c7c82] select-none text-center services-footer">
          <span>— ALSO: PRODUCT PHOTOGRAPHY —</span>
          <div className="w-6 h-1 rounded-full bg-accent/30 overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full bg-accent w-1/3 animate-scroll-indicator" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .mouse-wheel {
          animation: mouseWheel 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            infinite;
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
        @keyframes scrollIndicator {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(200%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        :global(.animate-scroll-indicator) {
          animation: scrollIndicator 3.5s ease-in-out infinite;
        }
        @keyframes audioPulse {
          0% {
            transform: scaleY(0.25);
            opacity: 0.3;
          }
          50% {
            transform: scaleY(0.75);
            opacity: 0.7;
          }
          100% {
            transform: scaleY(1);
            opacity: 0.95;
          }
        }
        .animate-lensFlare {
          animation: lensFlare 12s ease-in-out infinite;
        }
        .animate-lensFlare-reverse {
          animation: lensFlareReverse 16s ease-in-out infinite;
        }
        .animate-focusPulse {
          animation: focusPulse 2s ease-in-out infinite alternate;
        }
        @keyframes lensFlare {
          0% {
            transform: translate(-5%, -5%) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translate(5%, 5%) scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: translate(-5%, -5%) scale(1);
            opacity: 0.4;
          }
        }
        @keyframes lensFlareReverse {
          0% {
            transform: translate(5%, 5%) scale(1.1);
            opacity: 0.6;
          }
          50% {
            transform: translate(-5%, -5%) scale(0.9);
            opacity: 0.3;
          }
          100% {
            transform: translate(5%, 5%) scale(1.1);
            opacity: 0.6;
          }
        }
        @keyframes focusPulse {
          0% {
            transform: scale(0.96);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.03);
            opacity: 0.75;
          }
        }
        @keyframes histogramPulse {
          0% {
            transform: scaleY(0.3);
          }
          100% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}
