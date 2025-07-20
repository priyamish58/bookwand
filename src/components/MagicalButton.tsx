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
      magical: "btn-magical hover:transform hover:scale-105",
      scroll: "bg-magical-scroll-bg border-2 border-magical-scroll-border text-foreground hover:bg-accent hover:text-accent-foreground",
      outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
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