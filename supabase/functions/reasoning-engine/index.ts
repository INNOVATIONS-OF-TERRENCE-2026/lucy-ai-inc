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
    const { query, messages = [], showThinking = false } = await req.json();
    
    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Advanced reasoning for query:', query.substring(0, 100));

    // Chain-of-thought reasoning prompt
    const reasoningPrompt = `You are Lucy AI's advanced reasoning engine. For the following query, provide deep, step-by-step reasoning.

Query: ${query}

Use this structured approach:
1. **Problem Analysis**: Break down the problem into core components
2. **Sub-Problems**: Identify key sub-questions that need answering
3. **Reasoning Steps**: Think through each step explicitly, showing your work
4. **Verification**: Check for logical consistency and potential errors
5. **Synthesis**: Combine insights into a coherent final answer
6. **Confidence**: Rate your confidence (0-1) and explain any uncertainties

${showThinking ? 'Show your complete thought process.' : 'Focus on the final answer, but maintain rigorous reasoning internally.'}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro', // Use Pro for best reasoning
        messages: [
          {
            role: 'system',
            content: 'You are an advanced reasoning engine that thinks deeply and systematically. Break down complex problems, verify your logic, and synthesize clear answers.'
          },
          ...messages,
          {
            role: 'user',
            content: reasoningPrompt
          }
        ],
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
      throw new Error('Reasoning engine error');
    }

    const data = await response.json();
    const reasoning = data.choices?.[0]?.message?.content;

    return new Response(JSON.stringify({ 
      reasoning,
      model: 'google/gemini-2.5-pro'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('reasoning-engine error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
