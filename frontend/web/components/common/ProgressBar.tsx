import { motion } from "motion/react";

export default function ProgressBar({
  step,
  totalSteps,
}: {
  step: number;
  totalSteps: number;
}) {
  const progress = (step / totalSteps) * 100;

  return (
    <motion.div
      className="h-1 bg-blue-500 rounded-full"
      initial={{ width: "0%" }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
  );
}
