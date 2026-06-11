import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  Star,
  ChevronRight,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  RotateCcw,
  Phone,
  Minus,
  Plus,
  ArrowLeft,
  Image,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useTour, useTestimonials } from '../hooks/useTours'

// ─── helpers ────────────────────────────────────────────────────────────────

function formatPrice(price) {
  if (!price && price !== 0) return 'Hubungi Kami'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

// ─── skeleton ───────────────────────────────────────────────────────────────

function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  )
}

function TourDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Skeleton className="w-full h-64 md:h-96 rounded-none" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-72" />
            <Skeleton className="h-48" />
            <Skeleton className="h-64" />
          </div>
          <div>
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── itinerary accordion ────────────────────────────────────────────────────

const SAMPLE_ITINERARY = [
  {
    day: 1,
    title: 'Hari Pertama – Keberangkatan & Check-in',
    description:
      'Berkumpul di titik keberangkatan pukul 06.00. Perjalanan menuju destinasi utama, check-in hotel, dan acara makan malam bersama.',
  },
  {
    day: 2,
    title: 'Hari Kedua – Eksplorasi Objek Wisata Utama',
    description:
      'Sarapan di hotel, kunjungi objek wisata utama, makan siang di restoran lokal, dilanjutkan kunjungan sore dan makan malam.',
  },
  {
    day: 3,
    title: 'Hari Ketiga – Aktivitas & Kuliner Lokal',
    description:
      'Tur kuliner pagi, aktivitas pilihan (snorkeling / trekking / city tour), makan siang, dan waktu bebas sore hari.',
  },
  {
    day: 4,
    title: 'Hari Keempat – Wisata Alam & Budaya',
    description:
      'Kunjungan ke destinasi alam dan situs budaya, makan siang, sesi foto, dan makan malam spesial.',
  },
  {
    day: 5,
    title: 'Hari Kelima – Kepulangan',
    description:
      'Sarapan, check-out hotel, belanja oleh-oleh, dan perjalanan kembali ke kota asal. Tiba sore/malam hari.',
  },
]

function ItineraryItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-dark text-sm font-bold flex items-center justify-center">
            {item.day}
          </span>
          <span className="font-semibold text-dark">{item.title}</span>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 bg-gray-50 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
          {item.description}
        </div>
      )}
    </div>
  )
}

// ─── testimonial card ────────────────────────────────────────────────────────

function TestimonialCard({ t }) {
  const name = t.profiles?.full_name || 'Pelanggan Amoures'
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-3">
        {t.profiles?.avatar_url ? (
          <img
            src={t.profiles.avatar_url}
            alt={name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-dark font-bold text-sm">
            {initials}
          </div>
        )}
        <div>
          <p className="font-semibold text-dark text-sm">{name}</p>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < (t.rating || 5)
                    ? 'fill-primary text-primary'
                    : 'text-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed italic">
        &ldquo;{t.comment || 'Paket wisata yang sangat memuaskan!'}&rdquo;
      </p>
    </div>
  )
}

// ─── main component ─────────────────────────────────────────────────────────

