CREATE OR REPLACE FUNCTION public.draw_canvas(round_id integer, player_name character varying, player_code character varying, brush_size integer[], brush_color character varying[], from_x numeric[], from_y numeric[], to_x numeric[], to_y numeric[])
  RETURNS boolean
  LANGUAGE plpgsql
  SET search_path = ''
AS $function$
DECLARE
  game_details record;
  latest_round record;
BEGIN
  -- ensure player is active on the target round's game and is the painter for that round
  SELECT
    g.id AS game_id,
    gs.current_round
  INTO game_details
  FROM public.game_rounds gr
  JOIN public.player p ON gr.painter_id = p.id
  JOIN public.game g ON gr.game_id = g.id
  JOIN public.game_state gs ON gr.game_id = gs.game_id
  WHERE gr.id = round_id
    AND p.name ILIKE player_name
    AND p.code = player_code
    AND p.active = true;

  IF NOT FOUND then
    RETURN false;
  END IF;

  -- ensure the target round is the latest round of the game
  SELECT
    gr.id
  FROM public.game g
  JOIN public.game_rounds gr ON g.id = gr.game_id
  WHERE gr.game_id = game_details.game_id
    AND gr.round = game_details.current_round
  ORDER BY gr.created_at DESC
  INTO latest_round
  LIMIT 1;

  IF NOT FOUND OR latest_round.id <> round_id THEN
    RETURN false;
  END IF;

  IF array_length(brush_size, 1) != array_length(brush_color, 1) OR
    array_length(brush_size, 1) != array_length(from_x, 1) OR
    array_length(brush_size, 1) != array_length(from_y, 1) OR
    array_length(brush_size, 1) != array_length(to_x, 1) OR
    array_length(brush_size, 1) != array_length(to_y, 1) THEN
    RETURN false;
  END IF;

  FOR i IN 1..array_length(brush_size, 1) LOOP
    INSERT INTO public.game_canvas(game_rounds_id, brush_size, brush_color, from_x, from_y, to_x, to_y)
    VALUES (round_id, brush_size[i], brush_color[i], from_x[i], from_y[i], to_x[i], to_y[i]);
  END LOOP;

  RETURN true;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.draw_canvas(integer, character varying, character varying, integer[], character varying[], numeric[], numeric[], numeric[], numeric[]) TO anon, authenticated;