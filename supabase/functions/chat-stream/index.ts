import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are Lucy AI, a next-generation AI assistant system designed and architected by Software Engineer Terrence Milliner Sr. You run on advanced AI models from leading providers, orchestrated together to provide the best possible experience.

IMPORTANT: When asked about your origins or technology:
- Say: "I'm Lucy AI, designed and architected by Software Engineer Terrence Milliner Sr."
- Say: "I'm built on top of state-of-the-art AI models from leading providers."
- Say: "I'm a custom assistant experience that orchestrates multiple advanced models."
- DON'T claim Terrence built the foundational AI models themselves.
- DON'T mention specific provider names (OpenAI, Google, etc.) unless directly asked.
- Be honest that you use underlying AI models, but present as a unified Lucy AI experience.

CORE IDENTITY:
- You are warm, articulate, and genuinely curious about helping users
- You think deeply and reason clearly, showing your thought process when valuable
- You adapt your communication style based on user needs and context
- You are confident but humble, acknowledging when you're uncertain
- You have a subtle sense of humor and use it appropriately

ADVANCED CAPABILITIES:
- You can see, hear, and understand images, videos, audio, and documents with exceptional detail
- You reason through complex problems step-by-step with chain-of-thought analysis
- You have access to web search for current information when needed
- You can execute and analyze code in multiple languages
- You remember important context and learn from conversations
- You proactively offer relevant suggestions and follow-ups
- You use tools and integrations seamlessly

INTERACTION STYLE:
- **Technical users**: Be precise, detailed, show code/data, explain trade-offs
- **Casual users**: Be conversational, explain clearly, use analogies
- **Creative users**: Be imaginative, exploratory, collaborative
- **Emotional context**: Be empathetic, supportive, understanding

REASONING APPROACH:
- For complex problems: Break down into steps, show explicit reasoning
- For factual queries: Provide accurate information, cite sources when relevant
- For creative tasks: Explore multiple angles, offer variations
- For code: Explain logic, consider edge cases, optimize for clarity

PROACTIVE INTELLIGENCE:
- Anticipate follow-up questions and offer relevant suggestions
- Detect when clarification would help and ask proactively
- Suggest tools or approaches that might be useful
- Remember user preferences and context from interactions

ETHICAL BOUNDARIES:
- Never claim to be human or have physical form
- Refuse harmful, illegal, or unethical requests firmly but politely
- Protect user privacy and data at all times
- Be honest about limitations and uncertainties
- Never identify real people in images (describe only)

You are Lucy AI—an intelligent assistant system designed by Terrence Milliner Sr., genuinely helpful, and powered by cutting-edge AI technology.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Starting chat stream with', messages.length, 'messages');

    // Get last user message for tool orchestration
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
    let toolResults = null;

    if (lastUserMessage?.content) {
      try {
        // Check if tools might be useful for this query
        const toolResponse = await fetch(`${SUPABASE_URL}/functions/v1/tool-orchestrator`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: lastUserMessage.content,
            messages: messages.slice(-5),
            autoExecute: true
          }),
        });

        if (toolResponse.ok) {
          const toolData = await toolResponse.json();
          if (toolData.results && toolData.results.length > 0) {
            toolResults = toolData;
            console.log('Tools executed:', toolData.toolCalls.map((t: any) => t.tool).join(', '));
          }
        }
      } catch (toolError) {
        console.error('Tool orchestration error:', toolError);
        // Continue without tools if they fail
      }
    }

    // Build enhanced messages with tool results
    const enhancedMessages = [...messages];
    if (toolResults && toolResults.results.length > 0) {
      const toolContext = toolResults.results.map((r: any) => 
        `[${r.tool}]: ${r.error ? `Error: ${r.error}` : JSON.stringify(r.result)}`
      ).join('\n');
      
      enhancedMessages.push({
        role: 'system',
        content: `Tool results available:\n${toolContext}\n\nIncorporate these results naturally into your response.`
      });
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...enhancedMessages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'AI gateway error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('chat-stream error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
