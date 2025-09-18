CREATE OR REPLACE FUNCTION app.handle_game_logs_inserts()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  current_game_id integer;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- when a player answers send notification
    SELECT game_id INTO current_game_id FROM game_rounds WHERE game_rounds.id = NEW.game_rounds_id;

    INSERT INTO app.outbox (topic, event, payload)
    VALUES (
      format('game:%s', current_game_id),
      'player_answer',
      json_build_object(
        'id', NEW.player_id
      )
    );
  END IF;

  RETURN NULL;
END;
$function$;

create trigger game_logs_inserts
after insert
on public.game_logs
for each row
execute function app.handle_game_logs_inserts();