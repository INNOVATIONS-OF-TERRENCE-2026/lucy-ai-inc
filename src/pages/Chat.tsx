import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { useToast } from "@/hooks/use-toast";
import { UltraRealisticBackgroundManager } from "@/components/background/UltraRealisticBackgroundManager";
import { VideoControls } from "@/components/background/VideoControls";
import { PerformanceMonitor } from "@/components/background/PerformanceMonitor";
import { ScenePlaylistManager } from "@/components/background/ScenePlaylistManager";
import { BackgroundSettingsDialog } from "@/components/background/BackgroundSettingsDialog";
import { LoadingScreen } from "@/components/branding/LoadingScreen";

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  
  // Background video state
  const [videoTheme, setVideoTheme] = useState('nature');
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.4);
  const [performanceQuality, setPerformanceQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');
  const [parallaxIntensity, setParallaxIntensity] = useState(0.5);
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);

  const handleAudioEnabledChange = (enabled: boolean) => {
    setAudioEnabled(enabled);
    localStorage.setItem('lucy-audio-enabled', String(enabled));
  };

  const handleAudioVolumeChange = (volume: number) => {
    setAudioVolume(volume);
    localStorage.setItem('lucy-audio-volume', String(volume));
  };

  const handleEffectsEnabledChange = (enabled: boolean) => {
    setEffectsEnabled(enabled);
    localStorage.setItem('lucy-effects-enabled', String(enabled));
  };

  const handleParallaxIntensityChange = (intensity: number) => {
    setParallaxIntensity(intensity);
    localStorage.setItem('lucy-parallax-intensity', String(intensity));
  };

  // Load preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('lucy-bg-theme');
    const savedMuted = localStorage.getItem('lucy-bg-muted');
    const savedAudio = localStorage.getItem('lucy-audio-enabled');
    const savedVolume = localStorage.getItem('lucy-audio-volume');
    const savedEffects = localStorage.getItem('lucy-effects-enabled');
    const savedParallax = localStorage.getItem('lucy-parallax-intensity');
    if (savedTheme) setVideoTheme(savedTheme);
    if (savedMuted) setIsVideoMuted(savedMuted === 'true');
    if (savedAudio) setAudioEnabled(savedAudio === 'true');
    if (savedVolume) setAudioVolume(parseFloat(savedVolume));
    if (savedEffects) setEffectsEnabled(savedEffects === 'true');
    if (savedParallax) setParallaxIntensity(parseFloat(savedParallax));
  }, []);

  const handleThemeChange = (theme: string) => {
    setVideoTheme(theme);
    localStorage.setItem('lucy-bg-theme', theme);
  };

  const toggleVideoPause = () => {
    setIsVideoPaused(!isVideoPaused);
  };

  const toggleVideoMute = () => {
    const newMuted = !isVideoMuted;
    setIsVideoMuted(newMuted);
    localStorage.setItem('lucy-bg-muted', String(newMuted));
  };

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return <LoadingScreen message="Loading Lucy AI..." />;
  }

  return (
    <>
      <UltraRealisticBackgroundManager
        theme={videoTheme}
        isPaused={isVideoPaused}
        isMuted={isVideoMuted}
        audioEnabled={audioEnabled}
        audioVolume={audioVolume}
        performanceQuality={performanceQuality}
        parallaxIntensity={parallaxIntensity}
        effectsEnabled={effectsEnabled}
      />
      <PerformanceMonitor onQualityChange={setPerformanceQuality} />
      <SidebarProvider>
        <div className="min-h-screen flex w-full relative">
          <ChatSidebar 
            userId={user?.id}
            currentConversationId={currentConversationId}
            onConversationSelect={setCurrentConversationId}
            videoControls={
              <div className="flex gap-2">
                <VideoControls
                  isPaused={isVideoPaused}
                  isMuted={isVideoMuted}
                  currentTheme={videoTheme}
                  onTogglePause={toggleVideoPause}
                  onToggleMute={toggleVideoMute}
                  onChangeTheme={handleThemeChange}
                />
                <BackgroundSettingsDialog
                  audioEnabled={audioEnabled}
                  audioVolume={audioVolume}
                  effectsEnabled={effectsEnabled}
                  parallaxIntensity={parallaxIntensity}
                  onAudioEnabledChange={handleAudioEnabledChange}
                  onAudioVolumeChange={handleAudioVolumeChange}
                  onEffectsEnabledChange={handleEffectsEnabledChange}
                  onParallaxIntensityChange={handleParallaxIntensityChange}
                />
                {user && (
                  <ScenePlaylistManager
                    userId={user.id}
                    onSelectPlaylist={setActivePlaylistId}
                  />
                )}
              </div>
            }
          />
          <ChatInterface 
            userId={user?.id}
            conversationId={currentConversationId}
            onConversationCreated={setCurrentConversationId}
          />
        </div>
      </SidebarProvider>
    </>
  );
};

export default Chat;
