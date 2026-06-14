import { Shield, Headphones, Tag, Award, CreditCard, Heart } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Terpercaya & Aman",
    desc: "Beroperasi sejak 2011 dengan ribuan pelanggan puas dan rekam jejak terbukti.",
  },
  {
    icon: Headphones,
    title: "Layanan 24/7",
    desc: "Tim support kami siap membantu kapan saja, di mana saja, tanpa hari libur.",
  },
  {
    icon: Tag,
    title: "Harga Terjangkau",
    desc: "Paket wisata berkualitas premium dengan harga yang tetap bersahabat di kantong.",
  },
  {
    icon: Award,
    title: "Pemandu Berpengalaman",
    desc: "Guide profesional & berpengalaman hadir di setiap destinasi perjalanan Anda.",
  },
  {
    icon: CreditCard,
    title: "Pembayaran Fleksibel",
    desc: "Berbagai metode pembayaran dan opsi cicilan yang mudah dan aman tersedia.",
  },
  {
    icon: Heart,
    title: "Kepuasan Pelanggan",
    desc: "Tingkat kepuasan 98% dari ribuan testimoni nyata pelanggan setia kami.",
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-14">
          <span className="section-badge">
            ⭐ Keunggulan Kami
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#1A1A1A] mb-4">
            Mengapa{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Amoures Tour?</span>
              <span
                className="absolute left-0 bottom-1 w-full h-3 -z-0 rounded-full opacity-40 bg-primary"
              />
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            Kami hadir dengan komitmen penuh untuk memberikan pengalaman perjalanan terbaik,
            aman, dan tak terlupakan bagi setiap pelanggan.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-7">
          {features.map(({ icon: Icon, title, desc }, idx) => (
            <FeatureCard key={title} Icon={Icon} title={title} desc={desc} number={idx + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ Icon, title, desc, number }) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 hover:border-primary/40 p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Hover accent bottom border via pseudo approach with a div */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Subtle bg tint on hover */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.03] transition-colors duration-300 rounded-2xl pointer-events-none" />

      {/* Number badge */}
      <span className="absolute top-4 right-4 text-xs font-black text-primary/50 group-hover:text-primary transition-colors duration-200 select-none">
        {String(number).padStart(2, "0")}
      </span>

      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-primary/15 group-hover:bg-primary/25 flex items-center justify-center transition-colors duration-300 flex-shrink-0">
        <Icon className="w-6 h-6 text-accent" strokeWidth={2} />
      </div>

      {/* Text */}
      <div>
        <h3 className="text-[#1A1A1A] font-bold text-base md:text-lg mb-1.5 leading-snug">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
