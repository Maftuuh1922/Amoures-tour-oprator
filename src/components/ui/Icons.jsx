/**
 * Custom Interactive SVG Icon Library for Amoures Tour
 * All icons are hand-crafted SVG with hover-ready styling
 */

// ─── Base wrapper ─────────────────────────────────────────────────────────────
function Icon({ size = 24, className = '', children, viewBox = '0 0 24 24', ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  )
}

// ─── Globe / Destinasi ────────────────────────────────────────────────────────
export function GlobeIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3.6 8h16.8M3.6 16h16.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Icon>
  )
}

// ─── Plane / Paket Wisata ─────────────────────────────────────────────────────
export function PlaneIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <path
        d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z"
        fill="currentColor"
      />
    </Icon>
  )
}

// ─── Tag / Harga / Diskon ─────────────────────────────────────────────────────
export function PriceTagIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <path
        d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
      />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" />
    </Icon>
  )
}

// ─── Receipt / Invoice ────────────────────────────────────────────────────────
export function InvoiceIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
      />
      <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="8" y1="17" x2="13" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Icon>
  )
}

// ─── Headset / Support ────────────────────────────────────────────────────────
export function SupportIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <path
        d="M3 18v-6a9 9 0 0 1 18 0v6"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      />
      <path
        d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"
        stroke="currentColor" strokeWidth="1.8"
      />
    </Icon>
  )
}

// ─── Briefcase / Account Manager ─────────────────────────────────────────────
export function BriefcaseIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="1.8" />
      <line x1="12" y1="12" x2="12" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M2 12h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Icon>
  )
}

// ─── ShoppingBag / Pesan ──────────────────────────────────────────────────────
export function ShoppingBagIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <path
        d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
      />
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Icon>
  )
}

// ─── Box / Empty State ────────────────────────────────────────────────────────
export function PackageBoxIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <polyline points="21 8 21 21 3 21 3 8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <rect x="1" y="3" width="22" height="5" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <line x1="10" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Icon>
  )
}

// ─── Key / Credentials ───────────────────────────────────────────────────────
export function KeyIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <circle cx="7.5" cy="15.5" r="5.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M21 2l-9.6 9.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15.5 7.5l2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18.5 4.5l2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Icon>
  )
}

// ─── Star / Rating ───────────────────────────────────────────────────────────
export function StarIcon({ size = 24, className = '', filled = false }) {
  return (
    <Icon size={size} className={className}>
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
        fill={filled ? 'currentColor' : 'none'}
      />
    </Icon>
  )
}

// ─── Shield / Verified ───────────────────────────────────────────────────────
export function ShieldCheckIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <path
        d="M12 2L3 7v6c0 5.25 3.75 10.15 9 11.25C17.25 23.15 21 18.25 21 13V7l-9-5z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
      />
      <polyline points="9 12 11 14 15 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  )
}

// ─── Handshake / B2B Partnership ─────────────────────────────────────────────
export function HandshakeIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <path d="M14 11l4-4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 13l-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 7h-8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 17h8a4 4 0 0 0 4-4v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Icon>
  )
}

// ─── Chat / Chatbot ───────────────────────────────────────────────────────────
export function ChatIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
      />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="12" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </Icon>
  )
}

// ─── Phone / Kontak ───────────────────────────────────────────────────────────
export function PhoneIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 12.22 19.79 19.79 0 0 1 1.39 3.6 2 2 0 0 1 3.36 1.4h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.14 17l.78-.08z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
      />
    </Icon>
  )
}

// ─── Mail / Email ─────────────────────────────────────────────────────────────
export function MailIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </Icon>
  )
}

// ─── Map Pin / Destinasi ──────────────────────────────────────────────────────
export function MapPinIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
        stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" />
    </Icon>
  )
}

// ─── Calendar / Tanggal ───────────────────────────────────────────────────────
export function CalendarIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.8" />
    </Icon>
  )
}

// ─── Users / Pelanggan ───────────────────────────────────────────────────────
export function UsersIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Icon>
  )
}

// ─── Arrow Right ─────────────────────────────────────────────────────────────
export function ArrowRightIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <polyline points="12 5 19 12 12 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  )
}

// ─── Trending / Statistik ─────────────────────────────────────────────────────
export function TrendingIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  )
}

// ─── Bot / AI ─────────────────────────────────────────────────────────────────
export function BotIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <rect x="3" y="8" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 12h.01M15 12h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M9 16c1 .667 2.333 1 4 1s3-.333 4-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 8V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="3" r="1" fill="currentColor" />
      <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" />
    </Icon>
  )
}

// ─── Send / Kirim ─────────────────────────────────────────────────────────────
export function SendIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </Icon>
  )
}

// ─── Close / X ───────────────────────────────────────────────────────────────
export function CloseIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Icon>
  )
}

// ─── Minimize ─────────────────────────────────────────────────────────────────
export function MinimizeIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Icon>
  )
}

// ─── Chevron Down ─────────────────────────────────────────────────────────────
export function ChevronDownIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  )
}

// ─── Badge / Discount ────────────────────────────────────────────────────────
export function DiscountBadgeIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 9h.01M15 15h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Icon>
  )
}

// ─── Compass / Jelajahi ──────────────────────────────────────────────────────
export function CompassIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </Icon>
  )
}

// ─── Lightning / Cepat ───────────────────────────────────────────────────────
export function LightningIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </Icon>
  )
}

// ─── Layered / Paket Lengkap ─────────────────────────────────────────────────
export function LayersIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <polygon points="12 2 2 7 12 12 22 7 12 2"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <polyline points="2 17 12 22 22 17" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <polyline points="2 12 12 17 22 12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </Icon>
  )
}

// ─── Lock / Keamanan ─────────────────────────────────────────────────────────
export function LockIcon({ size = 24, className = '' }) {
  return (
    <Icon size={size} className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </Icon>
  )
}
