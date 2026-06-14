import { useState, useRef, useEffect } from 'react'
import DOMPurify from 'dompurify'
import {
  ChatIcon, CloseIcon, SendIcon, BotIcon, MinimizeIcon,
  ChevronDownIcon, GlobeIcon, PriceTagIcon, HandshakeIcon,
  ShoppingBagIcon, PhoneIcon,
} from './Icons'

// ─── Knowledge Base ───────────────────────────────────────────────────────────
const KB = [
  {
    patterns: ['halo', 'hai', 'hello', 'hi', 'selamat', 'hei', 'ola'],
    reply: 'Halo! Saya **Moura**, asisten virtual Amoures Tour. Saya siap membantu Anda menemukan paket wisata impian, informasi pemesanan, kemitraan B2B, dan banyak lagi!\n\nAda yang bisa saya bantu hari ini?',
  },
  {
    patterns: ['paket', 'tur', 'tour', 'wisata', 'destinasi', 'pilihan'],
    reply: 'Kami memiliki ratusan paket wisata unggulan! Beberapa destinasi populer:\n\n• **Bali** – Rp 2.500.000/pax (5H4M)\n• **Lombok** – Rp 2.200.000/pax (4H3M)\n• **Labuan Bajo** – Rp 4.900.000/pax (4H3M)\n• **Raja Ampat** – Rp 4.900.000/pax (6H5M)\n• **Yogyakarta** – Rp 1.800.000/pax (3H2M)\n• **Bromo** – Rp 1.500.000/pax (2H1M)\n\nKlik **Paket Tur** di menu atas untuk melihat semua paket!',
  },
  {
    patterns: ['harga', 'biaya', 'tarif', 'berapa', 'cost', 'murah'],
    reply: 'Harga paket kami mulai dari **Rp 1.500.000/pax** untuk paket domestik. Semua sudah termasuk:\n\n• Akomodasi\n• Transportasi lokal\n• Guide profesional\n• Makan pagi\n\nUntuk harga termurah, cek halaman **Paket Tur** atau hubungi tim kami!',
  },
  {
    patterns: ['pesan', 'booking', 'beli', 'order', 'cara pesan', 'cara booking'],
    reply: 'Cara memesan paket wisata di Amoures:\n\n1. **Daftar / Login** ke akun Anda\n2. Pilih paket di halaman **Paket Tur**\n3. Klik **Pesan Sekarang**\n4. Isi formulir pemesanan\n5. Pilih metode pembayaran\n6. Selesai! Tim kami akan konfirmasi dalam 1x24 jam\n\nMau saya bantu ke halaman pemesanan?',
  },
  {
    patterns: ['b2b', 'kemitraan', 'mitra', 'perusahaan', 'korporat', 'travel agent', 'agen', 'bisnis'],
    reply: 'Amoures memiliki program **Kemitraan B2B** eksklusif untuk:\n\n• **Travel Agent**\n• Perusahaan / Korporat\n• Event Organizer\n• Sekolah & Universitas\n\n**Keuntungan mitra B2B:**\n• Diskon khusus hingga 25%\n• Invoice terkonsolidasi bulanan\n• Account Manager dedikasi\n• Akses portal B2B 24/7',
  },
  {
    patterns: ['daftar', 'register', 'registrasi', 'buat akun', 'signup'],
    reply: 'Mendaftar di Amoures sangat mudah!\n\n1. Klik tombol **Daftar** di pojok kanan atas\n2. Isi nama, email, dan password\n3. Verifikasi email Anda\n4. Selesai! Akun siap digunakan\n\nSudah punya akun? Klik **Masuk** untuk login.',
  },
  {
    patterns: ['login', 'masuk', 'sign in', 'lupa password', 'reset password'],
    reply: 'Untuk masuk ke akun Anda:\n\nKlik tombol **Masuk** di pojok kanan atas dan masukkan email & password.\n\n**Akun demo tersedia:**\n• Admin: `admin@moures.com` / `admin123`\n• User: `user@moures.com` / `user123`\n• Travel Agent: `agent@cvkaryanusantara.com` / `agent123`',
  },
  {
    patterns: ['kontak', 'hubungi', 'telepon', 'email', 'whatsapp', 'cs', 'customer service', 'support'],
    reply: 'Hubungi tim Amoures:\n\n• **WhatsApp:** +62 812-3456-7890\n• **Email:** hello@amourestour.com\n• **B2B:** b2b@amourestour.com\n• **Jam Operasional:** Senin–Sabtu, 08.00–20.00 WIB',
  },
  {
    patterns: ['bayar', 'pembayaran', 'transfer', 'qris', 'ewallet', 'cicil', 'dp'],
    reply: 'Metode pembayaran yang kami terima:\n\n• **Transfer Bank** (BCA, Mandiri, BRI, BNI)\n• **Virtual Account**\n• **QRIS**\n• **E-Wallet** (GoPay, OVO, Dana, ShopeePay)\n\nUntuk **B2B**: Invoice NET 7/14/30 hari\n\nDP minimal **30%** dari total harga paket.',
  },
  {
    patterns: ['batal', 'cancel', 'refund', 'batalkan', 'pengembalian'],
    reply: 'Kebijakan pembatalan Amoures:\n\n• **> 30 hari** sebelum keberangkatan: Refund 80%\n• **15–30 hari**: Refund 50%\n• **7–14 hari**: Refund 25%\n• **< 7 hari**: Tidak ada refund\n\nPembatalan bisa dilakukan melalui **Dashboard** akun Anda atau hubungi CS kami.',
  },
  {
    patterns: ['kecewa', 'komplain', 'buruk', 'jelek', 'lama', 'masalah', 'gagal', 'keluhan'],
    reply: 'Saya sangat memohon maaf atas ketidaknyamanan yang Anda alami. Moura sangat peduli dengan pengalaman liburan Anda bersama kami. 🙏\n\nAgar masalah ini cepat teratasi, bolehkah Anda memberikan detail masalah atau nomor pesanan Anda? Tim Customer Service kami akan segera menghubungi Anda untuk memberikan solusi terbaik.',
  },
  {
    patterns: ['cuaca', 'makan', 'presiden', 'berita', 'politik', 'jodoh', 'game', 'film'],
    reply: 'Hmm, obrolan yang menarik! 😄 Tapi sebagai asisten travel profesional, Moura lebih ahli membahas destinasi liburan, tiket, dan paket wisata.\n\nMau Moura rekomendasikan destinasi liburan yang cocok untuk Anda bulan ini?',
  },
  {
    patterns: ['terima kasih', 'makasih', 'thanks', 'thx', 'ok', 'baik', 'oke'],
    reply: 'Sama-sama! Senang bisa membantu Anda.\n\nJika ada pertanyaan lain, jangan ragu untuk bertanya ya! Selamat merencanakan perjalanan impian Anda bersama **Amoures Tour**.',
  },
]

