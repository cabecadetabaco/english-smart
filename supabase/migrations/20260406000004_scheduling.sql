-- 004: Scheduling
-- Creates class_schedules table with RLS

CREATE TABLE IF NOT EXISTS public.class_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scheduled_date TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('live', 'makeup')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_class_schedules_student_id ON public.class_schedules(student_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_date ON public.class_schedules(scheduled_date);

-- RLS
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own schedules"
  ON public.class_schedules FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own schedules"
  ON public.class_schedules FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can view all schedules"
  ON public.class_schedules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all schedules"
  ON public.class_schedules FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
