import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const contactItems = [
  {
    icon: MapPin,
    label: 'Kantor Pusat',
    value: 'Jl. Asia Afrika No. 8, Bandung 40111, Jawa Barat',
  },
  {
    icon: Phone,
    label: 'Telepon / WhatsApp',
    value: '+62 811-2345-678',
    href: 'https://wa.me/628112345678',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@amourestour.com',
    href: 'mailto:info@amourestour.com',
  },
  {
    icon: Clock,
    label: 'Jam Operasional',
    value: 'Senin – Sabtu, 08:00 – 17:00 WIB',
  },
]

const subjectOptions = [
  { value: '', label: 'Pilih Subjek' },
  { value: 'pertanyaan_umum', label: 'Pertanyaan Umum' },
  { value: 'reservasi_paket', label: 'Reservasi Paket' },
  { value: 'keluhan', label: 'Keluhan' },
  { value: 'kerjasama', label: 'Kerjasama' },
]

const confettiDots = [
  { color: '#FFC107', size: 10, top: '12%', left: '8%', delay: '0s' },
  { color: '#FF8F00', size: 7,  top: '20%', left: '90%', delay: '0.5s' },
  { color: '#ffffff', size: 8,  top: '70%', left: '6%',  delay: '1s' },
  { color: '#FFC107', size: 6,  top: '80%', left: '93%', delay: '0.3s' },
  { color: '#FF6F00', size: 9,  top: '45%', left: '4%',  delay: '0.8s' },
  { color: '#FFE082', size: 6,  top: '55%', left: '95%', delay: '1.3s' },
]

const emptyForm = {
  nama: '',
  email: '',
  phone: '',
  subjek: '',
  pesan: '',
}

export default function ContactSection() {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate async send
    setTimeout(() => {
      setLoading(false)
      setForm(emptyForm)
      toast.success('Pesan Anda telah terkirim! Kami akan menghubungi Anda segera.')
    }, 800)
  }

  const handleScrollToTours = () => {
    document.getElementById('tours')?.scrollIntoView({ behavior: 'smooth' })
  }
  const handleScrollToForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="contact" className="py-20">
      {/* ── CTA Banner ──────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1A1A1A 0%, #111827 100%)',
        }}
      >
        {/* Confetti dots */}
        {confettiDots.map((dot, i) => (
          <span
            key={i}
            className="absolute rounded-full opacity-70"
            style={{
              width: dot.size,
              height: dot.size,
              background: dot.color,
              top: dot.top,
              left: dot.left,
              animation: `floatDot 5s ease-in-out infinite`,
              animationDelay: dot.delay,
            }}
          />
        ))}

        {/* Ambient glow blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none bg-primary" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none bg-accent" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 flex flex-col items-center text-center">
          {/* Airplane badge */}
          <div
            className="text-5xl mb-6 select-none"
            style={{ animation: 'planeFly 3s ease-in-out infinite' }}
            aria-hidden="true"
          >
            ✈️
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Siap Memulai{' '}
            <span className="relative inline-block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Petualangan?
            </span>
          </h2>

          <p className="text-gray-300 text-lg max-w-xl leading-relaxed mb-10">
            Hubungi kami sekarang dan dapatkan penawaran terbaik untuk paket wisata
            impian Anda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleScrollToTours}
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-dark font-bold text-base px-8 py-4 rounded-full shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95"
            >
              <MapPin className="w-5 h-5" />
              Lihat Paket Tur
            </button>
            <button
              onClick={handleScrollToForm}
              className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white font-bold text-base px-8 py-4 rounded-full border-2 border-white/60 hover:border-white shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              Hubungi Kami
            </button>
          </div>
        </div>

        {/* Keyframes (scoped here so they don't pollute global scope) */}
        <style>{`
          @keyframes floatDot {
            0%, 100% { transform: translateY(0px) scale(1); }
            50%       { transform: translateY(-14px) scale(1.2); }
          }
          @keyframes planeFly {
            0%, 100% { transform: translateX(0) rotate(-5deg); }
            50%       { transform: translateX(10px) rotate(5deg); }
          }
        `}</style>
      </div>

      {/* ── Contact Info + Form ─────────────────────────────────────── */}
      <div className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Section label */}
          <div className="flex flex-col items-center text-center mb-12">
            <span className="section-badge mb-4">
              📬 Kontak Kami
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-dark">
              Kami Siap Membantu Anda
            </h3>
            <p className="text-gray-500 mt-3 max-w-lg">
              Kirimkan pesan atau kunjungi kantor kami. Tim kami akan merespons
              dalam 1×24 jam kerja.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* ── Left: Contact Info ──────────────────────────────── */}
            <div className="flex flex-col gap-6">
              {/* Info cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {contactItems.map(({ icon: Icon, label, value, href }) => (
                  <div
                    key={label}
                    className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/40 p-5 transition-all duration-200 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary/15 group-hover:bg-primary/25 flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                      <Icon className="w-5 h-5 text-accent" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-dark font-semibold text-sm hover:text-accent transition-colors duration-150 break-all"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-dark font-semibold text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-200 rounded-2xl h-48 sm:h-64 flex flex-col items-center justify-center border border-gray-200 shadow-sm overflow-hidden relative">
                <iframe 
                  src="https://maps.google.com/maps?q=Jl.%20Asia%20Afrika%20No.8,%20Bandung&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta Lokasi Kantor"
                />
              </div>
            </div>

            {/* ── Right: Contact Form ─────────────────────────────── */}
            <div
              id="contact-form"
              className="bg-white rounded-2xl border border-gray-100 shadow-md p-8"
            >
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Send className="w-5 h-5 text-accent" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="font-bold text-dark text-lg leading-none">
                    Kirim Pesan
                  </h4>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Isi formulir di bawah ini
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Nama */}
                <div>
                  <label
                    htmlFor="nama"
                    className="block text-sm font-semibold text-gray-700 mb-1.5"
                  >
                    Nama Lengkap <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="nama"
                    name="nama"
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap Anda"
                    value={form.nama}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm text-gray-800 placeholder-gray-400 transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>

                {/* Email + No. HP — two columns on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="email@contoh.com"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm text-gray-800 placeholder-gray-400 transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                      No. HP / WhatsApp
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+62 8xx-xxxx-xxxx"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm text-gray-800 placeholder-gray-400 transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                {/* Subjek */}
                <div>
                  <label
                    htmlFor="subjek"
                    className="block text-sm font-semibold text-gray-700 mb-1.5"
                  >
                    Subjek <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="subjek"
                    name="subjek"
                    required
                    value={form.subjek}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm text-gray-800 transition-all duration-200 bg-gray-50 hover:bg-white appearance-none cursor-pointer"
                  >
                    {subjectOptions.map(({ value, label }) => (
                      <option key={value} value={value} disabled={value === ''}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pesan */}
                <div>
                  <label
                    htmlFor="pesan"
                    className="block text-sm font-semibold text-gray-700 mb-1.5"
                  >
                    Pesan <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="pesan"
                    name="pesan"
                    required
                    rows={5}
                    placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."
                    value={form.pesan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm text-gray-800 placeholder-gray-400 transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-dark font-bold text-base px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95"
                >
                  {loading ? (
                    <>
                      <svg
                        className="w-5 h-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                        />
                      </svg>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Kirim Pesan
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
