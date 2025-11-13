import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { conversationId, format } = await req.json();

    if (!conversationId || !format) {
      return new Response(JSON.stringify({ error: 'conversationId and format required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch conversation and messages
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single();

    if (convError || !conversation) {
      throw new Error('Conversation not found');
    }

    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (msgError) {
      throw new Error('Failed to fetch messages');
    }

    let content: string;
    let contentType: string;
    let filename: string;

    switch (format) {
      case 'txt':
        content = generateTxtExport(conversation, messages);
        contentType = 'text/plain';
        filename = `lucy-ai-${conversation.title.replace(/[^a-z0-9]/gi, '-')}.txt`;
        break;

      case 'md':
        content = generateMarkdownExport(conversation, messages);
        contentType = 'text/markdown';
        filename = `lucy-ai-${conversation.title.replace(/[^a-z0-9]/gi, '-')}.md`;
        break;

      case 'json':
        content = JSON.stringify({
          export_info: {
            exported_from: "Lucy AI - Beyond Intelligence",
            export_date: new Date().toISOString(),
            format_version: "1.0"
          },
          conversation,
          messages
        }, null, 2);
        contentType = 'application/json';
        filename = `lucy-ai-${conversation.title.replace(/[^a-z0-9]/gi, '-')}.json`;
        break;

      default:
        throw new Error('Invalid format');
    }

    return new Response(content, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('export-conversation error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateTxtExport(conversation: any, messages: any[]): string {
  let output = `╔═══════════════════════════════════════════════════════════════╗\n`;
  output += `║                     LUCY AI                                   ║\n`;
  output += `║                 Beyond Intelligence                           ║\n`;
  output += `║           Conversation Export - Text Format                   ║\n`;
  output += `╚═══════════════════════════════════════════════════════════════╝\n\n`;
  output += `Title: ${conversation.title}\n`;
  output += `Created: ${new Date(conversation.created_at).toLocaleString()}\n`;
  output += `Tags: ${conversation.tags?.join(', ') || 'None'}\n`;
  output += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  for (const msg of messages) {
    const role = msg.role === 'user' ? 'You' : 'Lucy AI';
    const timestamp = new Date(msg.created_at).toLocaleString();
    output += `[${timestamp}] ${role}:\n${msg.content}\n\n`;
  }

  output += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  output += `Exported from Lucy AI - Your Advanced AI Assistant\n`;
  output += `Export Date: ${new Date().toLocaleString()}\n`;

  return output;
}

function generateMarkdownExport(conversation: any, messages: any[]): string {
  let output = `---\n`;
  output += `title: "${conversation.title}"\n`;
  output += `exported_from: "Lucy AI - Beyond Intelligence"\n`;
  output += `export_date: "${new Date().toISOString()}"\n`;
  output += `conversation_created: "${conversation.created_at}"\n`;
  output += `tags: [${conversation.tags?.map((t: string) => `"${t}"`).join(', ') || ''}]\n`;
  output += `---\n\n`;
  
  output += `# 🌟 ${conversation.title}\n\n`;
  output += `> **Powered by Lucy AI** - Beyond Intelligence\n\n`;
  output += `**Created:** ${new Date(conversation.created_at).toLocaleString()}  \n`;
  output += `**Tags:** ${conversation.tags?.join(', ') || 'None'}  \n`;
  output += `**Exported:** ${new Date().toLocaleString()}\n\n`;
  output += `---\n\n`;

  for (const msg of messages) {
    const role = msg.role === 'user' ? '👤 **You**' : '🤖 **Lucy AI**';
    const timestamp = new Date(msg.created_at).toLocaleString();
    output += `### ${role} <small>(${timestamp})</small>\n\n`;
    output += `${msg.content}\n\n`;
    output += `---\n\n`;
  }

  output += `\n---\n\n`;
  output += `<div align="center">\n\n`;
  output += `**Lucy AI** - Your Advanced AI Assistant  \n`;
  output += `*Beyond Intelligence*\n\n`;
  output += `</div>\n`;

  return output;
}