import { useState, useEffect } from "react";
import { MagicalCard } from "./MagicalCard";

interface BreathingAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export function BreathingAnimation({ isVisible, onComplete }: BreathingAnimationProps) {
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [timer, setTimer] = useState(4);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setPhase((currentPhase) => {
            const nextPhase = currentPhase === 'inhale' ? 'exhale' : 'inhale';
            if (nextPhase === 'inhale') {
              // Completed full cycle, call onComplete after this cycle
              setTimeout(() => onComplete?.(), 8000); // After exhale completes
            }
            return nextPhase;
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <MagicalCard variant="magical" className="p-8 text-center max-w-sm">
        <div className="space-y-6">
          <h3 className="text-xl font-magical text-foreground mb-4">
            Breathing Break
          </h3>
          
          <div className="relative flex items-center justify-center">
            <div 
              className={`w-24 h-24 rounded-full bg-primary/20 border-2 border-primary transition-all duration-1000 ease-in-out flex items-center justify-center ${
                phase === 'inhale' ? 'scale-125' : 'scale-100'
              }`}
              style={{
                boxShadow: phase === 'inhale' 
                  ? '0 0 30px hsl(var(--primary) / 0.5)' 
                  : '0 0 15px hsl(var(--primary) / 0.3)'
              }}
            >
              <div className="text-primary text-sm font-medium">
                {timer}s
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-lg font-medium text-foreground capitalize">
              {phase}
            </div>
            <div className="text-sm text-muted-foreground">
              {phase === 'inhale' ? 'Breathe in slowly...' : 'Breathe out gently...'}
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Reading will resume automatically
          </div>
        </div>
      </MagicalCard>
    </div>
  );
}