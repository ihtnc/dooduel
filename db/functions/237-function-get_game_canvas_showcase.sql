CREATE OR REPLACE FUNCTION public.get_game_canvas_showcase(
  current_game_id integer,
  current_player_name character varying,
  current_player_code character varying
)
  RETURNS TABLE(
    category character varying,
    round_id integer,
    word character varying,
    painter_name character varying,
    painter_avatar character varying,
    painter_score numeric,
    star_count bigint,
    love_count bigint,
    like_count bigint,
    happy_count bigint,
    amused_count bigint,
    surprised_count bigint,
    confused_count bigint,
    disappointed_count bigint,
    data jsonb,
    canvas_data jsonb
  )
  LANGUAGE plpgsql
  SET search_path = app, public
AS $function$
BEGIN
  -- ensure player is active on the target game
  IF NOT EXISTS (
    SELECT 1
    FROM game g
    JOIN game_state gs
      ON g.id = gs.game_id
    JOIN player p
      ON g.id = p.game_id
    WHERE g.id = current_game_id
      AND gs.status = 'completed'
      AND p.name ILIKE current_player_name
      AND p.code = current_player_code
      AND p.active = true
  ) THEN
    RAISE EXCEPTION 'game/player not found';
  END IF;

  -- get game stats
  CREATE TEMP TABLE IF NOT EXISTS tmp_game_stats ON COMMIT DROP AS
  SELECT
    id as round_id,
    MIN(created_at) AS round_start,
    0::numeric AS painter_score,
    SUM(id) AS total_correct,
    SUM(id) AS total_incorrect,
    COUNT(id) AS total_attempts,
    MIN(created_at) AS first_correct,
    MIN(created_at) AS draw_start,
    MAX(created_at) AS draw_end,
    COUNT(id) AS stroke_count,
    COUNT(id) AS brush_size_count,
    COUNT(id) AS brush_color_count,
    SUM(id) AS star_count,
    SUM(id) AS love_count,
    SUM(id) AS like_count,
    SUM(id) AS happy_count,
    SUM(id) AS amused_count,
    SUM(id) AS surprised_count,
    SUM(id) AS confused_count,
    SUM(id) AS disappointed_count,
    SUM(id) AS positive_reaction_count,
    SUM(id) AS neutral_reaction_count,
    SUM(id) AS negative_reaction_count,
    COUNT(id) AS reaction_count
  FROM public.game
  GROUP BY id
  LIMIT 0;

  INSERT INTO tmp_game_stats(
    round_id,
    round_start,
    painter_score,
    total_correct,
    total_incorrect,
    total_attempts,
    first_correct,
    draw_start,
    draw_end,
    stroke_count,
    brush_size_count,
    brush_color_count,
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
    gs.round_id,
    gs.round_start,
    gs.painter_score,
    gs.total_correct,
    gs.total_incorrect,
    gs.total_attempts,
    gs.first_correct,
    gs.draw_start,
    gs.draw_end,
    gs.stroke_count,
    gs.brush_size_count,
    gs.brush_color_count,
    gs.star_count,
    gs.love_count,
    gs.like_count,
    gs.happy_count,
    gs.amused_count,
    gs.surprised_count,
    gs.confused_count,
    gs.disappointed_count,
    gs.positive_reaction_count,
    gs.neutral_reaction_count,
    gs.negative_reaction_count,
    gs.reaction_count
  FROM app.get_game_stats(current_game_id) AS gs;

  CREATE TEMP TABLE IF NOT EXISTS tmp_showcase ON COMMIT DROP AS
  SELECT name AS category, id AS round_id, jsonb_build_object() AS data FROM public.game LIMIT 0;

  -- best: max(painter_score)
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Best' AS category, gs.round_id, jsonb_build_object() AS data
  FROM tmp_game_stats gs
  ORDER BY gs.painter_score DESC
  LIMIT 1;

  -- hardest: min(total_correct), max(total_incorrect), max(first_correct - draw_start)
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Hardest' AS category, gs.round_id, jsonb_build_object('Incorrect guesses', gs.total_incorrect) AS data
  FROM tmp_game_stats gs
  WHERE gs.first_correct IS NOT NULL
  ORDER BY gs.total_incorrect DESC, gs.total_correct ASC, (gs.first_correct - gs.draw_start) DESC
  LIMIT 1;

  -- easiest: max(total_correct), min(total_incorrect), min(first_correct - draw_start)
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Easiest' AS category, gs.round_id, jsonb_build_object('Correct guesses', gs.total_correct) AS data
  FROM tmp_game_stats gs
  WHERE gs.first_correct IS NOT NULL
  ORDER BY gs.total_correct DESC, gs.total_incorrect ASC, (gs.first_correct - gs.draw_start) ASC
  LIMIT 1;

  -- shortest: min(draw_end - draw_start)
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Shortest' AS category, gs.round_id, jsonb_build_object('Duration (s)', TRUNC(EXTRACT(EPOCH FROM (gs.draw_end - gs.draw_start)))) AS data
  FROM tmp_game_stats gs
  ORDER BY (gs.draw_end - gs.draw_start) ASC
  LIMIT 1;

  -- longest: max(draw_end - draw_start)
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Longest' AS category, gs.round_id, jsonb_build_object('Duration (s)', TRUNC(EXTRACT(EPOCH FROM (gs.draw_end - gs.draw_start)))) AS data
  FROM tmp_game_stats gs
  ORDER BY (gs.draw_end - gs.draw_start) DESC
  LIMIT 1;

  -- fastest: min(draw_end - round_start)
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Fastest' AS category, gs.round_id, jsonb_build_object('Duration', TRUNC(EXTRACT(EPOCH FROM (gs.draw_end - gs.round_start)))) AS data
  FROM tmp_game_stats gs
  ORDER BY (gs.draw_end - gs.round_start) ASC
  LIMIT 1;

  -- minimalist: brush_color_count = 1, brush_size_count = 1, min(stroke_count)
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Minimalist' AS category, gs.round_id, jsonb_build_object() AS data
  FROM tmp_game_stats gs
  WHERE gs.brush_color_count = 1
    AND gs.brush_size_count = 1
  ORDER BY gs.stroke_count ASC
  LIMIT 1;

  -- colorful: brush_color_count > 1, max(brush_color_count), max(stroke_count)
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Colorful' AS category, gs.round_id, jsonb_build_object() AS data
  FROM tmp_game_stats gs
  WHERE gs.brush_color_count > 1
  ORDER BY gs.brush_color_count DESC, gs.stroke_count DESC
  LIMIT 1;

  -- most-strokes: max(stroke_count)
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Most Strokes' AS category, gs.round_id, jsonb_build_object() AS data
  FROM tmp_game_stats gs
  ORDER BY gs.stroke_count DESC
  LIMIT 1;

  -- popular: reaction_count > 0, max(reaction_count)
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Popular' AS category, gs.round_id, jsonb_build_object() AS data
  FROM tmp_game_stats gs
  WHERE gs.reaction_count > 0
  ORDER BY gs.reaction_count DESC
  LIMIT 1;

  -- favourite: positive_reaction_count > 0, max(positive_reaction_count)
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Favourite' AS category, gs.round_id, jsonb_build_object() AS data
  FROM tmp_game_stats gs
  WHERE gs.positive_reaction_count > 0
  ORDER BY gs.positive_reaction_count DESC
  LIMIT 1;

  -- controversial: positive_reaction_count > 0, negative_reaction_count > 0, max(positive_reaction_count + negative_reaction_count), min(ABS(positive_reaction_count - negative_reaction_count))
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Controversial' AS category, gs.round_id, jsonb_build_object() AS data
  FROM tmp_game_stats gs
  WHERE gs.positive_reaction_count > 0
    AND gs.negative_reaction_count > 0
  ORDER BY (gs.positive_reaction_count + gs.negative_reaction_count) DESC, ABS(gs.positive_reaction_count - gs.negative_reaction_count) ASC
  LIMIT 1;

  -- most-star: star_count > 0, max(star_count)
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Most Star' AS category, gs.round_id, jsonb_build_object() AS data
  FROM tmp_game_stats gs
  WHERE gs.star_count > 0
  ORDER BY gs.star_count DESC
  LIMIT 1;

  -- most-love: love_count > 0, max(love_count)
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Most Love' AS category, gs.round_id, jsonb_build_object() AS data
  FROM tmp_game_stats gs
  WHERE gs.love_count > 0
  ORDER BY gs.love_count DESC
  LIMIT 1;

  -- top-like: like_count > 0, max(like_count)
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Top Like' AS category, gs.round_id, jsonb_build_object() AS data
  FROM tmp_game_stats gs
  WHERE gs.like_count > 0
  ORDER BY gs.like_count DESC
  LIMIT 1;

  -- top-happy: happy_count > 0, max(happy_count)
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Top Happy' AS category, gs.round_id, jsonb_build_object() AS data
  FROM tmp_game_stats gs
  WHERE gs.happy_count > 0
  ORDER BY gs.happy_count DESC
  LIMIT 1;

  -- top-amused: amused_count > 0, max(amused_count)
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Top Amused' AS category, gs.round_id, jsonb_build_object() AS data
  FROM tmp_game_stats gs
  WHERE gs.amused_count > 0
  ORDER BY gs.amused_count DESC
  LIMIT 1;

  -- top-surprised: surprised_count > 0, max(surprised_count)
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Top Surprised' AS category, gs.round_id, jsonb_build_object() AS data
  FROM tmp_game_stats gs
  WHERE gs.surprised_count > 0
  ORDER BY gs.surprised_count DESC
  LIMIT 1;

  -- top-confused: confused_count > 0, max(confused_count)
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Top Confused' AS category, gs.round_id, jsonb_build_object() AS data
  FROM tmp_game_stats gs
  WHERE gs.confused_count > 0
  ORDER BY gs.confused_count DESC
  LIMIT 1;

  -- top-disappointed: disappointed_count > 0, max(disappointed_count)
  INSERT INTO tmp_showcase(category, round_id, data)
  SELECT 'Top Disappointed' AS category, gs.round_id, jsonb_build_object() AS data
  FROM tmp_game_stats gs
  WHERE gs.disappointed_count > 0
  ORDER BY gs.disappointed_count DESC
  LIMIT 1;

  -- get canvas data
  CREATE TEMP TABLE IF NOT EXISTS tmp_canvas ON COMMIT DROP AS
  SELECT game_rounds_id AS round_id, jsonb_build_object() AS canvas_data FROM public.game_canvas LIMIT 0;

  INSERT INTO tmp_canvas(round_id, canvas_data)
  SELECT
    gs.round_id,
    json_agg(json_build_object(
      'id', gc.id,
      'brush_size', gc.brush_size,
      'brush_color', gc.brush_color,
      'from_x', gc.from_x,
      'from_y', gc.from_y,
      'to_x', gc.to_x,
      'to_y', gc.to_y
    )) as canvas_data
  FROM tmp_game_stats gs
  JOIN public.game_canvas gc on gs.round_id = gc.game_rounds_id
  GROUP BY gs.round_id;

  RETURN QUERY
  SELECT
    tmp.category,
    tmp.round_id,
    gw.value AS word,
    p.name AS painter_name,
    p.avatar AS painter_avatar,
    FLOOR(gs.painter_score) AS painter_score,
    gs.star_count,
    gs.love_count,
    gs.like_count,
    gs.happy_count,
    gs.amused_count,
    gs.surprised_count,
    gs.confused_count,
    gs.disappointed_count,
    tmp.data,
    tc.canvas_data
  FROM tmp_showcase tmp
  JOIN tmp_game_stats gs
    ON tmp.round_id = gs.round_id
  JOIN game_rounds gr
    ON tmp.round_id = gr.id
  JOIN game_words gw
    ON gr.game_word_id = gw.id
  JOIN player p
    ON gr.painter_id = p.id
  JOIN tmp_canvas tc
    ON tmp.round_id = tc.round_id;
END;
$function$;
