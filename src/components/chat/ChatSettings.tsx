import { Settings2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ReadingMode } from '@/hooks/useReadingMode';
import { StreamingSpeed } from '@/hooks/useStreamingSpeed';

interface ChatSettingsProps {
  readingMode: ReadingMode;
  setReadingMode: (mode: ReadingMode) => void;
  streamingSpeed: StreamingSpeed;
  setStreamingSpeed: (speed: StreamingSpeed) => void;
}

export function ChatSettings({
  readingMode,
  setReadingMode,
  streamingSpeed,
  setStreamingSpeed,
}: ChatSettingsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="glass-card border-primary/30 hover:shadow-glow-violet transition-all"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 glass-card-enhanced border-primary/40" align="end">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" />
              Reading Mode
            </h3>
            <RadioGroup value={readingMode} onValueChange={(value) => setReadingMode(value as ReadingMode)}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                  <RadioGroupItem value="compact" id="compact" />
                  <Label htmlFor="compact" className="cursor-pointer flex-1">
                    <div className="font-medium">Compact</div>
                    <div className="text-xs text-muted-foreground">Tight spacing, more content</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                  <RadioGroupItem value="comfortable" id="comfortable" />
                  <Label htmlFor="comfortable" className="cursor-pointer flex-1">
                    <div className="font-medium">Comfortable</div>
                    <div className="text-xs text-muted-foreground">Balanced spacing (default)</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                  <RadioGroupItem value="expanded" id="expanded" />
                  <Label htmlFor="expanded" className="cursor-pointer flex-1">
                    <div className="font-medium">Expanded</div>
                    <div className="text-xs text-muted-foreground">Large spacing, easy reading</div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="border-t border-border/50 pt-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Streaming Speed
            </h3>
            <RadioGroup value={streamingSpeed} onValueChange={(value) => setStreamingSpeed(value as StreamingSpeed)}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                  <RadioGroupItem value="slow" id="slow" />
                  <Label htmlFor="slow" className="cursor-pointer flex-1">
                    <div className="font-medium">Slow</div>
                    <div className="text-xs text-muted-foreground">Cinematic typing effect</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="cursor-pointer flex-1">
                    <div className="font-medium">Medium</div>
                    <div className="text-xs text-muted-foreground">Balanced speed (default)</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                  <RadioGroupItem value="fast" id="fast" />
                  <Label htmlFor="fast" className="cursor-pointer flex-1">
                    <div className="font-medium">Fast</div>
                    <div className="text-xs text-muted-foreground">Quick responses</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                  <RadioGroupItem value="instant" id="instant" />
                  <Label htmlFor="instant" className="cursor-pointer flex-1">
                    <div className="font-medium">Instant</div>
                    <div className="text-xs text-muted-foreground">No animation</div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
