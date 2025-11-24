import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCalmMode = () => {
  const [calmMode, setCalmMode] = useState(() => {
    const stored = localStorage.getItem('calm-mode');
    return stored === 'true';
  });

  useEffect(() => {
    // Load from DB if user is authenticated
    const loadCalmMode = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', user.id)
          .single();

        if (profile?.preferences && typeof profile.preferences === 'object' && 'calmMode' in profile.preferences) {
          const prefs = profile.preferences as { calmMode?: boolean };
          if (prefs.calmMode !== undefined) {
            setCalmMode(prefs.calmMode);
            localStorage.setItem('calm-mode', prefs.calmMode.toString());
          }
        }
      }
    };

    loadCalmMode();
  }, []);

  const toggleCalmMode = useCallback(async () => {
    const newMode = !calmMode;
    setCalmMode(newMode);
    localStorage.setItem('calm-mode', newMode.toString());

    // Save to DB if authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single();

      const currentPrefs = (profile?.preferences && typeof profile.preferences === 'object') 
        ? profile.preferences as Record<string, any>
        : {};

      await supabase
        .from('profiles')
        .update({
          preferences: {
            ...currentPrefs,
            calmMode: newMode
          }
        })
        .eq('id', user.id);
    }
  }, [calmMode]);

  return { calmMode, toggleCalmMode };
};
