-- Fix security warnings

-- 1. Fix search_path for messages_search_vector_update function
DROP FUNCTION IF EXISTS messages_search_vector_update() CASCADE;

CREATE OR REPLACE FUNCTION messages_search_vector_update() 
RETURNS trigger 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.content, ''));
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER messages_search_vector_trigger
BEFORE INSERT OR UPDATE OF content ON messages
FOR EACH ROW EXECUTE FUNCTION messages_search_vector_update();

-- 2. Add RLS policy for usage_stats (service role can insert)
CREATE POLICY "Service role can insert usage stats"
  ON usage_stats FOR INSERT
  WITH CHECK (true);

-- 3. Users can view their own usage stats
CREATE POLICY "Users can view their own usage stats"
  ON usage_stats FOR SELECT
  USING (auth.uid() = user_id);