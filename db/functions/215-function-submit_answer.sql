CREATE OR REPLACE FUNCTION public.submit_answer(round_id integer, player_name character varying, player_code character varying, answer character varying)
  RETURNS numeric
  LANGUAGE plpgsql
  SET search_path = ''
AS $function$
DECLARE
  selected_player record;
  current_word record;
  current_log record;
  attempt_details numeric[];
  answer_accuracy numeric;
  speed_score_value numeric;
  accuracy_score_value numeric;
  efficiency_score_value numeric;
  correct_id integer;
BEGIN
  -- ensure player is active on the target game and it's not their turn to draw
  SELECT
    gr.game_id,
    gs.current_round,
    p.id AS player_id
  FROM public.game_rounds gr
  JOIN public.game_state gs ON gr.game_id = gs.game_id
  JOIN public.player p ON gr.game_id = p.game_id
  WHERE gr.id = round_id
    AND p.name ILIKE player_name
    AND p.code = player_code
    AND p.active = true
    AND gs.current_player_id <> p.id
    AND gs.status = 'inprogress'
  INTO selected_player;

  IF NOT FOUND then
    RAISE EXCEPTION 'game/player not found';
  END IF;

  -- get relevant details for the latest round of the game
  SELECT
    r.id AS game_rounds_id,
    r.created_at,
    w.value,
    w.similarity_threshold,
    g.difficulty,
    c.started_drawing_at
  FROM public.game_rounds r
  JOIN public.game_words w ON r.game_word_id = w.id AND r.game_id = w.game_id
  JOIN public.game g ON r.game_id = g.id
  LEFT JOIN
  (
    SELECT
      gc.game_rounds_id,
      min(gc.created_at) AS started_drawing_at
    FROM public.game_canvas gc
    GROUP BY gc.game_rounds_id
  ) c ON c.game_rounds_id = r.id
  WHERE r.game_id = selected_player.game_id
    AND r.round = selected_player.current_round
  ORDER BY r.created_at DESC
  INTO current_word
  LIMIT 1;

  IF NOT FOUND then
    RAISE EXCEPTION 'invalid game state';
  END IF;

  -- ensure player has not submitted a correct answer for this round yet
  SELECT *
  FROM public.player_turn
  WHERE game_rounds_id = current_word.game_rounds_id
    AND player_id = selected_player.player_id
    AND correct_attempt_id IS NOT NULL
  INTO current_log
  LIMIT 1;

  IF FOUND then
    RAISE EXCEPTION 'answer already submitted';
  END IF;

  answer_accuracy := extensions.similarity(answer, current_word.value);

  -- log the attempt
  INSERT INTO public.player_attempts(game_rounds_id, player_id, word, accuracy)
  VALUES (current_word.game_rounds_id, selected_player.player_id, answer, answer_accuracy)
  RETURNING id INTO correct_id;

  -- insert or update turn details
  INSERT INTO public.player_turn(game_rounds_id, player_id, has_answered)
  VALUES (current_word.game_rounds_id, selected_player.player_id, true)
  ON CONFLICT (game_rounds_id, player_id)
  DO UPDATE SET has_answered = EXCLUDED.has_answered;

  IF answer_accuracy < current_word.similarity_threshold THEN
    RETURN answer_accuracy / current_word.similarity_threshold;
  END IF;

  -- total score = 1000
  -- max reaction score = 10
  -- reaction score is added in end_game function

  -- max accuracy score = 50
  accuracy_score_value := public.calculate_guesser_accuracy_score(answer_accuracy);
  -- max speed score = 500
  speed_score_value := public.calculate_guesser_speed_score(current_word.started_drawing_at, current_word.difficulty);

  -- get all attempt accuracies for efficiency calculation
  SELECT ARRAY_AGG(pa.accuracy) AS attempts
  FROM public.player_attempts pa
  WHERE pa.game_rounds_id = current_word.game_rounds_id
    AND pa.player_id = selected_player.player_id
  INTO attempt_details;

  -- max efficiency score = 440
  efficiency_score_value := public.calculate_guesser_efficiency_score(attempt_details, current_word.difficulty);

  -- update turn with scores and flag as having answered correctly
  UPDATE public.player_turn
  SET speed_score = speed_score_value,
      accuracy_score = accuracy_score_value,
      efficiency_score = efficiency_score_value,
      correct_attempt_id = correct_id
  WHERE game_rounds_id = current_word.game_rounds_id
    AND player_id = selected_player.player_id;

  RETURN 1;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.submit_answer(integer, character varying, character varying, character varying) TO anon, authenticated;