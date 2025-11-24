import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, BellOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: 'Not Supported',
        description: 'Push notifications are not supported in this browser',
        variant: 'destructive'
      });
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast({
          title: 'Notifications Enabled',
          description: 'You\'ll receive notifications for new messages and updates'
        });

        // Show a test notification
        new Notification('Lucy AI', {
          body: 'Notifications are now enabled!',
          icon: '/icon-512.png',
          badge: '/favicon.png'
        });
      }
    } catch (error) {
      console.error('Notification permission error:', error);
      toast({
        title: 'Error',
        description: 'Failed to enable notifications',
        variant: 'destructive'
      });
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Card className="p-5 border-2 border-border/50 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-[12px] ${permission === 'granted' ? 'bg-gradient-button' : 'bg-muted'}`}>
            {permission === 'granted' ? (
              <Bell className="w-5 h-5 text-white" />
            ) : (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-base">Push Notifications</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {permission === 'granted' 
                ? '✓ Enabled - You\'ll receive notifications' 
                : 'Get notified about new messages and updates'}
            </p>
          </div>
        </div>
        
        {permission !== 'granted' && (
          <Button onClick={requestPermission} variant="gradient" size="sm">
            Enable
          </Button>
        )}
        
        {permission === 'granted' && (
          <Button variant="outline" disabled size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Active
          </Button>
        )}
      </div>
    </Card>
  );
};
