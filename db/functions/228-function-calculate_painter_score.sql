CREATE OR REPLACE FUNCTION app.calculate_painter_score(round_id integer)
  RETURNS numeric
  LANGUAGE plpgsql
  SET search_path = app, public
AS $function$
DECLARE
  stroke_details record;
  round_details record;
  attempt_count integer;
  speed_score numeric;
  accuracy_score numeric;
  efficiency_score numeric;
  reaction_score numeric;
BEGIN
  -- get stroke details
  SELECT
    COUNT(id) as stroke_count,
    MIN(created_at) as stroke_start,
    MAX(created_at) as stroke_end
  INTO stroke_details
  FROM game_canvas
  WHERE game_rounds_id = round_id;

  -- if no strokes were made, score 0 points
  IF NOT FOUND OR COALESCE(stroke_details.stroke_count, 0) = 0 THEN
    RETURN 0;
  END IF;

  -- get relevant round details
  SELECT
    g.id as game_id,
    g.difficulty,
    gr.created_at as round_start,
    COUNT(l.id)::integer as answer_count
  FROM game g
  JOIN game_rounds gr ON g.id = gr.game_id
  JOIN game_logs l ON gr.id = l.game_rounds_id
  WHERE gr.id = round_id
  GROUP BY g.id, g.difficulty, gr.created_at
  INTO round_details;

  -- get relevant player details
  SELECT COUNT(d.player_id)::integer
  INTO attempt_count
  FROM (
    SELECT DISTINCT ga.player_id
    FROM game_answer_attempts ga
    WHERE ga.game_rounds_id = round_id
  ) d;

  -- total score = 1000

  -- max speed score=300
  speed_score := public.calculate_painter_speed_score(
    round_details.round_start,
    stroke_details.stroke_start,
    stroke_details.stroke_end,
    round_details.difficulty
  );

  -- max accuracy score=400
  accuracy_score := public.calculate_painter_accuracy_score(
    round_details.answer_count,
    attempt_count,
    round_details.difficulty
  );

  -- max efficiency score=200
  efficiency_score := public.calculate_painter_efficiency_score(
    ARRAY(
      SELECT created_at
      FROM game_logs
      WHERE game_rounds_id = round_id
    ),
    round_details.difficulty
  );

  -- max reaction score=100
  reaction_score := public.calculate_painter_reaction_score(
    ARRAY(
      SELECT reaction
      FROM game_reactions
      WHERE game_rounds_id = round_id
    )
  );

  return speed_score + accuracy_score + efficiency_score + reaction_score;
END;
$function$;
