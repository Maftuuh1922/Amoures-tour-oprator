import { useState } from "react";
import {
  MapPin,
  Award,
  Users,
  Globe,
  CheckCircle2,
  Building2,
  ChevronDown,
} from "lucide-react";

const achievements = [
  "ISO 9001 Certified Tour Operator",
  "Best Tour Agency Award 2023 Jawa Barat",
  "Official Partner ASITA",
  "Over 10,000 happy customers",
];

const stats = [
  { icon: Award, label: "Tahun Berdiri", value: "2011", color: "primary" },
  { icon: Globe, label: "Destinasi", value: "150+", color: "primary-hover" },
  { icon: Users, label: "Pelanggan", value: "10K+", color: "accent" },
  { icon: MapPin, label: "Pemandu", value: "50+", color: "accent-dark" },
];

const misiList = [
  "Memberikan layanan berkualitas tinggi di setiap perjalanan",
  "Menjaga keselamatan dan kenyamanan pelanggan sebagai prioritas utama",
  "Mengembangkan dan mempromosikan destinasi wisata lokal Indonesia",
  "Membangun hubungan jangka panjang berbasis kepercayaan",
];

export default function CompanyProfile() {
  const [openAccordion, setOpenAccordion] = useState("visi");

  const toggle = (key) => setOpenAccordion((prev) => (prev === key ? null : key));

  return (
    <section
      id="about"
      className="py-20 relative overflow-hidden bg-white"
    >
      {/* Background decorative shapes */}
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none bg-primary"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── LEFT: Content ── */}
          <div className="flex flex-col">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 self-start section-badge mb-5">
              <Building2 className="w-4 h-4" />
              Tentang Amoures Tour
            </span>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-black text-dark leading-tight mb-5">
              Mitra Perjalanan Terpercaya Anda{" "}
              <span className="relative inline-block text-accent">
                Sejak 2011
                <span className="absolute left-0 bottom-0 w-full h-1 rounded-full bg-primary" />
              </span>
            </h2>

            {/* Story */}
            <p className="text-gray-600 leading-relaxed mb-3">
              Didirikan di Bandung pada tahun 2011, Amoures Tour telah berkembang
              menjadi salah satu operator tur terkemuka di Jawa Barat. Berawal dari
              semangat kecil untuk berbagi keindahan nusantara, kami kini melayani
              ribuan pelanggan setiap tahunnya.
            </p>
            <p className="text-gray-600 leading-relaxed mb-7">
              Kami menawarkan paket tur domestik dan internasional dengan fokus pada
              kenyamanan, keselamatan, dan pengalaman yang tak terlupakan — karena
              setiap perjalanan adalah cerita yang berharga.
            </p>

            {/* Visi & Misi Accordion */}
            <div className="flex flex-col gap-3 mb-7">
              {/* Visi */}
              <AccordionCard
                id="visi"
                open={openAccordion === "visi"}
                onToggle={() => toggle("visi")}
                title="🎯 Visi Kami"
              >
                <p className="text-gray-600 text-sm leading-relaxed">
                  Menjadi operator tur terkemuka yang menghadirkan pengalaman
                  perjalanan berkelas dunia bagi wisatawan Indonesia, dengan layanan
                  yang personal, aman, dan berkesan.
                </p>
              </AccordionCard>

              {/* Misi */}
              <AccordionCard
                id="misi"
                open={openAccordion === "misi"}
                onToggle={() => toggle("misi")}
                title="🚀 Misi Kami"
              >
                <ul className="flex flex-col gap-2">
                  {misiList.map((m) => (
                    <li key={m} className="flex items-start gap-2 text-gray-600 text-sm">
                      <CheckCircle2
                        className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary"
                      />
                      {m}
                    </li>
                  ))}
                </ul>
              </AccordionCard>
            </div>

            {/* Achievements */}
            <ul className="flex flex-col gap-2.5 mb-8">
              {achievements.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-primary" />
                  <span className="text-dark font-medium text-sm">{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div>
              <button
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-dark font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <MapPin className="w-4 h-4" />
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>

          {/* ── RIGHT: Visual Stats Card ── */}
          <div className="relative flex items-center justify-center">
            {/* Decorative ring behind the card */}
            <div
              className="absolute w-[340px] h-[340px] rounded-full border-[20px] border-primary/20 pointer-events-none"
              style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
            />
            <div
              className="absolute w-[280px] h-[280px] rounded-full border-[10px] border-[#FF8F00]/15 pointer-events-none"
              style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
            />

            {/* Main card */}
            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-primary/20 p-8 z-10">
              {/* Card header */}
              <div className="flex items-center gap-3 mb-7">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-primary to-accent">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-black text-[#1A1A1A] text-lg leading-none">
                    Amoures Tour
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">Operator & Travel Agency</p>
                </div>
              </div>

              {/* Stat mini-cards grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {stats.map(({ icon: Icon, label, value, color }) => (
                  <div
                    key={label}
                    className="rounded-2xl p-4 flex flex-col gap-2"
                    style={{ background: `${color}18` }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `${color}30` }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                  <p className="font-black text-dark text-xl leading-none">{value}</p>
                    <p className="text-gray-500 text-xs">{label}</p>
                  </div>
                ))}
              </div>

              {/* Rating pill */}
              <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-2xl px-4 py-3">
                <div>
                  <p className="font-black text-[#1A1A1A]">98% Kepuasan</p>
                  <p className="text-gray-500 text-xs">Dari 10.000+ ulasan</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-primary text-lg">★</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge: Bandung */}
            <div
              className="absolute top-4 -right-2 lg:-right-6 bg-white border border-primary/40 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold text-dark z-20"
              style={{ animation: "floatBadge 3s ease-in-out infinite" }}
            >
              <MapPin className="w-4 h-4 text-accent" />
              Bandung, Jawa Barat
            </div>

            {/* Floating badge: ASITA */}
            <div
              className="absolute bottom-6 -left-2 lg:-left-6 bg-white border border-primary/40 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold text-dark z-20"
              style={{ animation: "floatBadge 3.5s ease-in-out infinite", animationDelay: "1s" }}
            >
              <Award className="w-4 h-4 text-primary" />
              ASITA Partner
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}

function AccordionCard({ id, open, onToggle, title, children }) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        open
          ? "border-primary/60 bg-amber-50 shadow-md"
          : "border-gray-200 bg-white"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-bold text-[#1A1A1A] text-sm">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out px-5 ${
          open ? "max-h-96 pb-5 opacity-100" : "max-h-0 pb-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
