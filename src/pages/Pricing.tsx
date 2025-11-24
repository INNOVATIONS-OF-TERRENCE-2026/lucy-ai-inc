import { SEOHead } from '@/components/seo/SEOHead';
import { Pricing as PricingSection } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CosmicBackground } from '@/components/cosmic/CosmicBackground';

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead 
        title="Pricing - Lucy AI | Affordable AI Plans for Everyone"
        description="Flexible AI pricing plans for Lucy AI. Start free or upgrade to Pro for unlimited access. Best value AI assistant 2025. No credit card required to start."
        keywords="AI pricing, Lucy AI plans, AI subscription, affordable AI, AI assistant pricing, free AI chat, AI pro plans"
        image="/og-pricing.png"
        url="https://lucylounge.org/pricing"
        canonical="https://lucylounge.org/pricing"
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
