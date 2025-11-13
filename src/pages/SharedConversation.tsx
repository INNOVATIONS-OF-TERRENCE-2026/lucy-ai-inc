import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { LucyLogo } from "@/components/branding/LucyLogo";

export const SharedConversation = () => {
  const { token } = useParams<{ token: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [conversation, setConversation] = useState<any>(null);
  const [share, setShare] = useState<any>(null);
  const [password, setPassword] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSharedConversation();
  }, [token]);

  const loadSharedConversation = async () => {
    try {
      const { data: shareData, error: shareError } = await supabase
        .from('shared_conversations')
        .select('*')
        .eq('share_token', token)
        .single();

      if (shareError) throw new Error('Invalid share link');

      if (shareData.expires_at && new Date(shareData.expires_at) < new Date()) {
        throw new Error('This share link has expired');
      }

      setShare(shareData);

      if (shareData.password_hash) {
        setIsLocked(true);
        return;
      }

      await loadConversationData(shareData.conversation_id);

      // Increment view count
      await supabase
        .from('shared_conversations')
        .update({ 
          view_count: shareData.view_count + 1,
          last_accessed_at: new Date().toISOString()
        })
        .eq('id', shareData.id);

    } catch (error: any) {
      setError(error.message);
    }
  };

  const loadConversationData = async (conversationId: string) => {
    const { data: convData } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (convData) setConversation(convData);

    const { data: messagesData } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (messagesData) setMessages(messagesData);
  };

  const verifyPassword = () => {
    if (!share) return;
    
    const hashedInput = btoa(password);
    if (hashedInput === share.password_hash) {
      setIsLocked(false);
      loadConversationData(share.conversation_id);
    } else {
      setError('Incorrect password');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">{error}</p>
        </Card>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold">Password Protected</h1>
            <p className="text-muted-foreground">This conversation requires a password</p>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verifyPassword()}
            />
            <Button onClick={verifyPassword} className="w-full">
              Unlock
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Lucy Branding Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LucyLogo size="sm" showGlow />
            <div>
              <h2 className="font-bold text-lg">Lucy AI</h2>
              <p className="text-xs text-muted-foreground">Shared Conversation</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="p-6 mb-4">
          <h1 className="text-2xl font-bold">{conversation?.title}</h1>
          <p className="text-sm text-muted-foreground">
            Shared conversation • {messages.length} messages
          </p>
        </Card>

        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>

        {/* Lucy Branding Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
            <LucyLogo size="sm" showGlow={false} />
            <div className="text-sm">
              <p className="font-medium">Powered by Lucy AI</p>
              <p className="text-xs text-muted-foreground">Beyond Intelligence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
