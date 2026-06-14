import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  Package,
  Users,
  Headphones,
  FileText,
  BarChart3,
  Globe,
  Zap,
  Shield,
  Star,
  ChevronDown,
  ChevronUp,
  Lock,
  Server,
  ShieldCheck,
  CreditCard,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

/* ─────────────────────────────────── data ─────────────────────────────────── */

const HERO_STATS = [
  { value: '500+', label: 'Mitra Aktif' },
  { value: '50.000+', label: 'Booking' },
  { value: '4.8/5', label: 'Rating' },
]

const STEPS = [
  {
    num: '1',
    title: 'Daftar Mitra',
    desc: 'Isi formulir pendaftaran dan tunggu verifikasi tim kami dalam 1x24 jam',
  },
  {
    num: '2',
    title: 'Akses Portal B2B',
    desc: 'Login ke portal khusus mitra dan mulai jelajahi ribuan paket wisata',
  },
  {
    num: '3',
    title: 'Nikmati Keuntungan',
    desc: 'Dapatkan harga eksklusif, dukungan dedikasi, dan kemudahan pengelolaan',
  },
]

const FEATURES = [
  {
    icon: Package,
    title: 'Paket Custom',
    desc: 'Rancang itinerary sesuai kebutuhan dan budget perusahaan',
  },
  {
    icon: Users,
    title: 'Multi-User Access',
    desc: 'Beberapa staff dapat mengelola pemesanan dalam satu akun',
  },
  {
    icon: Headphones,
    title: 'Support Prioritas',
    desc: 'Antrian support terpisah dengan respons < 1 jam',
  },
  {
    icon: FileText,
    title: 'Invoice Terpusat',
    desc: 'Satu invoice untuk semua perjalanan dalam sebulan',
  },
  {
    icon: BarChart3,
    title: 'Laporan Analitik',
    desc: 'Pantau tren pengeluaran dan optimasi budget perjalanan',
  },
  {
    icon: Zap,
    title: 'Booking Instan',
    desc: 'Konfirmasi pemesanan real-time tanpa perlu menunggu',
  },
]

const TIERS = [
  {
    name: 'Basic',
    badge: null,
    price: 'Gratis',
    period: null,
    volume: '< 10 Booking/Bulan',
    cardClass: 'bg-white border border-gray-200',
    headingClass: 'text-dark',
    priceClass: 'text-dark',
    volClass: 'text-gray-500',
    btnClass: 'border-2 border-dark text-dark hover:bg-dark hover:text-white',
    features: [
      'Akses Portal B2B',
      'Diskon Mitra 5%',
      'Email Support',
    ],
    featureActive: true,
  },
  {
    name: 'Silver',
    badge: 'POPULER',
    price: 'Rp 299.000',
    period: '/bulan',
    volume: '10–50 Booking/Bulan',
    cardClass: 'bg-white border-2 border-primary shadow-xl shadow-primary/10 scale-105',
    headingClass: 'text-dark',
    priceClass: 'text-primary',
    volClass: 'text-gray-500',
    btnClass: 'bg-primary hover:bg-[#FFA000] text-dark shadow-lg shadow-primary/30',
    features: [
      'Akses Portal B2B',
      'Diskon Mitra 15%',
      'Account Manager',
      'Custom Invoice',
      'Priority Support',
    ],
    featureActive: true,
  },
  {
    name: 'Gold',
    badge: null,
    price: 'Rp 799.000',
    period: '/bulan',
    volume: 'Unlimited Booking',
    cardClass: 'bg-[#1A1A1A] border border-white/10',
    headingClass: 'text-white',
    priceClass: 'text-primary',
    volClass: 'text-gray-400',
    btnClass: 'bg-white hover:bg-gray-100 text-dark',
    features: [
      'Akses Portal B2B',
      'Diskon Mitra 25%',
      'Dedicated Account Manager',
      'Custom Invoice & Laporan',
      'API Integration',
      'Priority Support < 30 Menit',
      'On-site Assistance',
    ],
    featureActive: false,
  },
]

