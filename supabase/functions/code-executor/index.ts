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

    console.log(`Executing ${language} code (length: ${code.length})`);

    // For safety, this is a placeholder implementation
    // In production, use a sandboxed execution environment like E2B or similar
    
    let result: any = {
      executed: false,
      language,
      note: "Code execution requires a sandboxed environment. This is a simulation.",
      simulation: true
    };

    // Simulate JavaScript execution (very limited and unsafe - for demo only)
    if (language === 'javascript' && code.length < 500) {
      try {
        // NEVER do this in production without proper sandboxing!
        // This is just a demonstration
        const safeCode = code.replace(/require|import|fetch|Deno|process|eval/g, '');
        
        result = {
          executed: true,
          language,
          output: "Code execution simulation - integrate with E2B or similar for real execution",
          note: "For security, code execution requires proper sandboxing infrastructure"
        };
      } catch (error) {
        result = {
          executed: false,
          language,
          error: error instanceof Error ? error.message : 'Execution error',
          note: "Code execution requires sandboxed environment integration"
        };
      }
    }

    // Example of how to integrate with E2B (when API key is available):
    /*
    const E2B_API_KEY = Deno.env.get('E2B_API_KEY');
    if (E2B_API_KEY) {
      const response = await fetch('https://api.e2b.dev/v1/sandboxes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${E2B_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          template: language === 'python' ? 'python3' : 'node',
          code: code,
          timeout: 10000
        })
      });
      
      const data = await response.json();
      result = {
        executed: true,
        language,
        output: data.stdout || '',
        error: data.stderr || null,
        exitCode: data.exitCode
      };
    }
    */

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('code-executor error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
