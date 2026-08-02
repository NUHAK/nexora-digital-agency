import { HiArrowRight } from "react-icons/hi2";

const HeroButtons = () => {
    return (
        <div className="mt-[38px] flex flex-wrap gap-4">

            <button
                className="
        flex items-center
        gap-3
        rounded-full
        bg-gradient-to-br
        from-[#FF5A1F]
        to-[#C13E0A]
        px-[30px]
        py-4
        text-[14.5px]
        font-semibold
        text-white
        shadow-[0_18px_34px_-14px_rgba(255,90,31,.28)]
        duration-300
        hover:-translate-y-1
      "
            >
                Get Free Consultation

                <HiArrowRight className="text-lg" />

            </button>

            <button
                className="
        rounded-full
        border
        border-[#EFE6DD]
        bg-white
        px-[30px]
        py-4
        text-[14.5px]
        font-semibold
        text-[#191512]
        duration-300
        hover:border-[#FF5A1F]
      "
            >
                View Our Work
            </button>

        </div>
    );
};

export default HeroButtons;