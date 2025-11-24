import { Card } from '@/components/ui/card';

interface OGCardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  type?: 'default' | 'thinking' | 'referral' | 'product-hunt';
  showAvatar?: boolean;
}

export const OGCard = ({
  title = 'Lucy AI',
  subtitle = 'Your Intelligent AI Companion',
  description,
  type = 'default',
  showAvatar = true,
}: OGCardProps) => {
  const getBackgroundImage = () => {
    switch (type) {
      case 'thinking':
        return 'url(/og-thinking.png)';
      case 'referral':
        return 'url(/og-referral.png)';
      case 'product-hunt':
        return 'url(/og-product-hunt.png)';
      default:
        return 'url(/og-default.png)';
    }
  };

  return (
    <Card 
      className="relative overflow-hidden rounded-2xl aspect-[1.91/1] max-w-[600px] w-full"
      style={{
        backgroundImage: getBackgroundImage(),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Custom overlay for dynamic content if needed */}
      {description && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 flex flex-col justify-end p-8">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            <p className="text-lg mb-1 opacity-90">{subtitle}</p>
            {description && (
              <p className="text-sm opacity-75">{description}</p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
