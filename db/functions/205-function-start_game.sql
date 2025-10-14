CREATE OR REPLACE FUNCTION public.start_game(game_code character varying, creator character varying)
  RETURNS record
  LANGUAGE plpgsql
  SET search_path = public
AS $function$
DECLARE
  started_game record;
  player_count integer;
BEGIN
  SELECT
    game.id,
    game.name,
    game.rounds,
    game.difficulty,
    CASE WHEN char_length(COALESCE(game.password, '')) > 0 THEN true
    ELSE false
    END AS has_password
  FROM game
  JOIN game_state ON game.id = game_state.game_id
  WHERE code = game_code
    AND created_by ilike creator
    AND game_state.status = 'initial'
  INTO started_game;

  IF NOT FOUND then
    RAISE EXCEPTION 'game not found';
  END IF;

  SELECT COUNT(*) INTO player_count
  FROM player
  WHERE game_id = started_game.id;

  IF player_count < 2 THEN
    RAISE EXCEPTION 'not enough players';
  END IF;

  UPDATE game_state
  SET status = 'ready'
  WHERE game_state.game_id = started_game.id;

  RETURN started_game;
END;
$function$;
