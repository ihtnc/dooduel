CREATE OR REPLACE FUNCTION public.get_game_canvas(round_id integer, player_name character varying, player_code character varying)
  RETURNS TABLE(
    id integer,
    brush_size integer,
    brush_color character varying,
    from_x numeric,
    from_y numeric,
    to_x numeric,
    to_y numeric
  )
  LANGUAGE plpgsql
  SET search_path = public
AS $function$
DECLARE
  game_details record;
  latest_round record;
BEGIN
  SELECT
    g.id AS game_id,
    gs.current_round,
    p.id AS player_id
  INTO game_details
  FROM game_rounds gr
  JOIN game g ON gr.game_id = g.id
  JOIN player p ON g.id = p.game_id
  JOIN game_state gs ON gr.game_id = gs.game_id
  WHERE gr.id = round_id
    AND p.name ILIKE player_name
    AND p.code = player_code
    AND p.active = true;

  IF NOT FOUND then
    RAISE EXCEPTION 'game/player not found';
  END IF;

  SELECT
    gr.id
  FROM game g
  JOIN game_rounds gr ON g.id = gr.game_id
  WHERE gr.game_id = game_details.game_id
    AND gr.round = game_details.current_round
  ORDER BY gr.created_at DESC
  INTO latest_round
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'invalid game state';
  END IF;

  RETURN QUERY
  SELECT
    gc.id,
    gc.brush_size,
    gc.brush_color,
    gc.from_x,
    gc.from_y,
    gc.to_x,
    gc.to_y
  FROM game_canvas gc
  WHERE gc.game_rounds_id = round_id
  ORDER BY gc.created_at ASC;
END;
$function$;
