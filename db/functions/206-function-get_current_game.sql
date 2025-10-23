CREATE OR REPLACE FUNCTION public.get_current_game(game_name character varying, player_name character varying, player_code character varying)
  RETURNS record
  LANGUAGE plpgsql
  SET search_path = public
AS $function$
DECLARE
  selected_game record;
BEGIN
  -- ensure player is active on the target game
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
    game.created_by,
    pc.player_count
  FROM game
    JOIN game_state ON game.id = game_state.game_id
    JOIN player ON game.id = player.game_id
    JOIN (SELECT p.game_id, COUNT(p.id) as player_count from player p WHERE p.active = true GROUP BY p.game_id) pc ON pc.game_id = game.id
  WHERE game.name ilike game_name
    AND player.name ilike player_name
    AND player.code = player_code
    AND player.active = true
  INTO selected_game
  LIMIT 1;

  IF NOT FOUND then
    RAISE EXCEPTION 'game/player not found';
  END IF;

  RETURN selected_game;
END;
$function$;
