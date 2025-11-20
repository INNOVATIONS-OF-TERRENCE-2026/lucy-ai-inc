import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define available tools
const AVAILABLE_TOOLS = [
  {
    name: "web_search",
    description: "Search the web for current information, news, facts, or real-time data",
    parameters: {
      query: "string - the search query"
    }
  },
  {
    name: "generate_image",
    description: "Create images from text descriptions",
    parameters: {
      prompt: "string - detailed image description",
      style: "string - realistic, artistic, diagram, abstract"
    }
  },
  {
    name: "reasoning_engine",
    description: "Deep chain-of-thought reasoning for complex problems",
    parameters: {
      query: "string - the complex problem to analyze",
      showThinking: "boolean - whether to show reasoning process"
    }
  },
  {
    name: "code_executor",
    description: "Execute Python or JavaScript code safely",
    parameters: {
      code: "string - the code to execute",
      language: "string - python or javascript"
    }
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { query, messages = [], autoExecute = true } = await req.json();
    
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

    console.log('Tool orchestrator analyzing:', query.substring(0, 100));

    // Use AI to determine which tools to use
    const toolSelectionPrompt = `Given this user query, determine which tools (if any) should be used to best answer it.

User Query: ${query}

Available Tools:
${AVAILABLE_TOOLS.map(t => `- ${t.name}: ${t.description}`).join('\n')}

Respond with a JSON array of tool calls needed, or an empty array if no tools are needed:
[
  {"tool": "tool_name", "params": {"param1": "value1"}},
  ...
]

Only suggest tools that will genuinely help answer the query. Many queries don't need tools.`;

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
            content: 'You are a tool orchestrator that intelligently selects which tools to use. Respond only with valid JSON.'
          },
          {
            role: 'user',
            content: toolSelectionPrompt
          }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Tool selection failed');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '[]';
    
    // Extract JSON from response
    let toolCalls = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        toolCalls = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.log('No tools selected or invalid JSON');
    }

    const results: any[] = [];

    // Execute selected tools if autoExecute is true
    if (autoExecute && toolCalls.length > 0) {
      for (const toolCall of toolCalls) {
        const { tool, params } = toolCall;
        
        try {
          const toolResult = await executeTool(supabase, tool, params);
          results.push({
            tool,
            params,
            result: toolResult
          });
        } catch (error) {
          console.error(`Tool ${tool} failed:`, error);
          results.push({
            tool,
            params,
            error: error instanceof Error ? error.message : 'Tool execution failed'
          });
        }
      }
    }

    return new Response(JSON.stringify({ 
      toolCalls,
      results,
      executed: autoExecute
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('tool-orchestrator error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function executeTool(supabase: any, toolName: string, params: any) {
  // Execute the appropriate edge function based on tool name
  const functionMap: Record<string, string> = {
    'web_search': 'web-search',
    'generate_image': 'generate-image',
    'reasoning_engine': 'reasoning-engine',
    'code_executor': 'code-executor'
  };

  const functionName = functionMap[toolName];
  if (!functionName) {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  const { data, error } = await supabase.functions.invoke(functionName, {
    body: params
  });

  if (error) throw error;
  return data;
}
