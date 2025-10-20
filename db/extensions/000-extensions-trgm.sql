-- Enable the pg_trgm extension for text similarity operations
-- Used for evaluating player guesses against the target word

CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA extensions;