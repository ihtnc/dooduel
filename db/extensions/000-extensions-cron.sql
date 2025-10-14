-- Enable the pg_cron extension for scheduling periodic tasks
-- Used for tasks like evaluating game states and cleaning up old data

CREATE EXTENSION IF NOT EXISTS pg_cron;

GRANT USAGE ON SCHEMA cron TO CURRENT_USER;
GRANT ALL ON ALL TABLES IN SCHEMA cron TO CURRENT_USER;