-- Source for the words used in each game instance

CREATE TABLE public.game_words (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    game_id BIGINT NOT NULL REFERENCES game(id),
    value varchar NOT NULL,
    similarity_threshold float4 NOT NULL DEFAULT 1.0
);

ALTER TABLE public.game_words ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX unique_game_words ON public.game_words USING btree (game_id, value);