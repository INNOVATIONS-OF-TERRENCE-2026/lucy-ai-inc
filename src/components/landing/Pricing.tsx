import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '100 messages per month',
      'Basic AI models',
      'Image analysis',
      'Voice input',
      'Standard support'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'For power users and professionals',
    features: [
      'Unlimited messages',
      'All premium AI models',
      'Advanced reasoning',
      'Code execution',
      'Web search access',
      'Image generation',
      'Priority support',
      'Early access to features'
    ],
    cta: 'Start Pro Trial',
    popular: true
  },
  {
    name: 'Team',
    price: '$49',
    period: 'per month',
    description: 'Collaboration for teams',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Shared conversations',
      'Team analytics',
      'Admin controls',
      'Custom integrations',
      'Dedicated support'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

export const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="relative py-20 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/30 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-shadow-strong">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-white/90 text-shadow-soft">
            Choose the plan that fits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`glass-card-enhanced p-8 hover:scale-105 transition-all duration-300 relative ${
                plan.popular ? 'ring-2 ring-accent shadow-glow-accent' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/70">/{plan.period}</span>
                </div>
                <p className="text-white/80 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-white/90 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${
                  plan.popular 
                    ? 'bg-accent text-accent-foreground hover:bg-accent/90' 
                    : 'bg-white text-primary hover:bg-white/90'
                }`}
                size="lg"
                onClick={() => navigate('/auth')}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
