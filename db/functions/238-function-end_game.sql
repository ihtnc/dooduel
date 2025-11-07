CREATE OR REPLACE FUNCTION app.end_game(game_state_id integer)
  RETURNS boolean
  SET search_path = ''
AS $$
  DECLARE game_record record;
  DECLARE available_players integer;
  DECLARE game_round integer;
  DECLARE game_status public.status;
  DECLARE current_game_rounds_id integer;
BEGIN
  -- ensure target game is on gameend status
  SELECT * FROM public.game_state
  WHERE public.game_state.status = 'gameend'
    AND public.game_state.id = game_state_id
  INTO game_record;

  IF NOT FOUND then
    RETURN FALSE;
  END IF;

  -- add reaction scores for painters
  UPDATE public.player_turn pt
  SET reaction_score = reactions.reaction_score
  FROM (
    SELECT gr.game_id, gr.id as game_rounds_id, gr.painter_id, public.calculate_painter_reaction_score(array_agg(r.reaction)) AS reaction_score
    FROM public.game g
    JOIN public.game_rounds gr ON g.id = gr.game_id
    JOIN public.game_reactions r ON gr.id = r.game_rounds_id AND gr.painter_id <> r.player_id
    GROUP BY gr.game_id, gr.id, gr.painter_id
  ) reactions
  WHERE pt.game_rounds_id = reactions.game_rounds_id
    AND pt.player_id = reactions.painter_id
    AND reactions.game_id = game_record.game_id;

  -- get all player reaction scores for the round
  CREATE TEMP TABLE IF NOT EXISTS tmp_player_scores ON COMMIT DROP AS
  SELECT id, score as total_score FROM public.player LIMIT 0;

  -- add scores from reactions
  INSERT INTO tmp_player_scores(id, total_score)
  SELECT
    p.id,
    SUM(COALESCE(t.reaction_score, 0)) AS total_score
  FROM public.player p
  LEFT JOIN public.player_turn t
    ON p.id = t.player_id
  WHERE p.game_id = game_record.game_id
  GROUP BY p.id;

  -- update player scores for the round
  UPDATE public.player p
  SET score = score + tmp.total_score
  FROM tmp_player_scores tmp
  WHERE p.id = tmp.id;

  -- update game state
  UPDATE public.game_state
  SET
    current_player_id = NULL,
    current_round = NULL,
    status = 'completed',
    updated_at = now()
  WHERE id = game_record.id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;