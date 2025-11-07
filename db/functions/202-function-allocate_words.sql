CREATE OR REPLACE FUNCTION public.allocate_words(game_code character varying, creator character varying)
  RETURNS void
  SET search_path = ''
AS $$
DECLARE selected_game public.game;
BEGIN
  -- ensure target game is on initial status and is created by the player
  SELECT g.*
  FROM public.game g
  JOIN public.game_state gs ON g.id = gs.game_id
  WHERE g.code = game_code AND g.created_by = creator
    AND gs.status = 'initial'
  INTO selected_game
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'game not found';
  END IF;

  DELETE FROM public.game_words w WHERE w.game_id = selected_game.id;

  INSERT INTO public.game_words(game_id, value, similarity_threshold)
  SELECT selected_game.id, w.value, w.similarity_threshold
  FROM public.words w
  WHERE w.difficulty = selected_game.difficulty
  ORDER BY random();
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.allocate_words(character varying, character varying) TO anon, authenticated;