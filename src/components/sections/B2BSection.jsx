import { Link } from 'react-router-dom'
import {
  Percent,
  Users,
  Headphones,
  FileText,
  ArrowRight,
  Building2,
  CheckCircle2,
  BarChart3,
  Globe,
} from 'lucide-react'

const BENEFITS = [
  {
    icon: Percent,
    title: 'Diskon Mitra hingga 25%',
    desc: 'Harga eksklusif untuk pemesanan grup dan korporat',
  },
  {
    icon: Users,
    title: 'Pemesanan Grup & MICE',
    desc: 'Kelola perjalanan tim hingga ratusan peserta dengan mudah',
  },
  {
    icon: Headphones,
    title: 'Account Manager Dedikasi',
    desc: 'Satu kontak untuk semua kebutuhan perjalanan bisnis Anda',
  },
  {
    icon: FileText,
    title: 'Invoice & Laporan Bulanan',
    desc: 'Tagihan terkonsolidasi dan laporan pengeluaran otomatis',
  },
]

const STATS = [
  { value: '500+', label: 'Mitra Aktif' },
  { value: '50K+', label: 'Perjalanan/Tahun' },
  { value: '98%', label: 'Kepuasan Mitra' },
]

const CHIPS = [
  'Invoice Otomatis',
  'Real-time Booking',
  'Laporan Bulanan',
  'API Integration',
  'Multi-User Access',
  'Prioritas Support',
]

const MOCK_ORDERS = [
  { initial: 'PT', name: 'PT Maju Bersama', dest: 'Bali 5D4N', price: 'Rp 45.000.000' },
  { initial: 'CV', name: 'CV Karya Nusantara', dest: 'Lombok 4D3N', price: 'Rp 28.000.000' },
]

export default function B2BSection() {
  return (
    <section
      id="b2b"
      className="py-24 bg-[#1A1A1A] relative overflow-hidden"
    >
      {/* Subtle dot-grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,193,7,0.08) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto px-6">
        {/* ── Left column ── */}
        <div>
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Building2 className="w-4 h-4" />
            Program Mitra B2B
          </span>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Solusi Perjalanan
            <br />
            <span className="text-primary">untuk Bisnis Anda</span>
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Bergabunglah dengan 500+ mitra bisnis kami dan nikmati kemudahan
            pemesanan wisata korporat dengan harga terbaik, layanan premium, dan
            dukungan penuh dari tim dedikasi kami.
          </p>

          {/* Benefits */}
          <div className="space-y-4 mb-10">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-white font-semibold">{title}</p>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/b2b/register"
              className="bg-primary hover:bg-[#FFA000] text-dark font-bold px-6 py-3 rounded-xl inline-flex items-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
            >
              Daftar Sebagai Mitra
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/b2b"
              className="border border-white/20 text-white hover:border-primary hover:text-primary font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2 transition-all"
            >
              Pelajari Lebih Lanjut
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── Right column — premium portal card ── */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
          {/* Card header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-dark" />
            </div>
            <div>
              <p className="text-white font-bold leading-tight">Amoures B2B Portal</p>
              <p className="text-gray-400 text-sm">Dashboard Mitra Bisnis</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="bg-white/5 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-primary">{value}</p>
                <p className="text-gray-400 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CHIPS.map((chip) => (
              <span
                key={chip}
                className="bg-white/[0.08] border border-white/10 text-gray-300 text-xs font-medium px-3 py-1.5 rounded-lg"
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Mock booking card */}
          <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Pesanan Terbaru
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-medium">Live</span>
              </span>
            </div>

            {/* Mock order rows */}
            <div className="space-y-3">
              {MOCK_ORDERS.map(({ initial, name, dest, price }) => (
                <div
                  key={name}
                  className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-xs font-black">{initial}</span>
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold leading-tight">{name}</p>
                      <p className="text-gray-400 text-xs">{dest}</p>
                    </div>
                  </div>
                  <span className="bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap">
                    {price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
