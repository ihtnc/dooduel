CREATE TABLE app.outbox (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    topic varchar NOT NULL,
    event varchar NOT NULL,
    payload jsonb NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
);

