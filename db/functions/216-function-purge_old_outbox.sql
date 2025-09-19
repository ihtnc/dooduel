CREATE OR REPLACE FUNCTION app.purge_old_outbox() RETURNS void AS $$
DECLARE
  deleted_count integer := 0;
BEGIN
  SELECT COUNT(*) INTO deleted_count
  FROM app.outbox
  WHERE (created_at <= now() - interval '6 hours');

  DELETE FROM app.outbox
  WHERE (created_at <= now() - interval '6 hours');

  RAISE NOTICE 'Purged % records', deleted_count;
END;
$$ LANGUAGE plpgsql;