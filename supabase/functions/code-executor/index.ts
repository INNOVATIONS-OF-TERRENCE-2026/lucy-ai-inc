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
    const { code, language = 'javascript' } = await req.json();
    
    if (!code) {
      return new Response(JSON.stringify({ error: 'Code is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[code-executor] Executing ${language} code (length: ${code.length})`);

    // Safety checks for dangerous patterns
    const dangerousPatterns = [
      /require\s*\(/gi,
      /import\s+/gi,
      /eval\s*\(/gi,
      /Function\s*\(/gi,
      /process\./gi,
      /Deno\./gi,
      /fetch\s*\(/gi,
      /XMLHttpRequest/gi,
      /__dirname/gi,
      /__filename/gi,
      /child_process/gi,
      /fs\./gi,
      /execSync/gi,
    ];

    const hasDangerousCode = dangerousPatterns.some(pattern => pattern.test(code));
    
    if (hasDangerousCode) {
      return new Response(JSON.stringify({
        executed: false,
        language,
        error: 'Code contains potentially unsafe operations',
        note: 'For security, certain operations are restricted'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use Lovable AI for safe code analysis and execution simulation
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('Configuration error');
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
          {
            role: 'system',
            content: `You are a code analysis assistant. Analyze the provided ${language} code and predict its output accurately. Execute simple calculations and logic mentally. Format response as:

OUTPUT:
[exact predicted output or result]

EXPLANATION:
[brief explanation of what the code does]`
          },
          {
            role: 'user',
            content: `Analyze and predict the output:\n\`\`\`${language}\n${code}\n\`\`\``
          }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      if (response.status === 429 || response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "Service temporarily unavailable" 
        }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('Code analysis service unavailable');
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || '';

    const result = {
      executed: true,
      language,
      output: analysis,
      method: 'ai-simulation',
      note: 'Code analyzed and simulated securely with AI',
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[code-executor] error:', error);
    const sanitizedMessage = error instanceof Error 
      ? error.message.replace(/LOVABLE_API_KEY|key|token|internal/gi, '[REDACTED]')
      : 'Code execution failed. Please try again.';
    
    return new Response(JSON.stringify({ 
      error: sanitizedMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
