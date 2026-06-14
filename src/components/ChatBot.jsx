/**
 * ChatBot.jsx — Chatbot dinamis Amoures Tour
 * - Tidak menggunakan platform/aplikasi pihak ketiga
 * - Mengambil data paket wisata REAL dari Supabase
 * - Response engine berbasis NLP sederhana (keyword matching + context)
 * - UI floating widget, muncul di semua halaman
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Bot,
  ChevronRight,
} from "lucide-react";
import { supabase } from "../lib/supabase";

// ─── Format IDR ───────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

// ─── Knowledge base Amoures Tour ─────────────────────────────────────────────
const KB = {
  company: {
    nama: "Amoures Tour Operator",
    berdiri: 2011,
    lokasi: "Jl. Asia Afrika No. 158, Bandung, Jawa Barat",
    phone: "+62 811-2345-678",
    email: "info@amourestour.com",
    jam: "Senin–Sabtu, 08.00–17.00 WIB",
  },

  booking: [
    "1. Pilih paket wisata yang Anda inginkan",
    '2. Klik tombol "Detail & Pesan"',
    "3. Masuk atau daftar akun terlebih dahulu",
    "4. Isi formulir pemesanan (jumlah peserta, catatan)",
    "5. Konfirmasi pemesanan",
    "6. Tim kami akan menghubungi Anda dalam 1×24 jam",
  ],

  b2b: [
    "• Buka halaman Kemitraan B2B",
    "• Isi formulir pendaftaran perusahaan (nama, NPWP, jenis usaha)",
    "• Masukkan data PIC (Person in Charge)",
    "• Tunggu verifikasi tim kami dalam 1×24 jam",
    "• Setelah disetujui, akses portal B2B dengan diskon mitra hingga 25%",
  ],

  faqs: [
    {
      q: /batal|cancel|refund|kembal/i,
      a: "Pembatalan dapat dilakukan maksimal 7 hari sebelum keberangkatan. Refund 100% untuk pembatalan ≥14 hari, 50% untuk 7–13 hari. Hubungi kami di +62 811-2345-678.",
    },
    {
      q: /bayar|payment|cicil|dp|transfer/i,
      a: "Kami menerima pembayaran via Transfer Bank (BCA, Mandiri, BRI), Virtual Account, dan cicilan. DP minimal 30% dari total harga untuk konfirmasi booking.",
    },
    {
      q: /asuransi|insurance|kecelakaan/i,
      a: "Semua paket wisata sudah termasuk asuransi perjalanan dari Tokio Marine. Anda bisa menambah coverage asuransi premium dengan biaya tambahan.",
    },
    {
      q: /guide|pemandu|tour leader/i,
      a: "Setiap paket sudah termasuk pemandu wisata profesional berpengalaman minimal 5 tahun, fasih berbahasa Indonesia dan Inggris.",
    },
    {
      q: /visa|passport|paspor/i,
      a: "Untuk paket domestik tidak diperlukan paspor. Untuk paket internasional, Anda perlu menyiapkan paspor berlaku minimal 6 bulan. Kami dapat membantu proses visa dengan biaya tambahan.",
    },
    {
      q: /hotel|penginapan|akomodasi/i,
      a: "Paket standar sudah termasuk hotel bintang 3. Upgrade ke bintang 4-5 tersedia dengan biaya tambahan. Semua hotel telah kami seleksi untuk kenyamanan dan keamanan Anda.",
    },
    {
      q: /makanan|makan|meal|food/i,
      a: "Paket kami sudah termasuk makan 3x sehari (sarapan, makan siang, makan malam) dengan pilihan menu lokal yang autentik.",
    },
    {
      q: /berapa orang|minimum|minimal|grup|group/i,
      a: "Minimal 2 orang untuk paket private tour. Paket group sharing mulai dari 1 orang (bergabung dengan peserta lain). Untuk grup korporat/sekolah (>20 orang) tersedia paket khusus.",
    },
  ],
};

// ─── Chatbot Response Engine ──────────────────────────────────────────────────
async function generateResponse(input, tours, context) {
  const text = input.toLowerCase().trim();

  // ── GREETING ──
  if (
    /^(halo|hi|hai|hello|selamat|good|pagi|siang|sore|malam|hey|assalam|hei)\b/i.test(
      text,
    )
  ) {
    const hour = new Date().getHours();
    const salam =
      hour < 11 ? "pagi" : hour < 15 ? "siang" : hour < 18 ? "sore" : "malam";
    return {
      text: `Selamat ${salam}! Saya Aira, asisten virtual Amoures Tour. 😊\n\nSaya siap membantu Anda merencanakan perjalanan impian. Apa yang ingin Anda ketahui?`,
      quickReplies: [
        "Lihat paket wisata",
        "Cara pemesanan",
        "Daftar mitra B2B",
        "Info perusahaan",
      ],
      context: "greeting",
    };
  }

  // ── THANK YOU ──
  if (/terima kasih|makasih|thanks|thank you/i.test(text)) {
    return {
      text: "Sama-sama! Senang bisa membantu Anda. 🙏\n\nJika ada pertanyaan lain seputar paket wisata atau pemesanan, jangan ragu untuk bertanya ya!",
      quickReplies: ["Lihat paket wisata", "Hubungi kami"],
      context: null,
    };
  }

  // ── PAKET WISATA (all) ──
  if (
    /paket|wisata|tour|destinasi|semua|list|daftar paket/i.test(text) &&
    !/cara|bagaimana|how|proses/i.test(text)
  ) {
    if (tours.length === 0) {
      return {
        text: "Maaf, saat ini belum ada paket wisata tersedia. Silakan hubungi kami langsung di +62 811-2345-678.",
        quickReplies: ["Hubungi kami"],
        context: null,
      };
    }
    const list = tours
      .slice(0, 5)
      .map(
        (t, i) =>
          `${i + 1}. *${t.title}* — ${fmt(t.price)}/orang (${t.duration_days} hari)`,
      )
      .join("\n");
    return {
      text: `Berikut paket wisata unggulan kami:\n\n${list}\n\n${tours.length > 5 ? `...dan ${tours.length - 5} paket lainnya.` : ""}\n\nKetik nama destinasi untuk info lebih lengkap!`,
      quickReplies: tours.slice(0, 4).map((t) => t.destination),
      context: "tours",
    };
  }

  // ── DESTINASI SPESIFIK ──
  const destMatch = tours.find(
    (t) =>
      text.includes(t.destination.toLowerCase()) ||
      text.includes(t.title.toLowerCase()),
  );
  if (destMatch) {
    return {
      text: `🗺️ *${destMatch.title}*\n\n📍 Destinasi: ${destMatch.destination}\n⏱️ Durasi: ${destMatch.duration_days} hari\n💰 Harga: ${fmt(destMatch.price)}/orang\n👥 Kuota: ${destMatch.quota} peserta\n📅 Keberangkatan: ${destMatch.departure_date ? new Date(destMatch.departure_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "Fleksibel"}\n\n${destMatch.description || "Paket wisata eksklusif dengan pelayanan terbaik."}\n\nIngin memesan paket ini?`,
      quickReplies: ["Cara pemesanan", "Lihat paket lain", "Hubungi kami"],
      context: "dest_detail",
      meta: { tour: destMatch },
    };
  }

  // ── HARGA / BIAYA ──
  if (/harga|biaya|cost|price|murah|mahal|berapa|tarif/i.test(text)) {
    if (tours.length > 0) {
      const sorted = [...tours].sort((a, b) => a.price - b.price);
      return {
        text: `💰 Kisaran harga paket wisata kami:\n\n• Termurah: ${fmt(sorted[0].price)}/orang (${sorted[0].title})\n• Termahal: ${fmt(sorted[sorted.length - 1].price)}/orang (${sorted[sorted.length - 1].title})\n\nHarga sudah termasuk akomodasi, makan, transport, dan pemandu wisata profesional.\n\nDP minimal 30% untuk konfirmasi booking.`,
        quickReplies: [
          "Lihat semua paket",
          "Cara pemesanan",
          "Metode pembayaran",
        ],
        context: "price",
      };
    }
  }

  // ── CARA BOOKING / PESAN ──
  if (
    /pesan|booking|reservasi|cara|bagaimana|how|proses pemesanan/i.test(text) &&
    !/b2b|mitra|agen/i.test(text)
  ) {
    return {
      text: `📋 *Cara Pemesanan Paket Wisata:*\n\n${KB.booking.join("\n")}\n\nButuh bantuan? Tim kami siap membantu di ${KB.company.phone}`,
      quickReplies: ["Lihat paket wisata", "Metode pembayaran", "Hubungi kami"],
      context: "booking",
    };
  }

  // ── B2B / TRAVEL AGENT ──
  if (
    /b2b|mitra|travel agent|agen|partner|kemitraan|daftar mitra|bisnis|korporat/i.test(
      text,
    )
  ) {
    return {
      text: `🤝 *Program Kemitraan B2B Amoures Tour*\n\n*Keuntungan Menjadi Mitra:*\n• Diskon khusus hingga 25%\n• Account Manager dedikasi\n• Invoice bulanan terkonsolidasi\n• Akses portal B2B 24/7\n• Prioritas support < 1 jam\n\n*Cara Pendaftaran:*\n${KB.b2b.join("\n")}\n\nSudah 500+ perusahaan bergabung dengan kami!`,
      quickReplies: ["Daftar sekarang", "Syarat pendaftaran", "Hubungi kami"],
      context: "b2b",
    };
  }

  // ── SYARAT B2B ──
  if (/syarat|requirement|dokumen|berkas|npwp|siup/i.test(text)) {
    return {
      text: `📄 *Syarat Pendaftaran Mitra B2B:*\n\n• Akta pendirian perusahaan\n• NPWP perusahaan (jika ada)\n• KTP PIC (Person in Charge)\n• Nomor telepon & email bisnis aktif\n• Estimasi jumlah perjalanan per bulan\n\nProses verifikasi 1×24 jam. Daftar sekarang di halaman Kemitraan B2B!`,
      quickReplies: ["Cara daftar", "Hubungi kami"],
      context: "b2b_req",
    };
  }

  // ── KONTAK ──
  if (
    /kontak|hubungi|telepon|phone|whatsapp|wa|email|alamat|kantor|lokasi/i.test(
      text,
    )
  ) {
    return {
      text: `📞 *Kontak Amoures Tour Operator:*\n\n📍 ${KB.company.lokasi}\n📱 ${KB.company.phone} (WhatsApp)\n✉️ ${KB.company.email}\n⏰ ${KB.company.jam}\n\nAtau kunjungi langsung kantor kami di Bandung!`,
      quickReplies: ["Lihat paket wisata", "Cara pemesanan"],
      context: "contact",
    };
  }

  // ── TENTANG PERUSAHAAN ──
  if (
    /tentang|about|siapa|company|perusahaan|profil|amoures|sejarah|berdiri/i.test(
      text,
    )
  ) {
    return {
      text: `🏢 *Tentang Amoures Tour Operator*\n\nBerdiri sejak tahun ${KB.company.berdiri} di Bandung, Amoures Tour telah melayani ribuan wisatawan dengan paket perjalanan berkualitas ke 150+ destinasi.\n\n✅ ISO 9001 Certified\n✅ Best Tour Agency 2023 Jawa Barat\n✅ Official Partner ASITA\n✅ 10.000+ pelanggan puas\n\nKami berkomitmen menghadirkan pengalaman perjalanan yang aman, nyaman, dan tak terlupakan.`,
      quickReplies: ["Lihat paket wisata", "Hubungi kami"],
      context: "about",
    };
  }

  // ── LOGIN / DAFTAR ──
  if (/login|masuk|daftar|register|akun|sign in|sign up/i.test(text)) {
    return {
      text: `👤 *Akun Amoures Tour:*\n\nUntuk memesan paket wisata, Anda perlu memiliki akun.\n\n• *Daftar:* Klik tombol "Daftar" di pojok kanan atas\n• *Masuk:* Klik "Masuk" dengan email & password Anda\n\nProses pendaftaran hanya butuh 2 menit! ⚡`,
      quickReplies: ["Cara pemesanan", "Daftar mitra B2B"],
      context: "auth",
    };
  }

  // ── FAQ ──
  for (const faq of KB.faqs) {
    if (faq.q.test(text)) {
      return {
        text: faq.a,
        quickReplies: ["Pertanyaan lain", "Lihat paket wisata", "Hubungi kami"],
        context: "faq",
      };
    }
  }

  // ── BANTUAN / HELP ──
  if (/bantuan|help|bisa apa|apa saja|menu|pilihan/i.test(text)) {
    return {
      text: `Saya bisa membantu Anda dengan:\n\n🗺️ Informasi paket wisata\n💰 Harga dan promo\n📋 Cara pemesanan\n🤝 Daftar mitra B2B\n❓ FAQ & kebijakan\n📞 Kontak perusahaan\n\nKetik pertanyaan Anda atau pilih salah satu di bawah:`,
      quickReplies: [
        "Lihat paket wisata",
        "Cara pemesanan",
        "Daftar mitra B2B",
        "Hubungi kami",
      ],
      context: "help",
    };
  }

  // ── DEFAULT ──
  return {
    text: `Maaf, saya belum memahami pertanyaan Anda. 🙏\n\nSaya bisa membantu tentang:\n• Paket wisata & harga\n• Cara pemesanan\n• Program mitra B2B\n• Informasi perusahaan\n\nAtau langsung hubungi kami di *${KB.company.phone}*`,
    quickReplies: [
      "Lihat paket wisata",
      "Cara pemesanan",
      "Hubungi kami",
      "Bantuan",
    ],
    context: null,
  };
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function Message({ msg }) {
  const isBot = msg.role === "bot";

  // Parse bold *text* → <strong>
  const parseText = (text) =>
    text.split("\n").map((line, i) => (
      <span key={i}>
        {line
          .split(/\*([^*]+)\*/g)
          .map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part,
          )}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ));

  return (
    <div
      className={`flex items-end gap-2 ${isBot ? "justify-start" : "justify-end"} mb-3`}
    >
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-[#FFC107] flex items-center justify-center shrink-0 mb-0.5">
          <Bot size={14} className="text-dark" />
        </div>
      )}
      <div className={`max-w-[82%] ${isBot ? "order-2" : "order-1"}`}>
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
            isBot
              ? "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
              : "bg-[#FFC107] text-dark rounded-br-sm font-medium"
          }`}
        >
          {parseText(msg.text)}
        </div>
        <p
          className={`text-[10px] text-gray-400 mt-0.5 ${isBot ? "text-left pl-1" : "text-right pr-1"}`}
        >
          {msg.time}
        </p>
      </div>
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-[#FFC107] flex items-center justify-center shrink-0">
        <Bot size={14} className="text-dark" />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: "0.8s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main ChatBot component ───────────────────────────────────────────────────
export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [tours, setTours] = useState([]);
  const [context, setContext] = useState(null);
  const [unread, setUnread] = useState(1);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const now = () =>
    new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Fetch real tours from Supabase on mount
  useEffect(() => {
    supabase
      .from("tour_packages")
      .select(
        "id,title,destination,description,price,duration_days,quota,departure_date,is_active",
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setTours(data);
      });
  }, []);

  // Welcome message — tanpa emoji
  useEffect(() => {
    setMessages([
      {
        id: 1,
        role: "bot",
        text: "Halo! Saya *Aira*, asisten virtual Amoures Tour.\n\nSaya siap membantu Anda merencanakan perjalanan impian ke destinasi terbaik. Ada yang bisa saya bantu?",
        time: now(),
        quickReplies: [
          "Lihat paket wisata",
          "Cara pemesanan",
          "Daftar mitra B2B",
          "Hubungi kami",
        ],
      },
    ]);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Focus input when opened
  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open, minimized]);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg = {
        id: Date.now(),
        role: "user",
        text: trimmed,
        time: now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setTyping(true);

      // Simulate thinking delay (300-900ms)
      const delay = 300 + Math.random() * 600;
      await new Promise((r) => setTimeout(r, delay));

      const response = await generateResponse(trimmed, tours, context);
      setContext(response.context);

      const botMsg = {
        id: Date.now() + 1,
        role: "bot",
        text: response.text,
        time: now(),
        quickReplies: response.quickReplies || [],
      };

      setTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    },
    [tours, context],
  );

  const handleSend = (e) => {
    e?.preventDefault();
    sendMessage(input);
  };

  const handleOpen = () => {
    setOpen(true);
    setMinimized(false);
    setUnread(0);
  };

  return (
    <>
      {/* ── Chat window ── */}
      {open && (
        <div
          className={`fixed z-[9999] transition-all duration-300 ${
            minimized
              ? "opacity-0 pointer-events-none translate-y-4"
              : "opacity-100 translate-y-0"
          }`}
          style={{
            bottom: "5rem",
            right: "1rem",
            width: "min(22rem, calc(100vw - 2rem))",
            maxHeight: "calc(100svh - 7rem)",
          }}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
            style={{ height: "min(520px, calc(100svh - 7rem))" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FFC107] to-[#FF8F00] px-4 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 bg-white/30 rounded-full flex items-center justify-center">
                    <Bot size={18} className="text-dark" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                </div>
                <div>
                  <p className="font-black text-dark text-sm leading-none">
                    Aira
                  </p>
                  <p className="text-dark/70 text-[11px] mt-0.5">
                    Asisten Amoures Tour • Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMinimized(true)}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <Minimize2 size={13} className="text-dark" />
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    setMinimized(false);
                  }}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X size={13} className="text-dark" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 space-y-0">
              {messages.map((msg) => (
                <div key={msg.id}>
                  <Message msg={msg} />
                  {/* Quick replies */}
                  {msg.quickReplies?.length > 0 &&
                    msg.id === messages[messages.length - 1]?.id &&
                    !typing && (
                      <div className="flex flex-wrap gap-2 mb-3 pl-9">
                        {msg.quickReplies.map((qr) => (
                          <button
                            key={qr}
                            onClick={() => sendMessage(qr)}
                            className="flex items-center gap-1 text-xs font-semibold text-[#FF8F00] bg-white border border-[#FFC107]/50 hover:bg-[#FFF8E1] px-3 py-1.5 rounded-full transition-colors"
                          >
                            {qr}
                            <ChevronRight size={10} />
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}
              {typing && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="px-3 py-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FFC107]/50 focus:border-[#FFC107] transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 bg-[#FFC107] hover:bg-[#FFB300] disabled:opacity-40 rounded-xl flex items-center justify-center transition-all shrink-0 active:scale-95"
              >
                <Send size={16} className="text-dark" />
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-[10px] text-gray-400 pb-2 bg-white">
              Powered by Amoures Tour • Bandung, Indonesia
            </p>
          </div>
        </div>
      )}

      {/* ── Floating button ── */}
      <button
        onClick={open ? () => setMinimized((m) => !m) : handleOpen}
        aria-label="Buka chat"
        className="fixed bottom-5 right-4 sm:right-6 z-[9999] w-14 h-14 bg-[#FFC107] hover:bg-[#FFB300] rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
      >
        {open && !minimized ? (
          <X size={22} className="text-dark" />
        ) : (
          <>
            <MessageCircle size={24} className="text-dark" />
            {unread > 0 && !open && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </>
        )}
      </button>
    </>
  );
}
