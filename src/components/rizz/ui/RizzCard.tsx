import { cn } from "@/lib/utils";

interface RizzCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const RizzCard = ({ children, className, hover = true }: RizzCardProps) => (
  <div
    className={cn(
      "rizz-card transition-all duration-300",
      hover && "hover:-translate-y-1 hover:border-[rgba(24,123,255,0.35)]",
      className
    )}
  >
    {children}
  </div>
);
