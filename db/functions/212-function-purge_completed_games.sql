CREATE OR REPLACE FUNCTION app.purge_completed_games() RETURNS void AS $$
DECLARE
  game_record record;
  deleted_count integer := 0;
BEGIN
  FOR game_record IN SELECT * FROM public.game_state
  WHERE public.game_state.status = 'completed'
    AND public.game_state.updated_at <= now() - interval '1 hour'

  LOOP
    DELETE FROM public.game_logs WHERE public.game_logs.game_rounds_id IN (SELECT id FROM public.game_rounds WHERE game_id = game_record.game_id);
    DELETE FROM public.game_rounds WHERE public.game_rounds.game_id = game_record.game_id;
    DELETE FROM public.game_state WHERE public.game_state.id = game_record.id;
    DELETE FROM public.game_words WHERE public.game_words.game_id = game_record.game_id;
    DELETE FROM public.player WHERE public.player.game_id = game_record.game_id;
    DELETE FROM public.game WHERE public.game.id = game_record.game_id;
    deleted_count := deleted_count + 1;
  END LOOP;

  RAISE NOTICE 'Purged % completed games', deleted_count;
END;
$$ LANGUAGE plpgsql;