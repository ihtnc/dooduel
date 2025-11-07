CREATE OR REPLACE FUNCTION app.handle_game_canvas_inserts()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = ''
AS $function$
DECLARE
  current_game_id integer;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- when the canvas is updated send notification
    SELECT game_id INTO current_game_id FROM public.game_rounds WHERE game_rounds.id = NEW.game_rounds_id;

    INSERT INTO app.outbox (topic, event, payload)
    VALUES (
      format('game:%s:round:%s', current_game_id, NEW.game_rounds_id),
      'update_canvas',
      json_build_object(
        'id', NEW.id,
        'brush_size', NEW.brush_size,
        'brush_color', NEW.brush_color,
        'from_x', NEW.from_x,
        'from_y', NEW.from_y,
        'to_x', NEW.to_x,
        'to_y', NEW.to_y
      )
    );
  END IF;

  RETURN NULL;
END;
$function$;

create trigger game_canvas_inserts
after insert
on public.game_canvas
for each row
execute function app.handle_game_canvas_inserts();