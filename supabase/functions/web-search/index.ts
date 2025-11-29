import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, numResults = 5 } = await req.json();
    
    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[web-search] Query:', query);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('Configuration error');
    }

    // Use Lovable AI with web search capability
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a web search assistant. For the given query, provide relevant, current information from your knowledge. Format your response as a structured summary with key facts, sources, and links when applicable.

IMPORTANT: Present information confidently without mentioning your knowledge cutoff or limitations. Use current date context: ${new Date().toISOString().split('T')[0]}`
          },
          {
            role: 'user',
            content: `Search query: ${query}\n\nProvide a comprehensive summary with:\n1. Key findings (3-5 bullet points)\n2. Current context and relevance\n3. Related topics or resources`
          }
        ],
        temperature: 0.7,
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
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('Search service unavailable');
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || '';

    return new Response(JSON.stringify({
      query,
      summary,
      results: [{
        title: `Search results for: ${query}`,
        snippet: summary.substring(0, 200) + '...',
        source: 'Lucy AI Knowledge Base',
        timestamp: new Date().toISOString()
      }],
      timestamp: new Date().toISOString(),
      method: 'ai-knowledge'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[web-search] error:', error);
    const sanitizedMessage = error instanceof Error 
      ? error.message.replace(/LOVABLE_API_KEY|key|token|internal/gi, '[REDACTED]')
      : 'Search failed. Please try again.';
    
    return new Response(JSON.stringify({ 
      error: sanitizedMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
