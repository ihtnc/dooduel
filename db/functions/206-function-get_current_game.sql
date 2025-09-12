CREATE OR REPLACE FUNCTION public.get_current_game(game_name character varying, player_name character varying, player_code character varying)
 RETURNS game
 LANGUAGE plpgsql
AS $function$
DECLARE
  selected_game game;
  selected_player player;
BEGIN
  SELECT
    game.id,
    game.name,
    '' AS password,
    '' AS code,
    game.created_at,
    game.created_by,
    game.rounds,
    game.difficulty
  FROM game
  JOIN game_state ON game.id = game_state.game_id
  INTO selected_game
  WHERE game.name = game_name
    AND game_state.status <> 'completed'
  LIMIT 1;

  IF NOT FOUND then
    RAISE EXCEPTION 'game not found';
  END IF;

  SELECT *
  FROM player
  WHERE player.game_id = selected_game.id
    AND player.name = player_name
    AND player.code = player_code
    AND player.active = true
  INTO selected_player
  LIMIT 1;

  IF NOT FOUND then
    RAISE EXCEPTION 'player not found';
  END IF;

  RETURN selected_game;
END;
$function$;
