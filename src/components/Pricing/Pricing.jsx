import { motion } from "motion/react";
import { Check, ArrowRight } from "lucide-react";

// ----------------------------------------------------------------------
// Pricing Data
// ----------------------------------------------------------------------

const PRICING_PLANS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For small businesses getting started",
    price: "$499",
    period: "/ month",
    popular: false,
    features: [
      "Social media management (2 platforms)",
      "Monthly content calendar",
      "Basic SEO audit & setup",
      "Email support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For brands ready to scale faster",
    price: "$999",
    period: "/ month",
    popular: true,
    features: [
      "Everything in Starter",
      "Meta & Google Ads management",
      "Ongoing SEO optimization",
      "Graphic design & content production",
      "Monthly strategy call",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Full digital solutions, done for you",
    price: "$1,999",
    period: "/ month",
    popular: false,
    features: [
      "Everything in Growth",
      "Video production & motion graphics",
      "Website / app development",
      "Dedicated account manager",
      "Priority support",
    ],
  },
];

// ----------------------------------------------------------------------
// Animation Variants
// ----------------------------------------------------------------------

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

const CARD_SCROLL_VARIANT = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: index * 0.12,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  }),
};

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

function PricingCard({ plan, index }) {
  const isPopular = plan.popular;

  return (
    <motion.div
      variants={CARD_SCROLL_VARIANT}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      custom={index}
      className={`group relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 ${
        isPopular
          ? "border border-[#D9531E]/40 bg-[#09090B] text-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] md:-translate-y-4 md:hover:-translate-y-6"
          : "border border-[#18181B]/10 bg-white text-[#18181B] hover:border-[#D9531E]/40 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]"
      }`}
    >
      {/* Popular Tag */}
      {isPopular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#D9531E] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
          Most Popular
        </span>
      )}

      <div>
        {/* Card Header */}
        <div className="mb-6">
          <h3
            className={`text-2xl font-extrabold tracking-tight ${
              isPopular ? "text-white" : "text-[#18181B]"
            }`}
          >
            {plan.name}
          </h3>
          <p
            className={`mt-2 text-xs font-medium min-h-[32px] ${
              isPopular ? "text-white/70" : "text-[#18181B]/70"
            }`}
          >
            {plan.tagline}
          </p>
        </div>

        {/* Price Tag */}
        <div
          className={`mb-8 flex items-baseline gap-1 border-b pb-6 ${
            isPopular ? "border-white/10" : "border-[#18181B]/10"
          }`}
        >
          <span
            className={`text-5xl font-extrabold tracking-tight ${
              isPopular ? "text-white" : "text-[#18181B]"
            }`}
          >
            {plan.price}
          </span>
          <span
            className={`text-sm font-semibold ${
              isPopular ? "text-white/60" : "text-[#18181B]/60"
            }`}
          >
            {plan.period}
          </span>
        </div>

        {/* Features List */}
        <ul className="mb-8 space-y-4">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full mt-0.5 ${
                  isPopular
                    ? "bg-[#D9531E] text-white"
                    : "bg-[#D9531E]/10 text-[#D9531E]"
                }`}
              >
                <Check size={12} strokeWidth={3} />
              </div>
              <span
                className={`text-sm font-medium leading-snug ${
                  isPopular ? "text-white/80" : "text-[#18181B]/80"
                }`}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <a
        href="#contact"
        className={`group/btn flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-bold transition-all duration-300 ${
          isPopular
            ? "bg-[#D9531E] text-white shadow-[0_10px_20px_rgba(217,83,30,0.3)] hover:bg-[#c44719]"
            : "border border-[#18181B]/20 bg-transparent text-[#18181B] hover:border-[#D9531E] hover:bg-[#D9531E] hover:text-white"
        }`}
      >
        <span>Get Started</span>
        <ArrowRight
          size={16}
          className="transition-transform duration-300 group-hover/btn:translate-x-1"
        />
      </a>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-[#FAFAFA] py-28 text-[#18181B]"
    >
      {/* Soft Ambient Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#FDEBE4] to-transparent blur-3xl opacity-80"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Animated Section Header */}
        <motion.header
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 text-center"
        >
          <motion.div
            variants={FADE_IN_HEADER}
            custom={0}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <span className="h-[2px] w-6 bg-[#D9531E]" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D9531E]">
              PRICING
            </span>
          </motion.div>

          <motion.h2
            variants={FADE_IN_HEADER}
            custom={0.1}
            className="text-4xl font-extrabold tracking-tight text-[#18181B] md:text-6xl leading-tight"
          >
            Plans Built To Scale With You.
          </motion.h2>

          <motion.p
            variants={FADE_IN_HEADER}
            custom={0.2}
            className="mx-auto mt-4 max-w-xl text-base text-[#18181B]/70 font-medium leading-relaxed"
          >
            Simple, transparent packages — upgrade any time as your business
            grows.
          </motion.p>
        </motion.header>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch">
          {PRICING_PLANS.map((plan, index) => (
            <PricingCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}