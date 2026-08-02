import { useState, useEffect } from "react";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { navLinks } from "../../data/navLink";
import Logo from "../Logo/Logo";

function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        function handleScroll() {
            setScrolled(window.scrollY > 20);
        }

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav className="fixed top-0 left-0 z-50 flex w-full justify-center px-4 transition-all duration-500 ease-out">
            <div
                className={`flex w-full items-center justify-between transition-all duration-500 ease-out ${
                    scrolled
                        ? "mt-4 max-w-5xl rounded-full border border-white/60 bg-white/70 px-6 py-3 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl"
                        : "mt-0 max-w-7xl rounded-none border border-transparent bg-transparent px-6 py-5"
                }`}
            >
                <Logo />

                {/* Desktop Menu */}
                <ul className="hidden items-center gap-10 lg:flex">
                    {navLinks.map((item) => (
                        <li key={item.name}>
                            <a
                                href={item.href}
                                className="text-[14.5px] font-medium text-[#4B433D] transition-all duration-300 hover:text-[#C13E0A]"
                            >
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <button
                    className={`hidden items-center gap-2 rounded-full font-semibold text-white shadow-[0_18px_34px_-14px_rgba(255,90,31,.28)] duration-300 hover:-translate-y-1 lg:flex bg-gradient-to-br from-[#FF5A1F] to-[#C13E0A] ${
                        scrolled ? "px-5 py-2.5 text-[13.5px]" : "px-6 py-3 text-sm"
                    }`}
                >
                    Get Free Consultation
                </button>

                {/* Mobile Icon */}
                <button
                    onClick={() => setOpen(!open)}
                    className="text-3xl text-[#4B433D] lg:hidden"
                >
                    {open ? <HiX /> : <HiOutlineMenuAlt3 />}
                </button>

                {/* Mobile Menu */}
                {open && (
                    <div
                        className={`absolute left-0 right-0 top-full mt-3 lg:hidden ${
                            scrolled ? "px-0" : "px-4"
                        }`}
                    >
                        <div className="mx-auto max-w-5xl rounded-3xl border border-white/60 bg-white/90 shadow-xl backdrop-blur-xl">
                            <ul className="flex flex-col gap-5 p-6">
                                {navLinks.map((item) => (
                                    <li key={item.name}>
                                        <a
                                            href={item.href}
                                            onClick={() => setOpen(false)}
                                            className="text-[15px] font-medium text-[#4B433D] transition-colors duration-300 hover:text-[#C13E0A]"
                                        >
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                                <li>
                                    <button className="mt-2 w-full rounded-full bg-gradient-to-br from-[#FF5A1F] to-[#C13E0A] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_34px_-14px_rgba(255,90,31,.28)]">
                                        Get Free Consultation
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
