"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TOTAL_FRAMES = 240;
const HISTOGRAM_HEIGHTS = [30, 55, 45, 75, 40, 65, 50, 85, 35, 60, 25, 70];

const SERVICES_DATA = [
  {
    title: "Real Estate",
    tag: "Photography",
    shortDescription:
      "Architectural spaces, elevated.\nEvery property at its absolute best.",
    longDescription:
      "We capture architectural masterpieces and luxury estates with pristine clarity, using volumetric lighting, advanced stabilization, and high-dynamic-range imaging to showcase every layout, texture, and detail in its absolute best light.",
    image: "/images/real_estate.png",
  },
  {
    title: "Commercial Films",
    tag: "Commercials & Ads",
    shortDescription:
      "Volumetric shadows, rich details.\nTelling your brand's unique story.",
    longDescription:
      "Premium brand narratives engineered for the screen. From high-impact commercials to documentary-style brand stories, we direct cinematic campaigns that capture volumetric shadows, rich textures, and evoke deep emotional connections.",
    image: "/images/commercial_films.png",
  },
  {
    title: "Wedding Films",
    tag: "Events & Films",
    shortDescription:
      "Every stolen glance, every joyful\ntear — yours forever.",
    longDescription:
      "High-fidelity cinematic keepsakes. We document luxury weddings and boutique events with an intimate, candid approach. Every stolen glance, whispered vow, and joyful tear is preserved forever on pristine 4K formats.",
    image: "/images/wedding_films.png",
  },
];

const getPath = (
  index: number,
  p: number, // normalized progress 0 to 1
  bulgeVal: number,
  W: number,
  H: number,
  startLeft: number,
  startRight: number,
) => {
  const sideVal = bulgeVal * 0.7;
  if (index === 0) {
    // Left card boundary starts at startRight, moves to W
    const x_curr = startRight + p * (W - startRight);
    return `M 0 0 L ${x_curr} 0 C ${x_curr - sideVal} ${H * 0.25}, ${x_curr + bulgeVal} ${H * 0.25}, ${x_curr + bulgeVal} ${H * 0.5} C ${x_curr + bulgeVal} ${H * 0.75}, ${x_curr - sideVal} ${H * 0.75}, ${x_curr} ${H} L 0 ${H} Z`;
  } else if (index === 1) {
    // Middle card expanding both ways
    const x_left = startLeft - p * startLeft;
    const x_right = startRight + p * (W - startRight);
    
    const leftPath = `M ${x_left} 0 C ${x_left + sideVal} ${H * 0.25}, ${x_left - bulgeVal} ${H * 0.25}, ${x_left - bulgeVal} ${H * 0.5} C ${x_left - bulgeVal} ${H * 0.75}, ${x_left + sideVal} ${H * 0.75}, ${x_left} ${H}`;
    const rightPath = `L ${x_right} ${H} C ${x_right - sideVal} ${H * 0.75}, ${x_right + bulgeVal} ${H * 0.75}, ${x_right + bulgeVal} ${H * 0.5} C ${x_right + bulgeVal} ${H * 0.25}, ${x_right - sideVal} ${H * 0.25}, ${x_right} 0 Z`;
    
    return `${leftPath} ${rightPath}`;
  } else {
    // Right card expanding left, starts at startLeft, moves to 0
    const x_curr = startLeft - p * startLeft;
    return `M ${x_curr} 0 C ${x_curr + sideVal} ${H * 0.25}, ${x_curr - bulgeVal} ${H * 0.25}, ${x_curr - bulgeVal} ${H * 0.5} C ${x_curr - bulgeVal} ${H * 0.75}, ${x_curr + sideVal} ${H * 0.75}, ${x_curr} ${H} L ${W} ${H} L ${W} 0 Z`;
  }
};

