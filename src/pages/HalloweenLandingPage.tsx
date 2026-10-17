import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Globe, Lock, Trash2, UserPlus, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { halloweenEvent } from "../config/halloweenEvent";
import "./HalloweenLandingPage.css";

gsap.registerPlugin(ScrollTrigger);

export interface CompanionSoul {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: string;
}

export const HalloweenLandingPage: React.FC = () => {
  const pageRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [heroVideoAvailable, setHeroVideoAvailable] = useState(false);
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);

  // Application Form Modal State
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    cityChoice: "Hyderabad" as "Hyderabad" | "Secunderabad" | "other" | "",
    customCity: "",
    groupSize: "1" as "1" | "2-3" | "4-6" | "7+" | "",
    souls: [] as CompanionSoul[],
    is21OrOlder: "" as "yes" | "no" | "",
    agreedToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showSubmissionDetails, setShowSubmissionDetails] = useState(false);
  const [formError, setFormError] = useState("");

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isApplicationModalOpen) {
        setIsApplicationModalOpen(false);
      }
    };
    if (isApplicationModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isApplicationModalOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError("");
  };

  const handleSelectGroupSize = (size: "1" | "2-3" | "4-6" | "7+") => {
    setFormData((prev) => {
      let updatedSouls = prev.souls;
      if (size === "1") {
        updatedSouls = [];
      } else if (prev.souls.length === 0) {
        updatedSouls = [
          { id: "soul_" + Date.now(), name: "", email: "", phone: "", age: "" },
        ];
      }
      return {
        ...prev,
        groupSize: size,
        souls: updatedSouls,
      };
    });
    if (formError) setFormError("");
  };

  const handleSoulChange = (index: number, field: keyof CompanionSoul, value: string) => {
    setFormData((prev) => {
      const nextSouls = [...prev.souls];
      nextSouls[index] = { ...nextSouls[index], [field]: value };
      return { ...prev, souls: nextSouls };
    });
    if (formError) setFormError("");
  };

  const handleAddSoul = () => {
    setFormData((prev) => {
      const maxSouls = prev.groupSize === "2-3" ? 2 : prev.groupSize === "4-6" ? 5 : 12;
      if (prev.souls.length >= maxSouls) {
        setFormError(
          `Maximum ${maxSouls} accompanying souls for ${
            prev.groupSize === "2-3"
              ? "2–3 people"
              : prev.groupSize === "4-6"
              ? "4–6 people"
              : "7+ people"
          }.`
        );
        return prev;
      }
      return {
        ...prev,
        souls: [
          ...prev.souls,
          {
            id: "soul_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
            name: "",
            email: "",
            phone: "",
            age: "",
          },
        ],
      };
    });
  };

  const handleRemoveSoul = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      souls: prev.souls.filter((_, i) => i !== index),
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setFormError("Please enter what name we shall whisper when you arrive.");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setFormError("Please provide the number the shadows can reach you on.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setFormError("Please provide a valid email address for your secret invitation.");
      return;
    }
    if (!formData.cityChoice) {
      setFormError("Please select which city you are escaping from.");
      return;
    }
    if (formData.cityChoice === "other" && !formData.customCity.trim()) {
      setFormError("Please type the city you are escaping from.");
      return;
    }
    if (!formData.groupSize) {
      setFormError("Please select how many souls will cross the threshold with you.");
      return;
    }
    if (formData.groupSize !== "1") {
      if (formData.souls.length === 0) {
        setFormError("Please provide details for at least one accompanying soul.");
        return;
      }
      for (let i = 0; i < formData.souls.length; i++) {
        const soul = formData.souls[i];
        if (!soul.name.trim()) {
          setFormError(`Please enter the full name for Soul #${i + 1}.`);
          return;
        }
        if (!soul.email.trim() || !soul.email.includes("@")) {
          setFormError(`Please enter a valid email for Soul #${i + 1}.`);
          return;
        }
        if (!soul.phone.trim()) {
          setFormError(`Please enter the phone number for Soul #${i + 1}.`);
          return;
        }
        if (!soul.age.trim()) {
          setFormError(`Please enter the age for Soul #${i + 1}.`);
          return;
        }
      }
    }
    if (!formData.is21OrOlder) {
      setFormError("Please indicate whether you are 21 or older.");
      return;
    }
    if (!formData.agreedToTerms) {
      setFormError("Please agree to the confirmation terms before submitting.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    const resolvedCity =
      formData.cityChoice === "other"
        ? formData.customCity.trim() || "Somewhere beyond Hyderabad"
        : formData.cityChoice;

    const payload = {
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim(),
      city: resolvedCity,
      groupTier:
        formData.groupSize === "1"
          ? "Just me (1)"
          : formData.groupSize === "2-3"
          ? "2–3 people"
          : formData.groupSize === "4-6"
          ? "4–6 people"
          : "7+ people",
      totalSoulsCount: formData.groupSize === "1" ? 1 : formData.souls.length + 1,
      accompanyingSoulsCount: formData.souls.length,
      accompanyingSoulsDetails:
        formData.souls.length > 0
          ? formData.souls
              .map(
                (s, i) =>
                  `Soul #${i + 1}: ${s.name.trim()} (${s.age.trim()} yrs) | Phone: ${s.phone.trim()} | Email: ${s.email.trim()}`
              )
              .join("\n")
          : "None (Solo Entry)",
      is21OrOlder: formData.is21OrOlder === "yes" ? "Yes" : "No",
      agreedToTerms: formData.agreedToTerms ? "Yes" : "No",
    };

    const webhookUrl =
      halloweenEvent.googleSheetsWebhookUrl ||
      import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;

    const executeSubmission = async () => {
      try {
        if (webhookUrl) {
          await fetch(webhookUrl, {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify(payload),
          });
        }
        localStorage.setItem(
          "viora_halloween_application",
          JSON.stringify({
            ...payload,
            submittedAt: new Date().toISOString(),
          })
        );
      } catch (err) {
        console.warn("Storage or sheets sync error:", err);
      } finally {
        setIsSubmitting(false);
        setFormSubmitted(true);
      }
    };

    executeSubmission();
  };

  useEffect(() => {
    if (prefersReducedMotion) return;
    const controller = new AbortController();
    fetch(`${import.meta.env.BASE_URL}videos/halloween-hero.mp4`, { method: "HEAD", signal: controller.signal })
      .then((response) => setHeroVideoAvailable(response.ok && response.headers.get("content-type")?.startsWith("video/mp4") === true))
      .catch(() => setHeroVideoAvailable(false));
    return () => controller.abort();
  }, [prefersReducedMotion]);
  useLayoutEffect(() => {
    if (!pageRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".horror-reveal").forEach((element) => {
        gsap.fromTo(element, { autoAlpha: 0, y: 34 }, {
          autoAlpha: 1, y: 0, duration: .9, ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 86%", once: true },
        });
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return <main className="halloween-page" ref={pageRef}>
    <section className="halloween-hero" id="top">
      <div className="hero-media" aria-hidden="true">
        <div className="hero-poster" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/halloween-hero-poster.svg)` }} />
        {heroVideoAvailable && !heroVideoFailed && !prefersReducedMotion && <video
          className="hero-video"
          src={`${import.meta.env.BASE_URL}videos/halloween-hero.mp4`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={`${import.meta.env.BASE_URL}images/halloween-hero-poster.svg`}
          onError={() => setHeroVideoFailed(true)}
          tabIndex={-1}
        />}
      </div>
      <div className="hero-cinematic-overlay" aria-hidden="true" />
      <nav className="halloween-nav" aria-label="Main navigation">
        <a href="#top" className="halloween-brand-link" aria-label="VIORA ELITE">
          <img src={`${import.meta.env.BASE_URL}images/logo.svg`} alt="VIORA ELITE" className="halloween-header-logo" />
        </a>
        <div className="halloween-nav-links">
          <a href="#party">THE PARTY</a>
          <a href="#experience">THE NIGHT</a>
          <a href="#highlights">HIGHLIGHTS</a>
        </div>
      </nav>
      <div className="hero-copy">
        <p className="halloween-eyebrow">VIORA ELITE PRESENTS &nbsp;·&nbsp; HALLOWEEN AFTER DARK</p>
        <h1 className="hero-title-themed">
          <span className="hero-title-top" data-text="HALLOWEEN">HALLOWEEN</span>
          <div className="hero-collab-junction">
            <span className="collab-junction-line left" />
            <div className="hero-unique-x" aria-label="X" role="img">
              <svg viewBox="0 0 72 72" className="unique-x-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="uniqueXGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffe4b0" />
                    <stop offset="28%" stopColor="#ff2a44" />
                    <stop offset="68%" stopColor="#b30519" />
                    <stop offset="100%" stopColor="#4a0109" />
                  </linearGradient>
                  <linearGradient id="uniqueXGradSec" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffe4b0" />
                    <stop offset="28%" stopColor="#ff2a44" />
                    <stop offset="68%" stopColor="#b30519" />
                    <stop offset="100%" stopColor="#4a0109" />
                  </linearGradient>
                  <radialGradient id="uniqueXCoreGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="35%" stopColor="#ff3348" />
                    <stop offset="80%" stopColor="#960313" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </radialGradient>
                  <filter id="uniqueXDropGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ff1732" floodOpacity="0.75" />
                  </filter>
                </defs>

                {/* Gothic Blade 1: Top-Left to Bottom-Right */}
                <path
                  d="M 12 8 C 16 14, 18 16, 26 24 L 36 34 L 46 44 L 56 54 C 60 58, 64 64, 62 66 C 58 64, 52 60, 46 54 L 36 44 L 26 34 L 16 24 C 10 18, 8 12, 12 8 Z"
                  fill="url(#uniqueXGradMain)"
                  filter="url(#uniqueXDropGlow)"
                />
                <path d="M 19 14 L 12 18 L 17 22 Z" fill="#ff4d61" />
                <path d="M 53 50 L 60 54 L 55 58 Z" fill="#ff4d61" />

                {/* Gothic Blade 2: Top-Right to Bottom-Left */}
                <path
                  d="M 60 8 C 56 14, 54 16, 46 24 L 36 34 L 26 44 L 16 54 C 12 58, 8 64, 10 66 C 14 64, 20 60, 26 54 L 36 44 L 46 34 L 56 24 C 62 18, 64 12, 60 8 Z"
                  fill="url(#uniqueXGradSec)"
                  filter="url(#uniqueXDropGlow)"
                />
                <path d="M 53 14 L 60 18 L 55 22 Z" fill="#ff4d61" />
                <path d="M 19 50 L 12 54 L 17 58 Z" fill="#ff4d61" />

                {/* Central Demonic Seal / Core */}
                <circle cx="36" cy="36" r="8" fill="url(#uniqueXCoreGlow)" />
                <circle cx="36" cy="36" r="3.5" fill="#fff5e0" />

                {/* Blood drip trickling down from bottom intersection */}
                <path
                  d="M 36 42 C 34.5 48, 34 54, 36 60 C 37 61.5, 38.5 61.5, 39.5 60 C 41.5 54, 39 48, 36 42 Z"
                  fill="#ff1a35"
                />
              </svg>
            </div>
            <span className="collab-junction-line right" />
          </div>
          <span className="hero-title-frat" data-text="FRAT">FRAT</span>
          <span className="hero-bat-divider" aria-hidden="true">
            <span className="hero-bat-line" />
            <span className="hero-bat-symbol">🦇</span>
            <span className="hero-bat-line" />
          </span>
        </h1>
        <p className="hero-tagline">
          TWO WORLDS COLLIDE. <span className="tagline-highlight">ONE NIGHT TAKES OVER.</span>
        </p>
        <div className="hero-actions">
          <button
            type="button"
            className="halloween-cta halloween-cta-bleeding halloween-cta-solid"
            onClick={() => setIsApplicationModalOpen(true)}
            aria-label="Open application form"
          >
            <span className="cta-label">ENTER IF YOU DARE <ArrowRight size={15}/></span>
            <span className="cta-blood-drips" aria-hidden="true">
              <svg viewBox="0 0 240 28" className="cta-drips-svg" preserveAspectRatio="none">
                <path d="M0,0 L240,0 L240,3 Q235,3 232,7 Q229,12 226,12 Q223,12 220,5 Q215,3 208,3 Q200,3 196,16 Q192,26 186,26 Q180,26 177,14 Q175,3 166,3 Q160,3 156,9 Q153,13 149,13 Q145,13 142,4 Q135,3 125,3 Q118,3 113,18 Q108,28 102,28 Q96,28 92,16 Q90,3 80,3 Q74,3 70,8 Q67,11 63,11 Q59,11 56,4 Q48,3 38,3 Q31,3 26,17 Q22,25 16,25 Q11,25 8,13 Q6,3 0,3 Z" fill="currentColor" />
              </svg>
              <span className="cta-blood-drop drop-1" />
              <span className="cta-blood-drop drop-2" />
              <span className="cta-blood-drop drop-3" />
            </span>
          </button>
        </div>
      </div>
      <div className="hero-side-note" aria-hidden="true">ADMIT ONE &nbsp; / &nbsp; IF YOU DARE</div>
    </section>

    <section className="party-interlude" id="party" aria-labelledby="party-interlude-title">
      <h2 id="party-interlude-title" className="sr-only">The Party</h2>
      <img className="party-interlude-image" src={`${import.meta.env.BASE_URL}images/the-party-reference.png`} alt="The Party" />

      {/* About The Party Content Block */}
      <div className="party-about-block horror-reveal">
        <h3 className="party-about-title">
          Halloween Has a <span className="party-title-accent">New Social Life</span>
        </h3>
        
        <p className="party-about-para">
          They say Halloween is the one night the rules don’t apply. The lights go low, the masks come on, and the night takes a turn of its own.
        </p>
        <p className="party-about-para">
          This year, frat meets fright at VIORA. A little mischief, a little madness, and strangers who might just become part of your favourite story.
        </p>

        <div className="party-warning-wrap">
          <span className="party-warning-line" />
          <p className="party-warning-text">Hyderabad, consider this your warning.</p>
          <span className="party-warning-line" />
        </div>
      </div>
    </section>

    <section className="arrival-section" id="experience">
      <div className="arrival-copy horror-reveal">
        <div className="night-theme-block">
          {/* Layered Heading (same style as About The Party) */}
          <div className="night-layered-heading">
            {/* Background Layer: "THE EXCLUSIVE" */}
            <div className="night-layer-bg" aria-hidden="true">
              <span className="night-bg-text">THE EXCLUSIVE</span>
            </div>

            {/* Foreground Layer centered on top: "NIGHT" */}
            <h2 className="night-layer-fg">
              <span className="night-fg-text" data-text="NIGHT">NIGHT</span>
            </h2>
          </div>

          {/* Gothic Bat Divider (matching About The Party style) */}
          <div className="night-bat-divider" aria-hidden="true">
            <span className="night-bat-line" />
            <svg className="night-bat-svg" viewBox="0 0 60 22" fill="currentColor">
              <path d="M30,8 C31.5,4 33,2.5 34,2.5 C34.6,3.5 34.2,5.2 35.5,6 C39.5,4 45.5,4 52.5,1 C51,5.2 48,8.2 44.5,10.2 C49.5,11.2 55.5,10.2 59.5,8 C56.5,12.5 51.5,15.5 45.5,15.5 C43.5,17.2 40.5,18.5 36.5,17.5 C34.5,18.8 32.5,19.8 30,19.8 C27.5,19.8 25.5,18.8 23.5,17.5 C19.5,18.5 16.5,17.2 14.5,15.5 C8.5,15.5 3.5,12.5 0.5,8 C4.5,10.2 10.5,11.2 15.5,10.2 C12,8.2 9,5.2 7.5,1 C14.5,4 20.5,4 24.5,6 C25.8,5.2 25.4,3.5 26,2.5 C27,2.5 28.5,4 30,8 Z" />
            </svg>
            <span className="night-bat-line" />
          </div>
        </div>
        <p className="night-tagline">A little spooky. A little wicked. A whole lot of chaos.</p>
        
        <div className="night-tags-grid">
          <div className="night-tag-badge">
            <span className="night-tag-emoji" aria-hidden="true">🏰</span>
            <span className="night-tag-text">Spooky setting</span>
          </div>
          <div className="night-tag-badge">
            <span className="night-tag-emoji" aria-hidden="true">🍬</span>
            <span className="night-tag-text">Tricks and treats</span>
          </div>
          <div className="night-tag-badge">
            <span className="night-tag-emoji" aria-hidden="true">🔮</span>
            <span className="night-tag-text">Tarot corner</span>
          </div>
          <div className="night-tag-badge">
            <span className="night-tag-emoji" aria-hidden="true">✒️</span>
            <span className="night-tag-text">Get inked</span>
          </div>
          <div className="night-tag-badge">
            <span className="night-tag-emoji" aria-hidden="true">📸</span>
            <span className="night-tag-text">Costume cam</span>
          </div>
          <div className="night-tag-badge">
            <span className="night-tag-emoji" aria-hidden="true">🪩</span>
            <span className="night-tag-text">Dance floor</span>
          </div>
        </div>

        {/* ── THE EVENT HIGHLIGHTS (VIORA × FRAT CHAPTER) ── */}
        <div className="event-highlights-section horror-reveal" id="highlights">
          <div className="event-highlights-header">
            <h3 className="event-highlights-title">
              THE EVENT <span className="event-highlights-accent">HIGHLIGHTS</span>
            </h3>
            <div className="highlights-frat-junction" aria-hidden="true">
              <span className="frat-line" />
              <span className="frat-sigil">Φ · Ρ · Α · Τ</span>
              <span className="frat-line" />
            </div>
            <p className="event-highlights-subtext">The unwritten chapter of the night. Where mask meets mayhem and the ritual begins.</p>
          </div>

          <div className="event-highlights-grid">
            {/* Card 1: The Masquerade Ball */}
            <article className="event-highlight-card">
              <div className="highlight-card-glow" aria-hidden="true" />
              <div className="highlight-card-header">
                <span className="highlight-chapter-badge">CHAPTER I</span>
                <span className="highlight-greek-sigil">Φ</span>
              </div>
              <div className="highlight-card-image-wrap highlight-ratio-1">
                <img
                  src={`${import.meta.env.BASE_URL}images/highlight-masquerade.jpg`}
                  alt="Chapter I - The Masquerade Ball"
                  className="highlight-card-img"
                  loading="lazy"
                />
              </div>
              <h4 className="highlight-card-title">The Masquerade Ball</h4>
              <p className="highlight-card-desc">Masks on. Eyes locked. Let the mystery do the talking.</p>
              <div className="highlight-card-meta">
                <span className="highlight-meta-pill">SECRET RITE</span>
                <span className="highlight-meta-dot" />
                <span className="highlight-meta-pill">FRAT MYSTERY</span>
              </div>
            </article>

            {/* Card 2: The Costume Showdown */}
            <article className="event-highlight-card">
              <div className="highlight-card-glow" aria-hidden="true" />
              <div className="highlight-card-header">
                <span className="highlight-chapter-badge">CHAPTER II</span>
                <span className="highlight-greek-sigil">Ρ</span>
              </div>
              <div className="highlight-card-image-wrap highlight-ratio-2">
                <img
                  src={`${import.meta.env.BASE_URL}images/highlight-costume.jpg`}
                  alt="Chapter II - The Costume Showdown"
                  className="highlight-card-img"
                  loading="lazy"
                />
              </div>
              <h4 className="highlight-card-title">The Costume Showdown</h4>
              <p className="highlight-card-desc">Come dressed to impress. Leave them wondering how you pulled that off.</p>
              <div className="highlight-card-meta">
                <span className="highlight-meta-pill">FRAT TROPHY</span>
                <span className="highlight-meta-dot" />
                <span className="highlight-meta-pill">HIGH STAKES</span>
              </div>
            </article>

            {/* Card 3: The Feast & The Poison */}
            <article className="event-highlight-card">
              <div className="highlight-card-glow" aria-hidden="true" />
              <div className="highlight-card-header">
                <span className="highlight-chapter-badge">CHAPTER III</span>
                <span className="highlight-greek-sigil">Ω</span>
              </div>
              <div className="highlight-card-image-wrap highlight-ratio-3">
                <img
                  src={`${import.meta.env.BASE_URL}images/highlight-feast.jpg`}
                  alt="Chapter III - The Feast & The Poison"
                  className="highlight-card-img"
                  loading="lazy"
                />
              </div>
              <h4 className="highlight-card-title">The Feast & The Poison</h4>
              <p className="highlight-card-desc">Wicked bites, devilish drinks and flavours worth sinning for</p>
              <div className="highlight-card-meta">
                <span className="highlight-meta-pill">SINISTER BITES</span>
                <span className="highlight-meta-dot" />
                <span className="highlight-meta-pill">DEVIL'S BREW</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    {/* ── THE DRESS CODE SECTION ── */}
    <section className="dress-code-section horror-reveal" id="dress-code" aria-labelledby="dress-code-title">
      <div className="dress-code-container">
        {/* Section Header */}
        <div className="dress-code-header">
          <h2 className="dress-code-title" id="dress-code-title">
            THE <span className="dress-code-accent">DRESS CODE</span>
          </h2>
          <div className="dress-code-frat-junction" aria-hidden="true">
            <span className="dress-line" />
            <span className="dress-sigil">Φ · Ρ · Α · Τ</span>
            <span className="dress-line" />
          </div>
          <p className="dress-code-lead">
            Your fit deserves a plot twist.
          </p>
          <p className="dress-code-subtext">
            Steal some inspo from the looks below, bring your alter ego out to play, and whatever you do, don’t show up looking like it’s just another Saturday.
          </p>
        </div>

        {/* 3 Look Cards Grid */}
        <div className="dress-code-grid">
          {/* Card 1 – Dark gothic street fits */}
          <article className="dress-code-card">
            <div className="dress-card-glow" aria-hidden="true" />
            <div className="dress-card-image-wrap">
              <img
                src={`${import.meta.env.BASE_URL}images/dress-code-1.jpg`}
                alt="Dress Code Look 01 – Dark gothic street style with face paint and candles"
                className="dress-card-img"
                loading="lazy"
              />
              <div className="dress-image-overlay" aria-hidden="true" />
            </div>
          </article>

          {/* Card 2 – Costume characters (Maleficent, Joker, Harry Potter…) */}
          <article className="dress-code-card">
            <div className="dress-card-glow" aria-hidden="true" />
            <div className="dress-card-image-wrap">
              <img
                src={`${import.meta.env.BASE_URL}images/dress-code-2.jpg`}
                alt="Dress Code Look 02 – Halloween costume characters in ornate setting"
                className="dress-card-img"
                loading="lazy"
              />
              <div className="dress-image-overlay" aria-hidden="true" />
            </div>
          </article>

          {/* Card 3 – Masquerade ball elegance */}
          <article className="dress-code-card">
            <div className="dress-card-glow" aria-hidden="true" />
            <div className="dress-card-image-wrap">
              <img
                src={`${import.meta.env.BASE_URL}images/dress-code-3.jpg`}
                alt="Dress Code Look 03 – Masquerade ball with gold masks and velvet attire"
                className="dress-card-img"
                loading="lazy"
              />
              <div className="dress-image-overlay" aria-hidden="true" />
            </div>
          </article>
        </div>

        {/* Kicker line below cards */}
        <p className="dress-code-kicker">
          And babes, <em>fashionably late is still late.</em> 🖤
        </p>
      </div>
    </section>


    {/* ── SIMPLE GOTHIC FRAT THEMED FOOTER ── */}
    <footer className="halloween-footer" aria-label="Event Footer">
      <div className="footer-glow-overlay" aria-hidden="true" />

      {/* Footer Top Ornament with VIORA ELITE Halloween Logo */}
      <div className="footer-top-ornament">
        <span className="footer-ornament-line left" />
        <div className="footer-logo-emblem">
          <a href="#top" className="footer-logo-link" aria-label="VIORA ELITE - Back to top">
            <img src={`${import.meta.env.BASE_URL}images/logo.svg`} alt="VIORA ELITE" className="footer-halloween-logo" />
          </a>
          <span className="footer-sigil-text">Φ · Ρ · Α · Τ</span>
        </div>
        <span className="footer-ornament-line right" />
      </div>

      <div className="footer-simple-content">
        {/* Brand with frat accent */}
        <div className="footer-simple-brand">
          <a href="#top" className="footer-brand-title" aria-label="HALLOWEEN × FRAT">
            <span className="footer-brand-top">HALLOWEEN</span>
            <span className="footer-brand-x">×</span>
            <span className="footer-brand-sub">FRAT</span>
          </a>
          <p className="footer-simple-tagline">
            HALLOWEEN AFTER DARK &nbsp;·&nbsp; HYDERABAD CHAPTER
          </p>
        </div>

        {/* Hero Section CTA in Footer */}
        <div className="footer-hero-cta-wrap">
          <button
            type="button"
            className="halloween-cta halloween-cta-bleeding halloween-cta-solid footer-hero-cta-btn"
            onClick={() => setIsApplicationModalOpen(true)}
            aria-label="Open application form"
          >
            <span className="cta-label">ENTER IF YOU DARE <ArrowRight size={15}/></span>
            <span className="cta-blood-drips" aria-hidden="true">
              <svg viewBox="0 0 240 28" className="cta-drips-svg" preserveAspectRatio="none">
                <path d="M0,0 L240,0 L240,3 Q235,3 232,7 Q229,12 226,12 Q223,12 220,5 Q215,3 208,3 Q200,3 196,16 Q192,26 186,26 Q180,26 177,14 Q175,3 166,3 Q160,3 156,9 Q153,13 149,13 Q145,13 142,4 Q135,3 125,3 Q118,3 113,18 Q108,28 102,28 Q96,28 92,16 Q90,3 80,3 Q74,3 70,8 Q67,11 63,11 Q59,11 56,4 Q48,3 38,3 Q31,3 26,17 Q22,25 16,25 Q11,25 8,13 Q6,3 0,3 Z" fill="currentColor" />
              </svg>
              <span className="cta-blood-drop drop-1" />
              <span className="cta-blood-drop drop-2" />
              <span className="cta-blood-drop drop-3" />
            </span>
          </button>
        </div>

        {/* Sections in Text Format Only */}
        <nav className="footer-text-sections" aria-label="Page Sections">
          <a href="#top" className="footer-text-link">THE RITUAL</a>
          <span className="footer-text-dot" aria-hidden="true">·</span>
          <a href="#party" className="footer-text-link">THE PARTY</a>
          <span className="footer-text-dot" aria-hidden="true">·</span>
          <a href="#experience" className="footer-text-link">THE EXCLUSIVE NIGHT</a>
          <span className="footer-text-dot" aria-hidden="true">·</span>
          <a href="#highlights" className="footer-text-link">EVENT HIGHLIGHTS</a>
          <span className="footer-text-dot" aria-hidden="true">·</span>
          <a href="#dress-code" className="footer-text-link">THE DRESS CODE</a>
        </nav>

        {/* Themed Social & Website Icons */}
        <div className="footer-theme-icons" aria-label="Social and Website Links">
          <a
            href={halloweenEvent.instagram || "https://www.instagram.com/viora.elite?dlrf=enc3anpzN2UwNmty"}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-theme-icon-btn"
            title="Instagram: @viora.elite"
            aria-label="Instagram profile"
          >
            <svg viewBox="0 0 24 24" className="theme-icon-svg" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span className="footer-icon-label">INSTAGRAM</span>
          </a>

          <a
            href={halloweenEvent.websiteUrl || "https://www.vioraelite.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-theme-icon-btn"
            title="VIORA ELITE Website"
            aria-label="Official Website"
          >
            <Globe className="theme-icon-svg" size={16} aria-hidden="true" />
            <span className="footer-icon-label">WEBSITE</span>
          </a>
        </div>

        {/* Bottom copyright & legal text */}
        <div className="footer-simple-bottom">
          <small className="footer-simple-copyright">
            © {new Date().getFullYear()} VIORA ELITE × FRAT. ALL RIGHTS RESERVED.
          </small>
          <div className="footer-simple-legal">
            {halloweenEvent.privacyUrl && (
              <>
                <a href={halloweenEvent.privacyUrl} className="footer-legal-text">PRIVACY</a>
                <span className="footer-text-dot" aria-hidden="true">·</span>
              </>
            )}
            {halloweenEvent.termsUrl && (
              <>
                <a href={halloweenEvent.termsUrl} className="footer-legal-text">TERMS</a>
                <span className="footer-text-dot" aria-hidden="true">·</span>
              </>
            )}
            <a href="#top" className="footer-legal-text">BACK TO TOP ↑</a>
          </div>
        </div>
      </div>
    </footer>

    {/* ── HALLOWEEN × FRAT APPLICATION MODAL ── */}
    {isApplicationModalOpen && (
      <div
        className="halloween-modal-backdrop"
        data-lenis-prevent="true"
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-modal-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsApplicationModalOpen(false);
        }}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div
          className={`halloween-modal-dialog ${formSubmitted ? "is-thankyou-dialog" : ""}`}
          data-lenis-prevent="true"
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            className="halloween-modal-close-btn"
            onClick={() => {
              setIsApplicationModalOpen(false);
              setFormSubmitted(false);
              setShowSubmissionDetails(false);
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Decorative Corner Greek Sigils (hidden in thank you view) */}
          <div className="form-corner-sigil top-left" aria-hidden="true">Φ</div>
          <div className="form-corner-sigil top-right" aria-hidden="true">Ρ</div>
          <div className="form-corner-sigil bottom-left" aria-hidden="true">Α</div>
          <div className="form-corner-sigil bottom-right" aria-hidden="true">Τ</div>

          {formSubmitted ? (
            <div className="halloween-thankyou-wrapper" role="document">
              <h2 id="thankyou-modal-title" className="sr-only">
                Thank You — You Have Been Summoned
              </h2>

              {/* Ambient Crimson/Gold Glow behind parchment */}
              <div className="thankyou-ambient-glow" aria-hidden="true" />

              {/* Parchment Graphic Stage */}
              <div className="thankyou-parchment-stage">
                <img
                  src={`${import.meta.env.BASE_URL}images/thankyou-parchment.png`}
                  alt="Thank You — You Have Been Summoned. Something has heard your call. The ritual is in motion. The masks await. And something in the darkness knows your name. You were never meant to find this. Yet here you are. Your interest has been acknowledged. Your summons awaits. If you hear a knock after midnight do not answer."
                  className="thankyou-parchment-img"
                  loading="eager"
                />
              </div>

              {/* Action Controls */}
              <div className="thankyou-actions-bar">
                <button
                  type="button"
                  className="halloween-cta halloween-cta-bleeding halloween-cta-solid thankyou-close-btn"
                  onClick={() => {
                    setIsApplicationModalOpen(false);
                    setFormSubmitted(false);
                    setShowSubmissionDetails(false);
                  }}
                >
                  <span className="cta-label">
                    <span>RETURN TO THE NIGHT</span>
                    <ArrowRight size={14} />
                  </span>
                  <span className="cta-blood-drips" aria-hidden="true">
                    <svg viewBox="0 0 240 28" className="cta-drips-svg" preserveAspectRatio="none">
                      <path d="M0,0 L240,0 L240,3 Q235,3 232,7 Q229,12 226,12 Q223,12 220,5 Q215,3 208,3 Q200,3 196,16 Q192,26 186,26 Q180,26 177,14 Q175,3 166,3 Q160,3 156,9 Q153,13 149,13 Q145,13 142,4 Q135,3 125,3 Q118,3 113,18 Q108,28 102,28 Q96,28 92,16 Q90,3 80,3 Q74,3 70,8 Q67,11 63,11 Q59,11 56,4 Q48,3 38,3 Q31,3 26,17 Q22,25 16,25 Q11,25 8,13 Q6,3 0,3 Z" fill="currentColor" />
                    </svg>
                    <span className="cta-blood-drop drop-1" />
                    <span className="cta-blood-drop drop-2" />
                    <span className="cta-blood-drop drop-3" />
                  </span>
                </button>

                <button
                  type="button"
                  className="thankyou-receipt-toggle"
                  onClick={() => setShowSubmissionDetails((prev) => !prev)}
                >
                  {showSubmissionDetails ? "▲ Hide Submission Receipt" : "▼ View Submission Receipt"}
                </button>

                {showSubmissionDetails && (
                  <div className="thankyou-receipt-card">
                    <div className="record-card-row">
                      <span className="record-label">NAME</span>
                      <span className="record-value">{formData.fullName}</span>
                    </div>
                    <div className="record-card-row">
                      <span className="record-label">PHONE</span>
                      <span className="record-value">{formData.phoneNumber}</span>
                    </div>
                    <div className="record-card-row">
                      <span className="record-label">EMAIL</span>
                      <span className="record-value">{formData.email}</span>
                    </div>
                    <div className="record-card-row">
                      <span className="record-label">CITY OF ESCAPE</span>
                      <span className="record-value">
                        {formData.cityChoice === "other"
                          ? formData.customCity || "Somewhere beyond Hyderabad"
                          : formData.cityChoice}
                      </span>
                    </div>
                    <div className="record-card-row">
                      <span className="record-label">THRESHOLD SOULS</span>
                      <span className="record-value">
                        {formData.groupSize === "1"
                          ? "Just me (Solo Entry)"
                          : `${
                              formData.groupSize === "2-3"
                                ? "2–3 people"
                                : formData.groupSize === "4-6"
                                ? "4–6 people"
                                : "7+ people"
                            } (${formData.souls.length} souls listed)`}
                      </span>
                    </div>
                    {formData.souls.length > 0 && (
                      <div className="record-souls-list">
                        <span className="record-souls-header">ACCOMPANYING SOULS:</span>
                        <ul className="record-souls-items">
                          {formData.souls.map((soul, idx) => (
                            <li key={soul.id || idx}>
                              <strong>{soul.name || "Soul #" + (idx + 1)}</strong>
                              {soul.age ? ` (${soul.age} yrs)` : ""} — {soul.phone || "No phone"} | {soul.email || "No email"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="record-card-row">
                      <span className="record-label">CHAPTER</span>
                      <span className="record-value">31.10.26 | Hyderabad</span>
                    </div>
                    <div className="record-card-row">
                      <span className="record-label">STATUS</span>
                      <span className="record-value status-badge">SUMMONS IN MOTION</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="halloween-app-form" data-lenis-prevent="true">
              {/* Header */}
              <div className="app-form-header">
                <div className="app-form-logo-box">
                  <img src={`${import.meta.env.BASE_URL}images/logo.svg`} alt="Halloween Chapter" className="app-form-brand-logo" />
                </div>

                <h2 id="app-modal-title" className="app-form-main-title">
                  HALLOWEEN <span className="title-sigil">×</span> FRAT
                </h2>

                <p className="app-form-motto">
                  <em>*YOU'VE ENTERED THE UNKNOWN.*</em>
                </p>

                <div className="app-form-date-city">
                  <span className="meta-item">31.10.26</span>
                  <span className="meta-pipe">|</span>
                  <span className="meta-item">Hyderabad</span>
                </div>

                <div className="app-form-intro-block">
                  <p className="intro-line">
                    The night is calling. The usual plans are cancelled. Hyderabad is about to experience Halloween × Frat like never before.
                  </p>
                  <p className="intro-line">
                    Tell us who you are, where you're coming from, and what energy you're bringing. Spots are limited — make your application count.
                  </p>
                </div>

                {/* Gothic Bat / Sigil Divider */}
                <div className="app-form-ornament" aria-hidden="true">
                  <span className="ornament-line" />
                  <span className="ornament-symbol">🦇</span>
                  <span className="ornament-line" />
                </div>
              </div>

              {/* Questions Section */}
              <div className="app-form-chapter">
                <div className="app-prologue-banner">
                  <p className="prologue-text">
                    <em>Every mask hides a story. Before you enter the darkness, we need to know who you are.</em>
                  </p>
                </div>

                {/* 01. What name shall we whisper when you arrive? */}
                <div className="app-field-group">
                  <div className="field-label-line">
                    <label htmlFor="app-full-name" className="app-field-label">
                      <span className="q-num">01.</span> What name shall we whisper when you arrive? <span className="label-req">*</span>
                    </label>
                  </div>
                  <div className="field-sub-prompt">Full name</div>
                  <input
                    id="app-full-name"
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="app-text-input"
                    autoComplete="name"
                  />
                </div>

                {/* 02. Which number can the shadows reach you on? */}
                <div className="app-field-group">
                  <div className="field-label-line">
                    <label htmlFor="app-phone" className="app-field-label">
                      <span className="q-num">02.</span> Which number can the shadows reach you on? <span className="label-req">*</span>
                    </label>
                  </div>
                  <div className="field-sub-prompt">Phone number</div>
                  <input
                    id="app-phone"
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="app-text-input"
                    autoComplete="tel"
                  />
                </div>

                {/* 03. Where shall your secret invitation find you? */}
                <div className="app-field-group">
                  <div className="field-label-line">
                    <label htmlFor="app-email" className="app-field-label">
                      <span className="q-num">03.</span> Where shall your secret invitation find you? <span className="label-req">*</span>
                    </label>
                  </div>
                  <div className="field-sub-prompt">Email address</div>
                  <input
                    id="app-email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="app-text-input"
                    autoComplete="email"
                  />
                </div>

                {/* 04. Which city are you escaping from? */}
                <div className="app-field-group">
                  <div className="field-label-line">
                    <span className="app-field-label" id="city-question-label">
                      <span className="q-num">04.</span> Which city are you escaping from? <span className="label-req">*</span>
                    </span>
                  </div>

                  <div className="city-choice-column" role="radiogroup" aria-labelledby="city-question-label">
                    {/* Hyderabad */}
                    <button
                      type="button"
                      role="radio"
                      aria-checked={formData.cityChoice === "Hyderabad"}
                      className={`city-pill-btn ${formData.cityChoice === "Hyderabad" ? "is-active" : ""}`}
                      onClick={() => setFormData((prev) => ({ ...prev, cityChoice: "Hyderabad" }))}
                    >
                      <span className="choice-indicator">
                        {formData.cityChoice === "Hyderabad" && <span className="indicator-core" />}
                      </span>
                      <span className="city-pill-label">Hyderabad</span>
                    </button>

                    {/* Secunderabad */}
                    <button
                      type="button"
                      role="radio"
                      aria-checked={formData.cityChoice === "Secunderabad"}
                      className={`city-pill-btn ${formData.cityChoice === "Secunderabad" ? "is-active" : ""}`}
                      onClick={() => setFormData((prev) => ({ ...prev, cityChoice: "Secunderabad" }))}
                    >
                      <span className="choice-indicator">
                        {formData.cityChoice === "Secunderabad" && <span className="indicator-core" />}
                      </span>
                      <span className="city-pill-label">Secunderabad</span>
                    </button>

                    {/* Somewhere beyond Hyderabad */}
                    <div className={`city-beyond-container ${formData.cityChoice === "other" ? "is-active" : ""}`}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={formData.cityChoice === "other"}
                        className={`city-pill-btn beyond-btn ${formData.cityChoice === "other" ? "is-active" : ""}`}
                        onClick={() => setFormData((prev) => ({ ...prev, cityChoice: "other" }))}
                      >
                        <span className="choice-indicator">
                          {formData.cityChoice === "other" && <span className="indicator-core" />}
                        </span>
                        <span className="city-pill-label">Somewhere beyond Hyderabad</span>
                      </button>

                      {/* Interactive text input in place of Somewhere beyond Hyderabad */}
                      {formData.cityChoice === "other" && (
                        <div className="beyond-text-input-wrap">
                          <label htmlFor="app-custom-city" className="beyond-input-label">
                            Specify your city:
                          </label>
                          <input
                            id="app-custom-city"
                            type="text"
                            name="customCity"
                            required
                            autoFocus
                            value={formData.customCity}
                            onChange={handleInputChange}
                            placeholder="Type your city (e.g. Bangalore, Mumbai, Delhi)..."
                            className="app-text-input beyond-city-field"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 05. How many souls will cross the threshold with you? */}
                <div className="app-field-group">
                  <div className="field-label-line">
                    <span className="app-field-label" id="group-size-label">
                      <span className="q-num">05.</span> How many souls will cross the threshold with you? <span className="label-req">*</span>
                    </span>
                  </div>

                  <div className="souls-choice-grid" role="radiogroup" aria-labelledby="group-size-label">
                    {[
                      { key: "1", label: "Just me" },
                      { key: "2-3", label: "2–3 people" },
                      { key: "4-6", label: "4–6 people" },
                      { key: "7+", label: "7+ people" },
                    ].map((tier) => (
                      <button
                        key={tier.key}
                        type="button"
                        role="radio"
                        aria-checked={formData.groupSize === tier.key}
                        className={`city-pill-btn group-tier-btn ${formData.groupSize === tier.key ? "is-active" : ""}`}
                        onClick={() => handleSelectGroupSize(tier.key as "1" | "2-3" | "4-6" | "7+")}
                      >
                        <span className="choice-indicator">
                          {formData.groupSize === tier.key && <span className="indicator-core" />}
                        </span>
                        <span className="city-pill-label">{tier.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Solo note */}
                  {formData.groupSize === "1" && (
                    <div className="solo-soul-note">
                      <span className="solo-icon">🦇</span>
                      <span>Walking the shadows alone. No additional souls need be registered.</span>
                    </div>
                  )}

                  {/* Companion Souls Details Form */}
                  {formData.groupSize && formData.groupSize !== "1" && (
                    <div className="companion-souls-container">
                      <div className="souls-section-banner">
                        <div className="souls-banner-header">
                          <span className="souls-banner-badge">SOUL REGISTRY</span>
                          <h4 className="souls-banner-title">Accompanying Souls Details</h4>
                        </div>
                        <p className="souls-banner-desc">
                          Enter the name, email, phone number, and age of each soul accompanying you past the threshold.
                        </p>
                      </div>

                      <div className="souls-cards-list">
                        {formData.souls.map((soul, idx) => (
                          <div key={soul.id} className="soul-card-item">
                            <div className="soul-card-topbar">
                              <span className="soul-card-index">
                                <span className="soul-index-dot" /> SOUL #{String(idx + 1).padStart(2, "0")}
                              </span>
                              {formData.souls.length > 1 && (
                                <button
                                  type="button"
                                  className="soul-remove-btn"
                                  onClick={() => handleRemoveSoul(idx)}
                                  title="Remove this soul"
                                >
                                  <Trash2 size={13} />
                                  <span>Remove</span>
                                </button>
                              )}
                            </div>

                            <div className="soul-inputs-grid">
                              {/* Soul Name */}
                              <div className="soul-field-col">
                                <label htmlFor={`soul-name-${idx}`} className="soul-input-label">
                                  Full Name <span className="label-req">*</span>
                                </label>
                                <input
                                  id={`soul-name-${idx}`}
                                  type="text"
                                  required
                                  value={soul.name}
                                  onChange={(e) => handleSoulChange(idx, "name", e.target.value)}
                                  placeholder="Companion's full name"
                                  className="app-text-input soul-text-input"
                                />
                              </div>

                              {/* Soul Email */}
                              <div className="soul-field-col">
                                <label htmlFor={`soul-email-${idx}`} className="soul-input-label">
                                  Email Address <span className="label-req">*</span>
                                </label>
                                <input
                                  id={`soul-email-${idx}`}
                                  type="email"
                                  required
                                  value={soul.email}
                                  onChange={(e) => handleSoulChange(idx, "email", e.target.value)}
                                  placeholder="companion@example.com"
                                  className="app-text-input soul-text-input"
                                />
                              </div>

                              {/* Soul Phone */}
                              <div className="soul-field-col">
                                <label htmlFor={`soul-phone-${idx}`} className="soul-input-label">
                                  Phone Number <span className="label-req">*</span>
                                </label>
                                <input
                                  id={`soul-phone-${idx}`}
                                  type="tel"
                                  required
                                  value={soul.phone}
                                  onChange={(e) => handleSoulChange(idx, "phone", e.target.value)}
                                  placeholder="+91 98765 43210"
                                  className="app-text-input soul-text-input"
                                />
                              </div>

                              {/* Soul Age */}
                              <div className="soul-field-col">
                                <label htmlFor={`soul-age-${idx}`} className="soul-input-label">
                                  Age <span className="label-req">*</span>
                                </label>
                                <input
                                  id={`soul-age-${idx}`}
                                  type="number"
                                  min="16"
                                  max="120"
                                  required
                                  value={soul.age}
                                  onChange={(e) => handleSoulChange(idx, "age", e.target.value)}
                                  placeholder="Age (e.g. 22)"
                                  className="app-text-input soul-text-input"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="souls-actions-row">
                        <button
                          type="button"
                          className="add-soul-btn"
                          onClick={handleAddSoul}
                        >
                          <UserPlus size={14} />
                          <span>+ Add Another Soul</span>
                        </button>
                        <span className="souls-count-hint">
                          {formData.souls.length} soul{formData.souls.length === 1 ? "" : "s"} entered
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 06. Are you 21 or older? */}
                <div className="app-field-group">
                  <div className="field-label-line">
                    <span className="app-field-label" id="age-label">
                      <span className="q-num">06.</span> Are you 21 or older? <span className="label-req">*</span>
                    </span>
                    <span className="field-type-tag">[yes/no]</span>
                  </div>

                  <div className="age-selection-grid" role="radiogroup" aria-labelledby="age-label">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={formData.is21OrOlder === "yes"}
                      className={`age-choice-btn ${formData.is21OrOlder === "yes" ? "is-active" : ""}`}
                      onClick={() => setFormData((prev) => ({ ...prev, is21OrOlder: "yes" }))}
                    >
                      <span className="choice-indicator">
                        {formData.is21OrOlder === "yes" && <span className="indicator-core" />}
                      </span>
                      <span className="choice-text">YES — I am 21 or older</span>
                    </button>

                    <button
                      type="button"
                      role="radio"
                      aria-checked={formData.is21OrOlder === "no"}
                      className={`age-choice-btn ${formData.is21OrOlder === "no" ? "is-active" : ""}`}
                      onClick={() => setFormData((prev) => ({ ...prev, is21OrOlder: "no" }))}
                    >
                      <span className="choice-indicator">
                        {formData.is21OrOlder === "no" && <span className="indicator-core" />}
                      </span>
                      <span className="choice-text">NO — Under 21</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* CONFIRMATION */}
              <div className="app-confirmation-chapter">
                <h3 className="confirmation-title">CONFIRMATION</h3>

                <label className={`confirmation-agreement-row ${formData.agreedToTerms ? "is-active" : ""}`}>
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, agreedToTerms: e.target.checked }));
                      if (formError) setFormError("");
                    }}
                    className="sr-only"
                    required
                  />
                  <span
                    className={`custom-checkbox-box ${formData.agreedToTerms ? "is-checked" : ""}`}
                    aria-hidden="true"
                  >
                    {formData.agreedToTerms && <Check size={14} strokeWidth={3} />}
                  </span>
                  <span className="confirmation-statement">
                    I agree to be contacted by VIORA ELITE about this event and understand that submitting this application does not guarantee entry.
                  </span>
                </label>

                <div className="confirmation-footer-note">
                  <p className="quote-text">
                    <em>*Limited spots. One unforgettable night.*</em>
                  </p>
                  <p className="brand-text">
                    Halloween × Frat
                  </p>
                </div>
              </div>

              {formError && (
                <div className="form-error-banner" role="alert">
                  {formError}
                </div>
              )}

              {/* Submit Button */}
              <div className="form-submit-row">
                <button
                  type="submit"
                  disabled={!formData.agreedToTerms || isSubmitting}
                  className={`halloween-cta halloween-cta-bleeding halloween-cta-solid form-final-submit ${
                    !formData.agreedToTerms ? "is-locked" : "is-ready"
                  }`}
                  title={
                    !formData.agreedToTerms
                      ? "Check the confirmation box above to submit"
                      : "Click to seal your application"
                  }
                >
                  <span className="cta-label">
                    {!formData.agreedToTerms ? (
                      <span className="locked-cta-content">
                        <Lock size={13} className="lock-icon" />
                        <span>CHECK CONFIRMATION TO SUBMIT</span>
                      </span>
                    ) : isSubmitting ? (
                      "SEALING..."
                    ) : (
                      <>
                        <span>ENTER THE UNKNOWN</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </span>
                  {formData.agreedToTerms && (
                    <span className="cta-blood-drips" aria-hidden="true">
                      <svg viewBox="0 0 240 28" className="cta-drips-svg" preserveAspectRatio="none">
                        <path d="M0,0 L240,0 L240,3 Q235,3 232,7 Q229,12 226,12 Q223,12 220,5 Q215,3 208,3 Q200,3 196,16 Q192,26 186,26 Q180,26 177,14 Q175,3 166,3 Q160,3 156,9 Q153,13 149,13 Q145,13 142,4 Q135,3 125,3 Q118,3 113,18 Q108,28 102,28 Q96,28 92,16 Q90,3 80,3 Q74,3 70,8 Q67,11 63,11 Q59,11 56,4 Q48,3 38,3 Q31,3 26,17 Q22,25 16,25 Q11,25 8,13 Q6,3 0,3 Z" fill="currentColor" />
                      </svg>
                      <span className="cta-blood-drop drop-1" />
                      <span className="cta-blood-drop drop-2" />
                      <span className="cta-blood-drop drop-3" />
                    </span>
                  )}
                </button>
              </div>

              {!formData.agreedToTerms && (
                <p className="checkbox-required-hint">
                  <Lock size={12} /> Click the confirmation checkbox above to submit your details.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    )}
  </main>;
};
