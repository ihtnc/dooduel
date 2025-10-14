-- Stores messages to be sent to clients via Supabase Realtime
-- Actual sending is handled by the insert trigger on this table

CREATE TABLE app.outbox (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    topic varchar NOT NULL,
    event varchar NOT NULL,
    payload jsonb NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
);

ALTER TABLE app.outbox ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon to select" ON app.outbox
FOR SELECT
USING (true);

CREATE POLICY "Allow anon to insert" ON app.outbox
FOR INSERT
WITH CHECK (true);
