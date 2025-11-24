import { SEOHead } from '@/components/seo/SEOHead';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Twitter, Linkedin, Facebook, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LucyAvatar } from '@/components/avatar/LucyAvatar';

const Launch = () => {
  const navigate = useNavigate();

  const launchStats = [
    { label: 'Upvotes', value: '1,250+' },
    { label: 'Comments', value: '340+' },
    { label: 'Daily Active Users', value: '10K+' },
    { label: 'Rating', value: '4.9★' }
  ];

  return (
    <>
      <SEOHead 
        title="Launch Day - Lucy AI | Join the AI Revolution"
        description="Lucy AI is live on Product Hunt! Experience advanced AI with reasoning, vision, memory, and creativity. Join 10,000+ users already using Lucy AI."
        keywords="Lucy AI launch, Product Hunt, AI assistant launch, new AI tool, AI revolution"
        canonical="https://lucy-ai.app/launch"
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

          {/* Hero Section */}
          <div className="container mx-auto px-4 py-12 text-center">
            <div className="inline-block px-4 py-2 bg-accent text-accent-foreground rounded-full font-semibold mb-6 animate-pulse-glow">
              🚀 Now Live on Product Hunt!
            </div>

            <div className="flex justify-center mb-6">
              <LucyAvatar size="xl" state="happy" />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-shadow-strong">
              Lucy AI is Live!
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 text-shadow-soft">
              Join 10,000+ users experiencing the future of AI conversation
            </p>

            {/* Launch Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {launchStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/95 font-semibold text-lg px-8 py-6"
                onClick={() => navigate('/auth')}
              >
                Try Lucy AI Free
              </Button>
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg px-8 py-6"
                onClick={() => window.open('https://www.producthunt.com/posts/lucy-ai', '_blank')}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                View on Product Hunt
              </Button>
            </div>
          </div>

          {/* Screenshots Section */}
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center text-shadow-strong">
              See Lucy AI in Action
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Card className="p-2 bg-card/80 backdrop-blur-lg">
                <img 
                  src="/lucy-og-image.png" 
                  alt="Lucy AI Chat Interface"
                  className="w-full h-auto rounded-lg"
                />
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Advanced Chat Interface</h3>
                  <p className="text-sm text-muted-foreground">Real-time streaming with beautiful UI</p>
                </div>
              </Card>

              <Card className="p-2 bg-card/80 backdrop-blur-lg">
                <img 
                  src="/lucy-og-image.png" 
                  alt="Lucy AI Features"
                  className="w-full h-auto rounded-lg"
                />
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Powerful Features</h3>
                  <p className="text-sm text-muted-foreground">Vision, memory, code execution, and more</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-white mb-6 text-shadow-strong">
                Share Lucy AI with Your Network
              </h2>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
                  onClick={() => window.open('https://twitter.com/intent/tweet?text=Check out Lucy AI - Beyond Intelligence! 🚀&url=https://lucy-ai.app', '_blank')}
                >
                  <Twitter className="w-5 h-5 mr-2" />
                  Share on Twitter
                </Button>

                <Button
                  size="lg"
                  className="bg-[#0077B5] hover:bg-[#006399] text-white"
                  onClick={() => window.open('https://www.linkedin.com/sharing/share-offsite/?url=https://lucy-ai.app', '_blank')}
                >
                  <Linkedin className="w-5 h-5 mr-2" />
                  Share on LinkedIn
                </Button>

                <Button
                  size="lg"
                  className="bg-[#1877F2] hover:bg-[#166fe5] text-white"
                  onClick={() => window.open('https://www.facebook.com/sharer/sharer.php?u=https://lucy-ai.app', '_blank')}
                >
                  <Facebook className="w-5 h-5 mr-2" />
                  Share on Facebook
                </Button>
              </div>

              <div className="glass-card-enhanced p-8">
                <Star className="w-12 h-12 mx-auto mb-4 text-accent" />
                <h3 className="text-xl font-bold text-white mb-4">Love Lucy AI?</h3>
                <p className="text-white/80 mb-6">
                  Support us with an upvote on Product Hunt and help us reach more people!
                </p>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => window.open('https://www.producthunt.com/posts/lucy-ai', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Upvote on Product Hunt
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Launch;
