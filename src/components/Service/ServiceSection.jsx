
import React from "react";
import { motion } from "framer-motion";
import {
    HiOutlineMegaphone,
    HiOutlineSparkles,
    HiOutlineCodeBracketSquare,
    HiArrowUpRight,
} from "react-icons/hi2";

const SERVICES = [
    {
        index: "01",
        title: "Digital Marketing",
        blurb: "Data-backed campaigns that put your brand in front of the right audience, every time.",
        icon: HiOutlineMegaphone,
        items: ["Social Media Management", "Meta Ads", "Google Ads", "SEO"],
    },
    {
        index: "02",
        title: "Creative Services",
        blurb: "Design and storytelling that make your brand impossible to scroll past.",
        icon: HiOutlineSparkles,
        items: ["Branding & Design", "Graphic Design", "Video Production", "Motion Graphics"],
    },
    {
        index: "03",
        title: "Technology",
        blurb: "Fast, modern builds engineered to turn attention into conversions.",
        icon: HiOutlineCodeBracketSquare,
        items: ["Website Development", "Mobile App Development", "UI/UX Design"],
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
};

const listVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.07, delayChildren: 0.25 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -14 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function ServiceCard({ service }) {
    const Icon = service.icon;
    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -10 }}
            className="group relative overflow-hidden rounded-[28px] border border-[#EFE6DD] bg-white p-9 shadow-[0_2px_20px_-8px_rgba(33,23,18,0.08)] transition-shadow duration-500 hover:shadow-[0_30px_60px_-24px_rgba(193,62,10,0.28)]"
        >
            {/* ghost index number */}
            <span className=" pointer-events-none absolute -right-2 -top-4 text-[92px] font-black leading-none text-[#211712] opacity-[0.04] transition-opacity duration-500 group-hover:opacity-[0.07]">
                {service.index}
            </span>

            {/* icon badge */}
            <div className="relative mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFEDE2] transition-all duration-500 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#FF5A1F] group-hover:to-[#C13E0A]">
                <Icon className="h-7 w-7 text-[#C13E0A] transition-colors duration-500 group-hover:text-white" />
            </div>

            <h3 className=" relative mb-3 text-[22px] font-bold leading-snug text-[#211712]">
                {service.title}
            </h3>
            <p className="font-body relative mb-7 text-[15px] leading-relaxed text-[#5b5048]">
                {service.blurb}
            </p>

            {/* sub-service list */}
            <motion.ul
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                className="relative flex flex-col"
            >
                {service.items.map((item) => (
                    <motion.li
                        key={item}
                        variants={itemVariants}
                        className="group/item flex items-center justify-between border-t border-[#F1E9E1] py-3.5 first:border-t-0"
                    >
                        <span className="font-body flex items-center gap-3 text-[14.5px] text-[#3a322c]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A1F]" />
                            {item}
                        </span>
                        <HiArrowUpRight className="h-4 w-4 -translate-x-1 text-[#C13E0A] opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                    </motion.li>
                ))}
            </motion.ul>
        </motion.div>
    );
}

export default function ServicesSection() {
    return (
        <section className="relative overflow-hidden bg-[#FFF9F5] px-6 py-32">
          

            {/* ambient background orbs, consistent with the About section */}
            <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-[#FFD9BE] opacity-40 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#FFE3D0] opacity-50 blur-3xl" />

            {/* ================= HEADER ================= */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 mx-auto mb-20 max-w-2xl text-center"
            >
                <div className=" mb-6 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[#C13E0A]">
                    <span className="h-0.5 w-7 bg-[#C13E0A]" />
                    What We Do
                    <span className="h-0.5 w-7 bg-[#C13E0A]" />
                </div>
                <h2 className=" text-4xl font-extrabold leading-tight text-[#211712] md:text-5xl">
                    Services Built To{" "}
                    <span className="bg-gradient-to-r from-[#FF5A1F] to-[#C13E0A] bg-clip-text text-transparent">
                        Move The Needle
                    </span>
                </h2>
                <p className="font-body mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-[#5b5048]">
                    Three disciplines, one team — strategy, creative, and technology
                    working together instead of in silos.
                </p>
            </motion.div>

            {/* ================= CARDS ================= */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="relative z-10 mx-auto grid max-w-6xl gap-7 md:grid-cols-3"
            >
                {SERVICES.map((service) => (
                    <ServiceCard key={service.title} service={service} />
                ))}
            </motion.div>

            {/* ================= CTA ================= */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative z-10 mt-16 flex justify-center"
            >
                <button className="group flex items-center gap-2 rounded-full bg-gradient-to-br from-[#FF5A1F] to-[#C13E0A] px-8 py-4 text-sm font-semibold text-white shadow-[0_18px_34px_-14px_rgba(255,90,31,.4)] transition-all duration-300 hover:-translate-y-1">
                    Explore All Services
                    <HiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
            </motion.div>
        </section>
    );
}
