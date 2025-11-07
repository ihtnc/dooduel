CREATE OR REPLACE FUNCTION app.handle_player_turn_changes()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = ''
AS $function$
DECLARE
  current_game_id integer;
BEGIN
  IF NEW.correct_attempt_id IS NOT NULL THEN
    -- when a player answers send notification
    SELECT game_id INTO current_game_id FROM public.game_rounds WHERE game_rounds.id = NEW.game_rounds_id;

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

create trigger player_turn_changes
after insert or update
on public.player_turn
for each row
execute function app.handle_player_turn_changes();