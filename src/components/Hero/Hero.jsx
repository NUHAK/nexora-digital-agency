import { motion } from "framer-motion";
import HeroContent from "./HeroContent";
import RocketCanvas from "./RocketCanvas";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#FBF8F6] pt-[120px] pb-[60px] md:pt-[150px] md:pb-[80px] lg:pt-[170px] lg:pb-[100px]"
    >
      <motion.div
        className="absolute -top-24 -left-24 h-[300px] w-[300px] rounded-full bg-[#FF5A1F]/20 blur-[80px] sm:h-[400px] sm:w-[400px] sm:blur-[100px] lg:-top-40 lg:-left-40 lg:h-[520px] lg:w-[520px] lg:blur-[120px]"
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.85, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-16 -bottom-20 h-[240px] w-[240px] rounded-full bg-[#FF8A3D]/20 blur-[80px] sm:h-[320px] sm:w-[320px] sm:blur-[100px] lg:-right-28 lg:-bottom-32 lg:h-[400px] lg:w-[400px] lg:blur-[120px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="mx-auto grid max-w-[1220px] grid-cols-1 items-center gap-10 px-6 md:px-8 lg:grid-cols-2 lg:gap-10 lg:px-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center lg:text-left"
        >
          <HeroContent />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex h-[320px] w-full items-center justify-center overflow-visible sm:h-[400px] md:h-[480px] lg:h-[600px] lg:justify-end"
        >
          <RocketCanvas />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
