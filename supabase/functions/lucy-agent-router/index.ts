import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ToolCall {
  tool: 'chat' | 'web_search' | 'code_exec' | 'image_gen' | 'memory_search' | 'vision' | 'browser_fetch';
  arguments: Record<string, any>;
}

interface AgentStep {
  stepNumber: number;
  toolCall: ToolCall;
  toolResult?: any;
  notes?: string;
}

interface AgentPlan {
  steps: AgentStep[];
  finalAnswer?: string;
  persona?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId, personaId } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'messages[] is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Step 1: Determine which tools to use
    const routerPrompt = `You are Lucy's routing brain. Analyze the user's request and decide which tools to call.

Available tools:
- "chat": Standard reasoning (no external tools needed)
- "web_search": Search the web for current information
- "code_exec": Execute JavaScript code
- "vision": Analyze images
- "memory_search": Search user's long-term memory

Respond ONLY with JSON:
{
  "steps": [
    { "stepNumber": 1, "tool": "web_search", "arguments": { "query": "..." } }
  ],
  "reasoning": "Why these tools"
}

User's last message: ${messages[messages.length - 1].content}`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const routerResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: routerPrompt },
          ...messages.slice(-3), // Last 3 messages for context
        ],
        temperature: 0.2,
      }),
    });

    if (!routerResponse.ok) {
      throw new Error(`Router failed: ${routerResponse.status}`);
    }

    const routerData = await routerResponse.json();
    const routerText = routerData.choices?.[0]?.message?.content || '{}';
    
    let plan: any;
    try {
      plan = JSON.parse(routerText);
    } catch {
      // If parsing fails, default to chat
      plan = { steps: [{ stepNumber: 1, tool: 'chat', arguments: {} }] };
    }

    const steps: AgentStep[] = [];

    // Step 2: Execute tools
    for (const step of plan.steps || []) {
      const toolCall: ToolCall = {
        tool: step.tool,
        arguments: step.arguments || {},
      };

      let toolResult: any = null;

      try {
        switch (toolCall.tool) {
          case 'web_search':
            const { data: searchData } = await supabase.functions.invoke('web-search', {
              body: { query: toolCall.arguments.query || '' }
            });
            toolResult = searchData;
            break;

          case 'code_exec':
            const { data: codeData } = await supabase.functions.invoke('code-executor', {
              body: { code: toolCall.arguments.code || '', timeoutMs: 5000 }
            });
            toolResult = codeData;
            break;

          case 'memory_search':
            const { data: memoryData } = await supabase.functions.invoke('memory-manager', {
              body: { 
                action: 'search',
                userId: userId || 'anonymous',
                query: toolCall.arguments.query || '',
                topK: 5
              }
            });
            toolResult = memoryData;
            break;

          case 'chat':
          default:
            toolResult = { note: 'Standard chat reasoning' };
            break;
        }
      } catch (error: any) {
        console.error(`Tool ${toolCall.tool} failed:`, error);
        toolResult = { error: 'Tool execution failed' };
      }

      steps.push({
        stepNumber: step.stepNumber,
        toolCall,
        toolResult,
        notes: `Executed ${toolCall.tool}`,
      });
    }

    // Step 3: Generate final answer with persona context
    const personaPrompts: Record<string, string> = {
      credit: 'You are Credit Lucy, a world-class credit expert.',
      developer: 'You are Developer Lucy, a world-class software engineer.',
      realtor: 'You are Realtor Lucy, a world-class real estate expert.',
      business: 'You are Business Lucy, a world-class business strategist.',
      default: 'You are Lucy AI, an intelligent assistant.',
    };

    const personaPrompt = personaPrompts[personaId || 'default'] || personaPrompts.default;

    const finalMessages = [
      { role: 'system', content: `${personaPrompt}\n\nYou have access to tool results. Use them to compose a clear, accurate answer.` },
      ...messages,
      ...steps.map(s => ({
        role: 'system' as const,
        content: `Tool ${s.toolCall.tool} result: ${JSON.stringify(s.toolResult)}`
      })),
    ];

    const finalResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: finalMessages,
        temperature: 0.7,
      }),
    });

    if (!finalResponse.ok) {
      throw new Error(`Final answer generation failed: ${finalResponse.status}`);
    }

    const finalData = await finalResponse.json();
    const finalAnswer = finalData.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response.';

    const agentPlan: AgentPlan = {
      steps,
      finalAnswer,
      persona: personaId || 'default',
    };

    return new Response(
      JSON.stringify({ ok: true, plan: agentPlan }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[lucy-agent-router] error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Something went wrong on my side, but your data is safe. Please try again or rephrase your request.' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
