import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const batFlights = [
  { top: "22%", size: 30, duration: 23, delay: -17, drift: "-29px", driftReverse: "29px", rotate: "-8deg" },
  { top: "34%", size: 17, duration: 19, delay: -7, drift: "24px", driftReverse: "-24px", rotate: "8deg" },
  { top: "17%", size: 23, duration: 27, delay: -21, drift: "-18px", driftReverse: "18px", rotate: "-4deg" },
  { top: "48%", size: 14, duration: 22, delay: -11, drift: "32px", driftReverse: "-32px", rotate: "12deg" },
  { top: "28%", size: 12, duration: 18, delay: -4, drift: "-24px", driftReverse: "24px", rotate: "-14deg" },
  { top: "39%", size: 20, duration: 29, delay: -25, drift: "18px", driftReverse: "-18px", rotate: "6deg" },
  { top: "13%", size: 15, duration: 24, delay: -9, drift: "-38px", driftReverse: "38px", rotate: "-10deg" },
  { top: "55%", size: 18, duration: 26, delay: -14, drift: "21px", driftReverse: "-21px", rotate: "11deg" },
  { top: "25%", size: 13, duration: 21, delay: -19, drift: "-16px", driftReverse: "16px", rotate: "-6deg" },
  { top: "44%", size: 25, duration: 31, delay: -3, drift: "27px", driftReverse: "-27px", rotate: "5deg" },
  { top: "11%", size: 11, duration: 17, delay: -12, drift: "-21px", driftReverse: "21px", rotate: "-12deg" },
  { top: "61%", size: 16, duration: 28, delay: -23, drift: "16px", driftReverse: "-16px", rotate: "9deg" },
  { top: "31%", size: 19, duration: 25, delay: -16, drift: "-31px", driftReverse: "31px", rotate: "-7deg" },
  { top: "52%", size: 13, duration: 20, delay: -5, drift: "23px", driftReverse: "-23px", rotate: "13deg" },
  { top: "19%", size: 21, duration: 30, delay: -27, drift: "-19px", driftReverse: "19px", rotate: "-3deg" },
];

export interface BatSwarmProps {
  count?: number;
  mobileCount?: number;
  scatterAt?: string;
}

export function BatSwarm({ count = 10, mobileCount = 4, scatterAt = ".arrival-section" }: BatSwarmProps) {
  const swarmRef = useRef<HTMLDivElement>(null);
  const desktopCount = Math.max(8, Math.min(15, Math.floor(count)));
  const smallCount = Math.max(3, Math.min(6, Math.floor(mobileCount)));
  const renderedBats = batFlights.slice(0, desktopCount);

  useLayoutEffect(() => {
    const swarm = swarmRef.current;
    if (!swarm || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.utils.toArray<SVGSVGElement>(".flying-bat", swarm).forEach((bat, index) => {
        const scatter = { x: 0, y: 0 };
        gsap.to(scatter, {
          x: (index % 2 ? 1 : -1) * (90 + (index % 4) * 34),
          y: (index % 3 - 1) * (70 + (index % 2) * 48),
          duration: 1,
          ease: "none",
          onUpdate: () => {
            bat.style.setProperty("--scatter-x", `${scatter.x}px`);
            bat.style.setProperty("--scatter-y", `${scatter.y}px`);
          },
          scrollTrigger: { trigger: scatterAt, start: "top bottom", end: "top 30%", scrub: .8 },
        });
      });
    }, swarm);
    return () => context.revert();
  }, [scatterAt, desktopCount]);

  useEffect(() => {
    const swarm = swarmRef.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || !swarm) return;
    const observer = new IntersectionObserver(([entry]) => swarm.classList.toggle("is-visible", entry.isIntersecting), { threshold: 0 });
    observer.observe(swarm);
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => swarm.style.setProperty("--scroll-drift", `${Math.min(window.scrollY * .025, 18)}px`));
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => { observer.disconnect(); window.removeEventListener("scroll", update); cancelAnimationFrame(frame); };
  }, []);

  return <div className="bat-swarm" ref={swarmRef} aria-hidden="true" style={{ "--mobile-bat-count": smallCount } as React.CSSProperties}>
    {renderedBats.map((bat, index) => <svg key={index} className={`flying-bat flying-bat--${index + 1}${index >= smallCount ? " flying-bat--mobile-hidden" : ""}`} viewBox="0 0 64 40" style={{ top: bat.top, width: bat.size, animationDuration: `${bat.duration}s`, animationDelay: `${bat.delay}s`, "--bat-drift": bat.drift, "--bat-drift-reverse": bat.driftReverse, "--bat-rotation": bat.rotate } as React.CSSProperties}>
      <path className="bat-body" d="M32 16c-3-5-7-7-10-7l2 8c-6-8-13-10-19-9l5 10C4 13 1 15 1 15c8 4 10 12 17 12 4 0 8-3 12-6l2 10 2-10c4 3 8 6 12 6 7 0 9-8 17-12 0 0-3-2-9 3l5-10c-6-1-13 1-19 9l2-8c-3 0-7 2-10 7z"/>
      <path className="bat-wing" d="M32 16C25 5 18 7 13 3c3 9 8 11 14 16m9-3C43 5 50 7 55 3c-3 9-8 11-14 16"/>
    </svg>)}
  </div>;
}
