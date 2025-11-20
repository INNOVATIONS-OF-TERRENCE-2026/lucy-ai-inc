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

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, content, memoryType = 'fact' } = await req.json();
    
    if (!action) {
      return new Response(JSON.stringify({ error: 'Action is required (store, retrieve, search)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Memory action: ${action} for user ${user.id}`);

    // Store memory
    if (action === 'store' && content) {
      // In future: generate embeddings and store in user_memories table
      // For now, return success
      return new Response(JSON.stringify({
        success: true,
        message: 'Memory storage prepared. Database table will be created in migration.',
        memoryType,
        content: content.substring(0, 100)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Retrieve recent memories
    if (action === 'retrieve') {
      // In future: query user_memories table
      return new Response(JSON.stringify({
        memories: [],
        note: 'Memory retrieval will be available after database migration.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Search memories (semantic search)
    if (action === 'search' && content) {
      // In future: vector similarity search
      return new Response(JSON.stringify({
        results: [],
        query: content,
        note: 'Memory search will use vector embeddings after database migration.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      error: 'Invalid action or missing parameters'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('memory-manager error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
