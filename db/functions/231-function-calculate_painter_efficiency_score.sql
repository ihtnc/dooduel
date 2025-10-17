CREATE OR REPLACE FUNCTION public.calculate_painter_efficiency_score(
  answer_times timestamp without time zone[],
  difficulty integer,
  base_score integer DEFAULT 200
)
RETURNS numeric
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  score_modifier numeric;
  efficiency_value numeric;
  efficiency_score numeric;
BEGIN
  -- calculate score based on how close the answers were made to each other

  IF (answer_times IS NULL OR array_length(answer_times, 1) = 0) THEN
    RETURN 0;
  END IF;

  score_modifier := CASE difficulty
    WHEN 1 THEN 0.8 -- easy
    WHEN 2 THEN 1.0 -- medium
    WHEN 3 THEN 1.2 -- hard
    ELSE 1.0
  END;

  SELECT (1 - stddev_pop(EXTRACT(EPOCH FROM accuracy)))
  FROM unnest(answer_times) AS accuracy
  INTO efficiency_value;

  efficiency_score := base_score * efficiency_value * score_modifier;

  RETURN efficiency_score;
END;
$function$;
