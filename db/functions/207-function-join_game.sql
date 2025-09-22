CREATE OR REPLACE FUNCTION public.join_game(game_name character varying, game_password character varying, player_name character varying, player_avatar character varying, player_code character varying)
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
    END AS has_password
  FROM game
  JOIN game_state ON game.id = game_state.game_id
  WHERE game.name ilike game_name
    AND game.password = game_password
    AND game_state.status <> 'completed'
  INTO selected_game
  LIMIT 1;

  IF NOT FOUND then
    RAISE EXCEPTION 'game not found';
  END IF;

  SELECT *
  FROM player
  WHERE player.game_id = selected_game.id
    AND player.name ilike player_name
  INTO selected_player
  LIMIT 1;

  IF FOUND AND selected_player.code <> player_code THEN
    RAISE EXCEPTION 'duplicate player';

  ELSIF FOUND AND selected_player.code = player_code THEN
    UPDATE player
    SET active = true,
      avatar = player_avatar
    WHERE id = selected_player.id;

    RETURN selected_game;
  END IF;

  INSERT INTO player(game_id, name, avatar, code)
  VALUES (selected_game.id, player_name, player_avatar, player_code);

  RETURN selected_game;
END;
$function$;
