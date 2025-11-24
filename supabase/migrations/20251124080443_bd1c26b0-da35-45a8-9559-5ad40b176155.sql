-- Create email_leads table for email capture
CREATE TABLE IF NOT EXISTS public.email_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'inline',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  subscribed BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.email_leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert email leads
CREATE POLICY "Anyone can subscribe"
  ON public.email_leads
  FOR INSERT
  WITH CHECK (true);

-- Admins can view all email leads
CREATE POLICY "Admins can view all email leads"
  ON public.email_leads
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_email_leads_email ON public.email_leads(email);
CREATE INDEX IF NOT EXISTS idx_email_leads_created_at ON public.email_leads(created_at DESC);