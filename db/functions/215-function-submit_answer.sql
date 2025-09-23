CREATE OR REPLACE FUNCTION public.submit_answer(game_name character varying, player_name character varying, player_code character varying, answer character varying)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE
  selected_player record;
  current_word record;
  current_log record;
  base_speed_score numeric := 950;
  base_accuracy_score numeric := 50;
  speed_modifier numeric;
  accuracy_modifier numeric;
  speed_score numeric;
  accuracy_score numeric;
BEGIN
  SELECT
    g.id AS game_id,
    s.current_round,
    p.id AS player_id
  FROM game g
  JOIN game_state s ON g.id = s.game_id
  JOIN player p ON g.id = p.game_id
  WHERE g.name ilike game_name
    AND p.name ilike player_name
    AND p.code = player_code
    AND p.active = true
    AND s.current_player_id <> p.id
    AND s.status = 'inprogress'
  INTO selected_player
  LIMIT 1;

  IF NOT FOUND then
    RAISE EXCEPTION 'game/player not found';
  END IF;

  -- get the word for the latest round of the game
  SELECT
    r.id AS game_rounds_id,
    r.created_at,
    w.value,
    w.similarity_threshold
  FROM game_rounds r
  JOIN game_words w ON r.game_word_id = w.id AND r.game_id = w.game_id
  WHERE r.game_id = selected_player.game_id
    AND r.round = selected_player.current_round
  ORDER BY r.created_at DESC
  INTO current_word
  LIMIT 1;

  IF NOT FOUND then
    RAISE EXCEPTION 'invalid game state';
  END IF;

  -- check if player has already submitted an answer for this round
  SELECT *
  FROM game_logs
  WHERE game_rounds_id = current_word.game_rounds_id
    AND player_id = selected_player.player_id
  INTO current_log
  LIMIT 1;

  IF FOUND then
    RAISE EXCEPTION 'answer already submitted';
  END IF;

  accuracy_modifier := similarity(answer, current_word.value);
  IF accuracy_modifier < current_word.similarity_threshold THEN
    RETURN accuracy_modifier / current_word.similarity_threshold;
  END IF;

  -- calculate score based on time taken to answer
  speed_modifier := GREATEST(40, 100 - EXTRACT(EPOCH FROM (now() - current_word.created_at))) / 100;
  speed_score := (base_speed_score * speed_modifier);
  accuracy_score := (base_accuracy_score * accuracy_modifier);

  -- log the answer
  INSERT INTO game_logs(game_rounds_id, player_id, answer, speed_score, accuracy_score)
  VALUES (current_word.game_rounds_id, selected_player.player_id, answer, speed_score, accuracy_score);

  RETURN 1;
END;
$function$;
