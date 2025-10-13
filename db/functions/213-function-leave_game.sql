CREATE OR REPLACE FUNCTION public.leave_game(game_name character varying, player_name character varying, player_code character varying)
  RETURNS boolean
  LANGUAGE plpgsql
  SET search_path = public
AS $function$
DECLARE
  player_id integer;
  updated_player player;
BEGIN
  SELECT
    p.id INTO player_id
  FROM game g
  JOIN game_state s ON g.id = s.game_id
  JOIN player p ON g.id = p.game_id
  WHERE g.name ilike game_name
    AND p.name ilike player_name
    AND p.code = player_code
    AND p.active = true
    AND s.status <> 'completed'
  LIMIT 1;

  IF NOT FOUND then
    RAISE EXCEPTION 'game/player not found';
  END IF;

  UPDATE player SET active = false WHERE id = player_id
  RETURNING * INTO updated_player;

  IF NOT FOUND then
    RETURN false;
  END IF;

  RETURN true;
END;
$function$;
