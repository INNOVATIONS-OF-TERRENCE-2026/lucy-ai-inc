-- Analytics tables for public launch tracking
CREATE TABLE IF NOT EXISTS public.page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  referrer TEXT,
  device_type TEXT,
  browser TEXT,
  country TEXT,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_page_analytics_created_at ON public.page_analytics(created_at DESC);
CREATE INDEX idx_page_analytics_page_path ON public.page_analytics(page_path);

-- Referral system
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  reward_granted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_user_id);
CREATE INDEX idx_referrals_code ON public.referrals(referral_code);

-- Enable RLS
ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Analytics policies (public insert, admin view)
CREATE POLICY "Anyone can insert analytics" ON public.page_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view analytics" ON public.page_analytics
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Referral policies
CREATE POLICY "Users can view their referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_user_id);

CREATE POLICY "Users can create referrals" ON public.referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_user_id);

CREATE POLICY "System can update referrals" ON public.referrals
  FOR UPDATE USING (true);

-- Add referral_code to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pro_trial_until TIMESTAMP WITH TIME ZONE;

-- Generate referral codes for existing users
UPDATE public.profiles 
SET referral_code = substring(md5(random()::text) from 1 for 8)
WHERE referral_code IS NULL;