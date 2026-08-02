import HeroButtons from "../Hero/HeroButton"
import HeroStats from "./Stats";

const HeroContent = () => {
  return (
    <div>

      {/* Eyebrow */}

      <div className="flex items-center gap-[10px]">

        <span className="h-[1.5px] w-[22px] bg-[#FF5A1F]" />

        <span
          className="
          font-mono
          text-[12.5px]
          font-semibold
          uppercase
          tracking-[0.14em]
          text-[#C13E0A]
        "
        >
          Digital Marketing & Creative Agency
        </span>

      </div>

      {/* Heading */}

      <h1
        className="
        mt-[22px]
        max-w-[650px]
        font-['Bricolage_Grotesque']
        text-[56px]
        font-extrabold
        leading-[1.06]
        tracking-[-0.02em]
        text-[#191512]
      "
      >
        Grow Your Brand With{" "}

        <span className="bg-gradient-to-r from-[#FF5A1F] to-[#C13E0A] bg-clip-text text-transparent">
          Powerful Digital Solutions
        </span>
      </h1>

      {/* Paragraph */}

      <p
        className="
        mt-6
        max-w-[490px]
        text-[18px]
        leading-[1.65]
        text-[#4B433D]
      "
      >
        Nexora blends data-driven marketing, striking creative,
        and modern technology to help startups, real estate,
        healthcare and e-commerce brands scale with confidence.
      </p>

      <HeroButtons />
      <HeroStats/>

      

    </div>
  );
};

export default HeroContent;