import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Compass } from "lucide-react";

// WebP q=50 + lebar kecil = gambar ringan untuk Lighthouse
const row1 = [
  {
    name: "Bali",
    region: "Bali, Indonesia",
    packages: 24,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=480&q=50&fm=webp&auto=format&fit=crop",
  },
  {
    name: "Raja Ampat",
    region: "Papua, Indonesia",
    packages: 8,
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=480&q=50&fm=webp&auto=format&fit=crop",
  },
  {
    name: "Labuan Bajo",
    region: "NTT, Indonesia",
    packages: 12,
    image:
      "https://images.unsplash.com/photo-1570737209810-87a8e7245f88?w=480&q=50&fm=webp&auto=format&fit=crop",
  },
];

const row2 = [
  {
    name: "Yogyakarta",
    region: "Jawa Tengah",
    packages: 18,
    image:
      "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=360&q=50&fm=webp&auto=format&fit=crop",
  },
  {
    name: "Lombok",
    region: "NTB, Indonesia",
    packages: 15,
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=360&q=50&fm=webp&auto=format&fit=crop",
  },
  {
    name: "Bromo",
    region: "Jawa Timur",
    packages: 10,
    image:
      "https://images.unsplash.com/photo-1573790387438-4da905039392?w=360&q=50&fm=webp&auto=format&fit=crop",
  },
  {
    name: "Komodo",
    region: "NTT, Indonesia",
    packages: 6,
    image:
      "https://images.unsplash.com/photo-1557456170-0cf4f4d0d362?w=360&q=50&fm=webp&auto=format&fit=crop",
  },
];

function DestinationCard({ dest, height }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${height}`}
    >
      {/* Real <img> tag — lazy loaded, proper width/height for no layout shift */}
      <img
        src={dest.image}
        alt={dest.name}
        loading="lazy"
        decoding="async"
        width={700}
        height={480}
        className="absolute inset-0 w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-500" />

      {/* Package count pill — top right */}
      <div className="absolute top-4 right-4 z-10">
        <span className="bg-primary/90 text-dark text-xs font-bold px-2 py-0.5 rounded-full">
          {dest.packages} Paket
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <h3 className="text-xl font-bold text-white mb-0.5">{dest.name}</h3>
        <p className="text-primary text-sm font-medium flex items-center gap-1 mb-3">
          <MapPin className="w-3 h-3 shrink-0" />
          {dest.region}
        </p>

        {/* Slide-up "Lihat Paket" button on hover */}
        <div className="overflow-hidden h-0 group-hover:h-9 transition-all duration-300 ease-out">
          <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-dark text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            Lihat Paket
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DestinationsSection() {
  return (
    <section id="destinations" className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary px-4 py-1 rounded-full text-sm font-medium mb-5">
            <Compass className="w-4 h-4" />
            Destinasi Wisata
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            <span className="block">Temukan Destinasi</span>
            <span className="block text-primary">Impian Anda</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
            Dari surga tropis yang tenang hingga petualangan alam yang
            mendebarkan — setiap destinasi dirancang untuk menciptakan kenangan
            abadi.
          </p>
        </div>

        {/* Row 1 — 3 tall cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {row1.map((dest) => (
            <DestinationCard key={dest.name} dest={dest} height="h-72" />
          ))}
        </div>

        {/* Row 2 — 4 shorter cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {row2.map((dest) => (
            <DestinationCard key={dest.name} dest={dest} height="h-56" />
          ))}
        </div>

        {/* See all button */}
        <div className="flex justify-center">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-[#1A1A1A] font-semibold px-8 py-3 rounded-full transition-all duration-200 hover:scale-105"
          >
            Lihat Semua Destinasi
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
