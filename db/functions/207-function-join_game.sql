CREATE OR REPLACE FUNCTION public.join_game(game_name character varying, game_password character varying, player_name character varying, player_avatar character varying, player_code character varying)
 RETURNS game
 LANGUAGE plpgsql
AS $function$
DECLARE
  selected_game game;
  selected_player player;
BEGIN
  SELECT
    game.id,
    game.name,
    '' AS password,
    '' AS code,
    game.created_at,
    game.created_by,
    game.rounds,
    game.difficulty
  FROM game
  JOIN game_state ON game.id = game_state.game_id
  WHERE game.name = game_name
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
    AND player.name = player_name
  INTO selected_player
  LIMIT 1;

  IF FOUND AND selected_player.code <> player_code THEN
    RAISE EXCEPTION 'duplicate player';

  ELSIF FOUND AND selected_player.code = player_code THEN
    UPDATE player SET active = true WHERE id = selected_player.id;

    RETURN selected_game;
  END IF;

  INSERT INTO player(game_id, name, avatar, code)
  VALUES (selected_game.id, player_name, player_avatar, player_code);

  RETURN selected_game;
END;
$function$;
