CREATE OR REPLACE FUNCTION public.generate_game_code()
  RETURNS text
  LANGUAGE plpgsql
  SET search_path = ''
AS $function$
DECLARE
  charset TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := '';
  i INT;
  exists BOOLEAN;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..8 LOOP
      result := result || substr(charset, floor(random() * length(charset) + 1)::int, 1);
    END LOOP;
    SELECT EXISTS (SELECT 1 FROM public.game WHERE code = result) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN result;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.generate_game_code() TO anon, authenticated;
