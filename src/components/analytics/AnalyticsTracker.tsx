import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const sessionId = sessionStorage.getItem('analytics-session') || 
          Math.random().toString(36).substring(7);
        
        if (!sessionStorage.getItem('analytics-session')) {
          sessionStorage.setItem('analytics-session', sessionId);
        }

        // Get device and browser info
        const userAgent = navigator.userAgent;
        let deviceType = 'desktop';
        if (/mobile/i.test(userAgent)) deviceType = 'mobile';
        else if (/tablet/i.test(userAgent)) deviceType = 'tablet';

        let browser = 'unknown';
        if (userAgent.includes('Chrome')) browser = 'chrome';
        else if (userAgent.includes('Safari')) browser = 'safari';
        else if (userAgent.includes('Firefox')) browser = 'firefox';
        else if (userAgent.includes('Edge')) browser = 'edge';

        await supabase.from('page_analytics').insert({
          page_path: location.pathname,
          referrer: document.referrer || null,
          device_type: deviceType,
          browser: browser,
          user_agent: userAgent,
          session_id: sessionId
        });
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    trackPageView();
  }, [location]);

  return null;
};
