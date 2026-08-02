import { motion } from "motion/react";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, ArrowUpRight, ShieldCheck } from "lucide-react";

// ----------------------------------------------------------------------
// Data
// ----------------------------------------------------------------------

const CONTACT_INFO = [
  {
    id: "email",
    icon: Mail,
    title: "Email Us",
    value: "hello@nexora.com",
    href: "mailto:hello@nexora.com",
    subtext: "We usually reply within 2 hours",
  },
  {
    id: "phone",
    icon: Phone,
    title: "Call Us",
    value: "+1 (555) 019-2834",
    href: "tel:+15550192834",
    subtext: "Mon–Fri from 9am to 6pm",
  },
  {
    id: "office",
    icon: MapPin,
    title: "Visit Our Studio",
    value: "KINFRA IT Park, Calicut",
    href: "https://maps.google.com",
    subtext: "Kerala, India",
  },
];

const SERVICES = ["Web / UI", "Branding", "Marketing", "Full Package"];
const BUDGETS = ["$500 – 1k", "$1k – 3k", "$3k – 5k+"];

// ----------------------------------------------------------------------
// Animation variants
// ----------------------------------------------------------------------

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] },
  }),
};

const panelLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] } },
};

const panelRight = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] } },
};

// ----------------------------------------------------------------------
// Small reusable pieces
// ----------------------------------------------------------------------

function FloatingInput({ id, type = "text", label, required, textarea = false, rows = 4 }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div className="relative">
      <Tag
        id={id}
        type={!textarea ? type : undefined}
        rows={textarea ? rows : undefined}
        required={required}
        placeholder=" "
        className={`peer w-full border-b-2 border-[#211712]/15 bg-transparent pb-3 pt-5 text-[15px] text-[#211712] outline-none transition-colors duration-300 placeholder-transparent focus:border-[#FF5A1F] ${
          textarea ? "resize-none" : ""
        }`}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-5 text-[15px] text-[#211712]/40 transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-[15px] peer-focus:top-0 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-[#FF5A1F] [&:not(:placeholder-shown)]:top-0 [&:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>
    </div>
  );
}

