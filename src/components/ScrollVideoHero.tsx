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
  pWidth: number, // physical layout progress (0 to 1)
  pAnim: number,  // animation progress (0 to 1, always increases)
  bulgeVal: number,
  W: number,
  H: number,
  startLeft: number,
  startRight: number,
) => {
  const sideVal = bulgeVal * 0.7;
  
  // broad (0.25) when animation just starts, sharp/squished (0.08) near the end
  const yOffset = 0.25 - 0.17 * pAnim;
  const yTop = 0.5 - yOffset;
  const yBottom = 0.5 + yOffset;
  
  if (index === 0) {
    const x_curr = startRight + pWidth * (W - startRight);
    return `M 0 0 L ${x_curr} 0 C ${x_curr - sideVal} ${H * yTop}, ${x_curr + bulgeVal} ${H * yTop}, ${x_curr + bulgeVal} ${H * 0.5} C ${x_curr + bulgeVal} ${H * yBottom}, ${x_curr - sideVal} ${H * yBottom}, ${x_curr} ${H} L 0 ${H} Z`;
  } else if (index === 1) {
    const x_left = startLeft - pWidth * startLeft;
    const x_right = startRight + pWidth * (W - startRight);
    
    const leftPath = `M ${x_left} 0 C ${x_left + sideVal} ${H * yTop}, ${x_left - bulgeVal} ${H * yTop}, ${x_left - bulgeVal} ${H * 0.5} C ${x_left - bulgeVal} ${H * yBottom}, ${x_left + sideVal} ${H * yBottom}, ${x_left} ${H}`;
    const rightPath = `L ${x_right} ${H} C ${x_right - sideVal} ${H * yBottom}, ${x_right + bulgeVal} ${H * yBottom}, ${x_right + bulgeVal} ${H * 0.5} C ${x_right + bulgeVal} ${H * yTop}, ${x_right - sideVal} ${H * yTop}, ${x_right} 0 Z`;
    
    return `${leftPath} ${rightPath}`;
  } else {
    const x_curr = startLeft - pWidth * startLeft;
    return `M ${x_curr} 0 C ${x_curr + sideVal} ${H * yTop}, ${x_curr - bulgeVal} ${H * yTop}, ${x_curr - bulgeVal} ${H * 0.5} C ${x_curr - bulgeVal} ${H * yBottom}, ${x_curr + sideVal} ${H * yBottom}, ${x_curr} ${H} L ${W} ${H} L ${W} 0 Z`;
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
  const [transitionPath, setTransitionPath] = useState<string>("");
  const [startPos, setStartPos] = useState({ startLeft: 0, startRight: 0 });
  const isTransitioningRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const imageRef = useRef<SVGImageElement>(null);
  const transitionProgress = useRef({ x: 0, bulge: 0 });
  const scrollPathRef = useRef<SVGPathElement>(null);
  const scrollProgress = useRef({ current: 0, target: 0 });
  const transitionStartPos = useRef({ startLeft: 0, startRight: 0 });
  const mousePosition = useRef({ x: 0, y: 0 });

  // Track mouse coordinates globally to detect hover target when closing details
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Preload frames progressively to unlock interaction quickly and prevent queue saturation
  useEffect(() => {
    let active = true;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    imagesRef.current = images;

    const CRITICAL_STEP = 4;
    const criticalIndices: number[] = [];
    const backgroundIndices: number[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      if ((i - 1) % CRITICAL_STEP === 0 || i === TOTAL_FRAMES) {
        criticalIndices.push(i);
      } else {
        backgroundIndices.push(i);
      }
    }

    const totalCritical = criticalIndices.length;
    let loadedCritical = 0;

    const handleCriticalLoad = () => {
      if (!active) return;
      loadedCritical++;
      // Map loaded critical progress to visual 0-240 scale
      setLoadedCount(Math.round((loadedCritical / totalCritical) * TOTAL_FRAMES));
      
      if (loadedCritical === totalCritical) {
        setIsLoaded(true);
        // Begin batch loading the remaining background frames
        loadBackgroundQueue();
      }
    };

    const handleImageError = () => {
      if (!active) return;
      // Continue loading even on individual asset failures
      console.warn("Asset pipeline frame loading deferred");
    };

    // 1. Preload keyframes first
    criticalIndices.forEach((i) => {
      const img = new Image();
      const frameNum = i.toString().padStart(3, "0");
      img.src = `/frames/frame-${frameNum}.webp`;
      img.onload = handleCriticalLoad;
      img.onerror = handleImageError;
      images[i - 1] = img;
    });

    // 2. Load background frames in batches to avoid connection starvation
    let bgIndex = 0;
    const BATCH_SIZE = 6;

    const loadNextBatch = () => {
      if (!active || bgIndex >= backgroundIndices.length) return;

      const limit = Math.min(bgIndex + BATCH_SIZE, backgroundIndices.length);
      let batchLoaded = 0;
      const batchSize = limit - bgIndex;

      const onBgLoad = () => {
        if (!active) return;
        batchLoaded++;
        if (batchLoaded === batchSize) {
          bgIndex = limit;
          setTimeout(loadNextBatch, 20); // brief yield to main thread
        }
      };

      for (let k = bgIndex; k < limit; k++) {
        const i = backgroundIndices[k];
        const img = new Image();
        const frameNum = i.toString().padStart(3, "0");
        img.src = `/frames/frame-${frameNum}.webp`;
        img.onload = onBgLoad;
        img.onerror = onBgLoad;
        images[i - 1] = img;
      }
    };

    const loadBackgroundQueue = () => {
      setTimeout(loadNextBatch, 100);
    };

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

    // Find the nearest loaded frame to prevent blank frames during background load
    const findNearestLoadedFrame = (index: number): HTMLImageElement | null => {
      const images = imagesRef.current;
      if (!images) return null;
      let dist = 1;
      while (index - dist >= 1 || index + dist <= TOTAL_FRAMES) {
        if (index - dist >= 1) {
          const img = images[index - dist - 1];
          if (img && img.complete) return img;
        }
        if (index + dist <= TOTAL_FRAMES) {
          const img = images[index + dist - 1];
          if (img && img.complete) return img;
        }
        dist++;
      }
      return null;
    };

    // Helper to draw current frame using 'object-cover' logic
    const drawFrame = (frameIndex: number) => {
      let img = imagesRef.current[frameIndex - 1];
      if (!img || !img.complete) {
        img = findNearestLoadedFrame(frameIndex) || img;
      }
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

    const revealTimeline = gsap.timeline({ paused: true });

    revealTimeline
      // 1. Zoom and fade out the canvas
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
      .set(canvas, { display: "none" }, 1.0)

      // 2. Fade out Text Block 3 (JJ FILMS branding)
      .to(
        ".text-block-3",
        {
          opacity: 0,
          y: -40,
          duration: 0.6,
          ease: "power4.in",
        },
        0,
      )
      .set(".text-blocks-container", { display: "none" }, 0.6)

      // 3. Reveal cards overlay and slide up the cards
      .to(
        ".services-overlay",
        {
          opacity: 1,
          duration: 0.1,
        },
        0.8,
      )
      .to(
        ".services-card",
        {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
        },
        0.8,
      )

      // 4. Reveal individual card components
      .to(
        ".services-border",
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "power4.out",
        },
        1.2,
      )
      .to(
        ".services-num",
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "power4.out",
          stagger: 0.08,
        },
        1.4,
      )
      .to(
        ".services-content",
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power4.out",
          stagger: 0.08,
        },
        1.5,
      )
      .to(
        ".services-footer",
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power4.out",
        },
        1.7,
      )

      // 5. Enable pointer events / hover selection
      .to(
        ".services-overlay",
        {
          pointerEvents: "auto",
          duration: 0.1,
        },
        2.3,
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
          if (self.progress >= 0.95) {
            revealTimeline.play();
          } else {
            revealTimeline.reverse();
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

    // Playhead animation (frames 1 to 240) finishes at 92.7% of the scroll timeline (duration 10.2)
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
    tl.set(
      ".scroll-guide",
      { display: "none" },
      2.0,
    );

    // Text Block 1 animations
    tl.fromTo(
      ".text-block-1",
      { opacity: 0, y: 40, display: "block" },
      { opacity: 1, y: 0, duration: 1.0, ease: "power4.out" },
      1.5,
    );
    tl.to(
      ".text-block-1",
      { opacity: 0, y: -40, duration: 0.8, ease: "power4.in" },
      4.0,
    );
    tl.set(".text-block-1", { display: "none" }, 4.8);

    // Text Block 2 animations
    tl.fromTo(
      ".text-block-2",
      { opacity: 0, y: 40, display: "block" },
      { opacity: 1, y: 0, duration: 1.0, ease: "power4.out" },
      5.2,
    );
    tl.to(
      ".text-block-2",
      { opacity: 0, y: -40, duration: 0.8, ease: "power4.in" },
      7.7,
    );
    tl.set(".text-block-2", { display: "none" }, 8.5);

    // Text Block 3 animations (JJ FILMS branding)
    tl.fromTo(
      ".text-block-3",
      { opacity: 0, y: 40, display: "block" },
      { opacity: 1, y: 0, duration: 1.0, ease: "power4.out" },
      9.0, // Fades in earlier to be fully visible before video finish
    );

    // Dummy spacer to extend scroll timeline to 11.0
    tl.to({}, { duration: 0.8 }, 10.2);

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
      revealTimeline.kill();
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

    let pos = { startLeft: 0, startRight: 0 };
    if (!isMobile) {
      const rect = element.getBoundingClientRect();
      pos = {
        startLeft: rect.left,
        startRight: rect.right,
      };
    }
    transitionStartPos.current = pos;
    setStartPos(pos);

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

    gsap.set(document.documentElement, {
      "--transition-image-opacity": 1,
    });

    const tl = gsap.timeline({
      onUpdate: () => {
        const { x, bulge } = transitionProgress.current;
        if (pathRef.current) {
          const dPath = getPath(
            transitionIndex,
            x, // pWidth
            x, // pAnim
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
          const buffer = 260;
          
          let imgX = 0;
          let imgW = W;
          
          if (transitionIndex === 0) {
            const x_curr = startR + x * (W - startR);
            imgX = -buffer;
            imgW = x_curr + 2 * buffer;
          } else if (transitionIndex === 2) {
            const x_curr = startL * (1 - x);
            imgX = x_curr - buffer;
            imgW = (W - x_curr) + 2 * buffer;
          } else {
            const x_left = startL * (1 - x);
            const x_right = startR + x * (W - startR);
            imgX = x_left - buffer;
            imgW = (x_right - x_left) + 2 * buffer;
          }
          
          imageRef.current.setAttribute("x", imgX.toString());
          imageRef.current.setAttribute("width", imgW.toString());
        }
      },
      onComplete: () => {
        isTransitioningRef.current = false;
        // Sync final full-screen path to React state so it survives any re-render
        const finalPath = getPath(
          transitionIndex,
          1,
          1,
          0,
          W,
          H,
          transitionStartPos.current.startLeft,
          transitionStartPos.current.startRight,
        );
        setTransitionPath(finalPath);

        gsap.to(".service-detail-content", {
          opacity: 1,
          duration: 0.5,
          ease: "power4.out",
        });
      },
    });

    // Fade the expanding transition image to 0 opacity
    tl.to(
      document.documentElement,
      {
        "--transition-image-opacity": 0,
        duration: 1.0,
        ease: "power1.inOut",
      },
      0,
    );

    // Fade the clicked card's background image to 0 opacity via HTML-level CSS variable
    tl.to(
      document.documentElement,
      {
        [`--card-image-opacity-${index}`]: 0,
        duration: 0.6,
        ease: "power1.inOut",
      },
      0,
    );

    tl.to(
      transitionProgress.current,
      {
        x: 1,
        duration: 1.3,
        ease: "power1.inOut",
      },
      0,
    );
    tl.to(
      transitionProgress.current,
      {
        bulge: 40,
        duration: 0.4,
        ease: "power1.inOut",
      },
      0,
    );
    tl.to(
      transitionProgress.current,
      {
        bulge: 220,
        duration: 0.35,
        ease: "power1.out",
      },
      0.4,
    );
    tl.to(
      transitionProgress.current,
      {
        bulge: -35,
        duration: 0.35,
        ease: "power1.inOut",
      },
      0.75,
    );
    tl.to(
      transitionProgress.current,
      {
        bulge: 0,
        duration: 0.2,
        ease: "power1.out",
      },
      1.1,
    );
  };

  const handleCloseDetail = () => {
    if (isTransitioningRef.current || activeCard === null) return;
    isTransitioningRef.current = true;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const isMobile = W < 768;
    const transitionIndex = isMobile ? 0 : activeCard;
    const closingCardIndex = activeCard;

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
                x,     // pWidth
                1 - x, // pAnim (close animation progress is 1 - x)
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
              const buffer = 260;
              
              let imgX = 0;
              let imgW = W;
              
              if (transitionIndex === 0) {
                const x_curr = startR + x * (W - startR);
                imgX = -buffer;
                imgW = x_curr + 2 * buffer;
              } else if (transitionIndex === 2) {
                const x_curr = startL * (1 - x);
                imgX = x_curr - buffer;
                imgW = (W - x_curr) + 2 * buffer;
              } else {
                const x_left = startL * (1 - x);
                const x_right = startR + x * (W - startR);
                imgX = x_left - buffer;
                imgW = (x_right - x_left) + 2 * buffer;
              }
              
              imageRef.current.setAttribute("x", imgX.toString());
              imageRef.current.setAttribute("width", imgW.toString());
            }
          },
          onComplete: () => {
            // Reset CSS variables on html element when done
            gsap.set(document.documentElement, {
              clearProps: `--card-image-opacity-${closingCardIndex},--transition-image-opacity`
            });
            setActiveCard(null);
            setTransitionPath("");
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

            // Detect which card the cursor is currently over and set it as active hover
            const element = document.elementFromPoint(
              mousePosition.current.x,
              mousePosition.current.y
            );
            let foundCard = false;
            if (element) {
              const card = element.closest(".services-card");
              if (card) {
                const indexStr = card.getAttribute("data-index");
                if (indexStr !== null) {
                  setActiveHoverCard(parseInt(indexStr, 10));
                  foundCard = true;
                }
              }
            }
            if (!foundCard) {
              setActiveHoverCard(null);
            }
          },
        });

        // Fade CSS variable back to 1
        tl.to(
          document.documentElement,
          {
            [`--card-image-opacity-${closingCardIndex}`]: 1,
            duration: 0.8,
            ease: "power1.inOut",
          },
          0.4,
        );

        // Fade transition image opacity back to 1
        tl.to(
          document.documentElement,
          {
            "--transition-image-opacity": 1,
            duration: 1.0,
            ease: "power1.inOut",
          },
          0.1,
        );

        tl.to(
          transitionProgress.current,
          {
            x: 0,
            duration: 1.3,
            ease: "power1.inOut",
          },
          0,
        );
        tl.to(
          transitionProgress.current,
          {
            bulge: -45,
            duration: 0.4,
            ease: "power1.inOut",
          },
          0,
        );
        tl.to(
          transitionProgress.current,
          {
            bulge: -240, // opposite direction peak stretch!
            duration: 0.35,
            ease: "power1.out",
          },
          0.4,
        );
        tl.to(
          transitionProgress.current,
          {
            bulge: 40, // opposite recoil!
            duration: 0.35,
            ease: "power1.inOut",
          },
          0.75,
        );
        tl.to(
          transitionProgress.current,
          {
            bulge: 0,
            duration: 0.2,
            ease: "power1.out",
          },
          1.1,
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
      <div className="text-blocks-container absolute inset-0 z-10 pointer-events-none p-10 md:p-24 flex items-end justify-start overflow-hidden">
        {/* Text Block 1 */}
        <div className="absolute text-left opacity-0 translate-y-10 text-block-1 select-none bottom-20 md:bottom-32 left-10 md:left-24 max-w-xl">
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.35em] text-accent uppercase">
            30+ Years of Cinematic Excellence
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-light italic tracking-wide text-[#eae6e1] mt-3">
            3,000+ Masterpieces
          </h2>
          <p className="font-body text-xs md:text-sm text-[#eae6e1]/70 mt-4 leading-relaxed">
            Trusted by industry leaders including Tanishq, Titan, Hitachi, and Highly to deliver high-fidelity cinematic campaigns globally.
          </p>
        </div>

        {/* Text Block 2 */}
        <div className="absolute text-left opacity-0 translate-y-10 text-block-2 select-none bottom-20 md:bottom-32 left-10 md:left-24 max-w-xl">
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.35em] text-accent uppercase">
            Uncompromising Operational Trust
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-light italic tracking-wide text-[#eae6e1] mt-3">
            Zero-Friction Execution
          </h2>
          <p className="font-body text-xs md:text-sm text-[#eae6e1]/70 mt-4 leading-relaxed">
            Pioneering complete transparency, strict time commitments, and no hidden costs. Once assigned, we own the execution end-to-end so you don't have to worry about a thing.
          </p>
        </div>

        {/* Text Block 3 */}
        <div className="absolute text-left opacity-0 translate-y-10 text-block-3 select-none bottom-20 md:bottom-32 left-10 md:left-24 max-w-xl">
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.35em] text-accent uppercase">
            Future-Ready Celluloid Tech
          </span>
          <h2 className="font-display text-5xl md:text-7xl font-medium uppercase tracking-[0.2em] text-[#eae6e1] mt-3 drop-shadow-[0_0_30px_rgba(197,168,128,0.25)]">
            JJ FILMS
          </h2>
          <p className="font-body text-xs md:text-sm text-[#eae6e1]/70 mt-4 leading-relaxed">
            Harnessing cutting-edge visual systems with a global footprint, an unbroken record of 100% satisfaction, and zero negative reviews.
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
              data-index={index}
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
              className={`card-bg-image card-bg-image-${index} absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-105`}
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
              <path ref={pathRef} d={transitionPath} />
            </clipPath>
          </defs>
          {activeCard !== null && (
            <>
              {/* Solid Black Background behind the transition image */}
              <rect
                width="100%"
                height="100%"
                fill="#030303"
                clipPath="url(#card-clip)"
              />
              {/* Expanding image that fades to opacity 0 */}
              <image
                ref={imageRef}
                href={SERVICES_DATA[activeCard].image}
                x={startPos.startLeft - 260}
                width={(startPos.startRight - startPos.startLeft) + 520}
                height="100%"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#card-clip)"
                style={{
                  opacity: `var(--transition-image-opacity, 1)`,
                }}
              />
            </>
          )}
        </svg>

        {activeCard !== null && (
          <div
            onClick={handleCloseDetail}
            className="service-detail-content absolute inset-0 z-10 opacity-0 cursor-pointer"
          />
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
        .card-bg-image-0 {
          opacity: var(--card-image-opacity-0, 1);
        }
        .card-bg-image-1 {
          opacity: var(--card-image-opacity-1, 1);
        }
        .card-bg-image-2 {
          opacity: var(--card-image-opacity-2, 1);
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
