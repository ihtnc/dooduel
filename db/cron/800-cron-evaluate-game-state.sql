-- Schedules a cron job to automatically evaluate game states every 30 seconds
-- This is what makes the game progress from within the database

SELECT cron.schedule(
    'Evaluate game states',
    '30 seconds',
    'SELECT app.evaluate_game_states()'
);