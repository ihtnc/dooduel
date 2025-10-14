-- Schedules a cron job to purge old games from the database every hour at minute 0
-- Deletes all records from old/completed games that are older than a certain threshold to keep the database clean

SELECT cron.schedule(
    'Purge old games',
    '0 * * * *',
    'SELECT app.purge_old_games()'
);