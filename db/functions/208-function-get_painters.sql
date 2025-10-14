CREATE OR REPLACE FUNCTION app.get_painters(ready_game_id integer)
  RETURNS SETOF public.player
AS $$
DECLARE
  ready_game game_state;
BEGIN
  -- get all games that are on "ready" status (ready/turnend/roundend)
  SELECT * FROM public.game_state
  WHERE status IN ('ready', 'turnend', 'roundend')
    AND game_id = ready_game_id
  INTO ready_game;

  -- get painters from the current round of the target game
  -- if game is not ready, then no painters will be found
  CREATE TEMP TABLE IF NOT EXISTS tmp_painters ON COMMIT DROP AS
  SELECT game_id, painter_id AS player_id FROM public.game_rounds LIMIT 0;

  INSERT INTO tmp_painters(game_id, player_id)
  SELECT game_id, painter_id
  FROM public.game_rounds
  WHERE game_id = ready_game.game_id
    AND round = ready_game.current_round;

  -- get players that are not painters
  RETURN QUERY
  SELECT p.*
  FROM public.player p
  LEFT JOIN tmp_painters pt ON p.game_id = pt.game_id AND p.id = pt.player_id
  WHERE p.game_id = ready_game.game_id
    AND p.active = true
    AND pt.game_id IS NULL;
END;
$$ LANGUAGE plpgsql