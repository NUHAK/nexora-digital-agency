import { motion } from "framer-motion";

const Reveal = ({
  children,
  delay = 0,
  y = 50,
  duration = 0.8,
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: y,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // same easing as your CSS
      }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;