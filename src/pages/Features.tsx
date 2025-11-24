import { SEOHead } from '@/components/seo/SEOHead';
import { Features as FeaturesSection } from '@/components/landing/Features';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LucyAvatar } from '@/components/avatar/LucyAvatar';

const Features = () => {
  const navigate = useNavigate();

  const detailedFeatures = [
    {
      category: 'AI Capabilities',
      items: [
        { name: 'Advanced Reasoning Engine', description: 'Multi-step chain-of-thought analysis with transparent reasoning process' },
        { name: 'Vision & Multimodal', description: 'Analyze images, videos, PDFs, and documents with AI' },
        { name: 'Long-term Memory', description: 'Remembers your preferences across all sessions' },
        { name: 'Code Execution', description: 'Run Python and JavaScript in secure sandbox' },
        { name: 'Web Search', description: 'Real-time information with source citations' },
        { name: 'Image Generation', description: 'Create AI images from text descriptions' }
      ]
    },
    {
      category: 'User Experience',
      items: [
        { name: 'Real-time Streaming', description: 'Token-by-token response generation' },
        { name: 'Voice Capabilities', description: 'Speech-to-text and text-to-speech' },
        { name: 'Proactive Suggestions', description: 'Context-aware follow-up recommendations' },
        { name: 'Animated Avatar', description: 'Lucy avatar with emotional expressions' },
        { name: 'Smart Backgrounds', description: 'Dynamic 4K HDR nature scenes' },
        { name: 'Dark/Light Modes', description: 'Beautiful themes for any preference' }
      ]
    },
    {
      category: 'Collaboration',
      items: [
        { name: 'Multi-user Rooms', description: 'Real-time collaborative conversations' },
        { name: 'Share Conversations', description: 'Create secure shareable links' },
        { name: 'Team Workspaces', description: 'Organize and collaborate with teams' },
        { name: 'Export Options', description: 'TXT, MD, JSON export formats' }
      ]
    },
    {
      category: 'Developer Tools',
      items: [
        { name: 'Full-text Search', description: 'Search across all conversations' },
        { name: 'Conversation Folders', description: 'Organize with tags and folders' },
        { name: 'Analytics Dashboard', description: 'Track usage and performance' },
        { name: 'API Access', description: 'Integrate Lucy into your workflows' }
      ]
    }
  ];

  return (
    <>
      <SEOHead 
        title="Features - Lucy AI | Advanced AI Capabilities"
        description="Explore Lucy AI's powerful features: advanced reasoning, vision, memory, code execution, web search, and more. Experience the future of AI conversation."
        keywords="Lucy AI features, AI capabilities, multimodal AI, code execution, image generation, voice AI, AI memory"
        canonical="https://lucy-ai.app/features"
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
            <div className="flex justify-center mb-6">
              <LucyAvatar size="lg" state="focused" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-shadow-strong">
              Powerful AI Features
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-12 text-shadow-soft">
              Everything you need in a modern AI assistant, powered by cutting-edge technology
            </p>
          </div>

          {/* Features Grid */}
          <FeaturesSection />

          {/* Detailed Feature Comparison */}
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center text-shadow-strong">
                Complete Feature List
              </h2>

              <div className="space-y-12">
                {detailedFeatures.map((category, index) => (
                  <div key={index} className="glass-card-enhanced p-8">
                    <h3 className="text-2xl font-bold text-white mb-6">{category.category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                          <div>
                            <div className="font-semibold text-white">{item.name}</div>
                            <div className="text-sm text-white/70">{item.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center mt-12">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/95 font-semibold text-lg px-8 py-6"
                  onClick={() => navigate('/auth')}
                >
                  Try Lucy AI Free
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

export default Features;
