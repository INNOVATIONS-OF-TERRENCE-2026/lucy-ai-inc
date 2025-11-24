import { SEOHead } from '@/components/seo/SEOHead';
import { StructuredData } from '@/components/seo/StructuredData';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AboutLucySection } from '@/components/about/AboutLucySection';
import { LucyFAQSection } from '@/components/about/LucyFAQSection';
import { FounderStorySection } from '@/components/about/FounderStorySection';
import { CosmicBackground } from '@/components/cosmic/CosmicBackground';

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead 
        title="About Lucy AI | Meet Your Intelligent AI Companion"
        description="Learn about Lucy AI - an advanced AI assistant system designed by Software Engineer Terrence Milliner Sr. Discover the story, vision, and technology behind Lucy."
        keywords="about Lucy AI, AI creator, Terrence Milliner Sr, AI engineer, AI development, AI story, AI technology"
        image="/og-default.png"
        url="https://lucylounge.org/about"
        canonical="https://lucylounge.org/about"
      />
      <StructuredData 
        type="AboutPage"
        name="About Lucy AI"
        description="Lucy AI is a next-generation digital companion engineered by Terrence Milliner Sr."
      />
      
      <div className="min-h-screen relative overflow-hidden">
        <CosmicBackground />

        <div className="relative z-10">
          {/* Header */}
          <div className="container mx-auto px-4 py-8">
            <Button
              variant="ghost"
              className="text-foreground hover:bg-muted/20 border border-border/30"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Main Content */}
          <AboutLucySection />
          <FounderStorySection />
          <LucyFAQSection />

          {/* CTA Section */}
          <section className="relative py-20 px-4">
            <div className="relative z-10 max-w-3xl mx-auto glass-card-enhanced p-12 text-center shadow-glow-violet">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Experience Lucy AI
              </h2>
              <p className="text-foreground/80 mb-8 text-lg">
                Start your journey with a digital companion designed with intention and purpose
              </p>
              <Button
                size="lg"
                className="bg-gradient-button text-white hover:shadow-glow-magenta transition-all"
                onClick={() => navigate('/auth')}
              >
                Try Lucy Free
              </Button>
            </div>
          </section>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default About;
