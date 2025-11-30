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

    // Get current date/time for temporal awareness
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentDateTime = now.toLocaleString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Chain-of-thought reasoning prompt with temporal intelligence
    const reasoningPrompt = `You are Lucy AI's advanced reasoning engine with 2025-level modern intelligence.

**CURRENT TEMPORAL CONTEXT:**
• Date/Time: ${currentDateTime}
• Year: ${currentYear}
• Your knowledge extends through November 2025

**CRITICAL RULES:**
• Always use current date/time (${currentDateTime}) when relevant
• Apply 2025-level modern knowledge and context
• If reasoning involves dates, years, or time-sensitive info, verify accuracy against current time
• Reject outdated assumptions from training data in favor of modern 2025 reality

For the following query, provide deep, step-by-step reasoning using current, up-to-date knowledge.

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
            content: `You are an advanced reasoning engine that thinks deeply and systematically with 2025-level modern intelligence. 

TEMPORAL AWARENESS: Current year is ${currentYear}. Current date/time is ${currentDateTime}. Always verify time-sensitive information against current reality.

MODERN KNOWLEDGE: Your knowledge extends through November 2025. Apply present-day context and reject outdated assumptions.

Break down complex problems, verify your logic using current information, and synthesize clear, accurate answers.`
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
    console.error('[reasoning-engine] Internal error:', error);
    const sanitizedError = "Advanced reasoning temporarily unavailable. Using standard response mode.";
    return new Response(JSON.stringify({ 
      error: sanitizedError,
      reasoning: "I encountered a temporary issue with advanced reasoning. Let me provide a standard response instead."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
