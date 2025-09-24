CREATE OR REPLACE FUNCTION app.handle_game_deletes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF TG_OP = 'DELETE' THEN
    -- when a game is deleted send notification
    INSERT INTO app.outbox (topic, event, payload)
    VALUES (
      format('game:%s', OLD.id),
      'purge_game',
      json_build_object(
        'id', OLD.id
      )
    );
  END IF;

  RETURN NULL;
END;
$function$;

create trigger game_deletes
after delete
on public.game
for each row
execute function app.handle_game_deletes();