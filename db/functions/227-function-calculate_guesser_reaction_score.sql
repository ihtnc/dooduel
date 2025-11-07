CREATE OR REPLACE FUNCTION public.calculate_guesser_reaction_score(
  has_correct_answer boolean,
  has_reacted boolean,
  base_score numeric DEFAULT 10
)
RETURNS numeric
LANGUAGE plpgsql
SET search_path = ''
AS $function$
DECLARE
  pity_score numeric := 290;
BEGIN
  -- calculate score based on reaction
  IF has_reacted <> TRUE THEN
    RETURN 0;
  END IF;

  -- since the absolute minimum score for correct answers is around 370,
  --   add a pity score to players who has reacted but not answered correctly
  -- this is to encourage players to react even if they don't know the answer
  --   since reactions are used to calculate the painter's score
  --   even though in reality, base reaction score is only 10
  IF has_correct_answer = TRUE THEN
    RETURN base_score;
  ELSE
    RETURN pity_score + base_score;
  END IF;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.calculate_guesser_reaction_score(boolean, boolean, numeric) TO anon, authenticated;