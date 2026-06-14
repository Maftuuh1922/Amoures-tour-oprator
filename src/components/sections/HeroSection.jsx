import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  MapPin,
  Users,
  Globe,
  Award,
  Building2,
  Search,
  Calendar,
} from "lucide-react";
import useUIStore from "../../store/uiStore";

const STATS = [
  { icon: Users, value: "10.000+", label: "Pelanggan Puas" },
  { icon: Globe, value: "150+", label: "Destinasi Wisata" },
  { icon: Award, value: "12+", label: "Tahun Pengalaman" },
  { icon: Calendar, value: "500+", label: "Paket Tersedia" },
];

const LEFT_CARDS = [
  {
    label: "Bali, Indonesia",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=120&q=60&fm=webp&auto=format&fit=crop",
    delay: "0s",
  },
  {
    label: "Labuan Bajo, NTT",
    img: "https://images.unsplash.com/photo-1570737209810-87a8e7245f88?w=120&q=60&fm=webp&auto=format&fit=crop",
    delay: "0.8s",
  },
];
const RIGHT_CARDS = [
  {
    label: "Raja Ampat, Papua",
    img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=120&q=60&fm=webp&auto=format&fit=crop",
    delay: "0.4s",
  },
  {
    label: "Yogyakarta, Jawa",
    img: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=120&q=60&fm=webp&auto=format&fit=crop",
    delay: "1.2s",
  },
];

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchQuery(query.trim());
    const el = document.getElementById("tours");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else navigate("/");
  };

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* ── LCP Hero Image — real <img> tag so browser discovers it immediately ── */}
      <img
        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1280&q=70&fm=webp&auto=format&fit=crop"
        srcSet="
          https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=640&q=65&fm=webp&auto=format&fit=crop  640w,
          https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1280&q=70&fm=webp&auto=format&fit=crop 1280w,
          https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=70&fm=webp&auto=format&fit=crop 1920w
        "
        sizes="100vw"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        loading="eager"
        decoding="sync"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center 40%" }}
      />

      {/* ── Overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25 pointer-events-none" />

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-32 pb-10">
        {/* Left floating cards — desktop only */}
        <div className="absolute left-6 xl:left-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4">
          {LEFT_CARDS.map((c) => (
            <FloatingCard key={c.label} card={c} />
          ))}
        </div>

        {/* Right floating cards — desktop only */}
        <div className="absolute right-6 xl:right-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4">
          {RIGHT_CARDS.map((c) => (
            <FloatingCard key={c.label} card={c} />
          ))}
        </div>

        {/* Center content */}
        <div className="w-full max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/25 text-white/90 text-sm font-medium px-5 py-2 rounded-full mb-7 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Operator Wisata Terpercaya &bull; Sejak 2011
          </div>

          {/* Headline */}
          <h1
            className="font-black text-white leading-[1.05] mb-5"
            style={{
              fontSize: "clamp(2.4rem, 6.5vw, 4.8rem)",
              textShadow: "0 2px 20px rgba(0,0,0,0.4)",
            }}
          >
            Jelajahi Dunia{" "}
            <span
              className="text-[#FFC107]"
              style={{ textShadow: "0 0 30px rgba(255,193,7,0.35)" }}
            >
              Bersama Amoures
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/75 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Dari destinasi lokal yang memukau hingga petualangan mancanegara —
            perjalanan tak terlupakan sejak 2011.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/25 rounded-2xl p-2 max-w-lg mx-auto mb-8 shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFC107] flex items-center justify-center shrink-0">
              <Search className="w-4 h-4 text-[#1A1A1A]" strokeWidth={2.5} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari destinasi, e.g. Bali, Lombok…"
              className="flex-1 bg-transparent text-white placeholder-white/45 text-sm outline-none min-w-0"
            />
            <button
              type="submit"
              className="shrink-0 bg-[#FFC107] hover:bg-[#FFB300] text-[#1A1A1A] font-bold text-sm px-5 py-2.5 rounded-xl transition-colors active:scale-95"
            >
              Cari
            </button>
          </form>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => scrollTo("tours")}
              className="inline-flex items-center gap-2.5 bg-[#FFC107] hover:bg-[#FFB300] text-[#1A1A1A] font-bold text-base px-8 py-3.5 rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
            >
              <MapPin className="w-5 h-5 shrink-0" />
              Lihat Paket Tur
            </button>
            <Link
              to="/b2b"
              className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold text-base px-8 py-3.5 rounded-full border border-white/40 hover:border-white/70 transition-all duration-200 hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
            >
              <Building2 className="w-5 h-5 shrink-0" />
              Kemitraan B2B
            </Link>
          </div>
        </div>
      </div>

      {/* Stats bar — bottom */}
      <div className="relative z-10 w-full pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="h-px w-full bg-white/10 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3.5 hover:bg-white/15 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFC107]/20 flex items-center justify-center shrink-0 group-hover:bg-[#FFC107]/30 transition-colors">
                  <Icon className="w-5 h-5 text-[#FFC107]" />
                </div>
                <div>
                  <p className="text-white font-black text-lg leading-none">
                    {value}
                  </p>
                  <p className="text-white/55 text-xs mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo("destinations")}
        aria-label="Scroll ke bawah"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 text-white/50 hover:text-white/90 transition-colors"
        style={{ animation: "bounceY 2.5s ease-in-out infinite" }}
      >
        <ChevronDown className="w-7 h-7" />
      </button>

      <style>{`
        @keyframes floatUpDown {
          0%,100% { transform:translateY(0) }
          50%      { transform:translateY(-8px) }
        }
        @keyframes bounceY {
          0%,100% { transform:translateX(-50%) translateY(0) }
          50%      { transform:translateX(-50%) translateY(8px) }
        }
      `}</style>
    </section>
  );
}

function FloatingCard({ card }) {
  return (
    <div
      className="flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/20 text-white rounded-2xl shadow-xl overflow-hidden pr-4 w-52"
      style={{
        animation: "floatUpDown 4s ease-in-out infinite",
        animationDelay: card.delay,
      }}
    >
      <img
        src={card.img}
        alt={card.label}
        loading="lazy"
        decoding="async"
        width={56}
        height={56}
        className="w-14 h-14 shrink-0 object-cover"
      />
      <div className="min-w-0">
        <p className="text-xs text-[#FFC107] font-semibold flex items-center gap-1">
          <MapPin className="w-3 h-3 shrink-0" />
          Destinasi
        </p>
        <p className="text-sm font-bold text-white truncate">{card.label}</p>
      </div>
    </div>
  );
}
