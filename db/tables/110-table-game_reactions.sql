-- Stores player reactions for each turn

CREATE TABLE public.game_reactions (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    game_rounds_id integer NOT NULL REFERENCES public.game_rounds(id),
    player_id integer NOT NULL REFERENCES public.player(id),
    reaction reaction NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
);

ALTER TABLE public.game_reactions ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX unique_game_reactions ON public.game_reactions USING btree (game_rounds_id, player_id);
CREATE INDEX idx_game_reactions_game_rounds_id ON public.game_reactions USING btree (game_rounds_id);
CREATE INDEX idx_game_reactions_player_id ON public.game_reactions USING btree (player_id);