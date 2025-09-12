CREATE OR REPLACE FUNCTION app.end_game_rounds(game_state_id integer) RETURNS boolean AS $$
  DECLARE game_record record;
  DECLARE available_players integer;
  DECLARE game_round integer;
  DECLARE game_status status;
BEGIN
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
    game_status := 'ready';

  ELSIF game_record.current_round < game_round THEN
    -- move to next round if not the last round
    game_round := COALESCE(game_record.current_round, 1) + 1;
    game_status := 'ready';

  ELSE
    -- all rounds completed, set to null
    game_round := NULL;
    game_status := 'completed';
  END IF;

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