CREATE OR REPLACE FUNCTION app.purge_old_outbox()
  RETURNS void
  SET search_path = app
AS $$
DECLARE
  deleted_count integer := 0;
BEGIN
  SELECT COUNT(*) INTO deleted_count
  FROM app.outbox
  WHERE (created_at <= now() - interval '6 hours');

  -- delete outbox records older than 6 hours
  -- this coincides with the retention period of the completed games
  DELETE FROM app.outbox
  WHERE (created_at <= now() - interval '6 hours');

  RAISE NOTICE 'Purged % records', deleted_count;
END;
$$ LANGUAGE plpgsql;