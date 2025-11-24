import { Moon } from 'lucide-react';
import { HolographicCard } from '../ui/HolographicCard';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { useCalmMode } from '@/hooks/useCalmMode';

export const CalmModeToggle = () => {
  const { calmMode, toggleCalmMode } = useCalmMode();

  return (
    <HolographicCard className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Moon className="w-5 h-5 text-primary" />
          <div>
            <Label htmlFor="calm-mode" className="text-base font-semibold cursor-pointer">
              Calm Mode
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Reduce motion, soften animations, and create a more peaceful experience
            </p>
          </div>
        </div>
        <Switch
          id="calm-mode"
          checked={calmMode}
          onCheckedChange={toggleCalmMode}
        />
      </div>
    </HolographicCard>
  );
};
