-- 1) Ensure automatic updated_at maintenance on bookings and profiles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create or replace bookings validation and sanitization trigger function
CREATE OR REPLACE FUNCTION public.validate_bookings_and_sanitize()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  phone_digits TEXT;
BEGIN
  -- Normalize lengths and casing
  NEW.name := left(coalesce(NEW.name, ''), 120);
  NEW.email := lower(left(coalesce(NEW.email, ''), 254));
  NEW.phone := left(coalesce(NEW.phone, ''), 32);
  NEW.service_type := left(coalesce(NEW.service_type, ''), 120);
  IF NEW.message IS NOT NULL THEN
    NEW.message := left(NEW.message, 2000);
  END IF;

  -- Email format check (simple but effective)
  IF NEW.email !~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  -- Basic phone validation: at least 7 digits after stripping non-digits
  phone_digits := regexp_replace(NEW.phone, '\\D', '', 'g');
  IF length(phone_digits) < 7 THEN
    RAISE EXCEPTION 'Invalid phone number';
  END IF;

  -- Do not allow bookings in the past
  IF NEW.preferred_date < current_date THEN
    RAISE EXCEPTION 'preferred_date must be today or in the future';
  END IF;

  -- Enforce allowed status values and defaults
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'pending';
  ELSE
    -- On update, allow only known statuses
    IF NEW.status IS NULL OR NEW.status NOT IN ('pending','confirmed','cancelled') THEN
      NEW.status := COALESCE(OLD.status, 'pending');
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Prevent non-admin users from changing profile role
CREATE OR REPLACE FUNCTION public.prevent_profile_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT public.has_role(auth.uid(), 'admin') THEN
      RAISE EXCEPTION 'Only admins can change user roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Attach/update triggers (idempotent: drop if exists first)
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS validate_bookings_before_write ON public.bookings;
CREATE TRIGGER validate_bookings_before_write
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.validate_bookings_and_sanitize();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS prevent_role_change ON public.profiles;
CREATE TRIGGER prevent_role_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_profile_role_change();

-- Auto-provision profiles and roles when a new auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();