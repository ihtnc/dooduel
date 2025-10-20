-- Stores the current state of each game instance

CREATE TABLE public.game_state (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    game_id integer NOT NULL REFERENCES public.game(id),
    current_player_id integer NULL REFERENCES public.player(id),
    current_round integer NULL,
    status status DEFAULT 'initial',
    updated_at timestamp NULL
);

ALTER TABLE public.game_state ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX game_state_key ON public.game_state USING btree (game_id);
CREATE INDEX idx_game_state_current_player_id ON public.game_state USING btree (current_player_id);