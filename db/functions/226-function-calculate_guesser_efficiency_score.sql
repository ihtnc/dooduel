CREATE OR REPLACE FUNCTION public.calculate_guesser_efficiency_score(
  attempt_accuracies numeric[],
  difficulty integer,
  base_score numeric DEFAULT 440
)
RETURNS numeric
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  base_quality_score numeric := base_score * 0.6;
  base_quantity_score numeric := base_score * 0.4;
  phi numeric := (1 + SQRT(5)) / 2;
  fib_n numeric;
  difficulty_modifier numeric;
  input record;
  quantity_value numeric;
  quality_score numeric;
  quantity_score numeric;
  efficiency_score numeric;
BEGIN
  -- calculate score based on efficiency of guesses

  SELECT
    (1 - stddev_pop(a.accuracy)) as attempt_accuracy,
    COUNT(a.accuracy) as attempt_count
  INTO input
  FROM (
    SELECT UNNEST(attempt_accuracies) as accuracy
  ) AS a;

  -- calculate quality component of efficiency
  quality_score := base_quality_score * input.attempt_accuracy;

  -- calculate quantity component of efficiency
  -- calculate the penalty for quantity
  --   fibonacci approximation for number of attempts using Binet's formula
  --     n = attempt count
  --     phi = (1 + sqrt(5)) / 2
  --     fib(n) = (phi^n - (1 - phi)^n) / sqrt(5)
  fib_n := (phi^input.attempt_count - (1 - phi)^input.attempt_count) / sqrt(5);

  -- calculate difficulty modifier
  difficulty_modifier := (CASE
    WHEN difficulty = 1 THEN 5
    WHEN difficulty = 2 THEN 3.5
    WHEN difficulty = 3 THEN 2
    ELSE 1
    END
  );

  -- adjust penalty based on difficulty
  --   easy: fib(n)^5, medium: fib(n)^3.5, hard: fib(n)^2
  --   this means attempts are penalized more heavily on easy words than hard words
  fib_n := fib_n ^ difficulty_modifier;

  -- calculate quantity based off the penalty (prevent negative values)
  -- since fib(1) = 1, ensure that the penalty is not applied when there's only one attempt
  -- ensure the value does not go below 25 to acknowledge the effort
  quantity_value := CASE
    WHEN input.attempt_count > 1 THEN GREATEST(100 - fib_n, 25)
    ELSE 100
    END;

  -- calculate quantity score
  quantity_score := base_quantity_score * quantity_value / 100;

  RETURN quality_score + quantity_score;
END;
$function$;