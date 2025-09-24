CREATE OR REPLACE FUNCTION public.get_game_round_data(current_game_id integer, player_name character varying, player_code character varying)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
  game_details record;
  game_word character varying;
  game_round_data jsonb;
BEGIN
  SELECT
    g.id AS game_id,
    gs.id AS game_state_id,
    gs.status,
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

  /*
  payloads
    initial:    { status: string, player_count: number };
    ready:      { status: string, painters_left: number };
    roundend:   { status: string, painters_left: number };
    inprogress: { status: string, word?: string };
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

  ELSIF game_details.status = 'ready' OR game_details.status = 'roundend' THEN
    SELECT jsonb_build_object(
      'status', game_details.status,
      'painters_left', COUNT(id)
    ) INTO game_round_data
    FROM app.get_painters(game_details.game_id);

  ELSIF game_details.status = 'inprogress' THEN
    SELECT gw.value INTO game_word
    FROM game_state gs
    JOIN player p ON gs.game_id = p.game_id
      AND gs.current_player_id = p.id
    JOIN game_rounds gr ON p.game_id = gr.game_id
      AND p.id = gr.painter_id
      AND gs.current_round = gr.round
    JOIN game_words gw ON gr.game_word_id = gw.id
    WHERE gs.id = game_details.game_state_id
      AND p.id = game_details.player_id
    LIMIT 1;

    IF NOT FOUND then
      SELECT jsonb_build_object(
        'status', game_details.status,
        'word', ''
      ) INTO game_round_data;

    ELSE
      SELECT jsonb_build_object(
        'status', game_details.status,
        'word', game_word
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
