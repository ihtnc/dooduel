CREATE OR REPLACE FUNCTION public.get_game_reaction(round_id integer, player_name character varying, player_code character varying)
  RETURNS character varying
  LANGUAGE plpgsql
  SET search_path = public
AS $function$
DECLARE
  game_details record;
  reaction character varying;
BEGIN
  -- ensure player is active on the target round's game
  SELECT
    g.id AS game_id,
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
    RETURN NULL;
  END IF;

  SELECT gr.reaction
  FROM game_reactions gr
  WHERE gr.game_rounds_id = round_id
    AND gr.player_id = game_details.player_id
  INTO reaction;

  RETURN reaction;
END;
$function$;
