CREATE OR REPLACE FUNCTION public.get_created_game(game_name character varying, creator character varying)
 RETURNS game
 LANGUAGE plpgsql
AS $function$
DECLARE created_game game;
BEGIN
  SELECT game.*
  FROM game
  JOIN game_state ON game.id = game_state.game_id
  INTO created_game
  WHERE game.name = game_name
    AND game.created_by = creator
    AND game_state.status = 'initial'
  LIMIT 1;

  IF NOT FOUND then
    RAISE EXCEPTION 'game not found';
  END IF;

  RETURN created_game;
END;
$function$;
