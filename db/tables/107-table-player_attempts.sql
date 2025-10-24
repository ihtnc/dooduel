-- Stores player answer attempts for each turn

CREATE TABLE public.player_attempts (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    game_rounds_id integer NOT NULL REFERENCES public.game_rounds(id),
    player_id integer NOT NULL REFERENCES public.player(id),
    word character varying NOT NULL,
    accuracy numeric NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
);

ALTER TABLE public.player_attempts ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_player_attempts_game_rounds_id ON public.player_attempts USING btree (game_rounds_id);
CREATE INDEX idx_player_attempts_player_id ON public.player_attempts USING btree (player_id);