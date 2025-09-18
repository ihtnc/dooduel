CREATE OR REPLACE FUNCTION public.get_current_game(game_name character varying, player_name character varying, player_code character varying)
 RETURNS record
 LANGUAGE plpgsql
AS $function$
DECLARE
  selected_game record;
  selected_player player;
BEGIN
  SELECT
    game.id,
    game.name,
    game.rounds,
    game.difficulty,
    CASE WHEN char_length(COALESCE(game.password, '')) > 0 THEN true
    ELSE false
    END AS has_password,
    game_state.status,
    game_state.current_round,
    player.name AS current_player_name
  FROM game
  JOIN game_state ON game.id = game_state.game_id
  LEFT JOIN player ON game_state.game_id = player.game_id
    AND game_state.current_player_id = player.id
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
