import { cn } from "@/lib/utils";

interface GradientOrbProps {
  color: "orange" | "blue";
  className?: string;
  size?: string;
  opacity?: number;
}

export const GradientOrb = ({ color, className, size = "600px", opacity = 0.15 }: GradientOrbProps) => {
  const colorMap = {
    orange: "rgba(255,106,0,1)",
    blue: "rgba(24,123,255,1)",
  };

  return (
    <div
      aria-hidden="true"
      className={cn("absolute rounded-full pointer-events-none", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${colorMap[color]} 0%, transparent 70%)`,
        opacity,
        filter: "blur(80px)",
      }}
    />
  );
};
