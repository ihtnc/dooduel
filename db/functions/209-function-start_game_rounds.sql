CREATE OR REPLACE FUNCTION app.start_game_rounds(game_state_id integer) RETURNS boolean AS $$
  DECLARE game_record game_state;
  DECLARE game_round integer;
  DECLARE next_player player;
  DECLARE next_word game_words;
BEGIN
  SELECT * FROM public.game_state
  WHERE public.game_state.status in ('ready', 'turnend', 'roundend')
    AND public.game_state.id = game_state_id
  INTO game_record;

  IF NOT FOUND then
    RETURN FALSE;
  END IF;

  -- get next player
  SELECT * FROM app.get_painters(game_record.game_id)
  ORDER BY random()
  LIMIT 1
  INTO next_player;

  game_round := COALESCE(game_record.current_round, 1);

  -- get next unused word
  SELECT *
  FROM game_words w
  LEFT JOIN game_rounds r ON w.id = r.game_word_id AND w.game_id = r.game_id
  WHERE w.game_id = game_record.game_id
  AND r.id IS NULL
  ORDER BY random()
  LIMIT 1
  INTO next_word;

  INSERT INTO game_rounds(game_id, painter_id, round, game_word_id)
  VALUES(next_player.game_id, next_player.id, game_round, next_word.id);

  -- update game state
  UPDATE game_state
  SET
    current_player_id = next_player.id,
    current_round = game_round,
    status = 'inprogress',
    updated_at = now()
  WHERE game_id = game_record.game_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;