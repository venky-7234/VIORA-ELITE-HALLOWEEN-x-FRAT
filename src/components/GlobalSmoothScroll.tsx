import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { useLocation } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export function GlobalSmoothScroll({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2, // Controls the smoothing duration (buttery feel)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
      touchMultiplier: 2,
    });

    // 2. Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 3. Connect GSAP Ticker to Lenis
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    
    // Disable lag smoothing in GSAP to prevent jank with Lenis
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    // Refresh ScrollTrigger when route changes
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  // Lenis does not require restrictive DOM wrappers!
  return <>{children}</>;
}
