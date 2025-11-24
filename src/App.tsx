import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import Admin from "./pages/Admin";
import { SharedConversation } from "./pages/SharedConversation";
import { RoomList } from "./components/rooms/RoomList";
import { RoomChat } from "./components/rooms/RoomChat";
import { AnalyticsDashboard } from "./components/analytics/AnalyticsDashboard";
import { IntroScreen } from "./components/branding/IntroScreen";
import { AnalyticsTracker } from "./components/analytics/AnalyticsTracker";
import { InstallPrompt } from "./components/pwa/InstallPrompt";

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [hasShownIntro, setHasShownIntro] = useState(false);

  useEffect(() => {
    // Check if intro has been shown this session
    const introShown = sessionStorage.getItem('lucy-intro-shown');
    if (introShown) {
      setShowIntro(false);
      setHasShownIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('lucy-intro-shown', 'true');
    setShowIntro(false);
    setHasShownIntro(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
        <InstallPrompt />
        <div className={hasShownIntro ? 'animate-fade-in' : ''}>
          <BrowserRouter>
            <AnalyticsTracker />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/shared/:token" element={<SharedConversation />} />
              <Route path="/rooms" element={<RoomList />} />
              <Route path="/room/:roomId" element={<RoomChat />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
