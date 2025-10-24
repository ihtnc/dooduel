CREATE OR REPLACE FUNCTION public.get_players(current_game_id integer, player_name character varying, player_code character varying)
  RETURNS TABLE(
    id integer,
    name character varying,
    avatar character varying,
    active boolean,
    is_painter boolean,
    has_answered boolean,
    score numeric
  )
  LANGUAGE plpgsql
  SET search_path = public
AS $function$
DECLARE
  current_game record;
  current_round_id integer;
BEGIN
  -- ensure player is active on the target game
  SELECT
    s.game_id,
    s.current_round,
    s.status,
    s.current_player_id
  INTO current_game
  FROM game_state s
  JOIN player p ON s.game_id = p.game_id
  WHERE s.game_id = current_game_id
    AND p.name ilike player_name
    AND p.code = player_code
    AND p.active = true
  LIMIT 1;

  IF NOT FOUND then
    RAISE EXCEPTION 'game/player not found';
  END IF;

  -- get the latest round of the game
  SELECT
    r.id INTO current_round_id
  FROM game_rounds r
  WHERE r.game_id = current_game.game_id
    AND r.round = current_game.current_round
    AND current_game.status = 'inprogress'
  ORDER BY r.created_at DESC
  LIMIT 1;

  IF NOT FOUND then
    current_round_id := 0;
  END IF;

  -- get players for the current round
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.avatar,
    p.active,
    CASE WHEN p.id = current_game.current_player_id THEN true ELSE false END AS is_painter,
    CASE WHEN t.correct_attempt_id IS NOT NULL THEN true ELSE false END AS has_answered,
    CASE WHEN current_game.status = 'completed' THEN p.score ELSE 0 END AS score
  FROM player p
  LEFT JOIN player_turn t
    ON p.id = t.player_id AND t.game_rounds_id = current_round_id
  WHERE p.game_id = current_game.game_id;
END;
$function$;
