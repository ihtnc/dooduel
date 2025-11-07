CREATE OR REPLACE FUNCTION public.update_player_avatar(current_game_id integer, player_name character varying, player_code character varying, new_avatar character varying)
  RETURNS boolean
  LANGUAGE plpgsql
  SET search_path = ''
AS $function$
DECLARE
  selected_game_id integer;
  player_id integer;
BEGIN
  -- ensure player is active on the target game
  SELECT
    game_id INTO selected_game_id
  FROM public.player
  WHERE game_id = current_game_id
    AND name ILIKE player_name
    AND code = player_code
    AND active = true
  LIMIT 1;

  IF NOT FOUND then
    RAISE EXCEPTION 'game/player not found';
  END IF;

  UPDATE public.player
  SET avatar = new_avatar
  WHERE game_id = selected_game_id
    AND name ILIKE player_name
    AND code = player_code
    AND avatar <> new_avatar
  RETURNING id INTO player_id;

  IF NOT FOUND then
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$function$;
