import { User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { LucyLogo } from "@/components/branding/LucyLogo";
import { FilePreview } from "./FilePreview";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessageProps {
  message: {
    id?: string;
    role: string;
    content: string;
    created_at: string;
  };
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [attachments, setAttachments] = useState<any[]>([]);

  useEffect(() => {
    if (message.id) {
      loadAttachments();
    }
  }, [message.id]);

  const loadAttachments = async () => {
    if (!message.id) return;
    const { data } = await supabase
      .from('attachments')
      .select('*')
      .eq('message_id', message.id);
    if (data) setAttachments(data);
  };

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      {!isUser && (
        <LucyLogo size="sm" showGlow className="flex-shrink-0" />
      )}
      
      <div className={`max-w-[85%] md:max-w-[75%] ${isUser ? 'order-first' : ''}`}>
        <div className={`
          rounded-3xl px-6 py-4
          ${isUser 
            ? 'bg-gradient-button text-white ml-auto shadow-glow-magenta hover:shadow-glow-divine transition-shadow duration-300' 
            : 'glass-card-enhanced border border-primary/40 shadow-glow-violet'
          }
          transform transition-all duration-300
        `}>
          {isUser ? (
            <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-3 prose-p:leading-7 prose-headings:mt-6 prose-headings:mb-3 prose-ul:my-3 prose-ol:my-3 prose-li:my-1">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="mb-4 leading-7 last:mb-0">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="my-4 ml-6 list-disc space-y-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="my-4 ml-6 list-decimal space-y-2">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-7">{children}</li>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold mt-6 mb-3">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-bold mt-6 mb-3">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-bold mt-5 mb-2">{children}</h3>
                  ),
                  code({ className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const inline = !match;
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus as any}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg my-4"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {attachments.length > 0 && (
            <FilePreview attachments={attachments} />
          )}
        </div>
        {!isUser && !isStreaming && (
          <p className="text-xs text-muted-foreground mt-2 px-1">
            {new Date(message.created_at).toLocaleTimeString()}
          </p>
        )}
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-subtle flex items-center justify-center flex-shrink-0 border border-primary/30">
          <User className="w-4 h-4 text-foreground" />
        </div>
      )}
    </div>
  );
}