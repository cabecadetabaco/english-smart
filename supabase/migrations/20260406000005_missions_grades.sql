-- 005: Missions & Grades
-- Trigger to notify when a grade is launched, plus admin update policy

-- Trigger function: create notification when mission is graded
CREATE OR REPLACE FUNCTION public.notify_grade_launched()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF OLD.mission_grade IS NULL AND NEW.mission_grade IS NOT NULL THEN
    INSERT INTO public.notifications (student_id, type, title, message, reference_id)
    VALUES (
      NEW.student_id,
      'grade',
      'Nota da Missao Disponivel',
      'Sua missao foi corrigida! Nota: ' || NEW.mission_grade,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Note: trigger will be created after notifications table exists (in 006)
