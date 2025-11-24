import { SEOHead } from '@/components/seo/SEOHead';
import { Pricing as PricingSection } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead 
        title="Pricing - Lucy AI | Simple, Transparent Plans"
        description="Choose the perfect Lucy AI plan for your needs. Free forever plan available. Pro and Team plans with advanced features, unlimited usage, and priority support."
        keywords="Lucy AI pricing, AI assistant plans, free AI chat, pro AI features, team collaboration"
        canonical="https://lucy-ai.app/pricing"
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

          {/* Pricing Section */}
          <PricingSection />

          {/* FAQ Section */}
          <div className="py-12">
            <FAQ />
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Pricing;
