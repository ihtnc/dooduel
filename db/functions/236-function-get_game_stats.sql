CREATE OR REPLACE FUNCTION app.get_game_stats(completed_game_id integer)
  RETURNS TABLE(
    round_id integer,
    round_start timestamp without time zone,
    painter_score numeric,
    total_correct bigint,
    total_incorrect bigint,
    total_attempts bigint,
    first_correct timestamp without time zone,
    draw_start timestamp without time zone,
    draw_end timestamp without time zone,
    stroke_count bigint,
    brush_size_count bigint,
    brush_color_count bigint,
    star_count bigint,
    love_count bigint,
    like_count bigint,
    happy_count bigint,
    amused_count bigint,
    surprised_count bigint,
    confused_count bigint,
    disappointed_count bigint,
    positive_reaction_count bigint,
    neutral_reaction_count bigint,
    negative_reaction_count bigint,
    reaction_count bigint
  )
  LANGUAGE plpgsql
  SET search_path = app, public
AS $function$
BEGIN
  -- ensure target game is completed
  CREATE TEMP TABLE IF NOT EXISTS tmp_round_details ON COMMIT DROP AS
  SELECT id as game_id, id AS round_id, created_at AS round_start, 0::numeric AS painter_score FROM public.game LIMIT 0;

  INSERT INTO tmp_round_details(game_id, round_id, round_start, painter_score)
  SELECT
    g.id AS game_id,
    gr.id AS round_id,
    gr.created_at as round_start,
    (pt.speed_score + pt.accuracy_score + pt.efficiency_score + pt.reaction_score) AS painter_score
  FROM game g
  JOIN game_state gs
    ON g.id = gs.game_id
  JOIN game_rounds gr
    ON g.id = gr.game_id
  JOIN player_turn pt
    ON gr.id = pt.game_rounds_id AND gr.painter_id = pt.player_id
  WHERE g.id = completed_game_id
    AND gs.status = 'completed';

  IF NOT EXISTS (SELECT 1 FROM tmp_round_details LIMIT 1) THEN
    RETURN;
  END IF;

  -- get player attempt stats
  CREATE TEMP TABLE IF NOT EXISTS tmp_player_attempt_stats ON COMMIT DROP AS
  SELECT
    game_rounds_id,
    SUM(1) AS total_correct,
    SUM(1) AS total_incorrect,
    COUNT(game_rounds_id) AS total_attempts,
    MIN(created_at) AS first_correct
  FROM public.player_attempts
  GROUP BY game_rounds_id
  LIMIT 0;

  INSERT INTO tmp_player_attempt_stats(game_rounds_id, total_correct, total_incorrect, total_attempts, first_correct)
  SELECT
    pa.game_rounds_id,
    SUM(CASE WHEN pt.id IS NOT NULL THEN 1 ELSE 0 END) AS total_correct,
    SUM(CASE WHEN pt.id IS NULL THEN 1 ELSE 0 END) AS total_incorrect,
    COUNT(pa.game_rounds_id) AS total_attempts,
    MIN(pt.created_at) AS first_correct
  FROM player_attempts pa
  JOIN tmp_round_details rd
    ON pa.game_rounds_id = rd.round_id
  LEFT JOIN player_turn pt
    ON pa.id = pt.correct_attempt_id AND pt.is_painter = FALSE
  GROUP BY pa.game_rounds_id;

  -- get game canvas stats
  CREATE TEMP TABLE IF NOT EXISTS tmp_game_canvas_stats ON COMMIT DROP AS
  SELECT
    game_rounds_id,
    MIN(created_at) AS draw_start,
    MAX(created_at) AS draw_end,
    COUNT(game_rounds_id) AS stroke_count
  FROM public.game_canvas
  GROUP BY game_rounds_id
  LIMIT 0;

  INSERT INTO tmp_game_canvas_stats(game_rounds_id, draw_start, draw_end, stroke_count)
  SELECT
    game_canvas.game_rounds_id,
    MIN(game_canvas.created_at) AS draw_start,
    MAX(game_canvas.created_at) AS draw_end,
    COUNT(game_canvas.id) as stroke_count
  FROM game_canvas
  JOIN tmp_round_details rd
    ON game_canvas.game_rounds_id = rd.round_id
  GROUP BY game_canvas.game_rounds_id;

  -- get brush size stats
  CREATE TEMP TABLE IF NOT EXISTS tmp_brush_size_stats ON COMMIT DROP AS
  SELECT
    game_rounds_id,
    COUNT(game_rounds_id) AS brush_size_count
  FROM public.game_canvas
  GROUP BY game_rounds_id
  LIMIT 0;

  INSERT INTO tmp_brush_size_stats(game_rounds_id, brush_size_count)
  SELECT
    temp.game_rounds_id,
    COUNT(temp.brush_size) as brush_size_count
  FROM (
    SELECT DISTINCT game_canvas.game_rounds_id, game_canvas.brush_size
    FROM game_canvas
    JOIN tmp_round_details rd
      ON game_canvas.game_rounds_id = rd.round_id
  ) AS temp
  GROUP BY temp.game_rounds_id;

  --get brush color stats
  CREATE TEMP TABLE IF NOT EXISTS tmp_brush_color_stats ON COMMIT DROP AS
  SELECT
    game_rounds_id,
    COUNT(game_rounds_id) AS brush_color_count
  FROM public.game_canvas
  GROUP BY game_rounds_id
  LIMIT 0;

  INSERT INTO tmp_brush_color_stats(game_rounds_id, brush_color_count)
  SELECT
    temp.game_rounds_id,
    COUNT(temp.brush_color) as brush_color_count
  FROM (
    SELECT DISTINCT game_rounds_id, brush_color
    FROM game_canvas
    JOIN tmp_round_details rd
      ON game_canvas.game_rounds_id = rd.round_id
  ) AS temp
  GROUP BY temp.game_rounds_id;

  -- get reaction stats
  CREATE TEMP TABLE IF NOT EXISTS tmp_reaction_stats ON COMMIT DROP AS
  SELECT
    game_rounds_id,
    SUM(game_rounds_id) AS star_count,
    SUM(game_rounds_id) AS love_count,
    SUM(game_rounds_id) AS like_count,
    SUM(game_rounds_id) AS happy_count,
    SUM(game_rounds_id) AS amused_count,
    SUM(game_rounds_id) AS surprised_count,
    SUM(game_rounds_id) AS confused_count,
    SUM(game_rounds_id) AS disappointed_count,
    SUM(game_rounds_id) AS positive_reaction_count,
    SUM(game_rounds_id) AS neutral_reaction_count,
    SUM(game_rounds_id) AS negative_reaction_count,
    COUNT(game_rounds_id) AS reaction_count
  FROM public.game_reactions
  GROUP BY game_rounds_id
  LIMIT 0;

  INSERT INTO tmp_reaction_stats(
    game_rounds_id,
    star_count,
    love_count,
    like_count,
    happy_count,
    amused_count,
    surprised_count,
    confused_count,
    disappointed_count,
    positive_reaction_count,
    neutral_reaction_count,
    negative_reaction_count,
    reaction_count
  )
  SELECT
    r.game_rounds_id,
    SUM(CASE WHEN r.reaction = 'star' THEN 1 ELSE 0 END) AS star_count,
    SUM(CASE WHEN r.reaction = 'love' THEN 1 ELSE 0 END) AS love_count,
    SUM(CASE WHEN r.reaction = 'like' THEN 1 ELSE 0 END) AS like_count,
    SUM(CASE WHEN r.reaction = 'happy' THEN 1 ELSE 0 END) AS happy_count,
    SUM(CASE WHEN r.reaction = 'amused' THEN 1 ELSE 0 END) AS amused_count,
    SUM(CASE WHEN r.reaction = 'surprised' THEN 1 ELSE 0 END) AS surprised_count,
    SUM(CASE WHEN r.reaction = 'confused' THEN 1 ELSE 0 END) AS confused_count,
    SUM(CASE WHEN r.reaction = 'disappointed' THEN 1 ELSE 0 END) AS disappointed_count,
    SUM(CASE WHEN r.reaction = 'star' OR r.reaction = 'love' OR r.reaction = 'like' THEN 1 ELSE 0 END) AS positive_reaction_count,
    SUM(CASE WHEN r.reaction = 'happy' OR r.reaction = 'amused' OR r.reaction = 'surprised' THEN 1 ELSE 0 END) AS neutral_reaction_count,
    SUM(CASE WHEN r.reaction = 'confused' OR r.reaction = 'disappointed' THEN 1 ELSE 0 END) AS negative_reaction_count,
    COUNT(r.game_rounds_id) AS reaction_count
  FROM game_reactions r
  JOIN game_rounds gr
    ON r.game_rounds_id = gr.id
  JOIN tmp_round_details rd
    ON r.game_rounds_id = rd.round_id
  GROUP BY r.game_rounds_id;

  RETURN QUERY
  SELECT
    rd.round_id,
    rd.round_start,
    rd.painter_score,
    COALESCE(pas.total_correct, 0) AS total_correct,
    COALESCE(pas.total_incorrect, 0) AS total_incorrect,
    COALESCE(pas.total_attempts, 0) AS total_attempts,
    pas.first_correct AS first_correct,
    gc.draw_start,
    gc.draw_end,
    gc.stroke_count,
    bss.brush_size_count,
    bcs.brush_color_count,
    COALESCE(rs.star_count, 0) AS star_count,
    COALESCE(rs.love_count, 0) AS love_count,
    COALESCE(rs.like_count, 0) AS like_count,
    COALESCE(rs.happy_count, 0) AS happy_count,
    COALESCE(rs.amused_count, 0) AS amused_count,
    COALESCE(rs.surprised_count, 0) AS surprised_count,
    COALESCE(rs.confused_count, 0) AS confused_count,
    COALESCE(rs.disappointed_count, 0) AS disappointed_count,
    COALESCE(rs.positive_reaction_count, 0) AS positive_reaction_count,
    COALESCE(rs.neutral_reaction_count, 0) AS neutral_reaction_count,
    COALESCE(rs.negative_reaction_count, 0) AS negative_reaction_count,
    COALESCE(rs.reaction_count, 0) AS reaction_count
  FROM tmp_round_details rd
  JOIN tmp_game_canvas_stats gc
    ON rd.round_id = gc.game_rounds_id
  LEFT JOIN tmp_player_attempt_stats pas
    ON rd.round_id = pas.game_rounds_id
  JOIN tmp_brush_size_stats bss
    ON rd.round_id = bss.game_rounds_id
  JOIN tmp_brush_color_stats bcs
    ON rd.round_id = bcs.game_rounds_id
  LEFT JOIN tmp_reaction_stats rs
    ON rd.round_id = rs.game_rounds_id;
END;
$function$;
