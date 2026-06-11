import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { Star } from 'lucide-react'
import { useTestimonials } from '../../hooks/useTours'

// ─── Demo fallback data ──────────────────────────────────────────────────────

const DEMO_TESTIMONIALS = [
  {
    id: 't1',
    name: 'Budi Santoso',
    location: 'Jakarta',
    rating: 5,
    review:
      'Pengalaman luar biasa! Pelayanan Amoures Tour sangat profesional. Paket Bali yang kami ikuti benar-benar memuaskan, dari akomodasi hingga pemandu wisata.',
    package: 'Bali Paradise',
  },
  {
    id: 't2',
    name: 'Siti Rahayu',
    location: 'Bandung',
    rating: 5,
    review:
      'Sudah 3 kali menggunakan jasa Amoures Tour dan selalu puas! Harga terjangkau, perjalanan aman dan menyenangkan. Sangat direkomendasikan!',
    package: 'Lombok Eksotis',
  },
  {
    id: 't3',
    name: 'Ahmad Fauzi',
    location: 'Surabaya',
    rating: 5,
    review:
      'Tour Raja Ampat yang tak terlupakan! Amoures Tour memberikan pengalaman terbaik dengan pemandu yang ramah dan berpengetahuan luas.',
    package: 'Raja Ampat Adventure',
  },
  {
    id: 't4',
    name: 'Dewi Kartika',
    location: 'Yogyakarta',
    rating: 5,
    review:
      'Pertama kali ikut paket tur dan langsung jatuh cinta! Tim Amoures sangat perhatian dan detail dalam setiap aspek perjalanan.',
    package: 'Labuan Bajo',
  },
  {
    id: 't5',
    name: 'Rizky Pratama',
    location: 'Semarang',
    rating: 4,
    review:
      'Paket Bromo sunrise-nya spektakuler! Semua terorganisir dengan baik. Pasti akan booking lagi untuk destinasi selanjutnya.',
    package: 'Bromo Sunrise',
  },
  {
    id: 't6',
    name: 'Maya Indah',
    location: 'Bali',
    rating: 5,
    review:
      'Honeymoon package kami di Lombok sangat romantis dan berkesan. Amoures Tour tahu betul bagaimana membuat momen spesial menjadi sempurna.',
    package: 'Lombok Romantis',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Get initials (up to 2 chars) from a full name */
function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

/** Normalise a testimonial from either API shape or demo shape */
function normalise(t) {
  return {
    id: t.id ?? Math.random(),
    name: t.profiles?.full_name ?? t.name ?? 'Anonim',
    location: t.location ?? '',
    rating: t.rating ?? 5,
    review: t.comment ?? t.review ?? '',
    package: t.tour_packages?.title ?? t.package_name ?? t.package ?? '',
    avatarUrl: t.profiles?.avatar_url ?? null,
  }
}

// ─── Star Rating ─────────────────────────────────────────────────────────────

function StarRating({ rating, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-primary fill-primary' : 'text-gray-300 fill-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────

function TestimonialCard({ testimonial }) {
  const { name, location, rating, review, package: pkg, avatarUrl } = testimonial

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg flex flex-col h-full select-none">
      {/* Stars */}
      <StarRating rating={rating} />

      {/* Review */}
      <p className="mt-4 text-gray-700 italic leading-relaxed line-clamp-4 flex-1">
        &ldquo;{review}&rdquo;
      </p>

      {/* Divider */}
      <div className="border-t border-gray-100 my-5" />

      {/* Author row */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-11 h-11 rounded-full object-cover border-2 border-primary/30"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-primary text-dark font-black text-sm flex items-center justify-center border-2 border-primary/30 shadow-sm">
              {getInitials(name)}
            </div>
          )}
        </div>

        {/* Name + location */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-dark leading-tight truncate">{name}</p>
          {location && (
            <p className="text-gray-500 text-sm leading-tight truncate">{location}</p>
          )}
        </div>

        {/* Package badge */}
        {pkg && (
          <span className="flex-shrink-0 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full max-w-[120px] truncate">
            {pkg}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Testimonials() {
  const { testimonials: apiTestimonials, loading } = useTestimonials()

  const raw = apiTestimonials && apiTestimonials.length > 0 ? apiTestimonials : DEMO_TESTIMONIALS
  const testimonials = raw.map(normalise)

  return (
    <section
      id="testimonials"
      className="py-20"
      style={{
        background: 'linear-gradient(135deg, #FFC107 0%, #FF8F00 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-white/20 text-white font-semibold text-sm px-4 py-1.5 rounded-full mb-4 tracking-wide border border-white/30">
            Testimoni
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Apa Kata Mereka?
          </h2>
          <p className="text-white/90 text-lg max-w-xl mx-auto leading-relaxed">
            Ribuan pelanggan telah mempercayakan perjalanan impian mereka kepada
            Amoures Tour. Inilah cerita mereka.
          </p>
        </div>

        {/* Swiper carousel */}
        {loading ? (
          /* Skeleton while loading */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/30 rounded-2xl p-6 animate-pulse h-56"
              />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-12"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id} className="h-auto">
                <TestimonialCard testimonial={t} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Override Swiper pagination bullet colour to match brand */}
      <style>{`
        #testimonials .swiper-pagination-bullet {
          background: rgba(255,255,255,0.5);
          opacity: 1;
          width: 8px;
          height: 8px;
          transition: all 0.2s;
        }
        #testimonials .swiper-pagination-bullet-active {
          background: #ffffff;
          width: 20px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  )
}
