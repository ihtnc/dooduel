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

CREATE POLICY "Allow realtime subscription access to outbox" ON app.outbox
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow triggers to insert outbox messages" ON app.outbox
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

GRANT SELECT ON TABLE app.outbox TO anon, authenticated;
GRANT INSERT ON TABLE app.outbox TO anon, authenticated;