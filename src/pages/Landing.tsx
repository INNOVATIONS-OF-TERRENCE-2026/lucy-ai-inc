import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/seo/SEOHead';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';
import { CosmicBackground } from '@/components/cosmic/CosmicBackground';
import { EmailCapture } from '@/components/landing/EmailCapture';
import { ShareButtons } from '@/components/landing/ShareButtons';
import { StructuredData } from '@/components/seo/StructuredData';

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
        title="Lucy AI - Best AI Chat Platform 2025 | AI Companion & Assistant"
        description="Lucy AI: Advanced AI chat platform with reasoning, vision, memory & creativity. ChatGPT alternative for entrepreneurs, creators & businesses. Free AI assistant online. Mobile PWA app."
        keywords="AI companion, AI chat platform, AI assistant online, best AI chat 2025, AI mobile app, ChatGPT alternative, AI for entrepreneurs, AI girlfriend app, Lucy AI, AI SaaS companion, conversational AI, smart AI assistant, AI PWA app"
        image="/og-default.png"
        url="https://lucylounge.org"
        canonical="https://lucylounge.org"
      />
      
      <StructuredData type="WebSite" />
      <StructuredData type="Organization" />
      <StructuredData type="SoftwareApplication" />
      
      <div className="min-h-screen relative overflow-hidden">
        <CosmicBackground />
        <div className="relative z-10">
          <Hero />
          <Features />
          
          {/* Email Capture Section */}
          <section className="py-20 px-4">
            <div className="container mx-auto max-w-4xl">
              <EmailCapture />
            </div>
          </section>

          {/* Share Section */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold mb-6">Share Lucy AI</h2>
              <p className="text-muted-foreground mb-8">
                Help us reach more people who can benefit from AI
              </p>
              <ShareButtons />
            </div>
          </section>

          <Pricing />
          <FAQ />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Landing;
