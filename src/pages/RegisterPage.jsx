import { Navigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Plane,
  ShieldCheck,
  Headphones,
  CreditCard,
  Star,
} from 'lucide-react'
import RegisterForm from '../components/auth/RegisterForm'
import useAuth from '../hooks/useAuth'

// ─── Left Panel Sub-components ────────────────────────────────────────────────

function FeatureItem({ Icon, title, description }) {
  return (
    <div className="flex items-start gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3.5">
      <div className="w-9 h-9 bg-white/30 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-white font-semibold text-sm">{title}</p>
        <p className="text-white/70 text-xs mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

const AVATAR_COLORS = ['#E91E63', '#9C27B0', '#2196F3', '#4CAF50', '#FF5722']

function CommunityPreview() {
  const initials = ['A', 'B', 'C', 'D', '+']
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
      <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">
        Bergabung bersama
      </p>
      <div className="flex items-center gap-3">
        {/* Avatar stack */}
        <div className="flex">
          {initials.map((initial, i) => (
            <div
              key={i}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold
                border-2 border-white -ml-2 first:ml-0 shadow-sm"
              style={{ backgroundColor: AVATAR_COLORS[i] }}
            >
              {initial}
            </div>
          ))}
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none">10.000+</p>
          <p className="text-white/70 text-xs mt-0.5">traveler aktif</p>
        </div>
      </div>
      {/* Testimonial */}
      <div className="mt-3 pt-3 border-t border-white/20">
        <div className="flex items-center gap-0.5 mb-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={11} fill="white" className="text-white" />
          ))}
        </div>
        <p className="text-white/80 text-xs leading-relaxed italic">
          "Liburan ke Eropa jadi impian yang terwujud berkat Amoures Tour!"
        </p>
        <p className="text-white/60 text-xs mt-1 font-medium">— Siti Rahayu, Jakarta</p>
      </div>
    </div>
  )
}

// ─── Left Panel ───────────────────────────────────────────────────────────────

function HeroPanel() {
  return (
    <div
      className="hidden lg:flex lg:w-5/12 relative flex-col justify-between p-12 overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #FFC107 0%, #FF8F00 55%, #FF6F00 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full" />
      <div className="absolute top-1/2 right-4 w-20 h-20 bg-white/10 rounded-full" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
          <Plane size={24} className="text-[#FF6F00]" />
        </div>
        <div>
          <p className="text-white font-extrabold text-xl leading-none">Amoures</p>
          <p className="text-white/75 text-sm">Tour & Travel</p>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 space-y-5">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/25 rounded-full px-3 py-1.5 w-fit">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white text-xs font-semibold">10.000+ Traveler Bergabung</span>
        </div>

        {/* Headline */}
        <div>
          <h1 className="text-[2.4rem] font-extrabold text-white leading-tight tracking-tight">
            Bergabunglah &<br />Mulai Petualangan 🌏
          </h1>
          <p className="mt-3 text-white/80 text-base leading-relaxed">
            Daftar gratis dan dapatkan akses ke ribuan paket wisata eksklusif dengan harga terbaik dan layanan terpercaya.
          </p>
        </div>

        {/* Community Preview */}
        <CommunityPreview />

        {/* Feature List */}
        <div className="space-y-2.5">
          <FeatureItem
            Icon={ShieldCheck}
            title="Transaksi Aman & Terpercaya"
            description="Data dan pembayaran dilindungi enkripsi SSL 256-bit"
          />
          <FeatureItem
            Icon={Headphones}
            title="Dukungan 24/7"
            description="Tim kami siap membantu kapan saja dan di mana saja"
          />
          <FeatureItem
            Icon={CreditCard}
            title="Harga Terbaik Garansi"
            description="Kami menjamin harga terbaik atau refund 100%"
          />
        </div>
      </div>

      {/* Bottom Link */}
      <div className="relative z-10">
        <p className="text-white/75 text-sm">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-white font-bold hover:underline">
            Masuk sekarang →
          </Link>
        </p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const { user } = useAuth()

  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left: Branding panel */}
      <HeroPanel />

      {/* Right: Form panel — scrollable to accommodate all fields */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Back to Home */}
        <div className="px-6 pt-6 pb-2 flex-shrink-0">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-[#1A1A1A] transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-start justify-center px-6 py-6">
          <div className="w-full max-w-md">

            {/* Mobile-only logo */}
            <div className="flex items-center gap-2 mb-7 lg:hidden">
              <div className="w-9 h-9 bg-[#FFC107] rounded-xl flex items-center justify-center shadow-sm">
                <Plane size={18} className="text-[#1A1A1A]" />
              </div>
              <span className="font-extrabold text-lg text-[#1A1A1A]">Amoures Tour</span>
            </div>

            {/* Heading */}
            <div className="mb-7">
              <h1 className="text-[1.85rem] font-extrabold text-[#1A1A1A] leading-tight">
                Buat Akun Baru
              </h1>
              <p className="mt-1.5 text-gray-500">
                Mulai petualangan Anda bersama Amoures Tour
              </p>
            </div>

            {/* Register Form */}
            <RegisterForm />

            {/* Login Link */}
            <p className="mt-6 mb-8 text-center text-sm text-gray-500">
              Sudah punya akun?{' '}
              <Link
                to="/login"
                className="font-semibold text-[#FF6F00] hover:text-[#FFA000] hover:underline transition-colors"
              >
                Masuk sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
