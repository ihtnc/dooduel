CREATE OR REPLACE FUNCTION public.get_created_game(game_name character varying, creator character varying)
  RETURNS record
  LANGUAGE plpgsql
  SET search_path = ''
AS $function$
DECLARE created_game record;
BEGIN
  -- ensure target game is on initial status and is created by the player
  SELECT
    game.id,
    game.name,
    game.code,
    game.rounds,
    game.difficulty,
    game_state.status,
    CASE WHEN char_length(COALESCE(game.password, '')) > 0 THEN true
    ELSE false
    END AS has_password,
    pc.player_count
  FROM public.game
  JOIN public.game_state ON game.id = game_state.game_id
  JOIN (SELECT p.game_id, COUNT(p.id) as player_count from public.player p WHERE p.active = true GROUP BY p.game_id) pc ON pc.game_id = game.id
  INTO created_game
  WHERE game.name ilike game_name
    AND game.created_by ilike creator
    AND game_state.status = 'initial'
  LIMIT 1;

  IF NOT FOUND then
    RAISE EXCEPTION 'game not found';
  END IF;

  RETURN created_game;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.get_created_game(character varying, character varying) TO anon, authenticated;