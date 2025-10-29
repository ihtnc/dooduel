CREATE OR REPLACE FUNCTION app.end_game_rounds(game_state_id integer)
  RETURNS boolean
  SET search_path = app, public
AS $$
  DECLARE game_record record;
  DECLARE available_players integer;
  DECLARE game_round integer;
  DECLARE game_status status;
  DECLARE current_game_rounds_id integer;
BEGIN
  -- ensure target game is on inprogress status
  SELECT * FROM public.game_state
  WHERE public.game_state.status = 'inprogress'
    AND public.game_state.id = game_state_id
  INTO game_record;

  IF NOT FOUND then
    RETURN FALSE;
  END IF;

  -- get remaining players
  SELECT COUNT(*)
  FROM public.player p
  LEFT JOIN public.game_rounds r
    ON p.id = r.painter_id
    AND p.game_id = r.game_id
    AND r.round = game_record.current_round
  WHERE p.game_id = game_record.game_id
    AND p.active = true
    AND r.id IS NULL
  INTO available_players;

  SELECT rounds FROM public.game
  WHERE id = game_record.game_id
  INTO game_round;

  IF available_players > 0 THEN
    -- keep current round since there are still players
    game_round := COALESCE(game_record.current_round, 1);
    game_status := 'turnend';

  ELSIF game_record.current_round < game_round THEN
    -- move to next round if not the last round
    game_round := COALESCE(game_record.current_round, 1);
    game_status := 'roundend';

  ELSE
    -- all rounds completed, set to gameend
    game_round := COALESCE(game_record.current_round, 1);
    game_status := 'gameend';
  END IF;

  -- get current game round id
  SELECT id INTO current_game_rounds_id
  FROM public.game_rounds
  WHERE game_id = game_record.game_id
    AND round = game_record.current_round
  ORDER BY created_at DESC
  LIMIT 1;

  -- add painter score
  -- reaction score for painters are calculated in end_game function
  execute app.add_painter_score(current_game_rounds_id);

  -- get all player scores for the round
  CREATE TEMP TABLE IF NOT EXISTS tmp_player_scores ON COMMIT DROP AS
  SELECT id, score as total_score FROM public.player LIMIT 0;

  -- add scores from answers
  -- reactions will be added in end_game function
  INSERT INTO tmp_player_scores(id, total_score)
  SELECT
    p.id,
    COALESCE(t.speed_score, 0)
      + COALESCE(t.accuracy_score, 0)
      + COALESCE(t.efficiency_score, 0)
    as total_score
  FROM player p
  JOIN game g
    ON p.game_id = g.id
    AND g.id = game_record.game_id
  LEFT JOIN player_turn t
    ON p.id = t.player_id
    AND t.game_rounds_id = current_game_rounds_id;

  -- update player scores for the round
  UPDATE public.player p
  SET score = score + tmp.total_score
  FROM tmp_player_scores tmp
  WHERE p.id = tmp.id;

  -- update game state
  UPDATE game_state
  SET
    current_player_id = NULL,
    current_round = game_round,
    status = game_status,
    updated_at = now()
  WHERE id = game_record.id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;