const SECURITY_FEATURES = [
  {
    icon: ShieldCheck,
    title: 'PCI-DSS Compliant',
    desc: 'Semua transaksi pembayaran korporat dienkripsi penuh sesuai standar keamanan level bank internasional.',
  },
  {
    icon: Lock,
    title: 'Enkripsi SSL/TLS 256-Bit',
    desc: 'Data identitas perusahaan dan informasi rahasia agen tersimpan dengan enkripsi mutakhir.',
  },
  {
    icon: Server,
    title: 'Cloudflare WAF Protection',
    desc: 'Perlindungan Anti-DDoS dan Web Application Firewall untuk memastikan portal selalu online 99.9%.',
  },
  {
    icon: CreditCard,
    title: 'Gateway Pembayaran Resmi',
    desc: 'Terintegrasi hanya dengan penyedia pembayaran yang diawasi oleh Bank Indonesia (BI).',
  },
]

const FAQS = [
  {
    q: 'Bagaimana proses pendaftaran mitra B2B?',
    a: 'Isi formulir pendaftaran online di halaman daftar mitra. Tim kami akan meninjau permohonan dan menghubungi Anda melalui email atau telepon dalam 1x24 jam pada hari kerja.',
  },
  {
    q: 'Berapa lama proses verifikasi akun mitra?',
    a: 'Proses verifikasi membutuhkan waktu maksimal 1x24 jam pada hari kerja. Setelah diverifikasi, Anda akan menerima email berisi kredensial login ke portal B2B.',
  },
  {
    q: 'Apakah ada biaya pendaftaran?',
    a: 'Pendaftaran akun Basic sepenuhnya gratis tanpa biaya tersembunyi. Paket Silver dan Gold memiliki biaya langganan bulanan dengan fitur yang lebih lengkap.',
  },
  {
    q: 'Bagaimana sistem pembayaran dan invoicing?',
    a: 'Kami menyediakan invoice terkonsolidasi bulanan. Pembayaran dapat dilakukan melalui transfer bank, virtual account, atau kartu kredit korporat. Laporan pengeluaran tersedia secara otomatis setiap akhir bulan.',
  },
  {
    q: 'Apakah bisa integrasi dengan sistem internal perusahaan?',
    a: 'Ya, paket Gold mendukung integrasi API penuh dengan sistem ERP, HRM, atau travel management system internal perusahaan Anda. Tim teknis kami siap membantu proses integrasi.',
  },
]

/* ─────────────────────────────── sub-components ───────────────────────────── */

function SectionBadge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
      {children}
    </span>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-dark font-semibold pr-4">{q}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? '300px' : '0px' }}
      >
        <p className="px-6 pb-5 text-gray-500 leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────── page ─────────────────────────────────── */

