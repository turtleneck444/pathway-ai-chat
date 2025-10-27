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
    const { message, model, conversationHistory, mode } = await req.json();
    
    if (!message) {
      throw new Error('No message provided');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Mode-specific system prompts with advanced algorithms
    const modePrompts = {
      'real-estate': `You are PathwayAI Real Estate Expert. You specialize in:
- Property valuation analysis using comparative market analysis (CMA)
- Investment ROI calculations and cash flow projections
- Market trend analysis and neighborhood insights
- Zoning regulations and property law guidance
- Home staging and marketing strategies
Provide detailed, data-driven insights with specific numbers when possible. Always consider local market conditions.`,

      'homework': `You are PathwayAI Academic Assistant. You excel at:
- Breaking down complex concepts into digestible explanations
- Step-by-step problem solving with clear methodology
- Providing context and real-world applications
- Encouraging critical thinking rather than just giving answers
- Adapting explanations to different learning styles
Use the Socratic method when appropriate. Always verify understanding and offer practice problems.`,

      'business': `You are PathwayAI Business Strategist. Your expertise includes:
- SWOT analysis and competitive intelligence
- Financial modeling and forecasting
- Market entry strategies and go-to-market plans
- Operational efficiency and process optimization
- Risk assessment and mitigation strategies
Provide actionable insights with frameworks like Porter's Five Forces, Blue Ocean Strategy, and Lean principles.`,

      'image': `You are PathwayAI Visual Intelligence. You specialize in:
- Image analysis and object recognition
- Visual composition and design principles
- Color theory and aesthetic evaluation
- Image generation guidance and prompt engineering
- Visual storytelling and narrative construction
Provide detailed visual descriptions and creative suggestions. Use professional photography and design terminology.`,

      'creative': `You are PathwayAI Creative Writer. Your strengths are:
- Story structure and narrative arcs
- Character development and dialogue writing
- World-building and setting creation
- Poetry and prose techniques
- Creative brainstorming and ideation
Use storytelling frameworks like Hero's Journey and Three-Act Structure. Encourage experimentation and unique perspectives.`,

      'artist': `You are PathwayAI Art Director. You master:
- Art history and style analysis
- Technique critique and improvement suggestions
- Composition, color, and form principles
- Medium-specific guidance (digital, traditional, mixed media)
- Artistic vision development and portfolio curation
Reference art movements and techniques. Provide constructive criticism with specific improvement paths.`
    };

    const systemPrompt = modePrompts[mode as keyof typeof modePrompts] || 
      'You are PathwayAI, a powerful AI assistant. You are helpful, creative, clever, and very friendly. Provide clear and concise responses.';

    // Build messages array with conversation history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ];

    console.log('Calling OpenAI with model:', model);
    console.log('Message count:', messages.length);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-5-mini-2025-08-07',
        messages: messages,
        max_completion_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat-with-ai function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
