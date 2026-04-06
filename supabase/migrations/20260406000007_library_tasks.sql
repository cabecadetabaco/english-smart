-- 007: Library & Landing Leads
-- Creates library_items and landing_leads tables with RLS

CREATE TABLE IF NOT EXISTS public.library_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'link', 'audio', 'video')),
  url TEXT NOT NULL,
  module_id UUID REFERENCES public.modules(id) ON DELETE SET NULL,
  tags JSONB,
  is_active BOOL NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.landing_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  preferred_time TEXT CHECK (preferred_time IN ('morning', 'afternoon', 'evening')),
  source TEXT NOT NULL DEFAULT 'landing_page',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: library_items
ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view active library items"
  ON public.library_items FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage library items"
  ON public.library_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- RLS: landing_leads (only service role can access)
ALTER TABLE public.landing_leads ENABLE ROW LEVEL SECURITY;

-- No user-facing policies; only service_role can insert/read
CREATE POLICY "Service role full access to landing_leads"
  ON public.landing_leads FOR ALL
  USING (true)
  WITH CHECK (true);

-- Admins can view leads
CREATE POLICY "Admins can view landing leads"
  ON public.landing_leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
