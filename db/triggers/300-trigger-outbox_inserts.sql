CREATE OR REPLACE FUNCTION app.handle_outbox_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN

  /*
    game:{id} event payloads
    new_player:    { id: number, name: string, avatar: string }
    update_player: { id: number, active: bool, avatar: string, current_score: number }
    player_answer: { id: number }
    round_start:   { painter_id: number }
    game_ready:    { id: number }
    turn_end:      { id: number }
    round_end:     { id: number }
    game_over:     { id: number }
  */

  IF TG_OP = 'INSERT' THEN
    PERFORM realtime.send(
      NEW.payload,
      NEW.event,
      NEW.topic,
      true
    );
  END IF;

  RETURN NULL;
END;
$function$;

create trigger outbox_inserts
after insert
on app.outbox
for each row
execute function app.handle_outbox_changes();