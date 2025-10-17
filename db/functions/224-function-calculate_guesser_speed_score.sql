CREATE OR REPLACE FUNCTION public.calculate_guesser_speed_score(
  started_drawing_at timestamp without time zone,
  base_score numeric DEFAULT 500
)
RETURNS numeric
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  speed_modifier numeric := 0;
  speed_score numeric;
BEGIN
  -- calculate score based on time taken to answer

  if (started_drawing_at IS NULL) then
    -- if a guess is made before the drawing starts, give a lower modifier (0.3)
    -- this is to discourage guessing before any drawing is done
    speed_modifier := 0.3;
  ELSE
    -- ensure the modifier is at least 0.4
    speed_modifier := GREATEST(40, 100 - EXTRACT(EPOCH FROM (now() - started_drawing_at))) / 100;
  END IF;

  speed_score := (base_score * speed_modifier);

  RETURN speed_score;
END;
$function$;