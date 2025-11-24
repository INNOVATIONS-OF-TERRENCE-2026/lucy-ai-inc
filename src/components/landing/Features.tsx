import { Brain, Eye, Zap, Shield, MessageSquare, Sparkles, Image, Code, Globe, Database } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Advanced Reasoning',
    description: 'Multi-step chain-of-thought analysis for complex problems with transparent reasoning process'
  },
  {
    icon: Eye,
    title: 'Vision & Multimodal',
    description: 'Analyze images, videos, documents, and PDFs with advanced computer vision capabilities'
  },
  {
    icon: Zap,
    title: 'Real-time Streaming',
    description: 'Instant responses with live streaming and token-by-token generation'
  },
  {
    icon: Database,
    title: 'Long-term Memory',
    description: 'Remembers your preferences and conversation history across all sessions'
  },
  {
    icon: Code,
    title: 'Code Execution',
    description: 'Run Python, JavaScript, and analyze data in a secure sandboxed environment'
  },
  {
    icon: Globe,
    title: 'Web Search',
    description: 'Access real-time information from the web with source citations'
  },
  {
    icon: Image,
    title: 'Image Generation',
    description: 'Create stunning AI-generated images from text descriptions'
  },
  {
    icon: MessageSquare,
    title: 'Voice Capabilities',
    description: 'Speech-to-text and text-to-speech for hands-free conversation'
  },
  {
    icon: Sparkles,
    title: 'Proactive Suggestions',
    description: 'Smart follow-up suggestions based on conversation context'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'End-to-end encryption with complete data privacy controls'
  }
];

export const Features = () => {
  return (
    <section id="features" className="relative py-20 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/20 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-shadow-strong">
            Powerful AI Features
          </h2>
          <p className="text-xl text-white/90 text-shadow-soft max-w-2xl mx-auto">
            Everything you need in a modern AI assistant, powered by cutting-edge technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="glass-card-enhanced p-6 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
