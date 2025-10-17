CREATE OR REPLACE FUNCTION public.calculate_painter_efficiency_score(
  correct_answer_times timestamp without time zone[],
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
  stroke_duration numeric;
  score_modifier numeric;
  efficiency_value numeric;
  efficiency_score numeric;
BEGIN
  -- calculate score based on how close the answer durations were to the total stroke duration

  IF stroke_start IS NULL OR stroke_end IS NULL THEN
    RETURN 0;
  END IF;

  IF (correct_answer_times IS NULL OR COALESCE(array_length(correct_answer_times, 1), 0) = 0) THEN
    RETURN 0;
  END IF;

  score_modifier := CASE difficulty
    WHEN 1 THEN 0.8 -- easy
    WHEN 2 THEN 1.0 -- medium
    WHEN 3 THEN 1.2 -- hard
    ELSE 1.0
  END;

  SELECT EXTRACT(EPOCH FROM stroke_end - stroke_start) INTO stroke_duration;

  CREATE TEMP TABLE IF NOT EXISTS tmp_durations ON COMMIT DROP AS
  SELECT EXTRACT(EPOCH FROM now()) as duration LIMIT 0;

  -- add value for each correct answer
  INSERT INTO tmp_durations(duration)
  SELECT EXTRACT(EPOCH FROM accuracy - stroke_start) / stroke_duration
  FROM unnest(correct_answer_times) AS accuracy;

  -- add value for stroke duration
  INSERT INTO tmp_durations(duration)
  VALUES(stroke_duration / stroke_duration);

  SELECT (1 - stddev_pop(duration)) INTO efficiency_value
  FROM tmp_durations;

  efficiency_score := base_score * efficiency_value * score_modifier;

  RETURN efficiency_score;
END;
$function$;
