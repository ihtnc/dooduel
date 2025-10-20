-- Stores player answers and their corresponding scores for each turn

CREATE TABLE public.player_turn (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    game_rounds_id integer NOT NULL REFERENCES public.game_rounds(id),
    player_id integer NOT NULL REFERENCES public.player(id),
    has_answered boolean NOT NULL DEFAULT false,
    has_correct_answer boolean NULL,
    is_painter boolean NOT NULL DEFAULT false,
    speed_score numeric NULL,
    accuracy_score numeric NULL,
    efficiency_score numeric NULL,
    reaction_score numeric NULL,
    created_at timestamp NOT NULL DEFAULT now()
);

ALTER TABLE public.player_turn ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX unique_player_turn ON public.player_turn USING btree (game_rounds_id, player_id);
CREATE INDEX idx_player_turn_player_id ON public.player_turn USING btree (player_id);