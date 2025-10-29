CREATE OR REPLACE FUNCTION app.end_game(game_state_id integer)
  RETURNS boolean
  SET search_path = app, public
AS $$
  DECLARE game_record record;
  DECLARE available_players integer;
  DECLARE game_round integer;
  DECLARE game_status status;
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

  -- update game state
  UPDATE game_state
  SET
    current_player_id = NULL,
    current_round = NULL,
    status = 'completed',
    updated_at = now()
  WHERE id = game_record.id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;