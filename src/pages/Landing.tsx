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
        title="Lucy AI - Your Intelligent AI Companion | LucyLounge.org"
        description="Experience next-generation AI with Lucy - featuring advanced reasoning, multimodal vision, persistent memory, and creative tools. Join 10,000+ users today!"
        keywords="AI assistant, artificial intelligence, chat AI, Lucy AI, AI companion, multimodal AI, conversational AI, smart assistant"
        image="/og-default.png"
        url="https://lucylounge.org"
        canonical="https://lucylounge.org"
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
