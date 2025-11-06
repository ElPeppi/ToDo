import { motion } from "framer-motion";
import React from "react";

const slide = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: "0%", opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      transition={slide.transition}
      variants={slide}
      style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      {children}
    </motion.div>
  );
}
