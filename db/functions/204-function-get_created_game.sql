CREATE OR REPLACE FUNCTION public.get_created_game(game_name character varying, creator character varying)
 RETURNS record
 LANGUAGE plpgsql
AS $function$
DECLARE created_game record;
BEGIN
  SELECT
    game.id,
    game.name,
    game.code,
    game.rounds,
    game.difficulty,
    CASE WHEN char_length(COALESCE(game.password, '')) > 0 THEN true
    ELSE false
    END AS has_password
  FROM game
  JOIN game_state ON game.id = game_state.game_id
  INTO created_game
  WHERE game.name ilike game_name
    AND game.created_by ilike creator
    AND game_state.status = 'initial'
  LIMIT 1;

  IF NOT FOUND then
    RAISE EXCEPTION 'game not found';
  END IF;

  RETURN created_game;
END;
$function$;
