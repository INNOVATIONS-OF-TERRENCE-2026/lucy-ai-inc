import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Search, Download, Upload, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "./ChatMessage";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FileUploadZone } from "./FileUploadZone";
import { ExportDialog } from "./ExportDialog";
import { SearchModal } from "./SearchModal";
import { ModelSelector } from "./ModelSelector";
import { LucyLogo } from "@/components/branding/LucyLogo";
import { ToolResultDisplay } from "./ToolResultDisplay";
import { ProactiveSuggestions } from "./ProactiveSuggestions";
import { ContextIndicator } from "./ContextIndicator";
import { MemoryPanel } from "./MemoryPanel";
import { SmartSceneSuggestion } from "./SmartSceneSuggestion";
import { ChatSettings } from "./ChatSettings";
import { ReadingProgressBar } from "./ReadingProgressBar";
import { TimestampDivider } from "./TimestampDivider";
import { useSmartSceneSuggestion } from "@/hooks/useSmartSceneSuggestion";
import { useMemoryManager } from "@/hooks/useMemoryManager";
import { useContextAnalyzer } from "@/hooks/useContextAnalyzer";
import { useReadingMode } from "@/hooks/useReadingMode";
import { useStreamingSpeed } from "@/hooks/useStreamingSpeed";

interface ChatInterfaceProps {
  userId: string;
  conversationId: string | null;
  onConversationCreated: (id: string) => void;
}

