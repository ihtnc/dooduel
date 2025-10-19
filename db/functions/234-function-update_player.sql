CREATE OR REPLACE FUNCTION public.update_player(
  current_game_id integer,
  current_player_name character varying,
  current_player_code character varying,
  new_player_name character varying,
  new_player_code character varying,
  new_avatar character varying
)
  RETURNS boolean
  LANGUAGE plpgsql
  SET search_path = public
AS $function$
DECLARE
  game_details record;
  player_id integer;
BEGIN
  -- ensure player is active on the target game
  SELECT
    player.id as player_id,
    game.created_by as creator
  FROM player
  JOIN game ON player.game_id = game.id
  JOIN game_state ON game.id = game_state.game_id
  WHERE player.game_id = current_game_id
    AND game_state.status <> 'completed'
    AND player.name ILIKE current_player_name
    AND player.code = current_player_code
    AND player.active = true
  INTO game_details;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'game/player not found';
  END IF;

  -- ensure new name does not exist already
  IF EXISTS (
    SELECT 1
    FROM player
    WHERE game_id = current_game_id
      AND name ILIKE new_player_name
      AND id <> game_details.player_id
  ) THEN
    RAISE EXCEPTION 'duplicate player';
  END IF;

  UPDATE player
  SET
    avatar = new_avatar,
    name = new_player_name,
    code = new_player_code
  WHERE game_id = current_game_id
    AND name ILIKE current_player_name
    AND code = current_player_code
  RETURNING id INTO player_id;

  -- update game created_by if the player is the creator
  IF (game_details.creator = current_player_name) THEN
    UPDATE game
    SET created_by = new_player_name
    WHERE id = current_game_id;
  END IF;

  IF NOT FOUND then
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$function$;
