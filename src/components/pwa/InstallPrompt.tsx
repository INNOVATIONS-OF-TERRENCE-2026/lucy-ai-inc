import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Don't show if already dismissed
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <Card className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 shadow-2xl border-2 border-primary/20 animate-fade-in">
      <div className="p-5 bg-gradient-glow">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 bg-gradient-button p-3 rounded-[12px]">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1.5 bg-gradient-button bg-clip-text text-transparent">Install Lucy AI</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Get the full app experience with offline support, faster performance, and quick access from your home screen.
            </p>
            <div className="flex gap-3">
              <Button onClick={handleInstall} variant="gradient" className="flex-1" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Install Now
              </Button>
              <Button variant="ghost" onClick={handleDismiss} size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
