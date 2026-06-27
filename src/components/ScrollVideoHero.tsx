"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

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

const SERVICES_LIST = [
  {
    title: "Property Photography",
    description: "Premium wide-angle and detail interior/exterior photography utilizing advanced bracketed exposures, high-end optical sensors, and architectural perspective correction to showcase luxury properties in their most pristine visual light.",
  },
  {
    title: "Real Estate Videography",
    description: "Custom-engineered walkthrough videos combining smooth motorized gimbal movements, dynamic lens shifts, and volumetric lighting tracks designed to create immersive virtual experiences for prospective buyers.",
  },
  {
    title: "Drone Photography & Videography",
    description: "FAA-certified aerial cinematography capturing majestic sweeping sweeps, property boundaries, and neighborhood accessibility profiles on ultra-high definition 4K camera sensors for complete spatial overview.",
  },
  {
    title: "Luxury Property Films",
    description: "Bespoke, cinematic storytelling productions featuring custom sound designs, emotional lifestyle scripts, and elite color grades tailored exclusively for high-end luxury villas, penthouses, and landmark resorts.",
  },
  {
    title: "Builder & Developer Project Shoots",
    description: "High-impact marketing assets for developers, highlighting structural engineering scale, premium raw materials, and completed phases to build market authority and drive early off-plan sales.",
  },
  {
    title: "Architectural Photography",
    description: "Fine-art photography focusing on design details, dynamic shadow geometry, material textures, and natural lighting shifts, tailored for elite architects, structural engineers, and design catalogs.",
  },
  {
    title: "Interior Photography",
    description: "Curated interior captures highlighting spatial layout, custom furniture details, textures, and lighting design, crafted specifically to elevate portfolios for designers and luxury staging firms.",
  },
  {
    title: "Property Marketing Reels",
    description: "High-conversion, fast-paced vertical video reels (9:16) optimized with trending pacing and text layouts, engineered to maximize engagement, virality, and lead acquisition on social media channels.",
  },
  {
    title: "Virtual Property Tours",
    description: "High-resolution 3D virtual walkthroughs mapping spatial flows and architectural layouts, allowing prospective international buyers to inspect every corner of the property remotely.",
  },
  {
    title: "Construction Progress Documentation",
    description: "Periodic, chronologically structured high-definition photography and drone tracking reports designed to document construction milestones for investors, stakeholders, and regulatory agencies.",
  },
  {
    title: "360° Virtual Tours",
    description: "Seamless, interactive 360-degree virtual space models equipped with hot-spot labels and detailed maps, offering immersive digital inspection of premium properties from any device.",
  },
];

const COMMERCIAL_SERVICES = [
  {
    title: "Brand Storytelling Films",
    description: "High-concept cinematic brand profiles detailing your company's heritage, cultural values, and creative philosophy, engineered to forge a strong emotional connection with global audiences.",
  },
  {
    title: "Product Launch Videos",
    description: "Visually arresting product reveals utilizing high-speed macro cinematography, volumetric light designs, and custom CGI integration to generate maximum market hype and customer engagement.",
  },
  {
    title: "Social Media Campaigns",
    description: "A collection of short-form, high-retention video assets (Reels, TikToks, Shorts) designed around target demographics to maximize viewer retention, sharing frequency, and direct conversion rates.",
  },
  {
    title: "TV & Broadcast Commercials",
    description: "Full-scale commercial productions meeting rigorous network standards, featuring professional casting, art direction, and post-production optimization to capture broad television and digital audiences.",
  },
  {
    title: "Corporate Event Cinematography",
    description: "Comprehensive multi-camera coverage capturing the energy, keynotes, and human interactions of corporate summits, panel sessions, and galas, delivered in highly polished event recap films.",
  },
  {
    title: "Testimonial & Case Study Videos",
    description: "Authentic, interview-driven customer success narratives capturing verified metrics and human satisfaction to establish absolute market authority and trust for enterprise products.",
  },
  {
    title: "Company Culture & Recruitment",
    description: "Behind-the-scenes profiles of daily workflows, team collaborations, and executive visions, designed to showcase an inspiring work environment and attract elite global talent.",
  },
  {
    title: "Aerial & Drone Videography",
    description: "Licensed, safe, and dynamic aerial drone filming capturing factory complexes, corporate headquarters, and site developments from dramatic, high-angle cinematic vantage points.",
  },
  {
    title: "Animated Explainer Videos",
    description: "Custom motion graphic sequences, clean vector animations, and voiceover designs that simplify complex product features, app workflows, or technical architectures for easy understanding.",
  },
  {
    title: "Behind-the-Scenes (BTS) Content",
    description: "Engaging documentary logs detailing the scale, effort, and creative milestones of your marketing campaigns, adding human relatability and brand transparency.",
  },
];

const WEDDING_SERVICES = [
  {
    title: "Cinematic Highlight Film",
    description: "A masterfully edited, non-linear cinematic story of your wedding day, set to custom licensed soundtracks that weave together emotional vows, laughter, and premium visual compositions.",
  },
  {
    title: "Full-Feature Documentary Film",
    description: "A comprehensive, chronologically polished archive of your entire celebration, preserving full multi-camera records of the ceremony, toasts, first dances, and reception moments in pristine clarity.",
  },
  {
    title: "Pre-Wedding Cinematic Shoot",
    description: "A relaxed, fashion-forward couple profile shot in high-end scenic locations, designed to capture your unique chemistry and relationship story prior to the main wedding celebrations.",
  },
  {
    title: "Aerial Drone Cinematography",
    description: "Majestic 4K aerial compositions highlighting the layout, scale, and natural landscaping of your wedding venue, providing a grand context to your digital heirloom.",
  },
  {
    title: "Multi-Day Event Coverage",
    description: "Dedicated production crews documenting welcome dinners, wedding preparations, traditional rituals, morning brunches, and post-celebration parties to capture the full story of your guests.",
  },
  {
    title: "Same-Day Edit (SDE) Film",
    description: "A high-speed editing feat where highlights from the morning prep and ceremony are woven into a cinematic teaser and screened live to your guests during the reception dinner.",
  },
  {
    title: "Destination Wedding Cinematography",
    description: "Travel-ready, expert production crews equipped with specialized gear setups to document luxury unions in remote locations, varying climates, and historic venues globally.",
  },
  {
    title: "High-Fidelity Audio Vows Capture",
    description: "Pristine multi-source sound engineering utilizing discrete wireless lapel microphones and soundboard lines to capture clear whispers of vows, letter readings, and family speeches.",
  },
  {
    title: "Bridal Portraits & Preparations",
    description: "Intimate, macro-focused portrait capture highlighting dress textures, accessory details, emotional first-looks, and candid preparation moments before walking down the aisle.",
  },
  {
    title: "Anniversary & Legacy Vows Renewal",
    description: "Cinematic tribute packages documenting legacy vows, long-term family unions, and renewal celebrations, designed to preserve visual history for future generations.",
  },
];

