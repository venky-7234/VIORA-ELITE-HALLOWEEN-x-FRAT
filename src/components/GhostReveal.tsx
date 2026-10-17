import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface GhostRevealProps {
  className?: string;
  trigger?: string;
  delay?: number;
}

/** Original CSS/SVG specter revealed once as its containing scene enters view. */
export function GhostReveal({ className = "", trigger, delay = 0 }: GhostRevealProps) {
  const ghostRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const ghost = ghostRef.current;
    if (!ghost || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = trigger || ghost.closest("section") || undefined;
    const context = gsap.context(() => {
      gsap.fromTo(ghost,
        { autoAlpha: 0, y: 23, x: 8 },
        { autoAlpha: .46, y: -7, x: -3, duration: 4.4, delay, ease: "sine.inOut", yoyo: true, repeat: 1,
          scrollTrigger: section ? { trigger: section, start: "top 72%", once: true } : undefined },
      );
    }, ghost);
    return () => context.revert();
  }, [delay, trigger]);

  return <span ref={ghostRef} className={`ghost-reveal ${className}`} aria-hidden="true"><svg viewBox="0 0 80 180" preserveAspectRatio="none"><path d="M40 2C17 2 13 30 15 55l-7 25 8-5-4 47 13-9 4 52 11-16 10 18 8-54 14 5-8-54 8 8-10-27C64 18 56 2 40 2Z"/></svg></span>;
}
