CREATE OR REPLACE FUNCTION public.get_game_reaction(round_id integer, player_name character varying, player_code character varying)
  RETURNS public.reaction
  LANGUAGE plpgsql
  SET search_path = ''
AS $function$
DECLARE
  game_details record;
  reaction public.reaction;
BEGIN
  -- ensure player is active on the target round's game
  SELECT
    g.id AS game_id,
    p.id AS player_id
  INTO game_details
  FROM public.game_rounds gr
  JOIN public.game g ON gr.game_id = g.id
  JOIN public.player p ON g.id = p.game_id
  JOIN public.game_state gs ON gr.game_id = gs.game_id
  WHERE gr.id = round_id
    AND p.name ILIKE player_name
    AND p.code = player_code
    AND p.active = true;

  IF NOT FOUND then
    RETURN NULL;
  END IF;

  SELECT gr.reaction
  FROM public.game_reactions gr
  WHERE gr.game_rounds_id = round_id
    AND gr.player_id = game_details.player_id
  INTO reaction;

  RETURN reaction;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.get_game_reaction(integer, character varying, character varying) TO anon, authenticated;