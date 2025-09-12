CREATE OR REPLACE FUNCTION public.start_game(game_code character varying, creator character varying)
 RETURNS game
 LANGUAGE plpgsql
AS $function$
DECLARE
  started_game game;
  updated_state game_state;
BEGIN
  SELECT *
  FROM game
  WHERE code = game_code AND created_by = creator
  INTO started_game;

  IF NOT FOUND then
    RAISE EXCEPTION 'game not found';
  END IF;

  UPDATE game_state
  SET status = 'ready'
  WHERE game_state.game_id = started_game.id
  AND game_state.status = 'initial'
  RETURNING * INTO updated_state;

  IF NOT FOUND then
    RAISE EXCEPTION 'game not found';
  END IF;

  RETURN started_game;
END;
$function$;
