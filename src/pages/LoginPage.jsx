import { Navigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Star,
  Users,
  Globe,
  Award,
  Clock,
  Shield,
  Headphones,
  TrendingUp,
  Plane,
} from "lucide-react";
import toast from "react-hot-toast";
import LoginForm from "../components/auth/LoginForm";
import useAuthStore from "../store/authStore";

// ─── Google SVG Icon ──────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── Stat badge ───────────────────────────────────────────────────────────────
function StatBadge({ Icon, value, label }) {
  return (
    <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3">
      <div className="w-9 h-9 bg-white/25 rounded-xl flex items-center justify-center shrink-0">
        <Icon size={17} className="text-white" />
      </div>
      <div>
        <p className="text-white font-bold text-base leading-none">{value}</p>
        <p className="text-white/70 text-xs mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Destination card — pakai icon bukan emoji ────────────────────────────────
function DestCard({ icon: Icon, iconBg, name, country, rating, price }) {
  return (
    <div className="bg-white rounded-2xl shadow-md px-4 py-3 flex items-center gap-3 w-60">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
      >
        <Icon size={20} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-dark text-sm">{name}</p>
        <p className="text-gray-400 text-xs">{country}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="flex items-center gap-0.5 text-xs text-gray-500">
            <Star size={11} fill="currentColor" className="text-primary" />
            {rating}
          </span>
          <span className="text-xs font-bold text-accent">{price}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Kiri: branding panel ─────────────────────────────────────────────────────
function HeroPanel() {
  return (
    <div
      className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-primary via-primary-hover to-accent"
    >
      {/* Dekorasi bulat */}
      <div className="absolute -top-28 -right-28 w-96 h-96 bg-white/10 rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full" />
      <div className="absolute top-1/2 right-10 w-20 h-20 bg-white/10 rounded-full" />

      {/* Logo */}
      <div className="relative z-10">
        <img
          src="/logo.png"
          alt="Amoures Tour Operator"
          className="h-16 w-auto object-contain drop-shadow-md"
        />
      </div>

      {/* Konten tengah */}
      <div className="relative z-10 space-y-8">
        {/* Headline — TANPA emoji */}
        <div>
          <h1 className="text-[2.5rem] font-black text-white leading-tight tracking-tight">
            Jelajahi Dunia
            <br />
            Bersama Kami
          </h1>
          <p className="mt-3 text-white/80 text-base leading-relaxed max-w-xs">
            Pengalaman perjalanan tak terlupakan ke ratusan destinasi eksotis di
            seluruh dunia.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatBadge Icon={Users} value="10.000+" label="Pelanggan Puas" />
          <StatBadge Icon={Globe} value="150+" label="Destinasi Wisata" />
          <StatBadge Icon={Award} value="12+" label="Tahun Pengalaman" />
          <StatBadge Icon={TrendingUp} value="98%" label="Kepuasan Tamu" />
        </div>

        {/* Destination cards — TANPA emoji, pakai icon */}
        <div>
          <p className="text-white/70 text-[11px] font-bold uppercase tracking-widest mb-3">
            Destinasi Terpopuler
          </p>
          <div className="space-y-2.5">
            <DestCard
              icon={Globe}
              iconBg="bg-blue-500"
              name="Paris"
              country="Prancis"
              rating="4.9"
              price="Rp 12 Jt"
            />
            <div className="ml-8">
              <DestCard
                icon={Plane}
                iconBg="bg-rose-500"
                name="Tokyo"
                country="Jepang"
                rating="4.8"
                price="Rp 9 Jt"
              />
            </div>
            <DestCard
              icon={MapPin}
              iconBg="bg-emerald-500"
              name="Bali"
              country="Indonesia"
              rating="4.9"
              price="Rp 3 Jt"
            />
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative z-10">
        <p className="text-white/75 text-sm">
          Belum punya akun?{" "}
          <Link to="/register" className="text-white font-bold hover:underline">
            Daftar gratis sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const { user, profile } = useAuthStore();

  if (user) {
    const isAdmin = profile?.role?.toLowerCase() === "admin" || user.email === "admin@moures.com";
    if (isAdmin) return <Navigate to="/admin" replace />;
    if (profile) return <Navigate to="/dashboard" replace />;
    
    // Tampilkan loader saat memuat profile untuk mencegah redirect prematur ke dashboard
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleGoogleLogin = () => {
    toast.error(
      "Login dengan Google belum tersedia. Gunakan email & password.",
    );
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Panel kiri */}
      <HeroPanel />

      {/* Panel kanan */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Kembali ke Beranda */}
        <div className="px-6 pt-6 pb-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-dark transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            {/* Logo mobile */}
            <div className="flex items-center gap-2 mb-7 lg:hidden">
              <img
                src="/logo.png"
                alt="Amoures Tour Operator"
                className="h-12 w-auto object-contain"
              />
            </div>

            {/* Heading */}
            <div className="mb-7">
              <h1 className="text-3xl font-black text-dark leading-tight">
                Selamat Datang Kembali
              </h1>
              <p className="mt-1.5 text-gray-500 text-sm">
                Masuk ke akun Amoures Tour Anda
              </p>
            </div>

            {/* Login Form */}
            <LoginForm />

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-gray-400 font-medium uppercase tracking-widest">
                  Atau masuk dengan
                </span>
              </div>
            </div>

            {/* Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 px-5 flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all duration-200"
            >
              <GoogleIcon />
              Masuk dengan Google
            </button>

            {/* Fitur keamanan */}
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Shield size={13} className="text-primary" />
                SSL Terenkripsi
              </span>
              <span className="flex items-center gap-1">
                <Headphones size={13} className="text-primary" />
                Support 24/7
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-primary" />
                Konfirmasi Cepat
              </span>
            </div>

            {/* Daftar link */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="font-bold text-primary hover:text-primary-hover transition-colors"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
