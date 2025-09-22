CREATE OR REPLACE FUNCTION public.get_word_to_paint(current_game_id integer, player_name character varying, player_code character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
  game_word character varying;
BEGIN
  SELECT
    game_words.value into game_word
  FROM game
  JOIN game_state ON game.id = game_state.game_id
  JOIN player ON game_state.game_id = player.game_id
    AND game_state.current_player_id = player.id
  JOIN game_rounds ON player.game_id = game_rounds.game_id
    AND player.id = game_rounds.painter_id
    AND game_rounds.round = game_state.current_round
  JOIN game_words ON game_rounds.game_word_id = game_words.id
  WHERE game.id = current_game_id
    AND game_state.status = 'inprogress'
    AND player.name ilike player_name
    AND player.code = player_code
    AND player.active = true
  ORDER BY player.created_at DESC
  LIMIT 1;

  IF NOT FOUND then
    RETURN NULL;
  END IF;

  RETURN game_word;
END;
$function$;
