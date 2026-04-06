-- 003: Progress Tracking
-- Creates lesson_progress table with auto-calculation trigger and RLS

CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  video_done BOOL NOT NULL DEFAULT false,
  slides_done BOOL NOT NULL DEFAULT false,
  listen_repeat_done BOOL NOT NULL DEFAULT false,
  exercises_done BOOL NOT NULL DEFAULT false,
  live_class_done BOOL NOT NULL DEFAULT false,
  task_done BOOL NOT NULL DEFAULT false,
  mission_submitted BOOL NOT NULL DEFAULT false,
  mission_grade DECIMAL(4,2),
  mission_graded_at TIMESTAMPTZ,
  mission_graded_by UUID REFERENCES public.profiles(id),
  completion_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, lesson_id)
);

-- Trigger function: calculate weighted completion percentage
CREATE OR REPLACE FUNCTION public.calculate_lesson_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  pct DECIMAL(5,2);
BEGIN
  pct := 0;

  IF NEW.video_done THEN pct := pct + 25; END IF;
  IF NEW.slides_done THEN pct := pct + 15; END IF;
  IF NEW.listen_repeat_done THEN pct := pct + 15; END IF;
  IF NEW.exercises_done THEN pct := pct + 15; END IF;
  IF NEW.live_class_done THEN pct := pct + 15; END IF;
  IF NEW.task_done THEN pct := pct + 10; END IF;
  IF NEW.mission_submitted THEN pct := pct + 5; END IF;

  NEW.completion_percentage := pct;

  IF pct >= 100 AND NEW.completed_at IS NULL THEN
    NEW.completed_at := now();
  END IF;

  IF pct < 100 THEN
    NEW.completed_at := NULL;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_calculate_lesson_progress ON public.lesson_progress;
CREATE TRIGGER trg_calculate_lesson_progress
  BEFORE INSERT OR UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_lesson_progress();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lesson_progress_student_id ON public.lesson_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);

-- RLS
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own progress"
  ON public.lesson_progress FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Admins can view all progress"
  ON public.lesson_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Students can upsert own progress"
  ON public.lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own progress"
  ON public.lesson_progress FOR UPDATE
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can update all progress"
  ON public.lesson_progress FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
