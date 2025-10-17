-- Stores player answers and their corresponding scores for each turn

CREATE TABLE public.game_logs (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    game_rounds_id integer NOT NULL REFERENCES public.game_rounds(id),
    player_id integer NOT NULL REFERENCES public.player(id),
    answer varchar NOT NULL,
    speed_score numeric NOT NULL,
    accuracy_score numeric NOT NULL,
    efficiency_score numeric NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
);

ALTER TABLE public.game_logs ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX unique_game_logs ON public.game_logs USING btree (game_rounds_id, player_id);