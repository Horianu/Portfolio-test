"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function TransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ x: 40, opacity: 0 }}    // always start from right
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -40, opacity: 0 }}     // optional: slide out to left
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}
