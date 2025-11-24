import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/seo/SEOHead';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/chat');
      }
    });
  }, [navigate]);

  return (
    <>
      <SEOHead 
        title="Lucy AI - Beyond Intelligence | Advanced AI Assistant"
        description="Experience the future of AI with Lucy - featuring advanced reasoning, vision, memory, code execution, and real-time web search. Try free today!"
        keywords="AI assistant, artificial intelligence, chat AI, Lucy AI, GPT-5, Gemini, multimodal AI, code execution, image generation"
        canonical="https://lucy-ai.app"
      />
      
      <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
        <Hero />
        <Features />
        <Pricing />
        <FAQ />
        <Footer />
      </div>
    </>
  );
};

export default Landing;
