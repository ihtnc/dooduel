-- Creates the 'app' schema which will contain non-public, application-specific tables and functions

CREATE SCHEMA app;
GRANT USAGE ON SCHEMA app TO anon, authenticated, service_role;

GRANT USAGE ON ALL SEQUENCES IN SCHEMA app TO anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO service_role;