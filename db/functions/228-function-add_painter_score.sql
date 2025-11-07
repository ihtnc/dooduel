CREATE OR REPLACE FUNCTION app.add_painter_score(round_id integer)
  RETURNS void
  LANGUAGE plpgsql
  SET search_path = ''
AS $function$
DECLARE
  stroke_details record;
  round_details record;
  attempt_count integer;
  speed_score numeric;
  accuracy_score numeric;
  efficiency_score numeric;
BEGIN
  -- ensure painter has not been scored yet for this round
  IF EXISTS (
    SELECT 1
    FROM public.player_turn
    WHERE game_rounds_id = round_id
      AND is_painter = true
  ) THEN
    RETURN;
  END IF;

  -- get stroke details
  SELECT
    COUNT(id) as stroke_count,
    MIN(created_at) as stroke_start,
    MAX(created_at) as stroke_end
  INTO stroke_details
  FROM public.game_canvas
  WHERE game_rounds_id = round_id;

  -- if no strokes were made, score 0 points
  IF NOT FOUND OR COALESCE(stroke_details.stroke_count, 0) = 0 THEN
    RETURN;
  END IF;

  -- get relevant round details
  SELECT
    g.id as game_id,
    g.difficulty,
    gr.created_at as round_start,
    gr.painter_id,
    COALESCE(COUNT(pt.correct_attempt_id)::integer, 0) as correct_answer_count,
    COALESCE(COUNT(pt.has_answered)::integer, 0) as total_attempt_count
  FROM public.game g
  JOIN public.game_rounds gr ON g.id = gr.game_id
  JOIN public.player p ON gr.painter_id = p.id
  LEFT JOIN public.player_turn pt
    ON gr.id = pt.game_rounds_id
      AND gr.painter_id <> pt.player_id
  WHERE gr.id = round_id
  GROUP BY g.id, g.difficulty, gr.created_at, gr.painter_id
  INTO round_details;

  -- total score = 1000

  -- max speed score=200
  speed_score := public.calculate_painter_speed_score(
    round_details.round_start,
    stroke_details.stroke_start,
    stroke_details.stroke_end,
    round_details.difficulty
  );

  -- max accuracy score=300
  accuracy_score := public.calculate_painter_accuracy_score(
    round_details.correct_answer_count,
    round_details.total_attempt_count,
    round_details.difficulty
  );

  -- max efficiency score=300
  efficiency_score := public.calculate_painter_efficiency_score(
    ARRAY(
      SELECT created_at
      FROM public.player_turn
      WHERE game_rounds_id = round_id
        AND correct_attempt_id IS NOT NULL
    ),
    stroke_details.stroke_start,
    stroke_details.stroke_end,
    round_details.difficulty
  );

  -- max reaction score=200
  -- reactions are scored in end_game function

  INSERT INTO public.player_turn(game_rounds_id, player_id, speed_score, accuracy_score, efficiency_score, is_painter)
  VALUES(round_id, round_details.painter_id, speed_score, accuracy_score, efficiency_score, true);
END;
$function$;

GRANT EXECUTE ON FUNCTION app.add_painter_score(integer) TO anon, authenticated;