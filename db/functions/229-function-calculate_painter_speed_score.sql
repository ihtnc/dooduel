CREATE OR REPLACE FUNCTION public.calculate_painter_speed_score(
  round_start timestamp without time zone,
  stroke_start timestamp without time zone,
  stroke_end timestamp without time zone,
  difficulty integer,
  base_score integer DEFAULT 300
)
RETURNS numeric
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  base_startup_score numeric := base_score * 0.5;
  base_duration_score numeric := base_score * 0.5;
  difficulty_modifier numeric;
  startup_value numeric;
  duration_value numeric;
  startup_score numeric;
  duration_score numeric;
BEGIN
  -- calculate score based on how fast the painter is

  IF round_start IS NULL OR stroke_start IS NULL THEN
    RETURN 0;
  END IF;

  -- calculate score based on how fast the painter started painting
  difficulty_modifier := CASE difficulty
    WHEN 1 THEN 0.8 -- easy
    WHEN 2 THEN 1.0 -- medium
    WHEN 3 THEN 1.2 -- hard
    ELSE 1.0
  END;

  -- ensure the modifier is between 0.4 and 1
  -- this is to ensure a score is awarded for effort if the painter took a long time to start
  startup_value := GREATEST(40, 100 - EXTRACT(EPOCH FROM (stroke_start - round_start))) / 100;
  startup_value := LEAST(startup_value, 1);
  startup_score := base_startup_score * startup_value * difficulty_modifier;

  -- ====================================================================
  -- IMPORTANT! The logic below assumes a painting duration of 60 seconds
  -- ====================================================================

  -- calculate score based on how long the painter took to paint

  -- ensure the modifier is between 0 and 1
  -- no minimum score for long painting duration to encourage faster painting
  -- NOTE: needs to be adjusted if the painting duration changes
  duration_value := GREATEST(0, 60 - EXTRACT(EPOCH FROM (stroke_end - stroke_start))) / 60;
  duration_value := LEAST(duration_value, 1);
  duration_score := base_duration_score * duration_value;

  RETURN startup_score + duration_score;
END;
$function$;
