import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CalmModeToggle } from "@/components/settings/CalmModeToggle";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Preferences {
  personality: string;
  tone: string;
  verbosity: string;
  language_style: string;
}

const personalityPresets = {
  professional: "Professional and formal tone, focusing on clarity and precision.",
  casual: "Friendly and conversational, like chatting with a knowledgeable friend.",
  technical: "Detailed technical explanations with jargon and deep insights.",
  creative: "Imaginative and expressive, with rich descriptions and storytelling.",
  concise: "Brief and to-the-point responses, minimal elaboration.",
  balanced: "Warm, articulate, and adaptable—Lucy's default personality.",
};

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [preferences, setPreferences] = useState<Preferences>({
    personality: 'balanced',
    tone: 'warm',
    verbosity: 'moderate',
    language_style: 'clear',
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadPreferences();
    }
  }, [open]);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data?.preferences) {
        setPreferences(data.preferences as unknown as Preferences);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({ preferences: preferences as any })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your personality preferences have been updated.",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Failed to save",
        description: "Could not save your preferences.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Lucy AI Personality Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <CalmModeToggle />
          
          <div className="space-y-3">
            <Label>Personality Preset</Label>
            <Select
              value={preferences.personality}
              onValueChange={(value) => setPreferences({ ...preferences, personality: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(personalityPresets).map(([key, description]) => (
                  <SelectItem key={key} value={key}>
                    <div>
                      <div className="font-medium capitalize">{key}</div>
                      <div className="text-xs text-muted-foreground">{description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Response Length</Label>
            <Select
              value={preferences.verbosity}
              onValueChange={(value) => setPreferences({ ...preferences, verbosity: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brief">Brief - Quick, concise answers</SelectItem>
                <SelectItem value="moderate">Moderate - Balanced detail</SelectItem>
                <SelectItem value="detailed">Detailed - Comprehensive explanations</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Language Style</Label>
            <Select
              value={preferences.language_style}
              onValueChange={(value) => setPreferences({ ...preferences, language_style: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple - Easy to understand</SelectItem>
                <SelectItem value="clear">Clear - Straightforward language</SelectItem>
                <SelectItem value="technical">Technical - Industry jargon welcome</SelectItem>
                <SelectItem value="academic">Academic - Formal and precise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} disabled={isSaving} className="flex-1">
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}