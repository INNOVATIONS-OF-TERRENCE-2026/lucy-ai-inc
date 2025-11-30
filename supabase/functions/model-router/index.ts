import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Privacy sanitizer
function sanitizeError(error: unknown): string {
  console.error('[INTERNAL ERROR]', error);
  return "Lucy's response engine is temporarily busy. Please try again.";
}

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, enableFusion = false, preferredModel = null } = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // If user specified a model, use it
    if (preferredModel) {
      return await streamModelResponse(preferredModel, messages);
    }

    // Intelligent routing based on last message content
    const lastMessage = messages[messages.length - 1]?.content || '';
    const selectedModel = routeToModel(lastMessage);

    console.log('Routed to model:', selectedModel, 'for query:', lastMessage.substring(0, 100));

    // If fusion is enabled and query is complex, use multi-model approach
    if (enableFusion && isComplexQuery(lastMessage)) {
      return await fusionResponse(messages);
    }

    return await streamModelResponse(selectedModel, messages);

  } catch (error) {
    console.error('[model-router] Internal error:', error);
    return new Response(JSON.stringify({ error: sanitizeError(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function routeToModel(query: string): string {
  const lowerQuery = query.toLowerCase();

  // Code/technical patterns
  if (
    /\b(code|function|class|debug|error|syntax|algorithm|programming|typescript|javascript|python|react)\b/i.test(query) ||
    /```/.test(query)
  ) {
    return 'google/gemini-2.5-pro';
  }

  // Creative writing patterns
  if (
    /\b(write|story|poem|creative|imagine|describe|narrative|essay)\b/i.test(query) &&
    !/\b(code|technical)\b/i.test(query)
  ) {
    return 'openai/gpt-5-mini';
  }

  // Quick/simple queries
  if (query.length < 100 && /\b(what|who|when|where|define|explain)\b/i.test(query)) {
    return 'google/gemini-2.5-flash-lite';
  }

  // Analysis/research patterns
  if (
    /\b(analyze|research|compare|evaluate|assess|study|investigation)\b/i.test(query) ||
    query.length > 500
  ) {
    return 'google/gemini-2.5-pro';
  }

  // Default to balanced model
  return 'google/gemini-2.5-flash';
}

function isComplexQuery(query: string): boolean {
  return (
    query.length > 300 ||
    /\b(complex|detailed|comprehensive|thorough|in-depth)\b/i.test(query)
  );
}

async function streamModelResponse(model: string, messages: any[]) {
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
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
    throw new Error('AI gateway error');
  }

  return new Response(response.body, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'X-Model-Used': model,
    },
  });
}

async function fusionResponse(messages: any[]) {
  // Call multiple models in parallel
  const models = ['google/gemini-2.5-flash', 'openai/gpt-5-mini'];
  
  const responses = await Promise.all(
    models.map(async (model) => {
      const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          stream: false,
        }),
      });
      const data = await resp.json();
      return {
        model,
        content: data.choices?.[0]?.message?.content || '',
      };
    })
  );

  // Simple fusion: combine insights from both models
  const fusedContent = responses
    .map(r => r.content)
    .filter(c => c.length > 0)
    .join('\n\n---\n\n');

  // Stream the fused response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const chunks = fusedContent.split(' ');
      let i = 0;
      const interval = setInterval(() => {
        if (i < chunks.length) {
          const chunk = chunks[i] + ' ';
          const sseData = `data: ${JSON.stringify({ choices: [{ delta: { content: chunk } }] })}\n\n`;
          controller.enqueue(encoder.encode(sseData));
          i++;
        } else {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
          clearInterval(interval);
        }
      }, 50);
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'X-Model-Used': 'fusion',
    },
  });
}