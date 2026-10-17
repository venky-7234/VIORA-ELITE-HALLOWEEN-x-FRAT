import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface FogLayerProps {
  className?: string;
  drift?: number;
  fadeOnExit?: boolean;
  scrollTrigger?: string;
}

/** Decorative fog with scroll parallax. The wrapper is inert for pointer and assistive input. */
export function FogLayer({ className = "", drift = 10, fadeOnExit = false, scrollTrigger }: FogLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => layer.classList.toggle("is-visible", entry.isIntersecting), { threshold: 0 });
    observer.observe(layer);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const layer = layerRef.current;
    if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = scrollTrigger || layer.closest("section") || undefined;
    const context = gsap.context(() => {
      const travel = { y: 0 };
      gsap.to(travel, {
        y: drift,
        ease: "none",
        onUpdate: () => layer.style.setProperty("--fog-scroll-y", `${travel.y}%`),
        scrollTrigger: section ? { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 } : undefined,
      });
      if (fadeOnExit && section) {
        gsap.to(layer, { opacity: 0, ease: "none", scrollTrigger: { trigger: section, start: "65% top", end: "bottom top", scrub: .8 } });
      }
    }, layer);
    return () => context.revert();
  }, [drift, fadeOnExit, scrollTrigger]);

  return <div ref={layerRef} className={`fog-layer ${className}`} aria-hidden="true"><span className="fog-layer__drift"/></div>;
}
