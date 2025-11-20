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

    const { conversationId, messages = [] } = await req.json();
    
    if (!conversationId || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Conversation ID and messages required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing context for conversation:', conversationId);

    // Build conversation summary
    const conversationText = messages.map((m: any) => 
      `${m.role}: ${m.content}`
    ).join('\n\n');

    const analysisPrompt = `Analyze this conversation and extract:
1. Key topics discussed
2. User preferences or patterns
3. Important facts or context to remember
4. Proactive suggestions that would help the user next
5. Any unresolved questions or concerns

Respond with JSON:
{
  "topics": ["topic1", "topic2"],
  "preferences": {"key": "value"},
  "keyFacts": ["fact1", "fact2"],
  "suggestions": [
    {"type": "follow_up", "text": "suggestion text", "relevance": 0.9}
  ],
  "unresolvedQuestions": ["question1"]
}

Conversation:
${conversationText.substring(0, 4000)}`;

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
            content: 'You are a context analyzer that extracts key insights from conversations. Respond only with valid JSON.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Context analysis failed');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    
    let analysis = {};
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse context analysis:', e);
    }

    // Store context summary in database (future enhancement)
    // await supabase.from('conversation_context').insert({...})

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('context-analyzer error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
