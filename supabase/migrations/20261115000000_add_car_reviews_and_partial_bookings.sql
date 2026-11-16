CREATE TABLE IF NOT EXISTS public.car_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  customer_name text NOT NULL CHECK (char_length(trim(customer_name)) BETWEEN 1 AND 120),
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text NOT NULL CHECK (char_length(trim(comment)) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS car_reviews_car_created_idx
  ON public.car_reviews (car_id, created_at DESC);

ALTER TABLE public.car_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read car reviews" ON public.car_reviews;
CREATE POLICY "Public can read car reviews"
  ON public.car_reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can submit car reviews" ON public.car_reviews;
CREATE POLICY "Public can submit car reviews"
  ON public.car_reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_car_review_summary()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.cars
  SET
    rating = (
      SELECT round(avg(rating)::numeric, 1)
      FROM public.car_reviews
      WHERE car_id = NEW.car_id
    ),
    review_count = (
      SELECT count(*)::integer
      FROM public.car_reviews
      WHERE car_id = NEW.car_id
    )
  WHERE id = NEW.car_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_car_review_summary_after_insert ON public.car_reviews;
CREATE TRIGGER update_car_review_summary_after_insert
  AFTER INSERT ON public.car_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_car_review_summary();

CREATE TABLE IF NOT EXISTS public.partial_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL CHECK (char_length(email) <= 320),
  car_id uuid NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL CHECK (end_date > start_date),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT partial_bookings_email_car_dates_key UNIQUE (email, car_id, start_date, end_date),
  CONSTRAINT partial_bookings_email_format_check CHECK (email = lower(trim(email)) AND position('@' IN email) > 1)
);

CREATE INDEX IF NOT EXISTS partial_bookings_created_idx
  ON public.partial_bookings (created_at DESC);

ALTER TABLE public.partial_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can capture partial bookings" ON public.partial_bookings;
CREATE POLICY "Public can capture partial bookings"
  ON public.partial_bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read partial bookings" ON public.partial_bookings;
CREATE POLICY "Admins can read partial bookings"
  ON public.partial_bookings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role IN ('admin', 'super_admin')
    )
  );