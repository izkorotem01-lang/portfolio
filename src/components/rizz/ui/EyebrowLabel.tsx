import { cn } from "@/lib/utils";

interface EyebrowLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const EyebrowLabel = ({ children, className }: EyebrowLabelProps) => (
  <span className={cn("rizz-eyebrow", className)}>{children}</span>
);
