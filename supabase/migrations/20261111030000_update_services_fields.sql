ALTER TABLE public.services
  RENAME COLUMN title TO name;

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS price numeric(10, 2),
  ADD COLUMN IF NOT EXISTS duration_minutes integer,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

NOTIFY pgrst, 'reload schema';