import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface MagicalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "magical" | "parchment" | "scroll";
  glowing?: boolean;
  children: React.ReactNode;
}

const MagicalCard = forwardRef<HTMLDivElement, MagicalCardProps>(
  ({ className, variant = "magical", glowing = false, children, ...props }, ref) => {
    const variants = {
      magical: "magical-scroll",
      parchment: "parchment",
      scroll: "bg-card border border-border"
    };

    const glowClass = glowing ? "animate-magical-pulse" : "";

    return (
      <Card
        ref={ref}
        className={cn(
          variants[variant],
          glowClass,
          className
        )}
        {...props}
      >
        {children}
        {variant === "magical" && (
          <div className="magical-particles" />
        )}
      </Card>
    );
  }
);

MagicalCard.displayName = "MagicalCard";

export { MagicalCard };