
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ORB_SPEEDS = [18, -26, 12];

export default function AboutSection() {
  const rootRef = useRef(null);
  const aboutRef = useRef(null);
  const eyebrowRef = useRef(null);
  const leadRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const orbRefs = useRef([]);

  const storyRef = useRef(null);
  const stickyRef = useRef(null);
  const bgFillRef = useRef(null);
  const ghostRef = useRef(null);
  const panelMissionRef = useRef(null);
  const panelVisionRef = useRef(null);
  const hintRef = useRef(null);

  const [active, setActive] = useState(0); // 0 = Mission, 1 = Vision
  const activeRef = useRef(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      /* ---------- Masked text reveal + fade-in on scroll ---------- */
      gsap
        .timeline({ scrollTrigger: { trigger: aboutRef.current, start: "top 75%" } })
        .to(eyebrowRef.current, { opacity: 1, duration: 0.5, ease: "power2.out" })
        .to(
          [line1Ref.current, line2Ref.current],
          { y: "0%", duration: 0.9, ease: "power4.out", stagger: 0.14 },
          "-=0.2"
        )
        .to(leadRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5");

      /* ---------- Parallax orbs ---------- */
      if (!prefersReduced) {
        orbRefs.current.forEach((orb, i) => {
          if (!orb) return;
          gsap.to(orb, {
            y: ORB_SPEEDS[i] * 6,
            ease: "none",
            scrollTrigger: {
              trigger: aboutRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        });
      }

      /* ---------- Pinned scrollytelling: Mission -> Vision ---------- */
      const storyTl = gsap.timeline({
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: stickyRef.current,
          pinSpacing: false,
        },
      });

      storyTl
        .to(hintRef.current, { opacity: 0, duration: 0.15 }, 0.05)
        .to(panelMissionRef.current, { opacity: 0, y: -50, duration: 0.35 }, 0.35)
        .to(panelVisionRef.current, { opacity: 1, y: 0, duration: 0.35 }, 0.35)
        .to(bgFillRef.current, { opacity: 1, duration: 0.4 }, 0.35)
        .to(ghostRef.current, { opacity: 0, duration: 0.14 }, 0.32)
        .to(ghostRef.current, { opacity: 0.08, duration: 0.14 }, 0.46);

      // Drive React state from scroll progress so it also restores cleanly on scroll-up
      storyTl.eventCallback("onUpdate", () => {
        const idx = storyTl.progress() < 0.35 ? 0 : 1;
        if (idx !== activeRef.current) {
          activeRef.current = idx;
          setActive(idx);
        }
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="bg-orange-50">
    

      {/* ================= INTRO ================= */}
      <section ref={aboutRef} className="relative mx-auto max-w-6xl overflow-hidden px-6 pb-16 pt-30">
      

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div
            ref={eyebrowRef}
            className="font-display mb-7 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-orange-600 opacity-0"
          >
            <span className="h-0.5 w-7 bg-orange-600" />
            Who We Are
            <span className="h-0.5 w-7 bg-orange-600" />
          </div>

          <h1 className=" text-4xl font-extrabold leading-tight text-neutral-900 md:text-6xl">
            <span className="block overflow-hidden">
              <span ref={line1Ref} className="block translate-y-full">
                Built By Strategists,
              </span>
            </span>
            <span className="block overflow-hidden">
              <span ref={line2Ref} className="block translate-y-full">
                Sharpened By{" "}
                <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                  Data.
                </span>
              </span>
            </span>
          </h1>

          <p
            ref={leadRef}
            className="font-body mx-auto mt-8  translate-y-6 text-lg leading-relaxed text-neutral-600 opacity-0"
          >
            Nexora was founded on a simple belief: brands don't grow by
            accident. We're a digital marketing and creative agency of
            strategists, designers, and engineers who pair analytical rigor
            with bold creative work — helping startups, real estate,
            healthcare, and e-commerce brands turn attention into measurable,
            lasting growth.
          </p>
        </div>
      </section>

      {/* ================= PINNED MISSION / VISION SCROLLYTELLING ================= */}
      <section ref={storyRef} className="relative h-[280vh]">
        <div
          ref={stickyRef}
          className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-neutral-900"
        >
          {/* orange gradient fill that fades in as we cross into Vision */}
          <div
            ref={bgFillRef}
            className="absolute inset-0 z-0 bg-gradient-to-br from-orange-600 to-orange-700 opacity-0"
          />

          {/* giant ghost index number */}
          <div
            ref={ghostRef}
            className="font-display pointer-events-none absolute z-[1] select-none text-[46vw] font-black leading-none text-white opacity-5 md:text-[34rem]"
          >
            {active === 0 ? "01" : "02"}
          </div>

          {/* progress indicator */}
          <div className="absolute top-14 left-1/2 z-30 flex -translate-x-1/2 gap-9">
            <div
              className={`font-display flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest transition-colors duration-300 ${
                active === 0 ? "text-white" : "text-white/40"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  active === 0 ? "scale-125 bg-orange-500" : "bg-white/30"
                }`}
              />
              Mission
            </div>
            <div
              className={`font-display flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest transition-colors duration-300 ${
                active === 1 ? "text-white" : "text-white/40"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  active === 1 ? "scale-125 bg-orange-500" : "bg-white/30"
                }`}
              />
              Vision
            </div>
          </div>

          {/* Mission panel */}
          <div
            ref={panelMissionRef}
            className="relative z-20 max-w-2xl px-10 text-center text-white"
          >
            <span className="font-display mb-4 inline-block text-xs font-bold uppercase tracking-widest text-orange-500">
              Our Mission
            </span>
            <h2 className="font-display mb-5 text-3xl font-bold leading-snug md:text-5xl">
              Give ambitious brands the firepower of giants
            </h2>
            <p className="font-body text-lg leading-relaxed text-white/70">
              We combine data-driven strategy, striking creative, and modern
              technology so every rupee spent on growth compounds into real,
              trackable results — no guesswork, no vanity metrics.
            </p>
          </div>

          {/* Vision panel */}
          <div
            ref={panelVisionRef}
            className="absolute inset-0 z-20 flex items-center justify-center px-10 opacity-0"
          >
            <div className="max-w-2xl text-center text-white">
              <span className="font-display mb-4 inline-block text-xs font-bold uppercase tracking-widest text-white/75">
                Our Vision
              </span>
              <h2 className="font-display mb-5 text-3xl font-bold leading-snug md:text-5xl">
                Become the growth partner brands think of first
              </h2>
              <p className="font-body text-lg leading-relaxed text-white/70">
                Recognized not for the size of our campaigns, but for the
                clarity of our thinking and the confidence our clients feel
                scaling with us, year after year.
              </p>
            </div>
          </div>

          {/* scroll hint */}
          <div
            ref={hintRef}
            className="font-display absolute bottom-11 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/40"
          >
            Scroll
            <span className="h-3.5 w-3.5 animate-bounce border-b-2 border-r-2 border-white/50 -translate-x-1/2" />
          </div>
        </div>
      </section>
    </div>
  );
}
