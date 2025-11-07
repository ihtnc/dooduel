CREATE OR REPLACE FUNCTION public.get_recent_game(player_name character varying, player_code character varying)
  RETURNS record
  LANGUAGE plpgsql
  SET search_path = ''
AS $function$
DECLARE
  game_details record;
BEGIN
  -- get the most recent game where the player is still active
  SELECT
    game.id,
    game.name,
    game_state.status,
    game.rounds,
    game.difficulty,
    CASE WHEN char_length(COALESCE(game.password, '')) > 0 THEN true
    ELSE false
    END AS has_password,
    pc.player_count
  FROM public.game
  JOIN public.game_state ON game.id = game_state.game_id
  JOIN public.player ON game_state.game_id = player.game_id
    AND game.id = player.game_id
  JOIN (SELECT p.game_id, COUNT(p.id) as player_count from public.player p WHERE p.active = true GROUP BY p.game_id) pc ON pc.game_id = game.id
  WHERE player.name ilike player_name
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

GRANT EXECUTE ON FUNCTION public.get_recent_game(character varying, character varying) TO anon, authenticated;