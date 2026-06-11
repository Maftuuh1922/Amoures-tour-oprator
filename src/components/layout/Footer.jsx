import { Link } from 'react-router-dom'
import { Plane, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Youtube } from 'lucide-react'

const DESTINATIONS = [
  { label: 'Bali', href: '#tours' },
  { label: 'Lombok', href: '#tours' },
  { label: 'Raja Ampat', href: '#tours' },
  { label: 'Yogyakarta', href: '#tours' },
  { label: 'Labuan Bajo', href: '#tours' },
  { label: 'Bromo', href: '#tours' },
]

const SERVICES = [
  { label: 'Paket Wisata', href: '#tours' },
  { label: 'Tiket Pesawat', href: '#tours' },
  { label: 'Hotel', href: '#tours' },
  { label: 'Tour Guide', href: '#tours' },
  { label: 'Umroh & Haji', href: '#tours' },
]

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/amourestour',
    icon: Instagram,
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/amourestour',
    icon: Facebook,
  },
  {
    label: 'Twitter / X',
    href: 'https://twitter.com/amourestour',
    icon: Twitter,
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@amourestour',
    icon: Youtube,
  },
]

const CONTACT_INFO = [
  {
    icon: MapPin,
    text: 'Jl. Asia Afrika No. 8, Bandung, Jawa Barat',
  },
  {
    icon: Phone,
    text: '+62 811-2345-678',
    href: 'tel:+628112345678',
  },
  {
    icon: Mail,
    text: 'info@amourestour.com',
    href: 'mailto:info@amourestour.com',
  },
  {
    icon: Clock,
    text: 'Senin–Sabtu, 08:00–17:00 WIB',
  },
]

function FooterHeading({ children }) {
  return (
    <h3 className="text-white font-bold text-base mb-5 relative inline-block after:block after:mt-2 after:h-0.5 after:w-8 after:bg-primary after:rounded-full">
      {children}
    </h3>
  )
}

export default function Footer() {
  const handleAnchorClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-dark text-gray-300">
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <img 
                src="/logo.png" 
                alt="Amoures Logo" 
                className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              Menghadirkan pengalaman perjalanan tak terlupakan sejak 2011. Kami percaya setiap perjalanan adalah cerita yang layak untuk dikenang.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 hover:bg-primary hover:text-dark text-gray-400 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Destinasi Populer */}
          <div>
            <FooterHeading>Destinasi Populer</FooterHeading>
            <ul className="space-y-2.5">
              {DESTINATIONS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={(e) => handleAnchorClick(e, href)}
                    className="text-sm text-gray-400 hover:text-primary transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors duration-150 flex-shrink-0" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Layanan */}
          <div>
            <FooterHeading>Layanan</FooterHeading>
            <ul className="space-y-2.5">
              {SERVICES.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={(e) => handleAnchorClick(e, href)}
                    className="text-sm text-gray-400 hover:text-primary transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors duration-150 flex-shrink-0" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Kontak */}
          <div>
            <FooterHeading>Hubungi Kami</FooterHeading>
            <ul className="space-y-4">
              {CONTACT_INFO.map(({ icon: Icon, text, href }) => (
                <li key={text}>
                  {href ? (
                    <a
                      href={href}
                      className="flex items-start gap-3 text-sm text-gray-400 hover:text-primary transition-colors duration-150 group"
                    >
                      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary/70 group-hover:text-primary transition-colors duration-150" />
                      <span>{text}</span>
                    </a>
                  ) : (
                    <div className="flex items-start gap-3 text-sm text-gray-400">
                      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary/70" />
                      <span>{text}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Amoures Tour Operator. Berdiri sejak 2011 di Bandung. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="text-xs text-gray-500 hover:text-primary transition-colors duration-150"
            >
              Kebijakan Privasi
            </Link>
            <span className="text-gray-600 text-xs">|</span>
            <Link
              to="/terms"
              className="text-xs text-gray-500 hover:text-primary transition-colors duration-150"
            >
              Syarat &amp; Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
