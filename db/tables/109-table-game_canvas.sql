-- Stores the drawing actions made by players during their turn

CREATE TABLE public.game_canvas (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    game_rounds_id integer NOT NULL REFERENCES public.game_rounds(id),
    brush_size integer NOT NULL,
    brush_color character varying NOT NULL,
    from_x numeric NOT NULL,
    from_y numeric NOT NULL,
    to_x numeric NOT NULL,
    to_y numeric NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
);

ALTER TABLE public.game_canvas ENABLE ROW LEVEL SECURITY;