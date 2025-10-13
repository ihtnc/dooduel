CREATE OR REPLACE FUNCTION public.get_recent_game(player_name character varying, player_code character varying)
  RETURNS record
  LANGUAGE plpgsql
  SET search_path = public
AS $function$
DECLARE
  game_details record;
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
  JOIN player ON game_state.game_id = player.game_id
    AND game.id = player.game_id
  WHERE game_state.status <> 'completed'
    AND player.name ilike player_name
    AND player.code = player_code
    AND player.active = true
  ORDER BY player.created_at DESC
  INTO game_details
  LIMIT 1;

  IF NOT FOUND then
    RETURN NULL;
  END IF;

  RETURN game_details;
END;
$function$;