export default function B2BPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── 1. Hero ── */}
      {/* ── 1. Hero ── */}
      <section className="min-h-[75vh] flex items-center pt-28 pb-20 relative overflow-hidden bg-[#1A1A1A]">
        {/* Fullscreen Video Background */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          fetchpriority="high"
          poster="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-90"
        >
          <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Overlays for Text Legibility */}
        <div className="absolute inset-0 bg-black/60 z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-black/40 to-transparent z-0" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center flex flex-col items-center">
          <div className="max-w-4xl flex flex-col items-center">
            <SectionBadge>
              <Building2 className="w-4 h-4" />
              Platform Perjalanan Bisnis
            </SectionBadge>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
              Kelola Perjalanan
              <br />
              <span className="text-primary">Bisnis Lebih Cerdas</span>
            </h1>

            <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
              Platform B2B khusus untuk perusahaan, travel agent, dan event organizer.
              Akses ribuan paket wisata dengan harga mitra, invoice otomatis, dan
              dukungan account manager dedikasi.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Link
                to="/b2b/register"
                className="bg-primary hover:bg-[#FFA000] text-dark font-bold px-8 py-4 rounded-xl inline-flex items-center gap-2 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all text-lg"
              >
                Daftar Mitra Sekarang
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#how-it-works"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/40 font-semibold px-8 py-4 rounded-xl inline-flex items-center gap-2 transition-all text-lg"
              >
                Pelajari Cara Kerjanya
              </a>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {HERO_STATS.map(({ value, label }) => (
                <div
                  key={label}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-8 py-5 text-center min-w-[160px] shadow-2xl"
                >
                  <p className="text-3xl md:text-4xl font-black text-primary mb-1">{value}</p>
                  <p className="text-white/90 font-medium text-sm uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. How it works ── */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionBadge>Cara Kerja</SectionBadge>
            <h2 className="text-3xl md:text-4xl font-black text-dark">
              Mulai dalam 3 Langkah Mudah
            </h2>
          </div>

          <div className="relative grid md:grid-cols-3 gap-8">
            {/* Dashed connector line (desktop only) */}
            <div className="hidden md:block absolute top-6 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px border-t-2 border-dashed border-primary/30" />

            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="relative flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary text-dark font-black text-xl rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-primary/30 relative z-10">
                  {num}
                </div>
                <h3 className="text-dark font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Features ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionBadge>Fitur Platform</SectionBadge>
            <h2 className="text-3xl md:text-4xl font-black text-dark">
              Fitur Lengkap untuk Bisnis Anda
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md p-6 transition-shadow group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-dark font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3.5 Security & Trust ── */}
      <section className="py-20 bg-[#1A1A1A] relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(#D4E000 1px, transparent 1px), linear-gradient(90deg, #D4E000 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 bg-primary/20 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <Shield className="w-4 h-4" />
              Keamanan Tingkat Enterprise
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Data & Transaksi Anda Sangat Aman
            </h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              Kami menggunakan infrastruktur teknologi terdepan tanpa mengandalkan gambar berat agar situs berjalan kilat dan anti-lelet (lag-free).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SECURITY_FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Pricing ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionBadge>Harga</SectionBadge>
            <h2 className="text-3xl md:text-4xl font-black text-dark">
              Pilih Paket yang Tepat
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Mulai gratis, upgrade kapan saja sesuai pertumbuhan bisnis Anda.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            {TIERS.map(({ name, badge, price, period, volume, cardClass, headingClass, priceClass, volClass, btnClass, features, featureActive }) => (
              <div key={name} className={`relative rounded-3xl p-8 ${cardClass}`}>
                {badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-dark text-xs font-black px-4 py-1 rounded-full shadow">
                    {badge}
                  </span>
                )}
                <h3 className={`text-xl font-black mb-1 ${headingClass}`}>{name}</h3>
                <p className={`text-sm mb-5 ${volClass}`}>{volume}</p>

                <div className="flex items-end gap-1 mb-6">
                  <span className={`text-4xl font-black ${priceClass}`}>{price}</span>
                  {period && <span className={`text-sm mb-1 ${volClass}`}>{period}</span>}
                </div>

                <ul className="space-y-3 mb-8">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className={`text-sm ${featureActive ? 'text-gray-600' : 'text-gray-400'}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/b2b/register"
                  className={`block text-center font-bold px-6 py-3 rounded-xl transition-all ${btnClass}`}
                >
                  {name === 'Basic' ? 'Daftar Gratis' : 'Mulai Sekarang'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FAQ ── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <SectionBadge>FAQ</SectionBadge>
            <h2 className="text-3xl md:text-4xl font-black text-dark">
              Pertanyaan Umum
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CTA ── */}
      <section className="py-20 bg-[#1A1A1A] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,193,7,0.08) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Siap Memulai Kemitraan?
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Bergabunglah dengan ratusan mitra bisnis yang telah mempercayakan
            kebutuhan perjalanan korporat mereka kepada Amoures.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/b2b/register"
              className="bg-primary hover:bg-[#FFA000] text-dark font-bold px-8 py-4 rounded-xl inline-flex items-center gap-2 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all text-lg"
            >
              Daftar Sebagai Mitra
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="mailto:b2b@amourestour.com"
              className="border border-white/20 text-white hover:border-primary hover:text-primary font-semibold px-8 py-4 rounded-xl inline-flex items-center gap-2 transition-all text-lg"
            >
              Hubungi Sales
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
