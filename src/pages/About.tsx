import { SEOHead } from '@/components/seo/SEOHead';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AboutLucySection } from '@/components/about/AboutLucySection';
import { LucyFAQSection } from '@/components/about/LucyFAQSection';
import { FounderStorySection } from '@/components/about/FounderStorySection';

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead 
        title="About Lucy AI - Engineered by Terrence Milliner Sr."
        description="Lucy AI is a next-generation digital companion engineered and architected by Software Engineer & AI Innovator Terrence Milliner Sr. Learn about the system, the vision, and the creator behind Lucy."
        keywords="Lucy AI, Terrence Milliner, AI architect, software engineer, about Lucy, Lucy creator"
        url="https://lucylounge.org/about"
        canonical="https://lucylounge.org/about"
      />
      
      <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/30 pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="container mx-auto px-4 py-8">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
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
            <div className="relative z-10 max-w-3xl mx-auto glass-card-enhanced p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Experience Lucy AI
              </h2>
              <p className="text-white/80 mb-8 text-lg">
                Start your journey with a digital companion designed with intention and purpose
              </p>
              <Button
                size="lg"
                variant="gradient"
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
