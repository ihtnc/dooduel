CREATE OR REPLACE FUNCTION public.calculate_painter_reaction_score(
  reactions reaction[],
  base_score integer DEFAULT 200
)
RETURNS numeric
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  positive_multiplier numeric := 1.25;
  neutral_multiplier numeric := 1;
  negative_multiplier numeric := -0.50;
  -- since positive_multiplier is greater than 1, adjust the base_score value to keep max score = base_score
  adjusted_base_score numeric := base_score / (positive_multiplier);
  total_count integer := 0;
  positive_count integer := 0;
  neutral_count integer := 0;
  negative_count integer := 0;
  reaction_value numeric;
  reaction_score numeric;
BEGIN
  -- calculate score based on how many players provided reactions

  -- if no reactions were provided, score 0 points
  IF reactions IS NULL OR COALESCE(array_length(reactions, 1), 0) = 0 THEN
    RETURN 0;
  END IF;

  -- count reaction types
  SELECT
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE r = 'star' OR r = 'love' OR r = 'like') as positive_count,
    COUNT(*) FILTER (WHERE r = 'happy' OR r = 'amused' OR r = 'surprised') as neutral_count,
    COUNT(*) FILTER (WHERE r = 'confused' OR r = 'disappointed') as negative_count
  INTO total_count, positive_count, neutral_count, negative_count
  FROM unnest(reactions) AS r;

  reaction_value :=
    (positive_count * positive_multiplier / total_count) +
    (neutral_count * neutral_multiplier / total_count) +
    (negative_count * negative_multiplier / total_count);

  reaction_score := adjusted_base_score * reaction_value;

  RETURN reaction_score;
END;
$function$;
