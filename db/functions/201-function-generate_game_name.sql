CREATE OR REPLACE FUNCTION public.generate_game_name()
  RETURNS text
  LANGUAGE plpgsql
  SET search_path = public
AS $function$
DECLARE
  word1 TEXT;
  word2 TEXT;
  result TEXT;
  exists BOOLEAN;
  num TEXT;
BEGIN
  LOOP
    SELECT name INTO word1 FROM names WHERE active = true ORDER BY random() LIMIT 1;
    SELECT name INTO word2 FROM names WHERE active = true AND name <> word1 ORDER BY random() LIMIT 1;
    num := lpad(floor(random() * 100)::text, 2, '0');
    result := word1 || '-' || word2 || '-' || num;
    SELECT EXISTS (SELECT 1 FROM game WHERE name = result) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN result;
END;
$function$;