const CARD_DETAILS = [
  {
    heroImage: "/images/real_estate_hero.png",
    trustBadge: "Cinematic Quality Assured • 5★ Rated Agency",
    subtitle: "Architectural Spaces, Elevated",
    title: (
      <>
        Real Estate
        <br />
        Cinematic Vision
      </>
    ),
    description: "We document luxury estates, residential masterpieces, and commercial developments with pristine clarity. Every angle is carefully composed using cinematic camera motion, volumetric lighting, and advanced stabilizations to deliver absolute visual prestige.",
    gridTag: "EXPERTISE & CAPABILITIES",
    gridTitle: "Real Estate Services",
    gridIntro: "From high-end luxury villa features to interactive virtual spaces, explore our specialized suites designed to scale developer property assets.",
    services: SERVICES_LIST,
    gallery: [
      {
        title: "Aura",
        tagline: "LUXURY RESIDENCE",
        image: "/images/real_estate_hero.png",
        description: "High-ceiling architectural geometries captured at sunset, highlighting structural glass and ambient lighting.",
      },
      {
        title: "Vortex",
        tagline: "COMMERCIAL PLAZA",
        image: "/images/real_estate.png",
        description: "Dynamic aerial tracking shots emphasizing location scale, traffic accessibility, and surrounding landscape.",
      },
      {
        title: "Mirage",
        tagline: "OCEAN PENTHOUSE",
        image: "/images/real_estate_hero.png",
        description: "Ultra-wide angle interior framing showcasing spatial flow, bespoke textures, and panoramic ocean vistas.",
      },
    ],
  },
  {
    heroImage: "/images/commercial_films.png",
    trustBadge: "Premium Brand Production • Award-Winning Quality",
    subtitle: "Visual Narratives, Engineered",
    title: (
      <>
        Commercial Films
        <br />
        Cinematic Stories
      </>
    ),
    description: "Premium brand narratives engineered for the screen. From high-impact commercials to documentary-style brand stories, we direct cinematic campaigns that capture volumetric shadows, rich textures, and evoke deep emotional connections.",
    gridTag: "BRAND SOLUTIONS & MARKETING",
    gridTitle: "Commercial Production Services",
    gridIntro: "High-concept campaigns, social media assets, and corporate documentaries designed to amplify your brand presence.",
    services: COMMERCIAL_SERVICES,
    gallery: [
      {
        title: "Titan",
        tagline: "CRAFT BEVERAGE AD",
        image: "/images/commercial_films.png",
        description: "High-speed macro cinematography capturing condensation droplets and volumetric studio lighting.",
      },
      {
        title: "Aether",
        tagline: "TECH APPAREL REVEAL",
        image: "/images/commercial_films.png",
        description: "Dynamic motion control tracking shots highlighting fabric weave details and active athlete geometry.",
      },
      {
        title: "Nexus",
        tagline: "AUTOMOTIVE SPOT",
        image: "/images/commercial_films.png",
        description: "Cinematic tracking of luxury EV sweeping through volumetric mountain curves at blue hour.",
      },
    ],
  },
  {
    heroImage: "/images/wedding_films.png",
    trustBadge: "Intimate Storytelling • 100% High-Fidelity Legacy",
    subtitle: "Candid Moments, Preserved",
    title: (
      <>
        Wedding Films
        <br />
        Cinematic Heirlooms
      </>
    ),
    description: "High-fidelity cinematic keepsakes. We document luxury weddings and boutique events with an intimate, candid approach. Every stolen glance, whispered vow, and joyful tear is preserved forever on pristine 4K formats.",
    gridTag: "CINEMATIC HEIRLOOMS & EVENTS",
    gridTitle: "Wedding Film Services",
    gridIntro: "From intimate cinematic highlights to comprehensive documentary features, explore how we preserve your legacy.",
    services: WEDDING_SERVICES,
    gallery: [
      {
        title: "Elysian",
        tagline: "TUSCAN ESTATE",
        image: "/images/wedding_films.png",
        description: "Intimate golden hour portraits of the couple sweeping through antique olive groves.",
      },
      {
        title: "Solace",
        tagline: "CATHEDRAL VOWS",
        image: "/images/wedding_films.png",
        description: "Prism-filtered closeups of vows capture, preserving emotional details in high-fidelity 4K celluloid.",
      },
      {
        title: "Rhapsody",
        tagline: "LAKE RECEPTION",
        image: "/images/wedding_films.png",
        description: "Multi-angle drone sweeps capturing grand dinner setups and reception firework reveals.",
      },
    ],
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
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [activeHoverCard, setActiveHoverCard] = useState<number | null>(null);
  const [galleryProgress, setGalleryProgress] = useState(0);
  const [galleryActiveIndex, setGalleryActiveIndex] = useState(0);
  const [transitionPath, setTransitionPath] = useState<string>("");
  const [loadReelImages, setLoadReelImages] = useState(false);
  const [startPos, setStartPos] = useState({ startLeft: 0, startRight: 0 });
  const [showAllServices, setShowAllServices] = useState(false);
  const [showAllServicesView, setShowAllServicesView] = useState(false);
  const [homepageScrollProgress, setHomepageScrollProgress] = useState(0);
  const [detailScrollProgress, setDetailScrollProgress] = useState(0);
  const [transitionFinished, setTransitionFinished] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const localLenisRef = useRef<Lenis | null>(null);
  const isTransitioningRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const detailScrollRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const imageRef = useRef<SVGImageElement>(null);
  const transitionProgress = useRef({ x: 0, bulge: 0 });
  const scrollPathRef = useRef<SVGPathElement>(null);
  const scrollProgress = useRef({ current: 0, target: 0 });
  const transitionStartPos = useRef({ startLeft: 0, startRight: 0 });
  const mousePosition = useRef({ x: 0, y: 0 });
  const handleCloseDetailRef = useRef<() => void>(() => {});
  const activeCardRef = useRef<number | null>(null);

  useEffect(() => {
    activeCardRef.current = activeCard;
  }, [activeCard]);

  // Synchronized navbar entrance animation
  useEffect(() => {
    if (activeCard !== null && transitionFinished && imageLoaded) {
      gsap.killTweensOf(".global-navbar");
      gsap.fromTo(".global-navbar",
        { opacity: 0, y: -20, pointerEvents: "none" },
        { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.8, ease: "power4.out" }
      );
    } else {
      gsap.killTweensOf(".global-navbar");
      gsap.set(".global-navbar", { opacity: 0, y: -20, pointerEvents: "none" });
    }
  }, [activeCard, transitionFinished, imageLoaded]);


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

  // Lazy load reel section images after loader finishes to prioritize critical video frames
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setLoadReelImages(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  // Preload frames progressively to unlock interaction quickly and prevent queue saturation
  useEffect(() => {
    let active = true;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    imagesRef.current = images;

    const CRITICAL_STEP = 8;
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
    const BATCH_SIZE = 16;

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

    const params = new URLSearchParams(window.location.search);
    const isClose = params.get("transition") === "close";

    const loaderExitTl = gsap.timeline({
      onComplete: () => {
        setShowLoader(false);
        const isCards = params.get("scroll") === "cards";
        const isClose = params.get("transition") === "close";

        if (isCards || isClose) {
          const globalWindow = window as unknown as {
            lenis?: { scrollTo: (target: any, options?: any) => void; stop: () => void; start: () => void };
          };
          if (globalWindow.lenis) {
            globalWindow.lenis.start();
            globalWindow.lenis.scrollTo("bottom", { immediate: true });
            if (isClose) {
              globalWindow.lenis.stop();
            }
          } else {
            window.scrollTo(0, document.documentElement.scrollHeight);
          }
          ScrollTrigger.refresh();
        }

        if (isClose) {
          setTimeout(() => {
            handleCloseDetailRef.current();
          }, 100);
        } else if (isCards) {
          revealTimeline.play();
        }
      },
    });

    loaderExitTl
      // 1. Fade out all loader text overlays and UI metrics quickly
      .to(".loader-content", {
        opacity: 0,
        duration: 0.1,
        ease: "power3.out",
      })
      // 2. Staggered lifting of the vertical curtain strips
      .to(".loader-strip", {
        yPercent: -100,
        duration: 0.5,
        stagger: 0.03,
        ease: "power3.inOut",
      })
      // 3. Smooth reveal / lens zoom-out transition of the background canvas
      .fromTo(
        canvas,
        { scale: 1.25, opacity: 0.6 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.45", // starts shortly after curtain strips start lifting
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

      // 2. Fade out Text Blocks Container
      .to(
        ".text-blocks-container",
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
          setHomepageScrollProgress(self.progress);
          if (self.progress >= 0.95) {
            revealTimeline.play();
          } else {
            if (activeCardRef.current === null) {
              revealTimeline.reverse();
            }
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

    // Initialize full-screen S-curve details transition if returning via closing animation
    if (isClose) {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const isMobile = W < 768;
      const startLeft = 0;
      const startRight = isMobile ? W : W / 3;

      transitionStartPos.current = { startLeft, startRight };
      setStartPos({ startLeft, startRight });
      setActiveCard(0);

      // Pre-set full-screen path
      const initialPath = getPath(0, 1, 1, 0, W, H, startLeft, startRight);
      setTransitionPath(initialPath);

      // Pre-set CSS variables to hide card image and show black transition overlay
      gsap.set(document.documentElement, {
        "--transition-image-opacity": 0,
        "--card-image-opacity-0": 0,
      });

      // Show overlay and stop Lenis scroll
      if (overlayRef.current) {
        overlayRef.current.classList.remove("hidden");
        overlayRef.current.classList.add("pointer-events-auto");
        overlayRef.current.classList.remove("pointer-events-none");
      }
      
      const globalWindow = window as unknown as {
        lenis?: { stop: () => void };
      };
      if (globalWindow.lenis) {
        globalWindow.lenis.stop();
      }

      // Initialize the homepage cards to be fully visible underneath
      revealTimeline.progress(1);
    }

    const isCards = params.get("scroll") === "cards";
    if (isCards || isClose) {
      window.history.replaceState(null, "", "/");
    }

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

    setShowAllServices(false);
    setShowAllServicesView(false);
    setDetailScrollProgress(0);
    setTransitionFinished(false);
    setImageLoaded(false);

    // Preload hero image for detail screen
    const cardDetailsObj = CARD_DETAILS[index];
    if (cardDetailsObj && cardDetailsObj.heroImage) {
      const img = new Image();
      img.src = cardDetailsObj.heroImage;
      const checkImgComplete = () => {
        if (img.complete) {
          setImageLoaded(true);
        } else {
          img.onload = () => setImageLoaded(true);
          img.onerror = () => setImageLoaded(true);
        }
      };
      checkImgComplete();
    } else {
      setImageLoaded(true);
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

        isTransitioningRef.current = false;
        setTransitionFinished(true);
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

  const scrollToSection = (id: string) => {
    if (localLenisRef.current) {
      localLenisRef.current.scrollTo(id, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleCloseDetail = () => {
    if (isTransitioningRef.current || activeCard === null) return;
    setShowAllServices(false);
    setShowAllServicesView(false);
    setDetailScrollProgress(0);
    setTransitionFinished(false);
    setImageLoaded(false);
    gsap.to(".global-navbar", { opacity: 0, y: -20, duration: 0.3, ease: "power2.in" });
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

  useEffect(() => {
    handleCloseDetailRef.current = handleCloseDetail;
  }, [handleCloseDetail]);

  useEffect(() => {
    const el = detailScrollRef.current;
    if (!el || activeCard === null) return;

    // Initialize local Lenis for smooth scrolling inside the details overlay container
    const localLenis = new Lenis({
      wrapper: el,
      content: el.querySelector(".service-detail-content-inner") || el.firstElementChild || undefined,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });
    localLenisRef.current = localLenis;

    let rafId: number;
    const tick = (time: number) => {
      localLenis.raf(time);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    let snapTimeout: any;
    // Dynamic scroll tracking inside details overlay
    const handleScroll = (e: any) => {
      if (e && typeof e.progress === "number") {
        setDetailScrollProgress(e.progress);
      } else {
        const scrollHeight = el.scrollHeight - el.clientHeight;
        if (scrollHeight > 0) {
          setDetailScrollProgress(el.scrollTop / scrollHeight);
        }
      }

      const section = el.querySelector("#mp-gallery-section") as HTMLElement;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const totalScrollable = rect.height - viewHeight;

      if (totalScrollable <= 0) return;

      // Calculate progress of the gallery section from 0 to 1
      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      setGalleryProgress(progress);

      // Determine active index
      let index = 0;
      if (progress > 0.66) {
        index = 2;
      } else if (progress > 0.33) {
        index = 1;
      }
      setGalleryActiveIndex(index);

      // Debounce scroll snapping to closest project slide
      clearTimeout(snapTimeout);
      snapTimeout = setTimeout(() => {
        // Only snap if we are within the scroll boundaries of the gallery section
        if (progress > 0.05 && progress < 0.95) {
          const targetIndex = Math.round(progress * 2);
          const sectionScrollTop = el.scrollTop + rect.top; // absolute scroll offset of section top
          const targetScroll = sectionScrollTop + targetIndex * (totalScrollable / 2);
          
          localLenis.scrollTo(targetScroll, {
            duration: 0.9,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // match Lenis premium ease out
          });
        }
      }, 250); // 250ms after last scroll event
    };

    localLenis.on("scroll", handleScroll);

    const stopScrollPropagation = (e: Event) => {
      e.stopPropagation();
    };

    // Prevent wheel/touch events from bubbling up to Lenis window listeners
    el.addEventListener("wheel", stopScrollPropagation, { passive: false });
    el.addEventListener("touchstart", stopScrollPropagation, { passive: true });
    el.addEventListener("touchmove", stopScrollPropagation, { passive: false });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(snapTimeout);
      localLenis.off("scroll", handleScroll);
      localLenis.destroy();
      localLenisRef.current = null;
      el.removeEventListener("wheel", stopScrollPropagation);
      el.removeEventListener("touchstart", stopScrollPropagation);
      el.removeEventListener("touchmove", stopScrollPropagation);
    };
  }, [activeCard]);

  return (
    <div
      ref={triggerRef}
      className="relative w-screen h-screen bg-background overflow-hidden"
    >
      {/* Global Redesigned Capsule Navigation Bar */}
      <div 
        style={{ zIndex: 60 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl global-navbar opacity-0 pointer-events-none"
      >
        <nav 
          className="w-full bg-[#050507]/60 backdrop-blur-xl border border-white/10 rounded-full py-3 px-6 md:px-10 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative pointer-events-auto transition-all duration-500 hover:border-accent/30 hover:shadow-[0_20px_50px_rgba(197,168,128,0.05)]"
        >
          {/* Logo */}
          <div 
            onClick={() => {
              if (showAllServicesView) {
                setShowAllServicesView(false);
                setTimeout(() => scrollToSection("hero-section"), 50);
              } else {
                scrollToSection("hero-section");
              }
            }}
            className="font-display tracking-[0.25em] font-light text-foreground text-xs md:text-sm uppercase cursor-pointer hover:text-accent transition-colors"
          >
            JJ FILMS
          </div>
          
          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-6 font-mono text-[9px] tracking-[0.25em] uppercase text-foreground/50">
            <button
              onClick={() => {
                if (showAllServicesView) {
                  setShowAllServicesView(false);
                  setTimeout(() => scrollToSection("hero-section"), 50);
                } else {
                  scrollToSection("hero-section");
                }
              }}
              className="hover:text-accent transition-colors cursor-pointer border-none bg-transparent outline-none p-0 relative group"
            >
              Overview
              <span className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <span className="text-white/10 font-light select-none">/</span>
            <button
              onClick={() => {
                if (showAllServicesView) {
                  setShowAllServicesView(false);
                  setTimeout(() => scrollToSection("services-section"), 50);
                } else {
                  scrollToSection("services-section");
                }
              }}
              className="hover:text-accent transition-colors cursor-pointer border-none bg-transparent outline-none p-0 relative group"
            >
              Services
              <span className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            {activeCard !== null && CARD_DETAILS[activeCard]?.gallery && CARD_DETAILS[activeCard].gallery.length > 0 && (
              <>
                <span className="text-white/10 font-light select-none">/</span>
                <button
                  onClick={() => {
                    if (showAllServicesView) {
                      setShowAllServicesView(false);
                      setTimeout(() => scrollToSection("mp-gallery-section"), 50);
                    } else {
                      scrollToSection("mp-gallery-section");
                    }
                  }}
                  className="hover:text-accent transition-colors cursor-pointer border-none bg-transparent outline-none p-0 relative group"
                >
                  Gallery
                  <span className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </>
            )}
          </div>
          
          {/* CTA & Close Button */}
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => {
                if (showAllServicesView) {
                  setShowAllServicesView(false);
                  setTimeout(() => scrollToSection("details-contact"), 50);
                } else {
                  scrollToSection("details-contact");
                }
              }}
              className="inline-flex items-center justify-center font-mono text-[8px] md:text-[9px] tracking-[0.2em] uppercase bg-accent text-background hover:bg-white hover:text-background px-5 py-2 rounded-full transition-all duration-300 font-semibold shadow-[0_4px_12px_rgba(197,168,128,0.25)] cursor-pointer border-none outline-none"
            >
              Book Consultation
            </button>
            <span className="text-white/10 hidden sm:inline select-none">|</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCloseDetail();
              }}
              className="group inline-flex items-center gap-1.5 font-mono text-[8px] md:text-[9px] tracking-[0.15em] uppercase text-foreground/50 hover:text-accent transition-colors duration-300 cursor-pointer border-none bg-transparent outline-none p-0"
            >
              <span className="font-sans text-[11px] leading-none transition-transform duration-500 group-hover:rotate-90">
                ✕
              </span>
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>

          {/* Scroll progress running along the bottom border of the capsule */}
          <div className="absolute bottom-0 left-6 right-6 h-[1.5px] bg-white/5 overflow-hidden rounded-full">
            <div 
              className="h-full bg-accent" 
              style={{ width: `${detailScrollProgress * 100}%` }}
            />
          </div>
        </nav>
      </div>

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
            <div className="absolute top-24 left-12 flex flex-col gap-1 pointer-events-none select-none font-mono text-[9px] md:text-[10px] text-foreground/40 tracking-[0.25em]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="text-foreground/80 font-bold">REC</span>
              </div>
              <div>CAM_A // RAW 4K</div>
              <div>SHUTTER 180°</div>
              <div>PROGRESS // FPS 24</div>
            </div>

            <div className="absolute top-24 right-12 flex flex-col items-end gap-1 pointer-events-none select-none font-mono text-[9px] md:text-[10px] text-foreground/40 tracking-[0.25em]">
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
              style={{
                backgroundImage: loadReelImages ? `url('${service.image}')` : 'none',
              }}
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
              {/* Visual Card CTA */}
              <div className="mt-8 overflow-hidden">
                <span className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] uppercase text-accent group-hover:text-white transition-colors duration-500 font-semibold">
                  EXPLORE ARCHIVE 
                  <span className="transform translate-x-0 group-hover:translate-x-1.5 transition-transform duration-500">→</span>
                </span>
              </div>
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
                href={loadReelImages ? SERVICES_DATA[activeCard].image : undefined}
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
            ref={detailScrollRef}
            onClick={handleCloseDetail}
            data-lenis-prevent
            className="service-detail-content absolute inset-0 z-10 opacity-0 overflow-y-auto h-screen w-screen pointer-events-auto cursor-pointer"
          >
            {(() => {
              const details = CARD_DETAILS[activeCard];
              if (!details) return null;

              return (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="service-detail-content-inner w-full min-h-screen text-left cursor-default select-text bg-[#030303]"
                >
                  {showAllServicesView ? (
                    /* Redesigned All Services Page Layout */
                    <div className="w-full min-h-screen pt-32 pb-24 px-8 md:px-24 bg-[#030303] animate-fade-in relative">
                      {/* Technical visual elements for luxury studio look */}
                      <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-accent/20" />
                        <div className="absolute top-0 left-1/4 h-full w-[1px] bg-accent/20" />
                        <div className="absolute top-0 left-3/4 h-full w-[1px] bg-accent/20" />
                      </div>

                      <div className="max-w-7xl mx-auto relative z-10">
                        {/* Back button at the top */}
                        <div className="mb-16">
                          <button
                            onClick={() => {
                              setShowAllServicesView(false);
                              if (detailScrollRef.current) {
                                detailScrollRef.current.scrollTop = 0;
                              }
                              if (localLenisRef.current) {
                                localLenisRef.current.scrollTo(0, { immediate: true });
                              }
                            }}
                            className="group inline-flex items-center gap-2.5 font-mono text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-accent/70 hover:text-accent transition-colors duration-300 cursor-pointer border-none bg-transparent outline-none p-0"
                          >
                            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
                              ←
                            </span>
                            <span>Back to Overview</span>
                          </button>
                        </div>

                        {/* Header */}
                        <div className="mb-20 md:mb-32">
                          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-accent uppercase">
                            {details.gridTag} Portfolio
                          </span>
                          <h1 className="font-display text-4xl md:text-7xl font-light italic tracking-wide text-foreground mt-4">
                            All Service Offerings
                          </h1>
                          <p className="font-body text-xs md:text-sm text-[#7c7c82] max-w-xl leading-relaxed mt-6">
                            A complete breakdown of our high-fidelity production services, cinematic strategies, and specialized media craft.
                          </p>
                          <p className="font-body text-xs md:text-sm text-[#7c7c82]/70 max-w-3xl leading-relaxed mt-4">
                            Every service is executed with a relentless pursuit of creative prestige and technical precision. We deploy advanced cinematography packages, tailored grading, and specialized director treatments to capture properties and narratives in their most premium light, ensuring every detail reflects absolute architectural and emotional resonance.
                          </p>
                          <div className="h-[1px] bg-accent/15 w-full mt-10" />
                        </div>

                        {/* Services List (Detailed alternate layout) */}
                        <div className="flex flex-col gap-24 md:gap-36">
                          {details.services.map((service, index) => {
                            const isEven = index % 2 === 0;
                            const num = String(index + 1).padStart(2, "0");
                            return (
                              <div 
                                key={index}
                                className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-12 md:gap-20 items-center`}
                              >
                                {/* Left/Right Text Column */}
                                <div className="w-full md:w-1/2 flex flex-col gap-6">
                                  <div className="flex items-center gap-4">
                                    <span className="font-mono text-[10px] tracking-[0.25em] text-accent font-bold">
                                      [{num}]
                                    </span>
                                    <div className="h-[1px] bg-accent/25 w-12" />
                                  </div>
                                  <h3 className="font-display text-3xl md:text-4xl font-light text-[#eae6e1]">
                                    {service.title}
                                  </h3>
                                  <p className="font-body text-sm md:text-base text-foreground/60 leading-relaxed">
                                    {service.description}
                                  </p>
                                  {/* Elaborated technical specifications bullet points */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 font-mono text-[9px] tracking-[0.1em] text-foreground/45 uppercase border-t border-white/5 pt-6">
                                    <div className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                      <span>Advanced Equipment</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                      <span>4K RAW Mastering</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                      <span>Bespoke Color Grade</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                      <span>Unlimited Usage Rights</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Decorative Visual Canvas Block */}
                                <div className="w-full md:w-1/2 h-[200px] md:h-[300px] bg-[#09090b] border border-accent/15 rounded-[4px] relative overflow-hidden flex items-center justify-center group shadow-2xl">
                                  {/* Glassmorphic lighting gradient overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/[0.04] via-transparent to-accent/[0.04] opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                                  
                                  {/* Technical view lines */}
                                  <div className="absolute inset-4 border border-white/[0.02] pointer-events-none">
                                    <div className="absolute top-0 bottom-0 left-1/3 border-l border-dashed border-white/[0.015]" />
                                    <div className="absolute top-0 bottom-0 right-1/3 border-l border-dashed border-white/[0.015]" />
                                    <div className="absolute left-0 right-0 top-1/3 border-t border-dashed border-white/[0.015]" />
                                    <div className="absolute left-0 right-0 bottom-1/3 border-t border-dashed border-white/[0.015]" />
                                  </div>

                                  <div className="absolute top-3 left-4 font-mono text-[7px] text-white/25 uppercase tracking-widest">
                                    Capture Mode // RAW
                                  </div>
                                  <div className="absolute bottom-3 right-4 font-mono text-[7px] text-white/25 uppercase tracking-widest">
                                    ISO 800 // 24FPS
                                  </div>

                                  <span className="font-mono text-[9px] tracking-[0.4em] text-foreground/15 uppercase select-none group-hover:text-accent/30 group-hover:scale-105 transition-all duration-1000">
                                    JJ FILMS // {num}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <>
                      {/* ── Hero Section — Two-Column Editorial Split ── */}
                      {/*   Left: solid dark text panel  |  Right: pure image, zero overlay  */}
                      <section
                    id="hero-section"
                    className="relative h-screen flex overflow-hidden"
                  >
                    {/* ── LEFT: Text Panel ── */}
                    <div className="relative flex-shrink-0 w-[38%] min-w-[320px] bg-[#030303] flex flex-col justify-center px-10 md:px-16 xl:px-20 pt-24 pb-12 z-20">
                      {/* Left accent border */}
                      <div
                        className="absolute right-0 top-0 bottom-0 w-[3px]"
                        style={{
                          background:
                            'linear-gradient(to bottom, transparent 5%, rgba(197,168,128,0.35) 25%, rgba(197,168,128,0.35) 75%, transparent 95%)',
                        }}
                      />

                      {/* Top corner mark */}
                      <div className="absolute top-24 left-10 md:left-16 xl:left-20 font-mono text-[8px] tracking-[0.3em] text-foreground/15 uppercase select-none">
                        JJ FILMS // {details.gridTag.split(' ')[0]}
                      </div>

                      {/* Trust badge */}
                      {details.trustBadge && (
                        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-3.5 py-1.5 rounded-full mb-8 self-start animate-fade-in">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          <span className="font-mono text-[9px] tracking-[0.25em] text-accent uppercase font-medium">
                            {details.trustBadge}
                          </span>
                        </div>
                      )}

                      {/* Subtitle */}
                      <span className="font-mono text-[9px] md:text-[10px] tracking-[0.45em] text-accent/75 uppercase block mb-5">
                        {details.subtitle}
                      </span>

                      {/* Gold rule */}
                      <div className="w-10 h-[1px] bg-accent/40 mb-8" />

                      {/* Main title */}
                      <h1 className="font-display text-4xl md:text-5xl xl:text-[3.6rem] font-light italic tracking-normal text-[#eae6e1] leading-[1.08] mb-8">
                        {details.title}
                      </h1>

                      {/* Description */}
                      <p className="font-body text-[13px] text-[#eae6e1]/52 leading-relaxed mb-10">
                        {details.description}
                      </p>

                      {/* Horizontal divider */}
                      <div className="w-full h-[1px] bg-white/5 mb-8" />

                      {/* Bottom meta row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-[1px] bg-accent/25" />
                          <span className="font-mono text-[8px] tracking-[0.35em] uppercase text-foreground/28">Scroll to explore</span>
                        </div>
                        <span className="font-mono text-[8px] tracking-[0.2em] text-foreground/15 select-none">01 / 03</span>
                      </div>
                    </div>

                    {/* ── RIGHT: Pure image — zero overlay ── */}
                    <div className="relative flex-1 overflow-hidden">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url('${details.heroImage}')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      {/* Feather-soft left-edge seam — prevents a harsh cut, not a darkening overlay */}
                      <div
                        className="absolute inset-y-0 left-0 w-14 pointer-events-none"
                        style={{ background: 'linear-gradient(to right, #030303, transparent)' }}
                      />
                      {/* Narrow navbar top scrim — only on this panel to keep nav readable */}
                      <div
                        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
                        style={{ background: 'linear-gradient(to bottom, rgba(3,3,3,0.45), transparent)' }}
                      />
                    </div>
                  </section>

                  {/* Services Section */}
                  <section id="services-section" className="relative py-24 md:py-32 px-8 md:px-24 border-t border-accent/5 bg-[#030303]">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-6">
                      <div>
                        <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-accent uppercase">
                          {details.gridTag}
                        </span>
                        <h2 className="font-display text-4xl md:text-6xl font-light italic tracking-wide text-foreground mt-3">
                          {details.gridTitle}
                        </h2>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-6">
                        <p className="font-body text-xs md:text-sm text-[#7c7c82] max-w-md leading-relaxed md:text-right">
                          {details.gridIntro}
                        </p>
                        {details.services.length > 3 && (
                          <button
                            onClick={() => {
                              setShowAllServicesView(true);
                              if (detailScrollRef.current) {
                                detailScrollRef.current.scrollTop = 0;
                              }
                              if (localLenisRef.current) {
                                localLenisRef.current.scrollTo(0, { immediate: true });
                              }
                            }}
                            className="group inline-flex items-center gap-2.5 font-mono text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-accent border border-accent/20 hover:border-accent bg-transparent px-6 py-2.5 rounded-[2px] transition-all duration-500 hover:bg-accent/5 hover:tracking-[0.3em] cursor-pointer outline-none"
                          >
                            <span>View More</span>
                            <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5">
                              →
                            </span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {(showAllServices ? details.services : details.services.slice(0, 3)).map((service, index) => {
                        const num = String(index + 1).padStart(2, "0");
                        return (
                          <div
                            key={index}
                            className="group relative bg-[#0a0a0c]/40 border border-accent/10 p-8 md:p-10 rounded-[4px] overflow-hidden flex flex-col justify-between min-h-[220px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#121215]/70 hover:border-accent/40 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_-15px_rgba(197,168,128,0.15)] animate-fade-in"
                          >
                            {/* Micro focus corner brackets */}
                            <div className="absolute top-4 left-4 w-1.5 h-1.5 border-t border-l border-accent/0 group-hover:border-accent/30 transition-colors duration-500" />
                            <div className="absolute top-4 right-4 w-1.5 h-1.5 border-t border-r border-accent/0 group-hover:border-accent/30 transition-colors duration-500" />
                            <div className="absolute bottom-4 left-4 w-1.5 h-1.5 border-b border-l border-accent/0 group-hover:border-accent/30 transition-colors duration-500" />
                            <div className="absolute bottom-4 right-4 w-1.5 h-1.5 border-b border-r border-accent/0 group-hover:border-accent/30 transition-colors duration-500" />

                            {/* Service Header Info */}
                            <div className="flex justify-between items-start gap-4">
                              <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-accent/80 group-hover:text-accent transition-colors duration-500 font-semibold">
                                [{num}]
                              </span>
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

                  {/* MP Gallery Section */}
                  {details.gallery && details.gallery.length > 0 && (
                    <section 
                      id="mp-gallery-section" 
                      className="relative h-[250vh] w-full bg-[#030303] border-t border-accent/5"
                    >
                      <div className="sticky top-0 h-screen w-full flex flex-col lg:flex-row overflow-hidden">
                        
                        {/* Left Column: Pinned Copy */}
                        <div className="w-full lg:w-1/2 h-[45vh] lg:h-full flex items-center justify-start px-8 md:px-20 relative bg-[#030303]">
                          {/* Technical Grid Overlay */}
                          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
                            <div className="absolute inset-0 border-r border-accent" style={{ left: '20%' }} />
                            <div className="absolute inset-0 border-r border-accent" style={{ left: '50%' }} />
                            <div className="absolute inset-0 border-r border-accent" style={{ left: '80%' }} />
                          </div>

                          <div className="relative z-10 w-full h-[280px]">
                            {details.gallery.map((item, idx) => {
                              const isActive = idx === galleryActiveIndex;
                              return (
                                <div
                                  key={idx}
                                  className={`absolute inset-0 flex flex-col justify-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                    isActive 
                                      ? "opacity-100 translate-y-0 pointer-events-auto" 
                                      : "opacity-0 translate-y-8 pointer-events-none"
                                  }`}
                                >
                                  <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-accent uppercase block mb-3">
                                    [ PROJECT 0{idx + 1} / GALLERY ]
                                  </span>
                                  <h3 className="font-display text-4xl md:text-[5vw] font-light tracking-tight uppercase leading-[0.95] mb-3 text-[#eae6e1]">
                                    {item.title}
                                  </h3>
                                  <span className="font-mono tracking-[0.2em] uppercase text-accent/80 text-[10px] md:text-xs block mb-5">
                                    {item.tagline}
                                  </span>
                                  <p className="font-body text-xs md:text-sm text-foreground/60 leading-relaxed max-w-md">
                                    {item.description}
                                  </p>
                                </div>
                              );
                            })}
                          </div>

                          {/* Gallery Bottom Metadata */}
                          <div className="absolute bottom-10 left-8 md:left-20 z-10 font-mono text-[8px] md:text-[9px] text-[#7c7c82]/50 tracking-[0.25em] flex flex-col gap-1 text-left uppercase">
                            <span>A GALLERY WORKSPACE EXPERIMENT</span>
                            <span>CRAFTED WITH GSAP & LENIS RUNTIME</span>
                          </div>
                        </div>

                        {/* Right Column: Moving 3D Parallax Image Column */}
                        <div className="w-full lg:w-1/2 h-[55vh] lg:h-full relative overflow-hidden bg-[#050507] border-t lg:border-t-0 lg:border-l border-accent/5 flex items-center justify-center">
                          <div className="relative w-full max-w-lg aspect-[4/3] h-full flex items-center justify-center">
                            {details.gallery.map((item, i) => {
                              const dist = i - galleryProgress * (details.gallery.length - 1);
                              const absDist = Math.abs(dist);
                              const translateY = dist * 45; // 45vh vertical spacing
                              const scale = 1.05 - absDist * 0.15;
                              const rotate = dist * -8; // rotate between -16deg and 16deg
                              const blurVal = Math.min(8, absDist * 6);
                              const opacity = 1 - Math.min(0.65, absDist * 0.45);
                              const zIndex = Math.round(10 - absDist * 2);

                              return (
                                <div
                                  key={i}
                                  className="absolute w-[80%] md:w-[85%] aspect-[4/3] bg-cover bg-center rounded-[4px] border border-accent/15 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] transition-shadow duration-500 overflow-hidden"
                                  style={{
                                    backgroundImage: `url('${item.image}')`,
                                    transform: `translateY(${translateY}vh) scale(${scale}) rotate(${rotate}deg)`,
                                    filter: `blur(${blurVal}px)`,
                                    opacity: opacity,
                                    zIndex: zIndex,
                                  }}
                                >
                                  {/* Subtle light flare overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-white/5 pointer-events-none" />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </section>
                  )}
                </>
              )}

              {/* "Contact Us" Section */}
              {activeCard !== null && (
                <section
                  id="details-contact"
                  className="relative bg-[#050507] border-t border-white/5 py-24 md:py-32 px-8 md:px-24 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#030303]/40 pointer-events-none" />
                  
                  {/* Subtle ambient light */}
                  <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-accent/3 blur-[100px] pointer-events-none select-none" />

                  <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                      
                      {/* Left: Contact Info & Narratives */}
                      <div className="lg:col-span-5 flex flex-col justify-between gap-12">
                        <div className="flex flex-col gap-6">
                          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.45em] text-accent uppercase block">
                            CONTACT US // JJ FILMS
                          </span>
                          <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight text-foreground leading-[1.2]">
                            Get in touch to <span className="italic font-serif text-accent">start a project</span>.
                          </h2>
                          <p className="font-body text-xs md:text-sm text-foreground/50 leading-relaxed max-w-md">
                            Have an upcoming campaign, a luxury listing, or a wedding celebration? Reach out to schedule a consultation with our production directors. We respond within 24 hours.
                          </p>
                        </div>

                        {/* Interactive Coordinates */}
                        <div className="flex flex-col gap-6 max-w-sm pt-8 border-t border-white/5">
                          <div className="flex flex-col gap-1.5">
                            <span className="font-mono text-[7.5px] text-foreground/35 tracking-[0.25em] uppercase">DIRECT EMAIL</span>
                            <a href="mailto:hello@jjfilms.co" className="font-serif text-base text-foreground hover:text-accent transition-colors duration-300 w-fit">
                              hello@jjfilms.co
                            </a>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="font-mono text-[7.5px] text-foreground/35 tracking-[0.25em] uppercase">CALL OR WHATSAPP</span>
                            <a href="tel:+15550192831" className="font-serif text-base text-foreground hover:text-accent transition-colors duration-300 w-fit">
                              +1 (555) 019-2831
                            </a>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="font-mono text-[7.5px] text-foreground/35 tracking-[0.25em] uppercase">CREATIVE HUBS</span>
                            <span className="font-serif text-sm text-[#7c7c82]">
                              Los Angeles // New York // London
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Sleek Onboarding Contact Form */}
                      <div className="lg:col-span-7">
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            alert("Thank you! Your inquiry brief has been received. A production director will contact you shortly.");
                          }}
                          className="space-y-6 bg-[#08080a]/40 border border-white/5 p-8 md:p-10 rounded-[8px] backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,0.8)] relative overflow-hidden group"
                        >
                          <div className="absolute top-4 left-4 w-1.5 h-1.5 border-t border-l border-accent/20 group-hover:border-accent/40 transition-colors duration-500" />
                          <div className="absolute bottom-4 right-4 w-1.5 h-1.5 border-b border-r border-accent/20 group-hover:border-accent/40 transition-colors duration-500" />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                              <label className="font-mono text-[8px] text-foreground/40 tracking-[0.2em] uppercase">Your Name</label>
                              <input 
                                required
                                type="text" 
                                placeholder="E.g. Alexander Cole"
                                className="w-full bg-[#030303] border border-white/10 rounded-[4px] px-4 py-3 text-xs text-foreground placeholder-white/20 focus:border-accent outline-none transition-colors duration-300"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="font-mono text-[8px] text-foreground/40 tracking-[0.2em] uppercase">Email Address</label>
                              <input 
                                required
                                type="email" 
                                placeholder="E.g. alex@example.com"
                                className="w-full bg-[#030303] border border-white/10 rounded-[4px] px-4 py-3 text-xs text-foreground placeholder-white/20 focus:border-accent outline-none transition-colors duration-300"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="font-mono text-[8px] text-foreground/40 tracking-[0.2em] uppercase">Project Type</label>
                            <select 
                              className="w-full bg-[#030303] border border-white/10 rounded-[4px] px-4 py-3 text-xs text-foreground focus:border-accent outline-none transition-colors duration-300"
                            >
                              <option value="real_estate">Real Estate &amp; Architecture</option>
                              <option value="commercial">Commercial Campaign / Brand Film</option>
                              <option value="wedding">Luxury Wedding Film / Event</option>
                              <option value="other">Other Creative Shoot</option>
                            </select>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="font-mono text-[8px] text-foreground/40 tracking-[0.2em] uppercase">Project Narrative / Vision</label>
                            <textarea 
                              required
                              rows={4}
                              placeholder="Tell us about the property, schedule, or brand narrative..."
                              className="w-full bg-[#030303] border border-white/10 rounded-[4px] px-4 py-3 text-xs text-foreground placeholder-white/20 focus:border-accent outline-none transition-colors duration-300 resize-none"
                            />
                          </div>

                          <button 
                            type="submit"
                            className="w-full inline-flex items-center justify-center font-mono text-[9px] tracking-[0.25em] uppercase bg-accent text-background hover:bg-white hover:text-background py-4 rounded-[4px] font-semibold transition-all duration-300 cursor-pointer border-none outline-none"
                          >
                            Submit Project Brief
                          </button>
                        </form>
                      </div>

                    </div>
                  </div>
                </section>
              )}

              {/* High-Impact CTA Section */}
              {activeCard !== null && (
                <section
                  id="details-cta"
                  className="relative py-28 md:py-36 px-8 md:px-24 bg-[#0d0d11] overflow-hidden border-t border-b border-white/5"
                >
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
                      Ready to direct your <span className="italic font-serif text-accent">visual masterpiece</span>?
                    </h2>
                    
                    <p className="font-body text-xs md:text-sm text-[#7c7c82] max-w-xl leading-relaxed">
                      Secure your production date with our award-winning cinematography team. Drop a brief or call directly to review storyboarding and custom camera treatments.
                    </p>

                    <button
                      onClick={() => {
                        const target = document.getElementById("details-contact");
                        if (target) target.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="inline-flex items-center justify-center font-mono text-[9px] tracking-[0.25em] uppercase border border-accent hover:bg-accent hover:text-background text-accent px-8 py-4 rounded-[4px] transition-all duration-500 font-semibold cursor-pointer outline-none bg-transparent"
                    >
                      Secure Production Date
                    </button>
                  </div>
                </section>
              )}

              <footer
                id="details-footer"
                className="relative bg-[#030303] py-24 md:py-32 px-8 md:px-24 overflow-hidden"
              >
                {/* Top Accent Gradient Border */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                
                {/* Big Ambient Backlit Glow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-accent/5 blur-[120px] pointer-events-none select-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                  {/* Main Footer Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
                    
                    {/* Left Side: Brand Statement & Contact Links (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col justify-between gap-12">
                      <div className="flex flex-col gap-6">
                        <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-accent uppercase block">
                          JJ FILMS // GLOBAL CREATIVE STUDIO
                        </span>
                        <h2 className="font-display text-4xl md:text-6xl font-light tracking-tight text-foreground leading-[1.1] max-w-2xl">
                          Let's shape your <span className="italic font-normal text-accent font-serif">cinematic legacy</span>.
                        </h2>
                      </div>

                      {/* Contact Coordinates */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-white/5 max-w-xl">
                        <div className="flex flex-col gap-2">
                          <span className="font-mono text-[8px] text-foreground/40 tracking-[0.25em] uppercase">
                            Direct Inquiry
                          </span>
                          <a 
                            href="mailto:hello@jjfilms.co" 
                            className="font-serif text-lg md:text-xl text-[#eae6e1] hover:text-accent transition-colors duration-300 w-fit"
                          >
                            hello@jjfilms.co
                          </a>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="font-mono text-[8px] text-foreground/40 tracking-[0.25em] uppercase">
                            Call Booking
                          </span>
                          <a 
                            href="tel:+15550192831" 
                            className="font-serif text-lg md:text-xl text-[#eae6e1] hover:text-accent transition-colors duration-300 w-fit"
                          >
                            +1 (555) 019-2831
                          </a>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="font-mono text-[8px] text-foreground/40 tracking-[0.25em] uppercase">
                            Creative Hub
                          </span>
                          <span className="font-serif text-base text-[#7c7c82]">
                            Los Angeles &amp; New York
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Exclusivity Availability Box (5 cols) */}
                    <div className="lg:col-span-5">
                      <div className="relative bg-[#08080a]/90 backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden group hover:border-accent/40 transition-all duration-700">
                        {/* Focus bracket detailing */}
                        <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-accent/20 group-hover:border-accent/50 transition-colors duration-500" />
                        <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-accent/20 group-hover:border-accent/50 transition-colors duration-500" />
                        
                        {/* Glow behind box */}
                        <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-accent/10 blur-xl pointer-events-none" />

                        <div className="flex items-center gap-2 mb-6">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="font-mono text-[8px] tracking-[0.25em] text-foreground/40 uppercase">
                            AVAILABILITY // OPEN
                          </span>
                        </div>

                        <h3 className="font-display text-2xl font-light text-foreground mb-4">
                          Start a Project
                        </h3>
                        
                        <p className="font-body text-xs text-foreground/60 leading-relaxed mb-8">
                          We partner with select visionaries, architects, and luxury brands to execute high-fidelity visual assets. Drop a note to explore rates, schedules, and custom treatments.
                        </p>

                        <button
                          onClick={() => {
                            alert("Thank you! Our project onboarding form will be available shortly.");
                          }}
                          className="w-full inline-flex items-center justify-between font-mono text-[9px] tracking-[0.25em] uppercase border border-accent/30 hover:border-accent text-accent px-6 py-4 rounded-[4px] transition-all duration-500 hover:bg-accent hover:text-background font-semibold cursor-pointer outline-none bg-transparent"
                        >
                          <span>Send Brief</span>
                          <span className="transition-transform duration-500 group-hover:translate-x-1">
                            →
                          </span>
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Footer Bottom / Meta Grid */}
                  <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Social Coordinates */}
                    <div className="flex flex-wrap items-center gap-6 md:gap-10 font-mono text-[8px] md:text-[9px] tracking-[0.25em] uppercase text-foreground/35">
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors duration-300">
                        01 / Instagram
                      </a>
                      <span className="text-white/10 select-none">|</span>
                      <a href="https://vimeo.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors duration-300">
                        02 / Vimeo
                      </a>
                      <span className="text-white/10 select-none">|</span>
                      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors duration-300">
                        03 / Youtube
                      </a>
                    </div>

                    {/* Copyright & Scroll Top */}
                    <div className="flex items-center gap-8 font-mono text-[8px] md:text-[9px] tracking-[0.25em] uppercase text-foreground/35">
                      <span>© 2026 JJ FILMS.</span>
                      <button
                        onClick={() => scrollToSection("hero-section")}
                        className="group inline-flex items-center gap-2 text-foreground/35 hover:text-accent transition-colors duration-300 border-none bg-transparent outline-none p-0 cursor-pointer"
                      >
                        BACK TO TOP
                        <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5">
                          ↑
                        </span>
                      </button>
                    </div>
                  </div>

                </div>
              </footer>
                </div>
              );
            })()}
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
