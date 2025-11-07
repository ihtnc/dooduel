CREATE OR REPLACE FUNCTION app.evaluate_game_states()
  RETURNS void
  SET search_path = ''
AS $$
DECLARE
  game_record record;
  started_status boolean;
  ended_status boolean;
  completed_status boolean;
BEGIN
  -- get all games that can be moved forward (not initial/completed)
  FOR game_record IN SELECT * FROM public.game_state
  WHERE public.game_state.status IN ('ready', 'inprogress', 'turnend', 'roundend', 'gameend')

  LOOP
    -- since this function will be called by a cron job that runs every 30 seconds,
    --   this effectively starts a new round after 30 seconds
    IF game_record.status = 'ready' OR game_record.status = 'turnend' OR game_record.status = 'roundend' THEN
      started_status := app.start_game_rounds(game_record.id);

      IF started_status THEN
        RAISE NOTICE 'Started new round for game_id %', game_record.game_id;
      ELSE
        RAISE WARNING 'Unable to start new round for game_id %', game_record.game_id;
      END IF;

    ELSIF game_record.status = 'gameend' THEN
      completed_status := app.end_game(game_record.id);

      IF completed_status THEN
        RAISE NOTICE 'Ended game for game_id %', game_record.game_id;
      ELSE
        RAISE WARNING 'Unable to end game for game_id %', game_record.game_id;
      END IF;

    -- end the round for applicable games after 1 minute
    ELSIF game_record.status = 'inprogress' AND game_record.updated_at <= now() - interval '1 minute' THEN
      ended_status := app.end_game_rounds(game_record.id);

      IF ended_status THEN
        RAISE NOTICE 'Ended current round for game_id %', game_record.game_id;
      ELSE
        RAISE WARNING 'Unable to end current round for game_id %', game_record.game_id;
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;