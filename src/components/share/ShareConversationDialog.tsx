import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Copy, Share2, Lock } from 'lucide-react';

interface ShareConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
}

export const ShareConversationDialog = ({ open, onOpenChange, conversationId }: ShareConversationDialogProps) => {
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [expiresIn, setExpiresIn] = useState('7');
  const [shareLink, setShareLink] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createShareLink = async () => {
    setIsCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const expiresAt = expiresIn === 'never' 
        ? null 
        : new Date(Date.now() + parseInt(expiresIn) * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase.functions.invoke('share-conversation', {
        body: {
          conversationId,
          password: usePassword ? password : null,
          expiresAt
        }
      });

      if (error) throw error;

      const link = `${window.location.origin}/shared/${data.shareToken}`;
      setShareLink(link);
      
      toast({
        title: 'Share link created!',
        description: 'Your conversation is now ready to share'
      });
    } catch (error) {
      console.error('Error creating share link:', error);
      toast({
        title: 'Failed to create share link',
        description: 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: 'Link copied!',
      description: 'Share link copied to clipboard'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Conversation
          </DialogTitle>
          <DialogDescription>
            Create a shareable link for this conversation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!shareLink ? (
            <>
              <div className="space-y-2">
                <Label>Expires In</Label>
                <select 
                  value={expiresIn}
                  onChange={(e) => setExpiresIn(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                >
                  <option value="1">1 day</option>
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="never">Never</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="password-protect" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password Protection
                </Label>
                <Switch
                  id="password-protect"
                  checked={usePassword}
                  onCheckedChange={setUsePassword}
                />
              </div>

              {usePassword && (
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
              )}

              <Button 
                onClick={createShareLink}
                disabled={isCreating || (usePassword && !password)}
                className="w-full"
              >
                {isCreating ? 'Creating...' : 'Create Share Link'}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Share Link</Label>
                <div className="flex gap-2">
                  <Input 
                    value={shareLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button onClick={copyLink} size="icon" variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                {usePassword && '🔒 Password protected • '}
                {expiresIn === 'never' ? 'Never expires' : `Expires in ${expiresIn} days`}
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
