import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MagicalProgressProps {
  value: number;
  className?: string;
  showWand?: boolean;
  label?: string;
}

export function MagicalProgress({ value, className, showWand = true, label }: MagicalProgressProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="text-primary font-magical">{Math.round(value)}%</span>
        </div>
      )}
      
      <div className="relative">
        <Progress 
          value={value} 
          className="h-2 bg-muted border border-border overflow-hidden"
        />
        
        {showWand && (
          <div 
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
            style={{ left: `${Math.max(0, Math.min(95, value))}%` }}
          >
            <div className="relative">
              <Sparkles className="w-4 h-4 text-primary animate-gentle-bounce drop-shadow-glow" />
              <div className="absolute inset-0 w-4 h-4 bg-primary/30 rounded-full animate-ping" />
            </div>
          </div>
        )}
        
        {/* Magical trail effect */}
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}