import { cn } from "@/lib/utils";

type RizzButtonProps = React.ComponentPropsWithoutRef<"a"> & {
  variant?: "primary" | "outline";
};

export const RizzButton = ({
  variant = "primary",
  className,
  children,
  ...props
}: RizzButtonProps) => (
  <a
    className={cn(
      "rizz-shine-btn inline-flex items-center gap-3 font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-lg",
      variant === "primary" && "rizz-shine-btn--primary bg-[#FF6A00] text-white",
      variant === "outline" &&
        "rizz-shine-btn--outline bg-black/40 text-white border border-white/40",
      className
    )}
    {...props}
  >
    <span className="relative z-[2] inline-flex items-center gap-3">{children}</span>
  </a>
);
