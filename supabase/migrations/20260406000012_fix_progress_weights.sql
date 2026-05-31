-- 012: Fix Progress Weights
-- Unify weights: 15,15,15,15,15,15,10 (matching client-side calculation)
-- Previous trigger had: video=25, task=10, mission=5 which caused desync

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

  IF NEW.video_done THEN pct := pct + 15; END IF;
  IF NEW.slides_done THEN pct := pct + 15; END IF;
  IF NEW.listen_repeat_done THEN pct := pct + 15; END IF;
  IF NEW.exercises_done THEN pct := pct + 15; END IF;
  IF NEW.live_class_done THEN pct := pct + 15; END IF;
  IF NEW.task_done THEN pct := pct + 15; END IF;
  IF NEW.mission_submitted THEN pct := pct + 10; END IF;

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

-- Recalculate all existing lesson_progress records
UPDATE public.lesson_progress SET
  completion_percentage = (
    (CASE WHEN video_done THEN 15 ELSE 0 END) +
    (CASE WHEN slides_done THEN 15 ELSE 0 END) +
    (CASE WHEN listen_repeat_done THEN 15 ELSE 0 END) +
    (CASE WHEN exercises_done THEN 15 ELSE 0 END) +
    (CASE WHEN live_class_done THEN 15 ELSE 0 END) +
    (CASE WHEN task_done THEN 15 ELSE 0 END) +
    (CASE WHEN mission_submitted THEN 10 ELSE 0 END)
  ),
  completed_at = CASE
    WHEN (
      (CASE WHEN video_done THEN 15 ELSE 0 END) +
      (CASE WHEN slides_done THEN 15 ELSE 0 END) +
      (CASE WHEN listen_repeat_done THEN 15 ELSE 0 END) +
      (CASE WHEN exercises_done THEN 15 ELSE 0 END) +
      (CASE WHEN live_class_done THEN 15 ELSE 0 END) +
      (CASE WHEN task_done THEN 15 ELSE 0 END) +
      (CASE WHEN mission_submitted THEN 10 ELSE 0 END)
    ) >= 100 THEN COALESCE(completed_at, now())
    ELSE NULL
  END;
