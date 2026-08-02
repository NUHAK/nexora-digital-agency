
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { HiStar } from "react-icons/hi";

const TESTIMONIALS = [
    {
        name: "Ananya Rao",
        role: "Founder, Lumen Skincare",
        quote: "Nexora didn't just run our ads — they rebuilt how we think about growth. ROAS is up 3.4x in five months.",
        rating: 5,
    },
    {
        name: "Rahul Mehta",
        role: "CEO, UrbanNest Realty",
        quote: "Every campaign came with numbers, not opinions. That's rare in this industry.",
        rating: 5,
    },
    {
        name: "Priya Nair",
        role: "Marketing Lead, CarePlus Health",
        quote: "Our brand finally looks and feels the way it should. The creative work was flawless.",
        rating: 5,
    },
    {
        name: "Devon Fernandes",
        role: "Co-founder, ShelfLife",
        quote: "They shipped our new site in three weeks and conversions jumped 40% at launch.",
        rating: 5,
    },
    {
        name: "Meera Iyer",
        role: "Director, Northline Logistics",
        quote: "Responsive, sharp, and genuinely invested in our numbers. Best agency we've worked with.",
        rating: 5,
    },
    {
        name: "Karan Bhatt",
        role: "VP Growth, Fintra",
        quote: "Nexora treats our budget like it's their own. That mindset alone is worth the partnership.",
        rating: 5,
    },
    {
        name: "Sana Sheikh",
        role: "Head of Brand, Woven",
        quote: "Fast turnarounds, sharp taste, zero hand-holding needed. Exactly what a lean team wants from an agency.",
        rating: 5,
    },
    {
        name: "Arjun Malhotra",
        role: "Founder, PeakForm",
        quote: "Six months in, our CAC is down 28% and our creative finally matches our ambition.",
        rating: 5,
    },
    {
        name: "Ritika Sen",
        role: "COO, Bloomtrail",
        quote: "They ask better questions about our business than most people on our own team do.",
        rating: 5,
    },
];

const COLUMNS = [
    { items: TESTIMONIALS.slice(0, 3), direction: "up", speed: 30 },
    { items: TESTIMONIALS.slice(3, 6), direction: "down", speed: 36 },
    { items: TESTIMONIALS.slice(6, 9), direction: "up", speed: 26 },
];

function initials(name) {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2);
}

function Card({ t }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, borderColor: "rgba(255,138,76,0.4)" }}
            transition={{ duration: 0.3 }}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md"
        >
            <div className="mb-3 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                    <HiStar key={i} className="h-3.5 w-3.5 text-[#FF8A4C]" />
                ))}
            </div>
            <p className="font-body mb-5 text-[14.5px] leading-relaxed text-white/80">
                {t.quote}
            </p>
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FF5A1F] to-[#C13E0A] text-[11.5px] font-bold text-white">
                    {initials(t.name)}
                </div>
                <div>
                    <div className="font-display text-[13px] font-semibold text-white">{t.name}</div>
                    <div className="font-body text-[11.5px] text-white/45">{t.role}</div>
                </div>
            </div>
        </motion.div>
    );
}

function VerticalColumn({ items, direction = "up", speed = 30 }) {
    const trackRef = useRef(null);
    const tweenRef = useRef(null);

    useEffect(() => {
        const el = trackRef.current;
        const from = direction === "up" ? { yPercent: 0 } : { yPercent: -50 };
        const to = direction === "up" ? { yPercent: -50 } : { yPercent: 0 };

        gsap.set(el, from);
        tweenRef.current = gsap.to(el, {
            ...to,
            duration: speed,
            ease: "none",
            repeat: -1,
        });

        return () => tweenRef.current?.kill();
    }, [direction, speed]);

    return (
        <div
            className="relative h-[560px] overflow-hidden md:h-[620px]"
            style={{
                WebkitMaskImage:
                    "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
                maskImage:
                    "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            }}
            onMouseEnter={() => tweenRef.current?.pause()}
            onMouseLeave={() => tweenRef.current?.play()}
        >
            <div ref={trackRef} className="flex flex-col gap-5">
                {[...items, ...items].map((t, i) => (
                    <Card key={`${t.name}-${i}`} t={t} />
                ))}
            </div>
        </div>
    );
}

export default function TestimonialsSection() {
    return (
        <section className="relative overflow-hidden bg-[#0B0806] px-6 py-32">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800;900&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
                .font-display { font-family: 'Poppins', sans-serif; }
                .font-body { font-family: 'Lora', serif; }
            `}</style>

            {/* ambient glow */}
            <div className="pointer-events-none absolute -left-20 top-0 h-[420px] w-[420px] rounded-full bg-[#FF5A1F] opacity-[0.12] blur-[110px]" />
            <div className="pointer-events-none absolute -right-24 bottom-0 h-[460px] w-[460px] rounded-full bg-[#C13E0A] opacity-[0.14] blur-[120px]" />

            {/* ================= HEADER ================= */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative z-10 mx-auto mb-16 max-w-2xl text-center"
            >
                <div className=" mb-6 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[#FF8A4C]">
                    <span className="h-0.5 w-7 bg-[#FF8A4C]" />
                    Client Love
                    <span className="h-0.5 w-7 bg-[#FF8A4C]" />
                </div>
                <h2 className=" text-4xl font-extrabold leading-tight text-white md:text-5xl">
                    Real Stories,{" "}
                    <span className="bg-gradient-to-r from-[#FF5A1F] to-[#FF8A4C] bg-clip-text text-transparent">
                        Real Growth
                    </span>
                </h2>
                <p className="font-body mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-white/60">
                    A living wall of feedback from brands we've grown with.
                </p>
            </motion.div>

            {/* ================= VERTICAL WALL ================= */}
            <div className="relative z-10 mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {COLUMNS.map((col, i) => (
                    <VerticalColumn key={i} items={col.items} direction={col.direction} speed={col.speed} />
                ))}
            </div>

            <p className=" relative z-10 mt-10 text-center text-[11px] font-semibold uppercase tracking-widest text-white/35">
                Hover a column to pause
            </p>
        </section>
    );
}