function PillGroup({ label, options, value, onChange }) {
  return (
    <div>
      <span className="mb-3 block text-xs font-bold uppercase tracking-wider text-[#211712]/50">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              type="button"
              key={opt}
              onClick={() => onChange(opt)}
              className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-all duration-300 ${
                active
                  ? "border-transparent bg-gradient-to-r from-[#FF5A1F] to-[#C13E0A] text-white shadow-[0_10px_20px_-8px_rgba(193,62,10,0.5)]"
                  : "border-[#211712]/12 text-[#211712]/60 hover:border-[#FF5A1F]/40 hover:text-[#211712]"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Main component
// ----------------------------------------------------------------------

export default function ContactSection() {
  const [service, setService] = useState(SERVICES[0]);
  const [budget, setBudget] = useState(BUDGETS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-[#FFF9F5] px-6 py-28">
    

      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#FFD9BE] opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#FFE3D0] opacity-50 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* ================= HEADER ================= */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <motion.div variants={fadeUp} custom={0} className="mb-5 flex items-center justify-center gap-3">
            <span className="h-0.5 w-7 bg-[#C13E0A]" />
            <span className=" text-xs font-bold uppercase tracking-[0.25em] text-[#C13E0A]">
              Get In Touch
            </span>
            <span className="h-0.5 w-7 bg-[#C13E0A]" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={0.1}
            className=" text-4xl font-extrabold leading-tight tracking-tight text-[#211712] md:text-6xl"
          >
            Let's Build Something{" "}
            <span className="bg-gradient-to-r from-[#FF5A1F] to-[#C13E0A] bg-clip-text text-transparent">
              Great Together
            </span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={0.2}
            className="font-body mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-[#5b5048]"
          >
            Have a project in mind, a query about pricing, or just want to say
            hi? Drop us a line below.
          </motion.p>
        </motion.div>

        {/* ================= UNIFIED SPLIT CARD ================= */}
        <div className="grid overflow-hidden rounded-[32px] shadow-[0_40px_90px_-30px_rgba(33,23,18,0.25)] lg:grid-cols-12">
          {/* ---- LEFT: dark info panel ---- */}
          <motion.div
            variants={panelLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative overflow-hidden bg-[#211712] p-10 text-white md:p-12 lg:col-span-5"
          >
            {/* ambient orange glow, breathing */}
            <motion.div
              className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#FF5A1F] opacity-20 blur-[90px]"
              animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.28, 0.15] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="pointer-events-none absolute -bottom-6 -right-4 select-none text-[160px] font-black leading-none text-white opacity-[0.04]">
              N
            </span>

            {/* availability badge */}
            <div className="relative mb-9 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF8A4C] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF8A4C]" />
              </span>
              <span className=" text-[11px] font-semibold uppercase tracking-widest text-white/80">
                Accepting new projects
              </span>
            </div>

            <h3 className=" relative mb-3 text-[26px] font-bold leading-snug">
              Let's start a conversation
            </h3>
            <p className="font-body relative mb-10 text-[14.5px] leading-relaxed text-white/55">
              Reach us directly, or fill out the form and we'll get back to
              you within two business hours.
            </p>

            {/* contact list */}
            <div className="relative flex flex-col divide-y divide-white/10 border-y border-white/10">
              {CONTACT_INFO.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target={item.id === "office" ? "_blank" : "_self"}
                    rel="noreferrer"
                    className="group flex items-center gap-4 py-5"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/8 text-[#FF8A4C] transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#FF5A1F] group-hover:to-[#C13E0A] group-hover:text-white">
                      <Icon size={19} strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <p className=" text-[10.5px] font-bold uppercase tracking-widest text-white/40">
                        {item.title}
                      </p>
                      <p className=" text-[15px] font-semibold text-white transition-colors group-hover:text-[#FF8A4C]">
                        {item.value}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="shrink-0 -translate-x-1 text-white/30 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-[#FF8A4C]"
                    />
                  </a>
                );
              })}
            </div>

            {/* quick pitch */}
            <div className="relative mt-9 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h4 className=" text-[15px] font-bold text-white">
                Prefer a quick call?
              </h4>
              <p className="font-body mt-2 text-[13px] leading-relaxed text-white/50">
                Book a free 15-minute discovery call to talk through your
                roadmap and timeline.
              </p>
              <a
                href="#booking"
                className=" mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF8A4C] transition-all hover:gap-2.5"
              >
                Schedule a Call
                <ArrowUpRight size={13} />
              </a>
            </div>
          </motion.div>

          {/* ---- RIGHT: form panel ---- */}
          <motion.div
            variants={panelRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="bg-white p-10 md:p-12 lg:col-span-7"
          >
            <h3 className=" mb-1 text-[22px] font-bold text-[#211712]">
              Send us a message
            </h3>
            <p className="font-body mb-8 text-[14px] text-[#5b5048]">
              Fields marked * are required — everything else just helps us
              prep before we talk.
            </p>

            <form onSubmit={handleSubmit} className="space-y-9">
              <div className="grid grid-cols-1 gap-x-8 gap-y-9 md:grid-cols-2">
                <FloatingInput id="name" label="Your Name *" required />
                <FloatingInput id="email" type="email" label="Email Address *" required />
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2">
                <PillGroup label="Service Interested In" options={SERVICES} value={service} onChange={setService} />
                <PillGroup label="Estimated Budget" options={BUDGETS} value={budget} onChange={setBudget} />
              </div>

              <FloatingInput id="message" label="Project Details *" required textarea rows={4} />

              <motion.button
                type="submit"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#FF5A1F] to-[#C13E0A] py-4 text-sm font-bold text-white shadow-[0_18px_34px_-14px_rgba(193,62,10,0.5)] transition-shadow duration-300 hover:shadow-[0_22px_44px_-14px_rgba(193,62,10,0.6)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover/btn:translate-x-full" />
                <span className="relative">Send Message</span>
                <Send
                  size={16}
                  className="relative transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                />
              </motion.button>

              <div className="flex items-center justify-center gap-2 text-[12px] text-[#5b5048]/70">
                <ShieldCheck size={14} className="text-[#C13E0A]" />
                We respect your privacy — no spam, ever.
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
