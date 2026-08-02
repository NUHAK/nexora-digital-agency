import { motion } from "motion/react";
import { ArrowUpRight, Send } from "lucide-react";
import Logo from "../Logo/Logo"

// Direct inline SVG icon components to eliminate import bugs
const LinkedinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const TwitterIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

// ----------------------------------------------------------------------
// Data
// ----------------------------------------------------------------------

const FOOTER_NAV = [
  {
    title: "Navigation",
    links: [
      { name: "Services", href: "#services" },
      { name: "Selected Work", href: "#work" },
      { name: "About Us", href: "#about" },
      { name: "Pricing", href: "#pricing" },
      { name: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { name: "Web Design & Dev", href: "#" },
      { name: "Brand Strategy", href: "#" },
      { name: "Digital Marketing", href: "#" },
      { name: "SEO Optimization", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
    ],
  },
];

const SOCIAL_LINKS = [
  { name: "LinkedIn", href: "#", Icon: LinkedinIcon },
  { name: "Twitter", href: "#", Icon: TwitterIcon },
  { name: "Instagram", href: "#", Icon: InstagramIcon },
  { name: "GitHub", href: "#", Icon: GithubIcon },
];

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] },
  }),
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#09090B]  text-white border-t border-white/10">
      {/* Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#D9531E]/20 to-transparent blur-3xl opacity-50"
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-12">
        {/* Top CTA Banner */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={FADE_UP}
          custom={0}
          className="mb-20 flex flex-col items-start justify-between gap-8 border-b border-white/10 pb-16 md:flex-row md:items-end"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D9531E]">
              READY TO SCALE?
            </span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
              Let’s build something <br className="hidden md:block" />
              extraordinary.
            </h2>
          </div>

          <a
            href="#contact"
            className="group flex items-center gap-3 rounded-full bg-[#D9531E] px-8 py-4 text-sm font-bold text-white shadow-[0_10px_20px_rgba(217,83,30,0.3)] transition-all duration-300 hover:bg-[#c44719] active:scale-95"
          >
            <span>Start a Project</span>
            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>
        </motion.div>

        {/* Navigation & Newsletter */}
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-16 lg:grid-cols-12 lg:gap-8">
          {/* Brand Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FADE_UP}
            custom={0.1}
            className="space-y-6 lg:col-span-5"
          >
            <div className="flex items-center gap-2">
             <Logo/>
            </div>

            <p className="max-w-sm text-sm font-medium leading-relaxed text-white/60">
              We create high-converting websites, visual brand identities, and
              performance marketing systems for ambitious digital brands.
            </p>

            {/* Newsletter */}
            <form onSubmit={(e) => e.preventDefault()} className="pt-2">
              <label
                htmlFor="footer-email"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/50"
              >
                Subscribe to Insights
              </label>
              <div className="flex max-w-md items-center gap-2">
                <input
                  type="email"
                  id="footer-email"
                  required
                  placeholder="enter@email.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-[#D9531E] focus:bg-white/10"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D9531E] text-white transition-all hover:bg-[#c44719]"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>

          {/* Quick Links Columns */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FADE_UP}
            custom={0.2}
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7"
          >
            {FOOTER_NAV.map((col) => (
              <div key={col.title} className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">
                  {col.title}
                </h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm font-medium text-white/70 transition-colors duration-200 hover:text-[#D9531E]"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Credits & Social Bar */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_UP}
          custom={0.3}
          className="mt-8 flex flex-col items-center justify-between gap-6 sm:flex-row"
        >
          <p className="text-xs font-medium text-white/40">
            © {new Date().getFullYear()} Agency Inc. All rights reserved.
          </p>

          {/* Render Social Icons */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-300 hover:border-[#D9531E] hover:bg-[#D9531E] hover:text-white"
                aria-label={name}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}