export default function TourDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tour, loading } = useTour(id)
  const { testimonials } = useTestimonials(id)
  const [passengerCount, setPassengerCount] = useState(1)

  if (loading) {
    return (
      <>
        <Navbar />
        <TourDetailSkeleton />
        <Footer />
      </>
    )
  }

  if (!tour) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
          <div className="text-6xl font-bold text-gray-200">404</div>
          <h2 className="text-xl font-semibold text-dark">Paket Tur Tidak Ditemukan</h2>
          <p className="text-gray-500 text-center max-w-xs">
            Maaf, paket tur yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-dark font-semibold rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>
        <Footer />
      </>
    )
  }

  const price = tour.price || 0
  const quota = tour.quota_available ?? tour.max_participants ?? 20
  const totalPrice = price * passengerCount

  const whatsappMessage = encodeURIComponent(
    `Halo Amoures! Saya tertarik dengan paket "${tour.title}" (${tour.destination}). Bisa info lebih lanjut?`
  )

  const includedFacilities = [
    'Hotel bintang 3–4',
    'Transportasi AC',
    'Makan 3x sehari',
    'Guide profesional',
    'Tiket masuk objek wisata',
    'Asuransi perjalanan',
  ]

  const excludedFacilities = [
    'Tiket pesawat PP',
    'Pengeluaran pribadi',
    'Tips guide',
  ]

  return (
    <>
      <Navbar />

      {/* ── Hero Banner ── */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden">
        {tour.image_url ? (
          <img
            src={tour.image_url}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center">
            <Image className="w-24 h-24 text-white/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <h1 className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg">
            {tour.title}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-white/90">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm md:text-base">{tour.destination}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <Link to="/tours" className="hover:text-primary transition-colors">
            Paket Tur
          </Link>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <span className="text-dark font-medium truncate max-w-[200px]">
            {tour.title}
          </span>
        </nav>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Image Gallery */}
            <div className="rounded-2xl overflow-hidden shadow-sm">
              <div className="relative w-full h-64 md:h-80 bg-gray-100">
                {tour.image_url ? (
                  <img
                    src={tour.image_url}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-light to-primary">
                    <Image className="w-16 h-16 text-white/50" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1 mt-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative h-20 bg-gray-100 overflow-hidden"
                  >
                    {tour.image_url ? (
                      <img
                        src={tour.image_url}
                        alt={`Thumbnail ${i + 1}`}
                        className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Image className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-dark mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full inline-block" />
                Deskripsi Paket
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                {tour.description ||
                  'Nikmati pengalaman perjalanan wisata yang tak terlupakan bersama Amoures Tour Operator. Paket ini dirancang khusus untuk memberikan kenyamanan dan kenangan indah bagi Anda dan keluarga. Kami menyediakan layanan terbaik mulai dari akomodasi, transportasi, hingga pemandu wisata berpengalaman yang siap membantu Anda sepanjang perjalanan.'}
              </p>
            </section>

            {/* Itinerary */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full inline-block" />
                Itinerary Perjalanan
              </h2>
              <div className="space-y-2">
                {(tour.itinerary?.length ? tour.itinerary : SAMPLE_ITINERARY).map(
                  (item, idx) => (
                    <ItineraryItem
                      key={idx}
                      item={typeof item === 'string' ? { day: idx + 1, title: `Hari ${idx + 1}`, description: item } : item}
                    />
                  )
                )}
              </div>
            </section>

            {/* Included */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-green-500 rounded-full inline-block" />
                Fasilitas Termasuk
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {includedFacilities.map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Excluded */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-red-400 rounded-full inline-block" />
                Tidak Termasuk
              </h2>
              <div className="space-y-2.5">
                {excludedFacilities.map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials */}
            {testimonials.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full inline-block" />
                  Ulasan Pelanggan
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {testimonials.map((t) => (
                    <TestimonialCard key={t.id} t={t} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── RIGHT COLUMN (sticky booking card) ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                {/* Price Header */}
                <div className="bg-primary/10 px-6 py-5 border-b border-primary/20">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Mulai dari
                  </p>
                  <p className="text-3xl font-extrabold text-dark">
                    {formatPrice(price)}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">/ orang</p>
                </div>

                <div className="px-6 py-5 space-y-4">
                  {/* Departure */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Tanggal Keberangkatan
                      </p>
                      <p className="text-sm font-semibold text-dark mt-0.5">
                        {formatDate(tour.departure_date)}
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Durasi
                      </p>
                      <p className="text-sm font-semibold text-dark mt-0.5">
                        {tour.duration ? `${tour.duration} Hari` : '-'}
                      </p>
                    </div>
                  </div>

                  {/* Quota */}
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Kuota Tersedia
                      </p>
                      <span
                        className={`inline-block mt-0.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          quota > 10
                            ? 'bg-green-100 text-green-700'
                            : quota > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {quota > 0 ? `${quota} Kursi Tersisa` : 'Habis'}
                      </span>
                    </div>
                  </div>

                  {/* Passenger Count */}
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                      Jumlah Penumpang
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPassengerCount((v) => Math.max(1, v - 1))}
                        className="w-9 h-9 rounded-full border-2 border-gray-200 hover:border-primary flex items-center justify-center transition-colors disabled:opacity-40"
                        disabled={passengerCount <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-bold text-dark w-8 text-center">
                        {passengerCount}
                      </span>
                      <button
                        onClick={() =>
                          setPassengerCount((v) => Math.min(quota || 10, v + 1))
                        }
                        className="w-9 h-9 rounded-full border-2 border-gray-200 hover:border-primary flex items-center justify-center transition-colors disabled:opacity-40"
                        disabled={passengerCount >= (quota || 10)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-primary/10 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="text-lg font-extrabold text-dark">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() =>
                      navigate(`/booking/${tour.id}`, {
                        state: { passengerCount },
                      })
                    }
                    disabled={quota <= 0}
                    className="w-full py-3 bg-primary hover:bg-primary-hover text-dark font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {quota > 0 ? 'Pesan Sekarang' : 'Kuota Habis'}
                  </button>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/6281234567890?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold rounded-xl transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    Hubungi via WhatsApp
                  </a>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Pemesanan aman & terenkripsi</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <RotateCcw className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span>Pembatalan gratis hingga 7 hari sebelum keberangkatan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
