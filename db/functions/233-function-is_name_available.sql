CREATE OR REPLACE FUNCTION public.is_name_available(current_game_id integer, player_name character varying)
  RETURNS boolean
  LANGUAGE plpgsql
  SET search_path = public
AS $function$
DECLARE
  game_details record;
BEGIN
  SELECT game.id
  FROM game
  JOIN game_state ON game.id = game_state.game_id
  JOIN player ON game_state.game_id = player.game_id
    AND game.id = player.game_id
  WHERE game.id = current_game_id
    AND game_state.status <> 'completed'
    AND player.name ilike player_name
  INTO game_details
  LIMIT 1;

  IF FOUND then
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$function$;
