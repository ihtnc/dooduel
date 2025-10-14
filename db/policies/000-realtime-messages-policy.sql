-- This policy controls access to realtime broadcast messages

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to receive broadcast messages
-- This policy is required for realtime.send() and realtime.broadcast_changes()
CREATE POLICY "Allow anon to receive broadcasts" ON realtime.messages
FOR SELECT
TO anon
USING (true);