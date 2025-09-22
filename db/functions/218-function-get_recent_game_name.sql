CREATE OR REPLACE FUNCTION public.get_recent_game_name(player_name character varying, player_code character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
  game_name character varying;
BEGIN
  SELECT
    game.name into game_name
  FROM game
  JOIN game_state ON game.id = game_state.game_id
  JOIN player ON game_state.game_id = player.game_id
    AND game.id = player.game_id
  WHERE game_state.status <> 'completed'
    AND player.name ilike player_name
    AND player.code = player_code
    AND player.active = true
  ORDER BY player.created_at DESC
  LIMIT 1;

  IF NOT FOUND then
    RETURN NULL;
  END IF;

  RETURN game_name;
END;
$function$;
