ALTER TABLE public.car_reviews
  ADD COLUMN IF NOT EXISTS is_approved boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS car_reviews_approved_car_created_idx
  ON public.car_reviews (car_id, created_at DESC)
  WHERE is_approved = true;

DROP POLICY IF EXISTS "Public can read car reviews" ON public.car_reviews;
CREATE POLICY "Public can read approved car reviews"
  ON public.car_reviews
  FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

DROP POLICY IF EXISTS "Public can submit car reviews" ON public.car_reviews;
CREATE POLICY "Public can submit pending car reviews"
  ON public.car_reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (is_approved = false);

DROP POLICY IF EXISTS "Admins can read all car reviews" ON public.car_reviews;
CREATE POLICY "Admins can read all car reviews"
  ON public.car_reviews
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

DROP POLICY IF EXISTS "Admins can moderate car reviews" ON public.car_reviews;
CREATE POLICY "Admins can moderate car reviews"
  ON public.car_reviews
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Admins can delete car reviews" ON public.car_reviews;
CREATE POLICY "Admins can delete car reviews"
  ON public.car_reviews
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE OR REPLACE FUNCTION public.update_car_review_summary()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  target_car_id uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_car_id := OLD.car_id;
  ELSE
    target_car_id := NEW.car_id;
  END IF;

  UPDATE public.cars
  SET
    rating = COALESCE((
      SELECT round(avg(car_reviews.rating)::numeric, 1)
      FROM public.car_reviews
      WHERE car_reviews.car_id = target_car_id
        AND car_reviews.is_approved = true
    ), 5),
    review_count = (
      SELECT count(*)::integer
      FROM public.car_reviews
      WHERE car_reviews.car_id = target_car_id
        AND car_reviews.is_approved = true
    )
  WHERE id = target_car_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_car_review_summary_after_insert ON public.car_reviews;
CREATE TRIGGER update_car_review_summary_after_change
  AFTER INSERT OR UPDATE OR DELETE ON public.car_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_car_review_summary();

NOTIFY pgrst, 'reload schema';