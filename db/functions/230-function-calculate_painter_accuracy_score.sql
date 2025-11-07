CREATE OR REPLACE FUNCTION public.calculate_painter_accuracy_score(
  correct_players integer,
  attempted_players integer,
  difficulty integer,
  base_score integer DEFAULT 200
)
RETURNS numeric
LANGUAGE plpgsql
SET search_path = ''
AS $function$
DECLARE
  effort_score numeric := 100;
  score_modifier numeric;
  accuracy_value numeric;
  accuracy_score numeric;
BEGIN
  -- calculate score based on how many players guessed correctly

  accuracy_value := LEAST(1, COALESCE(correct_players / NULLIF(attempted_players, 0), 0));

  score_modifier := CASE difficulty
    WHEN 1 THEN 0.8 -- easy
    WHEN 2 THEN 1.0 -- medium
    WHEN 3 THEN 1.2 -- hard
    ELSE 1.0
  END;

  accuracy_score := (base_score - effort_score) * accuracy_value;

  -- ensure a score is awarded for effort if no players guessed correctly
  RETURN (accuracy_score  * score_modifier) + (effort_score * score_modifier);
END;
$function$;

GRANT EXECUTE ON FUNCTION public.calculate_painter_accuracy_score(integer, integer, integer, integer) TO anon, authenticated;