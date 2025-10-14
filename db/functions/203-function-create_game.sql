CREATE OR REPLACE FUNCTION public.create_game(password character varying, rounds numeric, difficulty numeric, creator_name character varying, creator_avatar character varying, creator_code character varying)
  RETURNS game
  LANGUAGE plpgsql
  SET search_path = public
AS $function$
  DECLARE active_game_id integer;
  DECLARE inserted_game game;
BEGIN
  SELECT game_id into active_game_id
  FROM player
  WHERE name ILIKE creator_name
    AND code = creator_code
    AND active = true;

  IF FOUND then
    RAISE EXCEPTION 'already joined a game';
  END IF;

  INSERT INTO game (password, created_by, rounds, difficulty)
  VALUES (password, creator_name, rounds, difficulty)
  RETURNING * INTO inserted_game;

  INSERT INTO game_state(game_id)
  VALUES (inserted_game.id);

  INSERT INTO player(game_id, name, avatar, code)
  VALUES (inserted_game.id, creator_name, creator_avatar, creator_code);

  PERFORM allocate_words(inserted_game.code, inserted_game.created_by);

  RETURN inserted_game;
END;
$function$;
