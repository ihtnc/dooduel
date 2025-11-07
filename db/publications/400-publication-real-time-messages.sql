-- Create a publication for the outbox table to enable real-time messaging
-- Triggers on the app.outbox table will send messages to subscribed clients

ALTER PUBLICATION supabase_realtime_messages_publication ADD TABLE app.outbox;
