CREATE OR REPLACE FUNCTION app.handle_player_changes()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = ''
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- when a new player joins send notification
    INSERT INTO app.outbox (topic, event, payload)
    VALUES (
      format('game:%s', NEW.game_id),
      'new_player',
      json_build_object(
        'id', NEW.id,
        'name', NEW.name,
        'avatar', NEW.avatar
      )
    );

  ELSIF TG_OP = 'UPDATE' THEN
    -- when a player changes active status or score send notification
    IF (OLD.active IS DISTINCT FROM NEW.active)
      OR (OLD.score IS DISTINCT FROM NEW.score)
      OR (OLD.avatar IS DISTINCT FROM NEW.avatar)
      OR (OLD.name IS DISTINCT FROM NEW.name)
    THEN
      INSERT INTO app.outbox (topic, event, payload)
      VALUES (
        format('game:%s', NEW.game_id),
        'update_player',
        json_build_object(
          'id', NEW.id,
          'name', NEW.name,
          'active', NEW.active,
          'avatar', NEW.avatar,
          'current_score', COALESCE(NEW.score, 0) - COALESCE(OLD.score, 0)
        )
      );
    END IF;
  END IF;

  RETURN NULL;
END;
$function$;

create trigger player_changes
after insert or update
on public.player
for each row
execute function app.handle_player_changes();