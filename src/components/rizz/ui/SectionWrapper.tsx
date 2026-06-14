import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const SectionWrapper = ({
  children,
  className,
  delay = 0,
}: SectionWrapperProps) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 32 }}
      onViewportEnter={() => setRevealed(true)}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};
