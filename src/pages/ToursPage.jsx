import { Link, useSearchParams } from 'react-router-dom'
import { MapPin, Calendar, Clock, Users, ArrowRight, Compass } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useTours } from '../hooks/useTours'

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatPrice(price) {
  if (!price && price !== 0) return 'Hubungi Kami'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

function formatDate(dateStr) {
  if (!dateStr) return null
  const date = new Date(dateStr)
  if (isNaN(date)) return dateStr
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const DEST_GRADIENTS = {
  Bali: 'from-emerald-400 to-teal-600',
  Lombok: 'from-blue-400 to-cyan-600',
  'Labuan Bajo': 'from-orange-400 to-red-600',
  Yogyakarta: 'from-purple-400 to-indigo-600',
  'Raja Ampat': 'from-sky-400 to-blue-700',
  Bromo: 'from-amber-400 to-orange-600',
}

function cardGradient(destination) {
  return DEST_GRADIENTS[destination] || 'from-primary to-secondary'
}

// ─── Skeleton Card ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-24 bg-gray-200 rounded-full" />
        <div className="h-5 w-3/4 bg-gray-200 rounded-full" />
        <div className="h-3 w-full bg-gray-200 rounded-full" />
        <div className="h-3 w-2/3 bg-gray-200 rounded-full" />
        <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-6 w-32 bg-gray-200 rounded-full" />
            <div className="h-3 w-20 bg-gray-200 rounded-full" />
          </div>
          <div className="h-9 w-28 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// ─── Tour Card ───────────────────────────────────────────────────────────────

function TourCard({ tour, index }) {
  const isPopular = index < 3
  const durationLabel =
    tour.duration_days && tour.duration_nights
      ? `${tour.duration_days} Hari ${tour.duration_nights} Malam`
      : tour.duration_days
      ? `${tour.duration_days} Hari`
      : null

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {tour.image_url ? (
          <img
            src={tour.image_url}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${cardGradient(tour.destination)} group-hover:scale-110 transition-transform duration-500 flex items-center justify-center`}
          >
            <span className="text-6xl opacity-30 select-none">✈</span>
          </div>
        )}

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        {/* Duration badge */}
        {durationLabel && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {durationLabel}
          </div>
        )}

        {/* Popular badge */}
        {isPopular && (
          <div className="absolute top-3 left-3 bg-primary text-dark text-xs font-black px-3 py-1 rounded-full shadow-md tracking-wide">
            ★ POPULER
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Destination */}
        {tour.destination && (
          <div className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{tour.destination}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="font-bold text-lg text-dark leading-snug line-clamp-2 mb-2">
          {tour.title}
        </h3>

        {/* Description */}
        {tour.description && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">
            {tour.description}
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between gap-3">
            {/* Price + date */}
            <div>
              <p className="text-2xl font-black text-primary leading-none">
                {formatPrice(tour.price)}
              </p>
              <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                <Users className="w-3 h-3" />
                per orang
              </p>
              {tour.departure_date && (
                <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(tour.departure_date)}
                </p>
              )}
            </div>

            {/* CTA */}
            <Link
              to={`/tour/${tour.id}`}
              className="flex-shrink-0 inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-dark text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
            >
              Detail &amp; Pesan
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ToursPage() {
  const { tours, loading } = useTours()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  const filteredTours = tours.filter((t) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      t.title.toLowerCase().includes(q) ||
      t.destination.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    )
  })

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pb-20 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 text-primary mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <span className="font-bold tracking-wide uppercase text-sm">
                Eksplorasi Destinasi
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-dark mb-4 leading-tight">
              {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : 'Semua Paket Wisata'}
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
              {searchQuery
                ? `Menampilkan hasil paket wisata yang sesuai dengan pencarian Anda.`
                : `Temukan berbagai pilihan destinasi menakjubkan yang telah kami rancang khusus untuk memberikan pengalaman liburan terbaik bagi Anda.`}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : filteredTours.map((tour, index) => (
                  <TourCard key={tour.id} tour={tour} index={index} />
                ))}
          </div>
          
          {!loading && filteredTours.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm mt-8">
              <span className="text-4xl opacity-50 mb-4 block">🔍</span>
              <p className="text-gray-500 text-lg font-medium">Tidak ada paket wisata yang cocok.</p>
              <p className="text-gray-400 text-sm mt-1">Silakan coba kata kunci pencarian yang lain.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
