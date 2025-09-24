CREATE TABLE public.game_state (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    game_id integer NOT NULL REFERENCES public.game(id),
    current_player_id integer NULL REFERENCES public.player(id),
    current_round integer NULL,
    status status DEFAULT 'initial',
    updated_at timestamp NULL
);


CREATE UNIQUE INDEX game_state_key ON public.game_state USING btree (game_id);