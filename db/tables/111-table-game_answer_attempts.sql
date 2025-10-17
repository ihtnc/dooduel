-- Stores player answer attempts for each turn

CREATE TABLE public.game_answer_attempts (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    game_rounds_id integer NOT NULL REFERENCES public.game_rounds(id),
    player_id integer NOT NULL REFERENCES public.player(id),
    accuracy numeric NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
);

ALTER TABLE public.game_answer_attempts ENABLE ROW LEVEL SECURITY;