export default function ScrollVideoHero() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [activeHoverCard, setActiveHoverCard] = useState<number | null>(null);
  const isTransitioningRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const imageRef = useRef<SVGImageElement>(null);
  const transitionProgress = useRef({ x: 0, bulge: 0 });
  const scrollPathRef = useRef<SVGPathElement>(null);
  const scrollProgress = useRef({ current: 0, target: 0 });
  const transitionStartPos = useRef({ startLeft: 0, startRight: 0 });

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
        ease: "power4.out",
      })
      // 2. Staggered lifting of the vertical curtain strips starts immediately after text vanish completes
      .to(".loader-strip", {
        yPercent: -100,
        duration: 0.8,
        stagger: 0.05,
        ease: "power4.inOut",
      })
      // 3. Smooth reveal / lens zoom-out transition of the background canvas (increased intensity)
      .fromTo(
        canvas,
        { scale: 1.3, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 1.4, ease: "power4.out" },
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
    gsap.set(".services-card", { yPercent: 100, scale: 0.95, opacity: 0 });
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
          ease: "power4.inOut",
        },
        0,
      )
      // Automatically reveal cards overlay
      .to(
        ".services-overlay",
        {
          opacity: 1,
          duration: 0.1,
        },
        0.2,
      )
      // Staggered slide up of the 3 cards from the bottom with ultra-smooth power4.out ease
      .to(
        ".services-card",
        {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          duration: 1.6,
          stagger: 0.12,
          ease: "power4.out",
        },
        0.2,
      )
      .to(
        ".services-border",
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power4.out",
        },
        0.6,
      )
      .to(
        ".services-num",
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.1,
        },
        0.8,
      )
      .to(
        ".services-content",
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.1,
        },
        0.9,
      )
      .to(
        ".services-footer",
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power4.out",
        },
        1.2,
      )
      // Enable pointer events / hover selection only after a delay of 2.5 seconds (a few seconds after scrolling to the section)
      .to(
        ".services-overlay",
        {
          pointerEvents: "auto",
          duration: 0.1,
        },
        2.5,
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
          // Set scroll warp target from velocity
          scrollProgress.current.target = self.getVelocity();
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
        ease: "power4.out",
      },
      0.2,
    );

    // Text Block 1 animations
    tl.fromTo(
      ".text-block-1",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 2, ease: "power4.out" },
      1.5,
    );
    tl.to(
      ".text-block-1",
      { opacity: 0, y: -40, duration: 1.5, ease: "power4.in" },
      4.5,
    );

    // Text Block 2 animations
    tl.fromTo(
      ".text-block-2",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 2, ease: "power4.out" },
      5.5,
    );
    tl.to(
      ".text-block-2",
      { opacity: 0, y: -40, duration: 1.5, ease: "power4.in" },
      8.5,
    );

    // Text Block 3 animations
    tl.fromTo(
      ".text-block-3",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 2, ease: "power4.out" },
      9.5,
    );
    tl.to(
      ".text-block-3",
      { opacity: 0, y: -40, duration: 1.5, ease: "power4.in" },
      10.2, // Fades out exactly when video finishes scrubbing
    );

    const updateScrollWarp = () => {
      const target = scrollProgress.current.target * 0.15;
      const maxWarp = 120;
      const clampedTarget = Math.max(-maxWarp, Math.min(maxWarp, target));
      scrollProgress.current.current += (clampedTarget - scrollProgress.current.current) * 0.1;
      scrollProgress.current.target *= 0.85;

      if (scrollPathRef.current) {
        const W = window.innerWidth;
        const H = window.innerHeight;
        const warp = scrollProgress.current.current;
        // Wobbly top and bottom borders (edge to edge smooth curve)
        const d = `M 0 0 Q ${W * 0.5} ${warp} ${W} 0 L ${W} ${H} Q ${W * 0.5} ${H + warp} 0 ${H} Z`;
        scrollPathRef.current.setAttribute("d", d);
      }
    };

    gsap.ticker.add(updateScrollWarp);

    return () => {
      window.removeEventListener("resize", handleResize);
      tl.scrollTrigger?.kill();
      tl.kill();
      cardsTimeline.kill();
      loaderExitTl.kill();
      gsap.ticker.remove(updateScrollWarp);
    };
  }, [isLoaded]);

  // Percentage value for loading indicator
  const loadPercentage = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  const handleCardClick = (index: number, element: HTMLDivElement) => {
    if (isTransitioningRef.current || activeCard !== null) return;
    isTransitioningRef.current = true;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const isMobile = W < 768;
    const transitionIndex = isMobile ? 0 : index;

    if (isMobile) {
      transitionStartPos.current = {
        startLeft: 0,
        startRight: 0,
      };
    } else {
      const rect = element.getBoundingClientRect();
      transitionStartPos.current = {
        startLeft: rect.left,
        startRight: rect.right,
      };
    }

    if (overlayRef.current) {
      overlayRef.current.classList.remove("hidden");
      overlayRef.current.classList.add("pointer-events-auto");
      overlayRef.current.classList.remove("pointer-events-none");
    }

    const globalWindow = window as unknown as {
      lenis?: { stop: () => void; start: () => void };
    };
    if (globalWindow.lenis) {
      globalWindow.lenis.stop();
    }

    setActiveCard(index);
    transitionProgress.current = { x: 0, bulge: 0 };

    const tl = gsap.timeline({
      onUpdate: () => {
        const { x, bulge } = transitionProgress.current;
        if (pathRef.current) {
          const dPath = getPath(
            transitionIndex,
            x,
            bulge,
            W,
            H,
            transitionStartPos.current.startLeft,
            transitionStartPos.current.startRight,
          );
          pathRef.current.setAttribute("d", dPath);
        }
        if (imageRef.current) {
          const startL = transitionStartPos.current.startLeft;
          const startR = transitionStartPos.current.startRight;
          
          let imgX = 0;
          let imgW = W;
          const buffer = 200;
          
          if (transitionIndex === 0) {
            const x_curr = startR + x * (W - startR);
            imgX = 0;
            imgW = Math.min(W, x_curr + buffer);
          } else if (transitionIndex === 2) {
            const x_curr = startL * (1 - x);
            imgX = Math.max(0, x_curr - buffer);
            imgW = W - imgX;
          } else {
            const x_left = startL * (1 - x);
            const x_right = startR + x * (W - startR);
            imgX = Math.max(0, x_left - buffer);
            imgW = Math.min(W, x_right + buffer) - imgX;
          }
          
          imageRef.current.setAttribute("x", imgX.toString());
          imageRef.current.setAttribute("width", imgW.toString());
        }
      },
      onComplete: () => {
        isTransitioningRef.current = false;
        gsap.to(".service-detail-content", {
          opacity: 1,
          duration: 0.5,
          ease: "power4.out",
        });
      },
    });

    tl.to(
      transitionProgress.current,
      {
        x: 1,
        duration: 1.2,
        ease: "power4.inOut",
      },
      0,
    );
    tl.to(
      transitionProgress.current,
      {
        bulge: 160,
        duration: 0.5,
        ease: "power3.out",
      },
      0,
    );
    tl.to(
      transitionProgress.current,
      {
        bulge: -30,
        duration: 0.5,
        ease: "power2.inOut",
      },
      0.5,
    );
    tl.to(
      transitionProgress.current,
      {
        bulge: 0,
        duration: 0.2,
        ease: "power2.out",
      },
      1.0,
    );
  };

  const handleCloseDetail = () => {
    if (isTransitioningRef.current || activeCard === null) return;
    isTransitioningRef.current = true;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const isMobile = W < 768;
    const transitionIndex = isMobile ? 0 : activeCard;

    gsap.to(".service-detail-content", {
      opacity: 0,
      duration: 0.3,
      ease: "power4.out",
      onComplete: () => {
        transitionProgress.current = { x: 1, bulge: 0 };

        const tl = gsap.timeline({
          onUpdate: () => {
            const { x, bulge } = transitionProgress.current;
            if (pathRef.current) {
              const dPath = getPath(
                transitionIndex,
                x,
                bulge,
                W,
                H,
                transitionStartPos.current.startLeft,
                transitionStartPos.current.startRight,
              );
              pathRef.current.setAttribute("d", dPath);
            }
            if (imageRef.current) {
              const startL = transitionStartPos.current.startLeft;
              const startR = transitionStartPos.current.startRight;
              
              let imgX = 0;
              let imgW = W;
              const buffer = 200;
              
              if (transitionIndex === 0) {
                const x_curr = startR + x * (W - startR);
                imgX = 0;
                imgW = Math.min(W, x_curr + buffer);
              } else if (transitionIndex === 2) {
                const x_curr = startL * (1 - x);
                imgX = Math.max(0, x_curr - buffer);
                imgW = W - imgX;
              } else {
                const x_left = startL * (1 - x);
                const x_right = startR + x * (W - startR);
                imgX = Math.max(0, x_left - buffer);
                imgW = Math.min(W, x_right + buffer) - imgX;
              }
              
              imageRef.current.setAttribute("x", imgX.toString());
              imageRef.current.setAttribute("width", imgW.toString());
            }
          },
          onComplete: () => {
            setActiveCard(null);
            isTransitioningRef.current = false;
            if (overlayRef.current) {
              overlayRef.current.classList.add("hidden");
              overlayRef.current.classList.add("pointer-events-none");
              overlayRef.current.classList.remove("pointer-events-auto");
            }
            const globalWindow = window as unknown as {
              lenis?: { stop: () => void; start: () => void };
            };
            if (globalWindow.lenis) {
              globalWindow.lenis.start();
            }
          },
        });

        tl.to(
          transitionProgress.current,
          {
            x: 0,
            duration: 1.2,
            ease: "power4.inOut",
          },
          0,
        );
        tl.to(
          transitionProgress.current,
          {
            bulge: 180, // stretch value peaks
            duration: 0.5,
            ease: "power3.out",
          },
          0,
        );
        tl.to(
          transitionProgress.current,
          {
            bulge: -35,
            duration: 0.5,
            ease: "power2.inOut",
          },
          0.5,
        );
        tl.to(
          transitionProgress.current,
          {
            bulge: 0, // stretch value returns to 0
            duration: 0.2,
            ease: "power2.out",
          },
          1.0,
        );
      },
    });
  };

  return (
    <div
      ref={triggerRef}
      className="relative w-screen h-screen bg-background overflow-hidden"
    >
      {/* Global Scroll Clip Path SVG */}
      <svg className="absolute inset-0 w-0 h-0 pointer-events-none">
        <defs>
          <clipPath id="scroll-clip">
            <path ref={scrollPathRef} />
          </clipPath>
        </defs>
      </svg>

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
        <span className="uppercase text-[9px] text-[#eae6e1]/60 tracking-[0.35em] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-accent">
          SCROLL TO REVEAL MAGIC
        </span>
        <div className="w-[20px] h-[32px] border border-[#7c7c82]/40 rounded-[10px] flex justify-center p-1.5 opacity-80 hover:opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <div className="w-[3px] h-[6px] bg-[#facc15] rounded-full mouse-wheel" />
        </div>
      </div>

      {/* Services Split-Screen Panels (revealed at the end of the scroll) */}
      <div
        className="services-overlay absolute inset-0 z-30 opacity-0 pointer-events-none flex flex-col md:flex-row"
        style={{ clipPath: "url(#scroll-clip)" }}
      >
        {/* Thin Gold Viewport Border Overlay */}
        <div className="services-border absolute inset-4 md:inset-6 border border-accent/25 pointer-events-none z-30" />

        {/* Decorative Viewport Camera Dot */}
        <div className="absolute top-8 left-8 z-30 pointer-events-none select-none flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 animate-pulse" />
        </div>

        {SERVICES_DATA.map((service, index) => {
          const isHovered = activeHoverCard === index;
          const hasActiveHover = activeHoverCard !== null;
          
          let cardFlex = "1";
          let cardOpacity = "1";
          
          if (hasActiveHover) {
            cardFlex = isHovered ? "1.6" : "0.7";
            cardOpacity = isHovered ? "1" : "0.55";
          }

          return (
            <div
              key={index}
              onClick={(e) => handleCardClick(index, e.currentTarget)}
              onMouseEnter={() => {
                if (activeCard === null) {
                  setActiveHoverCard(index);
                }
              }}
              style={{
                "--card-flex": cardFlex,
                "--card-opacity": cardOpacity,
              } as React.CSSProperties}
              className={`services-card relative overflow-hidden flex items-end justify-start p-8 md:p-14 group cursor-pointer ${
                index < 2
                  ? "border-b md:border-b-0 md:border-r border-accent/10"
                  : ""
              }`}
            >
            {/* Background Zoom Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-105"
              style={{ backgroundImage: `url('${service.image}')` }}
            />
            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20 z-10" />

            {/* Section Large Number */}
            <div className="services-num absolute top-10 left-10 z-10 font-display text-6xl md:text-8xl text-foreground/5 font-extrabold select-none">
              0{index + 1}
            </div>

            {/* Text Details */}
            <div className="services-content relative z-20 text-left max-w-sm">
              <span className="font-body text-[9px] md:text-[10px] tracking-[0.45em] text-foreground/50 uppercase">
                {service.tag}
              </span>
              <h3 className="font-display text-3xl md:text-5xl text-foreground mt-2 font-light tracking-wide">
                {service.title}
              </h3>
              <p className="font-display italic text-[#7c7c82] mt-4 text-xs md:text-sm leading-relaxed max-w-xs whitespace-pre-line">
                {service.shortDescription}
              </p>
            </div>
          </div>
          );
        })}

        {/* Bottom Footer Info */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 font-body text-[8px] md:text-[9px] tracking-[0.3em] text-[#7c7c82] select-none text-center services-footer">
          <span>— ALSO: PRODUCT PHOTOGRAPHY —</span>
          <div className="w-6 h-1 rounded-full bg-accent/30 overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full bg-accent w-1/3 animate-scroll-indicator" />
          </div>
        </div>
      </div>

      {/* Curved Transition Panel & Fullscreen Service Details Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 pointer-events-none hidden bg-transparent"
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <clipPath id="card-clip">
              <path ref={pathRef} />
            </clipPath>
          </defs>
          {activeCard !== null && (
            <image
              ref={imageRef}
              href={SERVICES_DATA[activeCard].image}
              x={transitionStartPos.current.startLeft}
              width={transitionStartPos.current.startRight - transitionStartPos.current.startLeft}
              height="100%"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#card-clip)"
            />
          )}
        </svg>

        {activeCard !== null && (
          <div className="service-detail-content absolute inset-0 z-10 opacity-0 flex flex-col justify-between p-8 md:p-24 select-text">
            {/* Header: Title and Back button */}
            <div className="flex justify-between items-center w-full">
              <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-[#eae6e1]/50 uppercase">
                JJ Films // Service Details
              </span>
              <button
                onClick={handleCloseDetail}
                className="font-body text-[10px] md:text-xs tracking-[0.2em] text-[#eae6e1] hover:text-accent uppercase cursor-pointer border border-[#eae6e1]/20 rounded-full px-5 py-2 transition-colors duration-300 backdrop-blur-xs"
              >
                Back to Reel
              </button>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center my-auto">
              <div className="text-left">
                <span className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-accent uppercase">
                  Division 0{activeCard + 1}
                </span>
                <h2 className="font-display text-4xl md:text-7xl font-light tracking-wide text-[#eae6e1] mt-4">
                  {SERVICES_DATA[activeCard].title}
                </h2>
                <p className="font-body text-xs md:text-base text-[#eae6e1]/80 leading-relaxed mt-6 max-w-xl">
                  {SERVICES_DATA[activeCard].longDescription}
                </p>
                <div className="flex gap-4 mt-8 md:mt-10">
                  <button className="bg-accent hover:bg-accent-light text-background font-body text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] px-6 md:px-8 py-3.5 md:py-4 rounded-xs transition-all duration-300 cursor-pointer">
                    Book Project
                  </button>
                  <button className="border border-accent/30 hover:border-accent text-accent font-body text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] px-6 md:px-8 py-3.5 md:py-4 rounded-xs transition-all duration-300 cursor-pointer">
                    Watch Showreel
                  </button>
                </div>
              </div>

              {/* Cinematic Mockup Window */}
              <div className="relative aspect-video w-full bg-black/40 border border-accent/20 rounded-sm overflow-hidden group">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out scale-100 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('${SERVICES_DATA[activeCard].image}')`,
                  }}
                />
                <div className="absolute inset-0 bg-black/35 z-10 flex items-center justify-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#eae6e1]/10 border border-[#eae6e1]/20 backdrop-blur-xs flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 fill-[#eae6e1] translate-x-[2px]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Specifications */}
            <div className="flex flex-col md:flex-row justify-between border-t border-[#eae6e1]/10 pt-6 md:pt-8 w-full font-mono text-[8px] md:text-[9px] text-[#eae6e1]/40 tracking-[0.25em]">
              <div>SPECIFICATIONS // 4K RAW ANAMORPHIC</div>
              <div className="mt-2 md:mt-0">
                STYLING // VOLUMETRIC DIRECTION // RAW EDIT
              </div>
            </div>
          </div>
        )}
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
        @media (min-width: 768px) {
          .services-card {
            flex: var(--card-flex, 1) !important;
            opacity: var(--card-opacity, 1) !important;
            transition:
              flex 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }
        }
      `}</style>
    </div>
  );
}
