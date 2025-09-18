CREATE OR REPLACE FUNCTION app.handle_outbox_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
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