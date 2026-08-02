import { motion } from "motion/react";
import {
  Users,
  BarChart3,
  Palette,
  Zap,
  Handshake,
  Target,
} from "lucide-react";

// ----------------------------------------------------------------------
// Data & Animation Constants
// ----------------------------------------------------------------------

const FEATURES = [
  { title: "Experienced Creative Team", icon: Users },
  { title: "Data-Driven Marketing", icon: BarChart3 },
  { title: "Premium Design Quality", icon: Palette },
  { title: "Fast Delivery", icon: Zap },
  { title: "Client-Focused Approach", icon: Handshake },
  { title: "Results-Oriented Strategy", icon: Target },
];

// Double items for a smooth infinite scroll loop
const MARQUEE_ITEMS = [...FEATURES, ...FEATURES];

// Fade-in animation variants for headers
const FADE_IN = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  }),
};

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

function FeatureItem({ title, icon: Icon }) {
  return (
    <div className="group flex cursor-pointer items-center gap-5 transition-colors duration-300">
      {/* Icon Badge */}
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#C13E0A] backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-[#F4743C] group-hover:bg-[#F4743C] group-hover:text-black group-hover:shadow-[0_0_30px_rgba(244,116,60,0.4)]">
        <Icon size={24} className="transition-transform duration-300 group-hover:rotate-6" />
      </div>

      {/* Item Title */}
      <span className="text-2xl font-semibold tracking-tight text-white/70 transition-colors duration-300 group-hover:text-white">
        {title}
      </span>

      {/* Slash Divider */}
      <span aria-hidden="true" className="ml-5 text-xl font-light text-white/20">
        /
      </span>
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-[#070707] py-28 text-white">
      {/* Background Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F4743C]/10 blur-[170px]"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Animated Header */}
        <motion.header
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 text-center"
        >
          <motion.span
            variants={FADE_IN}
            custom={0}
            className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[#C13E0A]"
          >
            Why Us
          </motion.span>

          <motion.h2
            variants={FADE_IN}
            custom={0.1}
            className="mt-4 text-5xl font-bold tracking-tight md:text-7xl"
          >
            Built for Growth.
          </motion.h2>

          <motion.h2
            variants={FADE_IN}
            custom={0.2}
            className="text-5xl font-bold tracking-tight text-[#C13E0A] md:text-7xl"
          >
            Chosen for Results.
          </motion.h2>

          <motion.p
            variants={FADE_IN}
            custom={0.3}
            className="mx-auto mt-6 max-w-xl text-lg text-white/60"
          >
            We blend strategy, creativity, and technology into digital
            experiences that scale businesses.
          </motion.p>
        </motion.header>
      </div>

      {/* Marquee Track with Masked Fade Edges */}
      <div className="relative w-full overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex w-max items-center gap-10 whitespace-nowrap"
        >
          {MARQUEE_ITEMS.map((item, index) => (
            <FeatureItem
              key={`${item.title}-${index}`}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}