export function ChatInterface({ userId, conversationId, onConversationCreated }: ChatInterfaceProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedAttachments, setUploadedAttachments] = useState<any[]>([]);
  const [showExport, setShowExport] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [conversationTitle, setConversationTitle] = useState("New Conversation");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [fusionEnabled, setFusionEnabled] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [toolResults, setToolResults] = useState<any>(null);
  
  const { suggestedScene } = useSmartSceneSuggestion(conversationId);
  const { memories, storeMemory } = useMemoryManager(userId);
  const { analyzeContext } = useContextAnalyzer(conversationId);
  const { readingMode, setReadingMode, getSpacingClass } = useReadingMode();
  const { speed, setSpeed, getDelay } = useStreamingSpeed();

  useEffect(() => {
    if (conversationId) {
      loadMessages();
      loadConversationDetails();

      // Set up realtime subscription for messages
      const channel = supabase
        .channel(`messages-${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setMessages([]);
      setConversationTitle("New Conversation");
    }
  }, [conversationId]);

  const loadConversationDetails = async () => {
    if (!conversationId) return;
    const { data } = await supabase
      .from('conversations')
      .select('title')
      .eq('id', conversationId)
      .single();
    if (data) setConversationTitle(data.title);
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingMessage]);

  const loadMessages = async () => {
    if (!conversationId) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data);
    }
  };

  const createConversation = async (firstMessage: string) => {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        title: firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : ''),
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  };

  const saveMessage = async (convId: string, role: string, content: string) => {
    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: convId,
        role,
        content,
      });

    if (error) throw error;
  };

  const uploadFiles = async (convId: string, msgId: string) => {
    if (selectedFiles.length === 0) return [];

    const attachments = [];
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', convId);
      formData.append('messageId', msgId);

      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-attachment`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        attachments.push(data.attachment);
      }
    }

    setSelectedFiles([]);
    setUploadedAttachments(attachments);
    return attachments;
  };

  const analyzeMultimodal = async (attachmentIds: string[]) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/multimodal-analysis`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ attachmentIds }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429 || response.status === 402) {
          toast({
            title: "Analysis temporarily unavailable",
            description: errorData.error,
            variant: "destructive",
          });
        }
        return null;
      }

      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('Multimodal analysis error:', error);
      return null;
    }
  };

  const processStreamingResponse = async (response: Response, convId: string) => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";
    let receivedToolResults = false;

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              
              // Check for tool results in metadata
              if (parsed.toolResults && !receivedToolResults) {
                setToolResults(parsed.toolResults);
                receivedToolResults = true;
              }
              
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullResponse += content;
                setStreamingMessage(fullResponse);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    }

    // Save assistant message
    if (fullResponse) {
      await saveMessage(convId, 'assistant', fullResponse);
      setStreamingMessage("");
      await loadMessages();
      
      // Analyze context after conversation
      setTimeout(() => {
        const allMessages = [...messages, { role: 'user', content: input }, { role: 'assistant', content: fullResponse }];
        analyzeContext(allMessages.map(m => ({ role: m.role, content: m.content })));
      }, 1000);
      
      // Auto-store important memories
      if (fullResponse.length > 100 && (fullResponse.includes('remember') || fullResponse.includes('important'))) {
        storeMemory(fullResponse.slice(0, 200), 'conversation', 0.7);
      }
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && selectedFiles.length === 0) || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    setStreamingMessage("");

    try {
      // Create conversation if needed
      let convId = conversationId;
      if (!convId) {
        convId = await createConversation(userMessage);
        onConversationCreated(convId);
      }

      // Save user message and get message ID
      const { data: userMsgData } = await supabase
        .from('messages')
        .insert({
          conversation_id: convId,
          role: 'user',
          content: userMessage || '(File attachment)',
        })
        .select()
        .single();

      // Upload files if any
      let attachments: any[] = [];
      if (selectedFiles.length > 0 && userMsgData) {
        attachments = await uploadFiles(convId, userMsgData.id);
        
        // Trigger multimodal analysis for uploaded files
        if (attachments.length > 0) {
          const attachmentIds = attachments.map(a => a.id);
          const analysis = await analyzeMultimodal(attachmentIds);
          
          if (analysis) {
            // Prepend analysis to user message for AI context
            const enhancedMessage = `[Lucy's Multimodal Analysis]\n${analysis}\n\n[User Message]\n${userMessage || 'Please analyze the uploaded files.'}`;
            
            // Call streaming edge function with enhanced context
            const endpoint = selectedModel || fusionEnabled ? 'model-router' : 'chat-stream';
            const response = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${endpoint}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
                },
                body: JSON.stringify({
                  messages: [...messages.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: enhancedMessage }],
                  preferredModel: selectedModel,
                  enableFusion: fusionEnabled,
                }),
              }
            );

            if (!response.ok) {
              throw new Error('Failed to get AI response');
            }

            await processStreamingResponse(response, convId);
            return;
          }
        }
      }

      // Call streaming edge function (use model-router for advanced features)
      const endpoint = selectedModel || fusionEnabled ? 'model-router' : 'chat-stream';
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: userMessage }],
            preferredModel: selectedModel,
            enableFusion: fusionEnabled,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      await processStreamingResponse(response, convId);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="flex-1 flex flex-col h-screen relative">
      <ReadingProgressBar isStreaming={!!streamingMessage} />
      
      {/* Header */}
      <header className="h-16 border-b border-primary/20 flex items-center justify-between px-6 backdrop-blur-xl glass shadow-glow-violet">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <LucyLogo size="sm" showGlow />
          <div>
            <h1 className="font-semibold bg-gradient-button bg-clip-text text-transparent">{conversationTitle}</h1>
            <p className="text-xs text-muted-foreground">Divine Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ChatSettings
            readingMode={readingMode}
            setReadingMode={setReadingMode}
            streamingSpeed={speed}
            setStreamingSpeed={setSpeed}
          />
          <MemoryPanel userId={userId} />
          <Button variant="ghost" size="sm" onClick={() => setShowSearch(true)} className="glass-card border-primary/30">
            <Search className="w-4 h-4" />
          </Button>
          {conversationId && (
            <Button variant="ghost" size="sm" onClick={() => setShowExport(true)} className="glass-card border-primary/30">
              <Download className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setShowModelSelector(!showModelSelector)} className="glass-card border-primary/30">
            <Settings2 className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <SmartSceneSuggestion
        suggestedScene={suggestedScene}
        onApply={(scene) => console.log('Apply scene:', scene)}
        onDismiss={() => {}}
      />

      {showModelSelector && (
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          fusionEnabled={fusionEnabled}
          onFusionToggle={setFusionEnabled}
        />
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 px-6 py-8 scroll-smooth">
        {messages.length === 0 && !streamingMessage && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 max-w-2xl mx-auto">
            <LucyLogo size="xl" showGlow />
            <div className="glass-card-enhanced p-10 rounded-3xl border border-primary/40 shadow-glow-divine">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-button bg-clip-text text-transparent">
                Welcome to Lucy AI
              </h2>
              <p className="text-muted-foreground text-lg">
                Divine intelligence awaits. Ask me anything!
              </p>
            </div>
          </div>
        )}

        <div className={`max-w-4xl mx-auto ${getSpacingClass()} transition-all duration-300`}>
          {conversationId && <ContextIndicator conversationId={conversationId} />}
          
          {messages.map((message, index) => {
            const showDivider = index === 0 || 
              (new Date(message.created_at).getTime() - new Date(messages[index - 1].created_at).getTime()) > 3600000;
            
            return (
              <div key={message.id}>
                {showDivider && <TimestampDivider timestamp={message.created_at} />}
                <ChatMessage message={message} />
              </div>
            );
          })}
          
          {toolResults && <ToolResultDisplay results={toolResults.results} />}
          
          {streamingMessage && (
            <ChatMessage 
              message={{ 
                role: 'assistant', 
                content: streamingMessage,
                created_at: new Date().toISOString()
              }} 
              isStreaming 
            />
          )}
          
          {isLoading && !streamingMessage && (
            <div className="flex items-center gap-3 text-muted-foreground glass-card px-6 py-4 rounded-2xl border border-primary/30 w-fit">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="font-medium">Lucy is contemplating...</span>
            </div>
          )}
          
          {conversationId && !isLoading && messages.length > 0 && (
            <ProactiveSuggestions 
              conversationId={conversationId}
              onSelectSuggestion={(text) => {
                setInput(text);
                setTimeout(() => handleSend(), 100);
              }}
            />
          )}
          
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Enhanced Input */}
      <div className="border-t border-primary/20 p-4 md:p-6 backdrop-blur-xl glass shadow-glow-violet">
        <div className="max-w-5xl mx-auto space-y-3">
          <FileUploadZone
            selectedFiles={selectedFiles}
            onFilesSelected={(files) => setSelectedFiles([...selectedFiles, ...files])}
            onRemoveFile={(index) => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
          />
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Lucy..."
              className="pr-20 min-h-[90px] md:min-h-[110px] max-h-[300px] resize-none text-base md:text-lg px-6 py-5 rounded-3xl border-2 border-primary/40 focus:border-primary/70 focus:shadow-glow-divine transition-all duration-300 glass-card-enhanced"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={(!input.trim() && selectedFiles.length === 0) || isLoading}
              size="lg"
              className="absolute bottom-4 right-4 bg-gradient-button hover:shadow-glow-divine hover:scale-105 active:scale-95 transition-all duration-200 rounded-2xl h-14 w-14"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      <SearchModal
        open={showSearch}
        onOpenChange={setShowSearch}
        onSelectConversation={(id) => {
          onConversationCreated(id);
          setShowSearch(false);
        }}
      />

      {conversationId && (
        <ExportDialog
          open={showExport}
          onOpenChange={setShowExport}
          conversationId={conversationId}
          conversationTitle={conversationTitle}
        />
      )}
    </main>
  );
}
