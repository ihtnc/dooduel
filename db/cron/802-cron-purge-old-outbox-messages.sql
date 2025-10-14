-- Schedules a cron job to purge old outbox messages from the database every hour at minute 0
-- Deletes all records from app.outbox that are older than a certain threshold to keep the database clean

SELECT cron.schedule(
    'Purge old outbox messages',
    '0 * * * *',
    'SELECT app.purge_old_outbox()'
);