const FALLBACK = 'Maaf, saya belum menemukan jawaban yang tepat untuk itu.\n\nCoba tanyakan tentang:\n• Paket wisata & harga\n• Cara pemesanan\n• Kemitraan B2B\n• Metode pembayaran\n• Cara menghubungi kami\n\nAtau hubungi tim ahli kami di **+62 812-3456-7890**!'
const EMPTY_REPLY = 'Sepertinya Anda mengirim pesan kosong. Ada yang bisa Moura bantu hari ini? 😊'

function findReply(input) {
  const text = input.trim()
  if (!text) return EMPTY_REPLY

  // Normalisasi input ke huruf kecil dan hilangkan tanda baca dasar untuk pencocokan yang lebih baik
  const normalizedInput = text.toLowerCase().replace(/[^\w\s]/g, '')
  
  // Deteksi intent (skalabel: bisa diganti dengan NLP service di masa depan)
  for (const entry of KB) {
    if (entry.patterns.some((p) => normalizedInput.includes(p.toLowerCase()))) {
      return entry.reply
    }
  }
  
  return FALLBACK
}

// ─── Render bold/code markdown ────────────────────────────────────────────────
function renderText(text) {
  return text.split('\n').map((line, i) => {
    const formatted = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code style="background:#f3f4f6;color:#7a6f00;padding:1px 5px;border-radius:4px;font-size:11px;font-family:monospace">$1</code>')
    
    // Sanitize with DOMPurify to prevent XSS
    const cleanHTML = DOMPurify.sanitize(formatted);

    return (
      <span key={i} dangerouslySetInnerHTML={{ __html: cleanHTML }}
        className="block leading-relaxed" />
    )
  })
}

// ─── Quick Replies ────────────────────────────────────────────────────────────
const QUICK_REPLIES = [
  { label: 'Lihat Paket', icon: GlobeIcon, query: 'paket wisata' },
  { label: 'Info Harga', icon: PriceTagIcon, query: 'harga paket' },
  { label: 'Program B2B', icon: HandshakeIcon, query: 'b2b kemitraan' },
  { label: 'Cara Pesan', icon: ShoppingBagIcon, query: 'cara pesan booking' },
  { label: 'Kontak Kami', icon: PhoneIcon, query: 'kontak hubungi' },
]

// ─── Bot avatar (uses custom AI logo) ─────────────────────────────────────────
function BotAvatar({ size = 28 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden border"
      style={{ width: size, height: size, borderColor: '#D4E000' }}
    >
      <img
        src="/moura-logo.png"
        alt="Moura"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  )
}

function UserAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="#6b7280" strokeWidth="1.8" />
        <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  )
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function Bubble({ msg }) {
  const isBot = msg.role === 'bot'
  return (
    <div className={`flex items-end gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && <BotAvatar size={26} />}
      <div
        className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm shadow-sm ${
          isBot
            ? 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
            : 'rounded-br-sm text-[#1A1A1A]'
        }`}
        style={!isBot ? { background: '#D4E000' } : {}}
      >
        {isBot ? renderText(msg.text) : <p className="leading-relaxed font-medium">{msg.text}</p>}
        <p className={`text-[10px] mt-1 ${isBot ? 'text-gray-400' : 'text-[#1A1A1A]/50'} text-right`}>
          {msg.time}
        </p>
      </div>
      {!isBot && <UserAvatar />}
    </div>
  )
}

// ─── Typing dots ──────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 justify-start">
      <BotAvatar size={26} />
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{ background: '#D4E000', animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Welcome message ─────────────────────────────────────────────────────────
const WELCOME = {
  id: 'welcome',
  role: 'bot',
  text: 'Halo! Saya **Moura**, asisten virtual Amoures Tour.\n\nSaya bisa membantu Anda dengan:\n• Paket & destinasi wisata\n• Cara pemesanan\n• Program kemitraan B2B\n• Pembayaran & kebijakan\n\nAda yang bisa saya bantu?',
  time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
}

// ─── Main Chatbot ─────────────────────────────────────────────────────────────
export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [hasNew, setHasNew] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      setTimeout(() => inputRef.current?.focus(), 100)
      setHasNew(false)
    }
  }, [messages, open, minimized])

  useEffect(() => {
    const t = setTimeout(() => { if (!open) setHasNew(true) }, 5000)
    return () => clearTimeout(t)
  }, [])

  const sendMessage = async (text) => {
    if (!text.trim()) return
    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    setMessages((p) => [...p, { id: Date.now(), role: 'user', text: text.trim(), time: now }])
    setInput('')
    setTyping(true)
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 500))
    setTyping(false)
    setMessages((p) => [
      ...p,
      {
        id: Date.now() + 1,
        role: 'bot',
        text: findReply(text),
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }

  return (
    <>
      {/* ── Chat Window ── */}
      {open && (
        <div
          className="fixed z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-white/10 transition-all duration-300"
          style={{
            /* Responsive positioning & sizing */
            right: '1.25rem',
            bottom: '5.5rem',
            width: 'min(360px, calc(100vw - 2rem))',
            height: minimized ? '60px' : 'min(520px, calc(100dvh - 8rem))',
            background: '#f8f9fa',
          }}
        >
          {/* ── Header ── */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ background: '#1A1A1A' }}
          >
            <div className="flex items-center gap-3">
              {/* Bot Logo */}
              <div
                className="rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden border border-white/10"
                style={{ width: 36, height: 36 }}
              >
                <img src="/moura-logo.png" alt="Moura" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <p className="font-bold text-sm leading-tight" style={{ color: '#D4E000' }}>Moura</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                  </span>
                  <p className="text-white/50 text-[11px]">Online sekarang</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setMinimized((v) => !v)}
                className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all"
              >
                {minimized
                  ? <ChevronDownIcon size={15} className="rotate-180" />
                  : <MinimizeIcon size={15} />}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all"
              >
                <CloseIcon size={15} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* ── Messages ── */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 overscroll-contain">
                {messages.map((msg) => <Bubble key={msg.id} msg={msg} />)}
                {typing && <TypingIndicator />}
                <div ref={bottomRef} />
              </div>

              {/* ── Quick Replies ── */}
              <div className="px-3 py-2 flex gap-1.5 flex-wrap flex-shrink-0 border-t border-gray-100">
                {QUICK_REPLIES.map(({ label, icon: IconComp, query }) => (
                  <button
                    key={label}
                    onClick={() => sendMessage(query)}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm border"
                    style={{
                      background: 'white',
                      borderColor: '#D4E00040',
                      color: '#5a5f00',
                    }}
                  >
                    <IconComp size={12} />
                    {label}
                  </button>
                ))}
              </div>

              {/* ── Input ── */}
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
                className="flex items-center gap-2 px-3 pb-3 pt-2 flex-shrink-0"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pesan..."
                  className="flex-1 px-3.5 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#D4E000] focus:ring-2 focus:ring-[#D4E000]/20 shadow-sm transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 flex-shrink-0"
                  style={{ background: '#D4E000' }}
                >
                  <SendIcon size={14} className="text-[#1A1A1A] translate-x-px" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* ── FAB ── */}
      <button
        onClick={() => { setOpen((v) => !v); setHasNew(false) }}
        className="fixed bottom-5 right-5 z-50 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-2xl border-2"
        style={{
          width: 52, height: 52,
          borderColor: open ? '#1A1A1A' : '#D4E000',
          background: open ? '#1A1A1A' : '#D4E000',
        }}
        title="Chat dengan Moura"
      >
        {open
          ? <CloseIcon size={19} className="text-[#D4E000]" />
          : <img src="/moura-logo.png" alt="Moura" className="rounded-full" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}

        {hasNew && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-md animate-bounce">
            1
          </span>
        )}
      </button>
    </>
  )
}
