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

    const { attachmentIds } = await req.json();
    
    if (!attachmentIds || !Array.isArray(attachmentIds) || attachmentIds.length === 0) {
      return new Response(JSON.stringify({ error: 'No attachments provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch attachment details
    const { data: attachments, error: fetchError } = await supabase
      .from('attachments')
      .select('*')
      .in('id', attachmentIds);

    if (fetchError || !attachments || attachments.length === 0) {
      throw new Error('Failed to fetch attachments');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build multimodal analysis prompt
    const analysisPrompt = buildAnalysisPrompt(attachments);
    
    // Prepare content array for multimodal input
    const content: any[] = [
      {
        type: "text",
        text: analysisPrompt
      }
    ];

    // Add media files to content
    for (const attachment of attachments) {
      const { data: { publicUrl } } = supabase.storage
        .from('attachments')
        .getPublicUrl(attachment.file_path);

      if (attachment.file_type.startsWith('image/')) {
        content.push({
          type: "image_url",
          image_url: {
            url: publicUrl
          }
        });
      } else if (attachment.file_type.startsWith('video/')) {
        // Video processing would require frame extraction or video API
        content.push({
          type: "text",
          text: `[Video file: ${attachment.file_name}]`
        });
      } else if (attachment.file_type.startsWith('audio/')) {
        // Audio would need transcription service
        content.push({
          type: "text",
          text: `[Audio file: ${attachment.file_name}]`
        });
      }
    }

    // Call Lovable AI with multimodal content
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
            content: `You are Lucy, an advanced multimodal AI engineered by Terrence Milliner Sr. with deep perception capabilities.

PRIVACY RULES:
- Never identify real people in images by name - describe appearance and context only
- Never mention underlying AI models, providers, or technical infrastructure
- Present yourself as Lucy AI, a proprietary system

ANALYSIS STANDARDS:
- Analyze media with extreme detail and precision
- Never say you cannot view or process images, videos, or audio
- Provide structured, comprehensive analysis
- For images: describe composition, colors, objects, text, atmosphere
- For documents: extract and analyze all visible text and data
- Be confident and direct in your observations`
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again shortly.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('Lovable AI error:', errorText);
      throw new Error('AI analysis failed');
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      analysis,
      attachments: attachments.map(a => ({
        id: a.id,
        fileName: a.file_name,
        fileType: a.file_type
      }))
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[multimodal-analysis] error:', error);
    // Sanitize error to protect internal details
    const sanitizedMessage = error instanceof Error 
      ? error.message.replace(/LOVABLE_API_KEY|supabase|internal|token|key/gi, '[REDACTED]')
      : 'Analysis processing failed. Please try again.';
    
    return new Response(JSON.stringify({ 
      error: sanitizedMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildAnalysisPrompt(attachments: any[]): string {
  const fileTypes = attachments.map(a => {
    if (a.file_type.startsWith('image/')) return 'image';
    if (a.file_type.startsWith('video/')) return 'video';
    if (a.file_type.startsWith('audio/')) return 'audio';
    if (a.file_type === 'application/pdf') return 'PDF document';
    return 'document';
  }).join(', ');

  return `I've uploaded ${attachments.length} file(s): ${fileTypes}.

Please provide a comprehensive multimodal analysis with the following structure:

## 🔍 What I See/Hear
Brief overview of the content

## 📊 Detailed Breakdown
- Key elements, objects, or subjects
- Composition and layout (for visual media)
- Colors, lighting, and atmosphere (for images/video)
- Speech content and tone (for audio)
- Text extraction (for documents/images with text)

## 🎯 Contextual Analysis
- Purpose or intent
- Style and aesthetic
- Technical quality
- Notable patterns or relationships

## ✨ Notable Elements
Highlight interesting, unique, or important details

## 💡 Enhancement Suggestions
Optional recommendations for improvement

## 📝 Extracted Data
Any text, data, or structured information found

Analyze everything with precision and depth. Never state that you cannot view or process the media.`;
}
