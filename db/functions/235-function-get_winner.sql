CREATE OR REPLACE FUNCTION public.get_game_winner(
  current_game_id integer,
  current_player_name character varying,
  current_player_code character varying
)
  RETURNS record
  LANGUAGE plpgsql
  SET search_path = public
AS $function$
DECLARE
  result record;
BEGIN
  -- ensure player is active on the target game
  IF NOT EXISTS (
    SELECT 1
    FROM player
    JOIN game ON player.game_id = game.id
    JOIN game_state ON game.id = game_state.game_id
    WHERE player.game_id = current_game_id
      AND game_state.status = 'completed'
      AND player.name ILIKE current_player_name
      AND player.code = current_player_code
      AND player.active = true
  ) THEN
    RAISE EXCEPTION 'game/player not found';
  END IF;

  SELECT name, score
  FROM player
  WHERE game_id = current_game_id
  ORDER BY score DESC
  INTO result
  LIMIT 1;

  RETURN result;
END;
$function$;
