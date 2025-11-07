CREATE OR REPLACE FUNCTION public.calculate_guesser_speed_score(
  started_drawing_at timestamp without time zone,
  difficulty integer,
  answered_at timestamp without time zone DEFAULT now(),
  base_score numeric DEFAULT 500
)
RETURNS numeric
LANGUAGE plpgsql
SET search_path = ''
AS $function$
DECLARE
  score_modifier numeric;
  speed_score numeric;
  speed_value numeric := 0;
BEGIN
  -- calculate score based on time taken to answer

  score_modifier := CASE difficulty
    WHEN 1 THEN 0.8 -- easy
    WHEN 2 THEN 1.0 -- medium
    WHEN 3 THEN 1.2 -- hard
    ELSE 1.0
  END;

  if (started_drawing_at IS NULL) then
    -- if a guess is made before the drawing starts, give a lower modifier (0.3)
    -- this is to discourage guessing before any drawing is done
    speed_value := 0.3;
  ELSE
    -- ensure the modifier is at between 0.4 and 1
    -- this is to ensure a score is awarded for effort if the answer took a long time
    speed_value := GREATEST(40, 100 - EXTRACT(EPOCH FROM (answered_at - started_drawing_at))) / 100;
    speed_value := LEAST(speed_value, 1);
  END IF;

  speed_score := base_score * speed_value * score_modifier;

  RETURN speed_score;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.calculate_guesser_speed_score(timestamp without time zone, integer, timestamp without time zone, numeric) TO anon, authenticated;