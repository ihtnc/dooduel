CREATE OR REPLACE FUNCTION app.evaluate_game_states() RETURNS void AS $$
DECLARE
  game_record record;
  started_status boolean;
  ended_status boolean;
BEGIN
  FOR game_record IN SELECT * FROM public.game_state
  WHERE public.game_state.status IN ('ready', 'inprogress', 'roundend')

  LOOP
    IF game_record.status = 'ready' OR game_record.status = 'roundend' THEN
      started_status := app.start_game_rounds(game_record.id);

      IF started_status THEN
        RAISE NOTICE 'Started new round for game_id %', game_record.id;
      ELSE
        RAISE WARNING 'Unable to start new round for game_id %', game_record.id;
      END IF;

    ELSIF game_record.status = 'inprogress' AND game_record.updated_at <= now() - interval '1 minute' THEN
      ended_status := app.end_game_rounds(game_record.id);

      IF ended_status THEN
        RAISE NOTICE 'Ended current round for game_id %', game_record.id;
      ELSE
        RAISE WARNING 'Unable to end current round for game_id %', game_record.id;
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;