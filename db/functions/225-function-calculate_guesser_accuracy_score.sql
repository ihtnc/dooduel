CREATE OR REPLACE FUNCTION public.calculate_guesser_accuracy_score(
  accuracy numeric,
  base_score numeric DEFAULT 50
)
RETURNS numeric
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  accuracy_score numeric;
BEGIN
  -- calculate score based on accuracy of the answer

  accuracy_score := (base_score * accuracy);

  RETURN accuracy_score;
END;
$function$;