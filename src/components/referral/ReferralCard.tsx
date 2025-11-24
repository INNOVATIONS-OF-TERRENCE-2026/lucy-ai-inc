import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Copy, Gift, Users } from 'lucide-react';

export const ReferralCard = () => {
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralStats, setReferralStats] = useState({ total: 0, converted: 0 });
  const { toast } = useToast();

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get referral code from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .single();

      if (profile?.referral_code) {
        setReferralCode(profile.referral_code);

        // Get referral stats
        const { data: stats } = await supabase
          .from('referrals')
          .select('status')
          .eq('referrer_user_id', user.id);

        if (stats) {
          setReferralStats({
            total: stats.length,
            converted: stats.filter(r => r.status === 'converted').length
          });
        }
      }
    } catch (error) {
      console.error('Error loading referral data:', error);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/auth?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Referral link copied!',
      description: 'Share it with friends to earn rewards'
    });
  };

  if (!referralCode) return null;

  return (
    <Card className="p-6 bg-gradient-primary text-white">
      <div className="flex items-center gap-2 mb-4">
        <Gift className="w-6 h-6" />
        <h3 className="text-xl font-bold">Invite Friends, Get Rewards</h3>
      </div>

      <p className="mb-4 text-white/90">
        Share your unique link and both you and your friend get Pro trial access when they sign up!
      </p>

      <div className="flex gap-2 mb-4">
        <Input 
          value={`${window.location.origin}/auth?ref=${referralCode}`}
          readOnly
          className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
        />
        <Button 
          onClick={copyReferralLink}
          variant="secondary"
          size="icon"
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{referralStats.total} invited</span>
        </div>
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4" />
          <span>{referralStats.converted} converted</span>
        </div>
      </div>
    </Card>
  );
};
