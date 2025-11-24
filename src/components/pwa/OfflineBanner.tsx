import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 animate-fade-in">
      <Alert variant="destructive" className="bg-destructive/90 backdrop-blur-lg border-destructive">
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span className="font-medium">You're offline. Messages will be queued.</span>
        </AlertDescription>
      </Alert>
    </div>
  );
};
