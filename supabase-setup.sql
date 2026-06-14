-- ============================================================
-- AMOURES TOUR OPERATOR — Supabase Database Setup
-- Jalankan script ini di: Supabase Dashboard → SQL Editor
-- Project: pmadqpbjtqnbloywparm
-- ============================================================

-- ─── 1. PROFILES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'travel_agent')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User dapat baca & update profil sendiri
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Admin bisa lihat semua
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ─── 2. TRIGGER: auto-create profile saat register ──────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── 3. TOUR PACKAGES ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tour_packages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  destination     TEXT NOT NULL,
  description     TEXT,
  price           NUMERIC(12,0) NOT NULL DEFAULT 0,
  duration_days   INT NOT NULL DEFAULT 1,
  image_url       TEXT,
  quota           INT NOT NULL DEFAULT 10,
  departure_date  DATE,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tour_packages ENABLE ROW LEVEL SECURITY;

-- Siapa saja bisa baca paket aktif
CREATE POLICY "Anyone can view active packages"
  ON public.tour_packages FOR SELECT
  USING (is_active = TRUE);

-- Admin bisa CRUD semua
CREATE POLICY "Admins can manage packages"
  ON public.tour_packages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ─── 4. BOOKINGS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  package_id       UUID REFERENCES public.tour_packages(id) ON DELETE SET NULL,
  passenger_count  INT NOT NULL DEFAULT 1,
  total_price      NUMERIC(14,0) NOT NULL DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  booking_code     TEXT UNIQUE NOT NULL,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- User hanya bisa lihat & buat booking sendiri
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Admin bisa akses semua booking
CREATE POLICY "Admins can manage all bookings"
  ON public.bookings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ─── 5. TESTIMONIALS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.testimonials (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  package_id  UUID REFERENCES public.tour_packages(id) ON DELETE SET NULL,
  rating      SMALLINT CHECK (rating BETWEEN 1 AND 5),
  review      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read testimonials"
  ON public.testimonials FOR SELECT USING (TRUE);

CREATE POLICY "Users can add testimonials"
  ON public.testimonials FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── 6. SAMPLE DATA ──────────────────────────────────────────
INSERT INTO public.tour_packages
  (title, destination, description, price, duration_days, quota, departure_date, image_url, is_active)
VALUES
  ('Bali Paradise Escape',
   'Bali',
   'Nikmati keindahan Pulau Dewata dengan paket lengkap — pura sakral, sawah Ubud, pantai Seminyak, hingga sunset di Tanah Lot.',
   2500000, 5, 20, '2025-07-15',
   'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', TRUE),

  ('Lombok Eksotis',
   'Lombok',
   'Jelajahi keindahan Gili Trawangan, Pantai Pink, dan Gunung Rinjani yang megah bersama pemandu wisata berpengalaman.',
   2200000, 4, 15, '2025-07-22',
   'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80', TRUE),

  ('Labuan Bajo Adventure',
   'Labuan Bajo',
   'Petualangan menakjubkan menyusuri perairan Komodo, menyelam di titik-titik terbaik, dan bertemu Komodo di habitat aslinya.',
   4900000, 6, 12, '2025-08-01',
   'https://images.unsplash.com/photo-1570737209810-87a8e7245f88?w=800&q=80', TRUE),

  ('Yogyakarta Heritage',
   'Yogyakarta',
   'Jelajahi Candi Borobudur yang megah, Prambanan yang memesona, dan kekayaan budaya Kraton Yogyakarta.',
   1600000, 3, 25, '2025-08-10',
   'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=800&q=80', TRUE),

  ('Raja Ampat Diving Paradise',
   'Raja Ampat',
   'Surga bawah laut dengan biodiversitas tertinggi di dunia. Snorkeling dan diving di perairan paling jernih Indonesia.',
   5500000, 7, 10, '2025-08-20',
   'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80', TRUE),

  ('Bromo Sunrise Spectacular',
   'Bromo',
   'Saksikan matahari terbit yang spektakuler di Gunung Bromo, lautan pasir yang memesona, dan kawah yang menakjubkan.',
   1500000, 3, 20, '2025-09-01',
   'https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&q=80', TRUE)
ON CONFLICT DO NOTHING;

-- ─── 7. SET ADMIN (ganti email sesuai akun Anda) ─────────────
-- Jalankan ini SETELAH mendaftar akun admin:
-- UPDATE public.profiles SET role = 'admin' WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'admin@moures.com'
-- );

-- ============================================================
-- SELESAI! Cek tabel di: Table Editor → profiles / tour_packages / bookings
-- ============================================================
