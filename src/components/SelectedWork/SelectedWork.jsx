import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const PROJECTS = [
  {
    id: 1,
    title: "Solara Real Estate",
    category: "Brand Identity",
    description:
      "Full brand identity and marketing collateral for a premium property developer.",
    gradient: "from-[#F97316] via-[#EA580C] to-[#C2410C]",
  },
  {
    id: 2,
    title: "Vitalis Health",
    category: "Website",
    description:
      "Conversion-focused website and booking flow for a multi-location healthcare brand.",
    gradient: "from-[#FB923C] via-[#F97316] to-[#9A3412]",
  },
  {
    id: 3,
    title: "CartNest",
    category: "Social Campaign",
    description:
      "Always-on social content and Meta Ads engine for a fast-growing e-commerce store.",
    gradient: "from-[#52525B] via-[#3F3F46] to-[#18181B]",
  },
  {
    id: 4,
    title: "Apex Media",
    category: "Video Campaign",
    description:
      "Cinematic video production and performance ad creatives for digital reach.",
    gradient: "from-[#3F3F46] via-[#27272A] to-[#09090B]",
  },
  {
    id: 5,
    title: "Nova Tech",
    category: "Brand Identity",
    description:
      "Scalable visual language, logo system, and design guidelines for SaaS startup.",
    gradient: "from-[#EA580C] via-[#C2410C] to-[#7C2D12]",
  },
  {
    id: 6,
    title: "Lumina App",
    category: "Mobile App / UI-UX",
    description:
      "End-to-end product design and interface design for dynamic iOS/Android app.",
    gradient: "from-[#F97316] via-[#DD6B20] to-[#7B2CBF]",
  },
];

// Header Entrance Animation Variant
const FADE_IN_HEADER = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  }),
};

// Card Entrance Animation Variant
const CARD_ENTRANCE = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: index * 0.1,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  }),
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function SelectedWorkScroll() {
  const targetRef = useRef(null);

  // Track vertical page scroll relative to targetRef
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Map vertical scroll progress to horizontal translation
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]);

  return (
    <section
      ref={targetRef}
      className="relative h-[300vh] bg-[#FAFAFA] text-[#18181B]"
    >
      {/* Sticky Container keeps section fixed in view while scrolling horizontally */}
      <div className="sticky top-0 flex h-screen flex-col justify-between overflow-hidden py-16">
        
        {/* Animated Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-7xl px-6 w-full text-center"
        >
          <motion.div
            variants={FADE_IN_HEADER}
            custom={0}
            className="flex items-center justify-center gap-2 mb-3"
          >
            <span className="h-[2px] w-6 bg-[#D9531E]" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D9531E]">
              OUR WORK
            </span>
          </motion.div>

          <motion.h2
            variants={FADE_IN_HEADER}
            custom={0.1}
            className="text-4xl font-extrabold tracking-tight text-[#18181B] md:text-6xl"
          >
            Selected Work.
          </motion.h2>

          <motion.p
            variants={FADE_IN_HEADER}
            custom={0.2}
            className="mx-auto mt-3 max-w-lg text-base text-[#18181B]/70 font-medium"
          >
            Scroll down to explore our featured client case studies.
          </motion.p>
        </motion.div>

        {/* Horizontal Carousel Track */}
        <div className="relative flex items-center">
          <motion.div style={{ x }} className="flex gap-8 px-12 md:px-24">
            {PROJECTS.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        </div>

        {/* Bottom Progress Bar Indicator */}
        <div className="mx-auto w-48 h-1.5 bg-[#18181B]/10 rounded-full overflow-hidden">
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="h-full w-full bg-[#D9531E] origin-left"
          />
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Card Sub-component
// ----------------------------------------------------------------------

function ProjectCard({ project, index }) {
  return (
    <motion.div
      variants={CARD_ENTRANCE}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      custom={index}
      className="group relative flex h-[420px] w-[320px] shrink-0 flex-col overflow-hidden rounded-3xl border border-[#18181B]/10 bg-white transition-all duration-500 hover:-translate-y-2 hover:border-[#D9531E]/40 hover:shadow-[0_20px_40px_-15px_rgba(217,83,30,0.2)] md:w-[380px]"
    >
      {/* Card Visual Banner */}
      <div className="relative h-52 w-full overflow-hidden p-6">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient} transition-transform duration-700 group-hover:scale-105`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

        <span className="relative z-10 inline-block rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#D9531E] shadow-sm backdrop-blur-md">
          {project.category}
        </span>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-6 mb-16">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-[#18181B] transition-colors duration-300 group-hover:text-[#D9531E]">
            {project.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[#18181B]/70 font-medium">
            {project.description}
          </p>
        </div>

        {/* Action Link */}
        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#D9531E]">
          <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#D9531E] after:transition-all after:duration-300 group-hover:after:w-full">
            View Case Study
          </span>
          <ArrowUpRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </div>
      </div>
    </motion.div>
  );
}