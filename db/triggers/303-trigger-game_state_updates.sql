CREATE OR REPLACE FUNCTION app.handle_game_state_updates()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = app
AS $function$
DECLARE
  current_game_id integer;
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status = 'inprogress' THEN
    INSERT INTO app.outbox (topic, event, payload)
    VALUES (
      format('game:%s', NEW.game_id),
      'round_start',
      json_build_object(
        'painter_id', NEW.current_player_id
      )
    );
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'completed' THEN
    INSERT INTO app.outbox (topic, event, payload)
    VALUES (
      format('game:%s', NEW.game_id),
      'game_over',
      json_build_object(
        'id', NEW.game_id
      )
    );
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'ready' THEN
    INSERT INTO app.outbox (topic, event, payload)
    VALUES (
      format('game:%s', NEW.game_id),
      'game_ready',
      json_build_object(
        'id', NEW.game_id
      )
    );
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'turnend' THEN
    INSERT INTO app.outbox (topic, event, payload)
    VALUES (
      format('game:%s', NEW.game_id),
      'turn_end',
      json_build_object(
        'id', NEW.game_id
      )
    );

  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'roundend' THEN
    INSERT INTO app.outbox (topic, event, payload)
    VALUES (
      format('game:%s', NEW.game_id),
      'round_end',
      json_build_object(
        'id', NEW.game_id
      )
    );

  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'gameend' THEN
    INSERT INTO app.outbox (topic, event, payload)
    VALUES (
      format('game:%s', NEW.game_id),
      'game_end',
      json_build_object(
        'id', NEW.game_id
      )
    );
  END IF;

  RETURN NULL;
END;
$function$;

create trigger game_state_updates
after update
on public.game_state
for each row
execute function app.handle_game_state_updates();