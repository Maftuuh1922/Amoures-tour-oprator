import { Link } from 'react-router-dom'
import { MapPin, Calendar, Clock, Users, ArrowRight, Star } from 'lucide-react'
import { useTours } from '../../hooks/useTours'

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

// ─── Fallback demo data ──────────────────────────────────────────────────────

const DEMO_TOURS = [
  {
    id: 'demo-1',
    title: 'Bali Paradise Escape',
    destination: 'Bali',
    description:
      'Nikmati keindahan Pulau Dewata dengan paket lengkap — pura sakral, sawah Ubud, pantai Seminyak, hingga sunset di Tanah Lot.',
    price: 2500000,
    duration_days: 5,
    duration_nights: 4,
    departure_date: '2025-03-15',
    image_url: null,
    max_participants: 20,
  },
  {
    id: 'demo-2',
    title: 'Lombok Eksotis',
    destination: 'Lombok',
    description:
      'Jelajahi keindahan Gili Trawangan, Pantai Pink, dan Gunung Rinjani yang megah bersama pemandu wisata berpengalaman.',
    price: 2200000,
    duration_days: 4,
    duration_nights: 3,
    departure_date: '2025-03-22',
    image_url: null,
    max_participants: 15,
  },
  {
    id: 'demo-3',
    title: 'Labuan Bajo Adventure',
    destination: 'Labuan Bajo',
    description:
      'Berlayar di antara pulau-pulau eksotis, bertemu Komodo, dan menyelam di perairan kristal Taman Nasional Komodo.',
    price: 4500000,
    duration_days: 5,
    duration_nights: 4,
    departure_date: '2025-04-01',
    image_url: null,
    max_participants: 12,
  },
  {
    id: 'demo-4',
    title: 'Yogyakarta Heritage',
    destination: 'Yogyakarta',
    description:
      'Wisata budaya dan sejarah ke Candi Borobudur, Prambanan, Keraton Yogyakarta, dan pengalaman membatik.',
    price: 1800000,
    duration_days: 3,
    duration_nights: 2,
    departure_date: '2025-04-10',
    image_url: null,
    max_participants: 25,
  },
  {
    id: 'demo-5',
    title: 'Raja Ampat Adventure',
    destination: 'Raja Ampat',
    description:
      'Surga penyelaman dunia dengan biodiversitas laut tertinggi — coral garden, manta ray, dan pantai pasir putih memukau.',
    price: 7500000,
    duration_days: 7,
    duration_nights: 6,
    departure_date: '2025-04-20',
    image_url: null,
    max_participants: 10,
  },
  {
    id: 'demo-6',
    title: 'Bromo Sunrise Spectacular',
    destination: 'Bromo',
    description:
      'Saksikan matahari terbit spektakuler di atas lautan pasir Gunung Bromo, pengalaman yang tak akan terlupakan seumur hidup.',
    price: 1500000,
    duration_days: 2,
    duration_nights: 1,
    departure_date: '2025-05-05',
    image_url: null,
    max_participants: 20,
  },
]

// Gradient placeholders per destination when no image is provided
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

// ─── Main Component ──────────────────────────────────────────────────────────

export default function FeaturedTours() {
  const { tours, loading } = useTours(6)

  return (
    <section id="tours" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-primary/10 text-primary font-semibold text-sm px-4 py-1.5 rounded-full mb-4 tracking-wide">
            Paket Unggulan
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-dark mb-4 leading-tight">
            Destinasi Terpopuler
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Temukan paket wisata terbaik kami yang telah dipercaya ribuan pelanggan
            untuk perjalanan yang aman, nyaman, dan berkesan.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : tours.map((tour, index) => (
                <TourCard key={tour.id} tour={tour} index={index} />
              ))}
        </div>

        {/* "See All" button */}
        <div className="mt-12 text-center">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-dark font-bold px-8 py-3.5 rounded-full transition-all duration-200 hover:shadow-lg active:scale-95 text-base"
          >
            Lihat Semua Paket
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
