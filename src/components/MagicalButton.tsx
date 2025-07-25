import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface MagicalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "magical" | "scroll" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const MagicalButton = forwardRef<HTMLButtonElement, MagicalButtonProps>(
  ({ className, variant = "magical", size = "md", children, ...props }, ref) => {
    const baseClasses = "relative overflow-hidden font-semibold transition-all duration-300 ease-out";
    
    const variants = {
      magical: "bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 font-semibold rounded-lg border-2 border-amber-300 hover:from-amber-300 hover:to-yellow-400 hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300",
      scroll: "bg-magical-scroll-bg border-2 border-magical-scroll-border text-foreground magical-glow-hover",
      outline: "border-2 border-primary text-primary magical-glow-hover"
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };

    return (
      <Button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
        {variant === "magical" && (
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="magical-particles" />
          </div>
        )}
      </Button>
    );
  }
);

MagicalButton.displayName = "MagicalButton";

export { MagicalButton };