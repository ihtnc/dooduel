CREATE OR REPLACE FUNCTION public.submit_answer(round_id integer, player_name character varying, player_code character varying, answer character varying)
  RETURNS numeric
  LANGUAGE plpgsql
  SET search_path = public
AS $function$
DECLARE
  selected_player record;
  current_word record;
  current_log record;
  attempt_details numeric[];
  answer_accuracy numeric;
  speed_score numeric;
  accuracy_score numeric;
  efficiency_score numeric;
BEGIN
  -- ensure player is active on the target game and it's not their turn to draw
  SELECT
    gr.game_id,
    gs.current_round,
    p.id AS player_id
  FROM game_rounds gr
  JOIN game_state gs ON gr.game_id = gs.game_id
  JOIN player p ON gr.game_id = p.game_id
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
  FROM game_rounds r
  JOIN game_words w ON r.game_word_id = w.id AND r.game_id = w.game_id
  JOIN game g ON r.game_id = g.id
  LEFT JOIN
  (
    SELECT
      gc.game_rounds_id,
      min(gc.created_at) AS started_drawing_at
    FROM game_canvas gc
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

  -- ensure player has not submitted an answer for this round yet
  SELECT *
  FROM game_logs
  WHERE game_rounds_id = current_word.game_rounds_id
    AND player_id = selected_player.player_id
  INTO current_log
  LIMIT 1;

  IF FOUND then
    RAISE EXCEPTION 'answer already submitted';
  END IF;

  answer_accuracy := similarity(answer, current_word.value);

  -- log the attempt
  INSERT INTO game_answer_attempts(game_rounds_id, player_id, accuracy)
  VALUES (current_word.game_rounds_id, selected_player.player_id, answer_accuracy);

  IF answer_accuracy < current_word.similarity_threshold THEN
    RETURN answer_accuracy / current_word.similarity_threshold;
  END IF;

  -- total score = 1000
  -- max reaction score = 10
  --   added when a reaction is given at the end of the round

  -- max accuracy score = 50
  accuracy_score := calculate_guesser_accuracy_score(answer_accuracy);
  -- max speed score = 500
  speed_score := calculate_guesser_speed_score(current_word.started_drawing_at);

  -- get all attempt accuracies for efficiency calculation
  SELECT ARRAY_AGG(ga.accuracy) AS attempts
  FROM game_answer_attempts ga
  WHERE ga.game_rounds_id = current_word.game_rounds_id
    AND ga.player_id = selected_player.player_id
  INTO attempt_details;

  -- max efficiency score = 440
  efficiency_score := calculate_guesser_efficiency_score(attempt_details, current_word.difficulty);

  -- log the answer
  INSERT INTO game_logs(game_rounds_id, player_id, answer, speed_score, accuracy_score, efficiency_score)
  VALUES (current_word.game_rounds_id, selected_player.player_id, answer, speed_score, accuracy_score, efficiency_score);

  RETURN 1;
END;
$function$;
