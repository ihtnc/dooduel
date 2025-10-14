CREATE OR REPLACE FUNCTION public.add_game_reaction(round_id integer, player_name character varying, player_code character varying, reaction character varying)
  RETURNS boolean
  LANGUAGE plpgsql
  SET search_path = public
AS $function$
DECLARE
  game_details record;
  latest_round record;
BEGIN
  -- ensure player is active on the target round's game
  SELECT
    g.id AS game_id,
    gs.current_round,
    p.id AS player_id
  INTO game_details
  FROM game_rounds gr
  JOIN game g ON gr.game_id = g.id
  JOIN player p ON g.id = p.game_id
  JOIN game_state gs ON gr.game_id = gs.game_id
  WHERE gr.id = round_id
    AND p.name ILIKE player_name
    AND p.code = player_code
    AND p.active = true;

  IF NOT FOUND then
    RETURN false;
  END IF;

  -- ensure the target round is the latest round of the game
  SELECT
    gr.id
  FROM game g
  JOIN game_rounds gr ON g.id = gr.game_id
  WHERE gr.game_id = game_details.game_id
    AND gr.round = game_details.current_round
  ORDER BY gr.created_at DESC
  INTO latest_round
  LIMIT 1;

  IF NOT FOUND OR latest_round.id <> round_id THEN
    RETURN false;
  END IF;

  INSERT INTO game_reactions(game_rounds_id, player_id, reaction)
  VALUES (round_id, game_details.player_id, reaction)
  ON CONFLICT (game_rounds_id, player_id)
  DO UPDATE SET reaction = EXCLUDED.reaction;

  RETURN true;
END;
$function$;
