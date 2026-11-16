ALTER TABLE public.cars
  ADD COLUMN IF NOT EXISTS brand text,
  ADD COLUMN IF NOT EXISTS model text,
  ADD COLUMN IF NOT EXISTS top_speed text;

DROP POLICY IF EXISTS "Admins can delete cars" ON public.cars;
CREATE POLICY "Admins can delete cars"
  ON public.cars
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

NOTIFY pgrst, 'reload schema';