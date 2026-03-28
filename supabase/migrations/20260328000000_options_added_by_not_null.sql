-- Make options.added_by NOT NULL.
-- Authoring context: every option must be traceable to a trip member.
-- On delete restrict prevents accidental profile deletion while options exist.

-- 1. Drop existing nullable FK constraint
ALTER TABLE public.options
  DROP CONSTRAINT IF EXISTS options_added_by_fkey;

-- 2. Set NOT NULL (safe on fresh schema — no orphaned rows expected)
ALTER TABLE public.options
  ALTER COLUMN added_by SET NOT NULL;

-- 3. Recreate FK with ON DELETE RESTRICT (consistent with NOT NULL)
ALTER TABLE public.options
  ADD CONSTRAINT options_added_by_fkey
  FOREIGN KEY (added_by)
  REFERENCES public.profiles(id)
  ON DELETE RESTRICT;
