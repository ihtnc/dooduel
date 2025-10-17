CREATE OR REPLACE FUNCTION app.purge_old_games()
  RETURNS void
  SET search_path = app
AS $$
DECLARE
  game_record record;
  deleted_count integer := 0;
BEGIN
  -- get all games that are completed for more than 1 hour
  --   or games that are not completed but are created more than 6 hours ago
  FOR game_record IN
  SELECT s.*
  FROM public.game_state s
  JOIN public.game g ON s.game_id = g.id
  WHERE (s.status = 'completed' AND s.updated_at <= now() - interval '1 hour')
    OR (s.status <> 'completed' AND g.created_at <= now() - interval '6 hours')

  LOOP
    DELETE FROM public.player_attempts WHERE public.player_attempts.game_rounds_id IN (SELECT id FROM public.game_rounds WHERE game_id = game_record.game_id);
    DELETE FROM public.game_reactions WHERE public.game_reactions.game_rounds_id IN (SELECT id FROM public.game_rounds WHERE game_id = game_record.game_id);
    DELETE FROM public.game_canvas WHERE public.game_canvas.game_rounds_id IN (SELECT id FROM public.game_rounds WHERE game_id = game_record.game_id);
    DELETE FROM public.player_turn WHERE public.player_turn.game_rounds_id IN (SELECT id FROM public.game_rounds WHERE game_id = game_record.game_id);
    DELETE FROM public.game_rounds WHERE public.game_rounds.game_id = game_record.game_id;
    DELETE FROM public.game_state WHERE public.game_state.id = game_record.id;
    DELETE FROM public.game_words WHERE public.game_words.game_id = game_record.game_id;
    DELETE FROM public.player WHERE public.player.game_id = game_record.game_id;
    DELETE FROM public.game WHERE public.game.id = game_record.game_id;
    deleted_count := deleted_count + 1;
  END LOOP;

  RAISE NOTICE 'Purged % games', deleted_count;
END;
$$ LANGUAGE plpgsql;