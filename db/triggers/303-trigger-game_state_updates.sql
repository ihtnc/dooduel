CREATE OR REPLACE FUNCTION app.handle_game_state_updates()
 RETURNS trigger
 LANGUAGE plpgsql
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
        'id', NEW.current_player_id
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