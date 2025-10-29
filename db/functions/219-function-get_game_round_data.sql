CREATE OR REPLACE FUNCTION public.get_game_round_data(current_game_id integer, player_name character varying, player_code character varying)
  RETURNS jsonb
  LANGUAGE plpgsql
  SET search_path = public
AS $function$
DECLARE
  game_details record;
  latest_round record;
  game_round_data jsonb;
BEGIN
  -- ensure player is active on the target game
  SELECT
    g.id AS game_id,
    gs.id AS game_state_id,
    gs.status,
    gs.current_round,
    p.id AS player_id
  INTO game_details
  FROM game g
  JOIN player p ON g.id = p.game_id
  JOIN game_state gs ON g.id = gs.game_id
  WHERE g.id = current_game_id
    AND p.name ILIKE player_name
    AND p.code = player_code
    AND p.active = true;

  IF NOT FOUND then
    RAISE EXCEPTION 'game/player not found';
  END IF;

  -- get relevant details for the round
  SELECT
    g.id AS game_id,
    p.id AS painter_id,
    gr.id AS game_rounds_id,
    gr.round,
    gw.value AS word
  FROM game g
  LEFT JOIN game_rounds gr ON g.id = gr.game_id
  LEFT JOIN player p ON gr.painter_id = p.id
  LEFT JOIN game_words gw ON gr.game_word_id = gw.id
  WHERE g.id = game_details.game_id
  ORDER BY gr.created_at DESC
  INTO latest_round
  LIMIT 1;

  /*
  payloads
    initial:    { status: string, player_count: number };
    ready:      { status: string, player_count: number };
    turnend:    { round_id: number, status: string, current_round: number, current_painter_id: number, word: string, painters_left: number };
    roundend:   { round_id: number, status: string, current_round: number, current_painter_id: number, word: string, player_count: number };
    gameend:    { round_id: number, status: string, current_round: number, current_painter_id: number, word: string };
    inprogress: { round_id: number, status: string, current_round: number, word?: string };
    completed:  { status: string, total_score: number };
  */

  IF game_details.status = 'initial' THEN
    SELECT jsonb_build_object(
      'status', game_details.status,
      'player_count', COUNT(id)
    ) INTO game_round_data
    FROM player
    WHERE game_id = game_details.game_id
      AND active = true;

  ELSIF game_details.status = 'ready' THEN
    SELECT jsonb_build_object(
      'status', game_details.status,
      'player_count', COUNT(id)
    ) INTO game_round_data
    FROM app.get_painters(game_details.game_id);

  ELSIF game_details.status = 'turnend' THEN
    SELECT jsonb_build_object(
      'round_id', latest_round.game_rounds_id,
      'status', game_details.status,
      'current_round', game_details.current_round,
      'current_painter_id', latest_round.painter_id,
      'word', latest_round.word,
      'painters_left', COUNT(id)
    ) INTO game_round_data
    FROM app.get_painters(game_details.game_id);

  ELSIF game_details.status = 'roundend' THEN
    SELECT jsonb_build_object(
      'round_id', latest_round.game_rounds_id,
      'status', game_details.status,
      'current_round', game_details.current_round,
      'current_painter_id', latest_round.painter_id,
      'word', latest_round.word,
      'player_count', COUNT(id)
    ) INTO game_round_data
    FROM app.get_painters(game_details.game_id);

  ELSIF game_details.status = 'gameend' THEN
    SELECT jsonb_build_object(
      'round_id', latest_round.game_rounds_id,
      'status', game_details.status,
      'current_round', game_details.current_round,
      'current_painter_id', latest_round.painter_id,
      'word', latest_round.word
    ) INTO game_round_data;

  ELSIF game_details.status = 'inprogress' THEN
    IF latest_round.painter_id = game_details.player_id AND latest_round.round = game_details.current_round THEN
      SELECT jsonb_build_object(
        'round_id', latest_round.game_rounds_id,
        'status', game_details.status,
        'current_round', game_details.current_round,
        'word', latest_round.word
      ) INTO game_round_data;

    ELSE
      SELECT jsonb_build_object(
        'round_id', latest_round.game_rounds_id,
        'status', game_details.status,
        'current_round', game_details.current_round,
        'word', ''
      ) INTO game_round_data;
    END IF;

  ELSIF game_details.status = 'completed' THEN
    SELECT jsonb_build_object(
      'status', game_details.status,
      'total_score', score
    ) INTO game_round_data
    FROM player
    WHERE id = game_details.player_id;
  END IF;

  IF NOT FOUND then
    RAISE EXCEPTION 'invalid game state';
  END IF;

  RETURN game_round_data;
END;
$function$;
