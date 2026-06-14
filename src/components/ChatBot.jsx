/**
 * ChatBot.jsx — Aira, Asisten Virtual Amoures Tour
 * ──────────────────────────────────────────────────────────────────────────
 * Arsitektur 4-Layer (Scalable):
 *   L1 · Knowledge Base   — data & teks respons
 *   L2 · Sentiment Engine — deteksi emosi/nada pengguna
 *   L3 · Intent Engine    — klasifikasi maksud pesan
 *   L4 · Response Builder — susun balasan empatis + kontekstual
 *

 * ──────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Bot,
  ChevronRight,
  Smile,
} from "lucide-react";
import { supabase } from "../lib/supabase";

// ═══════════════════════════════════════════════════════════════════════════
// L1 · KNOWLEDGE BASE
// ═══════════════════════════════════════════════════════════════════════════

const KB = {
  bot: {
    name: "Aira",
    persona: "asisten virtual Amoures Tour yang ramah dan profesional",
  },

  company: {
    name: "Amoures Tour Operator",
    since: 2011,
    address: "Jl. Asia Afrika No. 158, Paledang, Bandung",
    phone: "+62 811-2345-678",
    whatsapp: "https://wa.me/628112345678",
    email: "info@amourestour.com",
    hours: "Senin–Sabtu, 08.00–17.00 WIB",
    awards: [
      "ISO 9001 Certified",
      "Best Tour Agency 2023 Jawa Barat",
      "Official Partner ASITA",
    ],
  },

  booking: {
    steps: [
      "1. Pilih paket wisata yang Anda inginkan",
      '2. Klik tombol "Detail & Pesan"',
      "3. Masuk atau daftar akun terlebih dahulu",
      "4. Isi formulir (jumlah peserta, tanggal, catatan)",
      "5. Konfirmasi & tunggu tim kami menghubungi dalam 1x24 jam",
    ],
    dp: "30%",
    payment: [
      "Transfer Bank (BCA, Mandiri, BRI)",
      "Virtual Account",
      "Cicilan 0%",
    ],
  },

  cancellation: {
    gte14days: "100% refund",
    "7to13days": "50% refund",
    lt7days: "Tidak dapat di-refund",
    contact: "+62 811-2345-678",
  },

  b2b: {
    discount: "25%",
    benefits: [
      "Diskon mitra hingga 25%",
      "Account Manager dedikasi",
      "Invoice terkonsolidasi bulanan",
      "Akses portal B2B 24/7",
      "Prioritas support < 1 jam",
    ],
    requirements: [
      "Akta pendirian perusahaan",
      "NPWP perusahaan (jika ada)",
      "KTP PIC (Person in Charge)",
      "Nomor WhatsApp & email bisnis aktif",
    ],
    process: "Verifikasi 1x24 jam setelah formulir dikirim",
    partners: "500+",
  },

  facilities: {
    included: [
      "Hotel bintang 3",
      "Makan 3x sehari",
      "Transportasi ber-AC",
      "Pemandu wisata profesional",
      "Tiket masuk objek wisata",
      "Asuransi perjalanan",
    ],
    excluded: ["Tiket pesawat PP", "Pengeluaran pribadi", "Tips guide"],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// L2 · SENTIMENT ENGINE
// Deteksi nada/emosi pengguna → sesuaikan gaya balasan
// ═══════════════════════════════════════════════════════════════════════════

const SENTIMENT_PATTERNS = [
  {
    sentiment: "frustrated",
    patterns:
      /susah|ribet|lama|ga bisa|tidak bisa|error|gagal|kenapa|masalah|kecewa|buruk|jelek|parah|benci|kesal|cape|capek|bingung banget|nyebelin|menyebalkan/i,
    prefix:
      "Saya memahami betul rasa frustrasi Anda, dan saya benar-benar mohon maaf atas ketidaknyamanan ini. Mari kita selesaikan bersama.",
  },
  {
    sentiment: "urgent",
    patterns:
      /urgent|darurat|segera|cepat|buru|sekarang juga|tolong cepat|asap|hari ini|deadline/i,
    prefix:
      "Saya mengerti ini mendesak. Saya akan prioritaskan bantuan untuk Anda sekarang.",
  },
  {
    sentiment: "sad",
    patterns:
      /sedih|kecewa|hampa|gagal lagi|tidak berhasil|putus asa|menyesal/i,
    prefix:
      "Saya ikut prihatin mendengar hal ini. Tidak apa-apa, kita cari solusi terbaik bersama.",
  },
  {
    sentiment: "happy",
    patterns:
      /senang|suka|bagus|keren|mantap|luar biasa|terima kasih|makasih|puas|cocok|pas|perfect|sip|oke banget/i,
    prefix: "Senang sekali mendengar itu!",
  },
  {
    sentiment: "confused",
    patterns:
      /bingung|tidak mengerti|kurang jelas|apa maksudnya|gimana|ga ngerti|ga paham|tidak paham|mohon jelaskan|jelaskan lagi/i,
    prefix: "Tenang, saya bantu jelaskan dengan lebih sederhana, ya.",
  },
  {
    sentiment: "neutral",
    patterns: /.*/,
    prefix: null,
  },
];

function detectSentiment(text) {
  for (const s of SENTIMENT_PATTERNS) {
    if (s.sentiment !== "neutral" && s.patterns.test(text)) return s;
  }
  return SENTIMENT_PATTERNS.find((s) => s.sentiment === "neutral");
}

// ═══════════════════════════════════════════════════════════════════════════
// L3 · INTENT ENGINE
// Klasifikasi maksud pesan → arahkan ke handler yang tepat
// ═══════════════════════════════════════════════════════════════════════════

const INTENTS = [
  {
    intent: "greeting",
    pattern:
      /^(halo|hai|hi|hello|selamat|assalam|pagi|siang|sore|malam|hei|yo)\b/i,
  },
  {
    intent: "farewell",
    pattern:
      /^(bye|selamat tinggal|sampai jumpa|dadah|makasih ya|ok thanks)\b/i,
  },
  { intent: "thanks", pattern: /terima kasih|makasih|thx|thanks/i },
  {
    intent: "tours_list",
    pattern: /paket|wisata|destinasi|tour|list paket|ada apa aja|pilihan|tur/i,
  },
  {
    intent: "pricing",
    pattern: /harga|biaya|tarif|berapa|cost|mahal|murah|diskon|promo/i,
  },
  {
    intent: "booking_flow",
    pattern:
      /cara pesan|proses pesan|mau pesan|booking|reservasi|langkah|prosedur/i,
  },
  {
    intent: "payment",
    pattern: /bayar|pembayaran|dp|cicil|transfer|virtual account|metode/i,
  },
  { intent: "cancel", pattern: /batal|cancel|refund|kembal/i },
  {
    intent: "facilities",
    pattern:
      /fasilitas|termasuk|include|sudah ada|hotel|makan|akomodasi|pemandu|guide/i,
  },
  {
    intent: "b2b",
    pattern:
      /b2b|mitra|travel agent|agen|partner|kemitraan|korporat|perusahaan|bisnis/i,
  },
  {
    intent: "b2b_register",
    pattern:
      /daftar mitra|cara daftar b2b|registrasi mitra|syarat.*mitra|dokumen.*mitra/i,
  },
  { intent: "visa", pattern: /visa|paspor|passport|dokumen perjalanan/i },
  {
    intent: "insurance",
    pattern: /asuransi|insurance|kecelakaan|perlindungan/i,
  },
  {
    intent: "contact",
    pattern:
      /kontak|hubungi|telepon|whatsapp|wa|email|alamat|kantor|lokasi|nomor/i,
  },
  {
    intent: "about",
    pattern:
      /tentang|profil|sejarah|siapa|company|amoures|berdiri|penghargaan/i,
  },
  { intent: "auth", pattern: /login|masuk|daftar|register|akun|sign/i },
  {
    intent: "complaint",
    pattern: /komplain|keluhan|laporan|masalah|tidak puas|kecewa dengan|buruk/i,
  },
  {
    intent: "agent_dashboard",
    pattern: /dashboard|verifikasi|dokumen b2b|dokumen agen|status akun|akun b2b saya|cek status|menunggu review/i,
  },
  { intent: "help", pattern: /bantuan|help|bisa apa|menu|apa saja|fitur/i },
];

function classifyIntent(text, conversationCtx) {
  const lower = text.toLowerCase().trim();

  // Intent dari quick-reply context (memori percakapan)
  if (conversationCtx.lastIntent === "tours_list" && lower.length < 20) {
    // Kemungkinan user mengetik nama destinasi setelah melihat list
    return "destination_detail";
  }

  for (const { intent, pattern } of INTENTS) {
    if (pattern.test(lower)) return intent;
  }
  return "unknown";
}

// Edge case: cek apakah input valid
function validateInput(text) {
  if (!text || text.trim().length === 0)
    return { valid: false, reason: "empty" };
  if (text.trim().length < 2) return { valid: false, reason: "too_short" };
  if (/^[^a-zA-Z0-9\s\u00C0-\u024F\u4E00-\u9FFF]+$/.test(text.trim()))
    return { valid: false, reason: "gibberish" };
  if (text.length > 500) return { valid: false, reason: "too_long" };
  return { valid: true };
}

// ═══════════════════════════════════════════════════════════════════════════
// L4 · RESPONSE BUILDER
// Susun respons berdasarkan intent + sentiment + konteks + data real
// ═══════════════════════════════════════════════════════════════════════════

const fmt = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

function buildResponse(intent, sentiment, text, tours, conversationCtx) {
  const lower = text.toLowerCase();
  const prefix = sentiment.prefix ? `${sentiment.prefix}\n\n` : "";

  switch (intent) {
    case "greeting": {
      const hour = new Date().getHours();
      const salam =
        hour < 11 ? "pagi" : hour < 15 ? "siang" : hour < 18 ? "sore" : "malam";
      return {
        text: `Selamat ${salam}! Saya *Aira*, asisten virtual Amoures Tour yang siap membantu Anda.\n\nSaya bisa bantu informasi paket wisata, proses pemesanan, program kemitraan B2B, dan masih banyak lagi. Ada yang bisa saya bantu hari ini?`,
        quickReplies: [
          "Lihat paket wisata",
          "Cara pemesanan",
          "Program mitra B2B",
          "Info perusahaan",
        ],
        nextCtx: { lastIntent: "greeting" },
      };
    }

    case "farewell":
      return {
        text: "Terima kasih sudah menghubungi Amoures Tour! Semoga perjalanan impian Anda segera terwujud.\n\nJika ada pertanyaan lain, saya siap membantu kapan saja. Sampai jumpa!",
        quickReplies: [],
        nextCtx: { lastIntent: "farewell" },
      };

    case "thanks":
      return {
        text: `${prefix}Sama-sama! Senang bisa membantu Anda. Jika ada pertanyaan lain seputar perjalanan atau pemesanan, jangan ragu untuk bertanya, ya. Kami selalu siap!`,
        quickReplies: ["Lihat paket wisata", "Hubungi kami"],
        nextCtx: { lastIntent: "thanks" },
      };

    case "complaint":
      return {
        text: `${prefix}Terima kasih sudah menyampaikan keluhan Anda — ini sangat berarti bagi kami untuk terus berkembang.\n\nAgar bisa kami tindak lanjuti dengan cepat, silakan hubungi tim kami langsung:\n\nWhatsApp: *${KB.company.phone}*\nEmail: *${KB.company.email}*\n\nKami berkomitmen merespons setiap keluhan dalam maksimal *2x24 jam* kerja.`,
        quickReplies: ["Hubungi via WhatsApp", "Lihat paket lain"],
        nextCtx: { lastIntent: "complaint" },
      };

    case "tours_list": {
      if (tours.length === 0) {
        return {
          text: `${prefix}Saat ini paket wisata sedang diperbarui. Untuk informasi terkini, silakan hubungi kami di *${KB.company.phone}* atau kunjungi kantor kami.\n\nTim kami dengan senang hati akan membantu merekomendasikan paket terbaik sesuai kebutuhan Anda!`,
          quickReplies: ["Hubungi kami", "Info perusahaan"],
          nextCtx: { lastIntent: "tours_list" },
        };
      }
      const list = tours
        .slice(0, 5)
        .map(
          (t, i) =>
            `${i + 1}. *${t.title}*\n   ${fmt(t.price)}/orang · ${t.duration_days} hari`,
        )
        .join("\n\n");
      return {
        text: `${prefix}Berikut paket wisata unggulan kami:\n\n${list}${tours.length > 5 ? `\n\n...dan *${tours.length - 5} paket* lainnya tersedia!` : ""}\n\nKetik nama destinasi untuk detail lengkap, atau saya bisa rekomendasikan paket sesuai budget Anda!`,
        quickReplies: [
          ...tours.slice(0, 3).map((t) => t.destination),
          "Rekomendasi sesuai budget",
        ],
        nextCtx: { lastIntent: "tours_list", tourList: tours },
      };
    }

    case "destination_detail":
    case "tours_list": {
      // fallthrough handled above
      const dest = tours.find(
        (t) =>
          lower.includes(t.destination.toLowerCase()) ||
          lower.includes(t.title.toLowerCase()),
      );
      if (dest) {
        const depDate = dest.departure_date
          ? new Date(dest.departure_date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
          : "Fleksibel (hubungi kami)";
        return {
          text: `${prefix}*${dest.title}*\n\nDestinasi: ${dest.destination}\nDurasi: ${dest.duration_days} hari\nHarga: ${fmt(dest.price)}/orang\nKuota: ${dest.quota} peserta\nKeberangkatan: ${depDate}\n\n${dest.description || "Paket wisata eksklusif dengan pelayanan premium dari tim kami."}\n\nFasilitas sudah termasuk: hotel, makan 3x, transport, & pemandu wisata.\n\nApakah Anda tertarik memesan paket ini?`,
          quickReplies: [
            "Ya, saya ingin memesan",
            "Lihat paket lain",
            "Tanya fasilitas",
          ],
          nextCtx: { lastIntent: "destination_detail", selectedTour: dest },
        };
      }
      // Jika tidak menemukan destinasi yang cocok, fallback ke list
      return buildResponse(
        "tours_list",
        sentiment,
        text,
        tours,
        conversationCtx,
      );
    }

    case "pricing": {
      // Cek apakah user menyebut nama destinasi tertentu
      const specificTour = tours.find(
        (t) =>
          lower.includes(t.destination.toLowerCase()) ||
          lower.includes(t.title.toLowerCase()),
      );
      if (specificTour) {
        return {
          text: `${prefix}Harga paket *${specificTour.title}* adalah:\n\n*${fmt(specificTour.price)}/orang*\n\nSudah termasuk:\n${KB.facilities.included.map((f) => `• ${f}`).join("\n")}\n\nDP minimal *${KB.booking.dp}* untuk konfirmasi booking. Metode pembayaran: ${KB.booking.payment.join(", ")}.`,
          quickReplies: ["Mau memesan", "Lihat paket lain", "Cara pembayaran"],
          nextCtx: { lastIntent: "pricing", selectedTour: specificTour },
        };
      }
      if (tours.length > 0) {
        const sorted = [...tours].sort((a, b) => a.price - b.price);
        return {
          text: `${prefix}Kisaran harga paket wisata kami:\n\nTermurah: *${fmt(sorted[0].price)}/orang* (${sorted[0].title})\nTertinggi: *${fmt(sorted[sorted.length - 1].price)}/orang* (${sorted[sorted.length - 1].title})\n\nSemua harga *sudah termasuk* akomodasi, makan, transport, dan pemandu wisata profesional.\n\nMau saya rekomendasikan paket sesuai budget Anda?`,
          quickReplies: [
            "Budget < Rp 2 juta",
            "Budget Rp 2-5 juta",
            "Budget > Rp 5 juta",
          ],
          nextCtx: { lastIntent: "pricing" },
        };
      }
      return {
        text: `${prefix}Untuk informasi harga terkini, silakan hubungi kami di *${KB.company.phone}*.`,
        quickReplies: ["Hubungi kami"],
        nextCtx: {},
      };
    }

    case "booking_flow":
      return {
        text: `${prefix}*Cara Pemesanan Paket Wisata Amoures Tour:*\n\n${KB.booking.steps.join("\n")}\n\nMudah kan? Tim kami siap membantu di setiap langkah. Ada yang ingin ditanyakan lebih lanjut?`,
        quickReplies: ["Lihat paket wisata", "Cara pembayaran", "Hubungi kami"],
        nextCtx: { lastIntent: "booking_flow" },
      };

    case "payment":
      return {
        text: `${prefix}*Metode Pembayaran Amoures Tour:*\n\n${KB.booking.payment.map((p) => `• ${p}`).join("\n")}\n\nDP minimal *${KB.booking.dp}* dari total harga untuk konfirmasi booking. Pelunasan dapat dilakukan sebelum tanggal keberangkatan.\n\nAda pertanyaan tentang pembayaran?`,
        quickReplies: ["Cara pemesanan", "Lihat paket wisata"],
        nextCtx: { lastIntent: "payment" },
      };

    case "cancel":
      return {
        text: `${prefix}*Kebijakan Pembatalan & Refund:*\n\n• Batalkan ≥14 hari sebelum: *${KB.cancellation.gte14days}*\n• Batalkan 7–13 hari sebelum: *${KB.cancellation["7to13days"]}*\n• Batalkan < 7 hari: *${KB.cancellation.lt7days}*\n\nUntuk proses pembatalan, hubungi kami di:\nWhatsApp: *${KB.cancellation.contact}*\n\nApakah ada yang ingin Anda tanyakan terkait pembatalan?`,
        quickReplies: ["Hubungi kami", "Lihat paket lain"],
        nextCtx: { lastIntent: "cancel" },
      };

    case "facilities":
      return {
        text: `${prefix}*Fasilitas Paket Wisata Amoures Tour:*\n\nSudah Termasuk:\n${KB.facilities.included.map((f) => `✓ ${f}`).join("\n")}\n\nBelum Termasuk:\n${KB.facilities.excluded.map((f) => `✗ ${f}`).join("\n")}\n\nUpgrade kamar hotel, private transfer, atau asuransi premium tersedia dengan biaya tambahan.`,
        quickReplies: ["Lihat paket wisata", "Cara pemesanan", "Hubungi kami"],
        nextCtx: { lastIntent: "facilities" },
      };

    case "b2b":
      return {
        text: `${prefix}*Program Kemitraan B2B Amoures Tour*\n\nSudah *${KB.b2b.partners} perusahaan* menjadi mitra kami!\n\nKeuntungan Menjadi Mitra:\n${KB.b2b.benefits.map((b) => `• ${b}`).join("\n")}\n\nCocok untuk: Travel Agency, Perusahaan, Event Organizer, Sekolah/Universitas.\n\nIngin tahu cara mendaftar?`,
        quickReplies: [
          "Cara daftar mitra",
          "Syarat pendaftaran",
          "Hubungi kami",
        ],
        nextCtx: { lastIntent: "b2b" },
      };

    case "b2b_register":
      return {
        text: `${prefix}*Cara Daftar Program Mitra B2B:*\n\n1. Buka halaman *Kemitraan B2B* di website\n2. Isi formulir data perusahaan\n3. Masukkan data PIC (Person in Charge)\n4. Tunggu verifikasi tim kami\n\nPersyaratan Dokumen:\n${KB.b2b.requirements.map((r) => `• ${r}`).join("\n")}\n\n*${KB.b2b.process}*\n\nSetelah disetujui, Anda langsung bisa akses portal B2B dan menikmati semua keuntungan mitra!`,
        quickReplies: ["Daftar sekarang", "Keuntungan mitra", "Hubungi kami"],
        nextCtx: { lastIntent: "b2b_register" },
      };

    case "agent_dashboard":
      return {
        text: `${prefix}*Status & Dokumen Verifikasi B2B*\n\nAnda dapat mengecek status persetujuan akun B2B Anda langsung di **Dashboard Agent**.\n\nJika status Anda "Menunggu Review", tim kami sedang memverifikasi dokumen (NIB, NPWP, SIUP) yang Anda unggah dalam 1-3 hari kerja.\n\nAnda juga dapat melihat kembali data perusahaan dan link dokumen yang telah Anda kirimkan di halaman tersebut.`,
        quickReplies: ["Syarat pendaftaran", "Hubungi kami"],
        nextCtx: { lastIntent: "agent_dashboard" },
      };

    case "visa":
      return {
        text: `${prefix}*Informasi Visa & Dokumen Perjalanan:*\n\nDomestik: Tidak perlu paspor — cukup KTP.\n\nInternasional: Paspor berlaku minimal *6 bulan* dari tanggal keberangkatan.\n\nKami dapat membantu proses visa dengan biaya tambahan. Hubungi kami untuk informasi lebih lanjut sesuai negara tujuan Anda.`,
        quickReplies: ["Hubungi kami", "Lihat paket internasional"],
        nextCtx: { lastIntent: "visa" },
      };

    case "insurance":
      return {
        text: `${prefix}*Informasi Asuransi Perjalanan:*\n\nSemua paket wisata Amoures Tour sudah termasuk asuransi perjalanan dari *Tokio Marine* yang mencakup:\n\n• Kecelakaan perjalanan\n• Kehilangan/kerusakan bagasi\n• Biaya pengobatan darurat\n• Pembatalan perjalanan\n\nUpgrade ke asuransi premium tersedia untuk perlindungan lebih komprehensif.`,
        quickReplies: ["Lihat paket wisata", "Cara pemesanan", "Hubungi kami"],
        nextCtx: { lastIntent: "insurance" },
      };

    case "contact":
      return {
        text: `${prefix}*Kontak Amoures Tour Operator:*\n\nWhatsApp: *${KB.company.phone}*\nEmail: *${KB.company.email}*\nAlamat: ${KB.company.address}\nJam Operasional: ${KB.company.hours}\n\nTim kami siap melayani Anda dengan sepenuh hati!`,
        quickReplies: ["Lihat paket wisata", "Cara pemesanan"],
        nextCtx: { lastIntent: "contact" },
      };

    case "about":
      return {
        text: `${prefix}*Tentang Amoures Tour Operator*\n\nBerdiri sejak *${KB.company.since}* di Bandung, kami telah melayani ribuan wisatawan ke 150+ destinasi lokal dan internasional.\n\nPenghargaan:\n${KB.company.awards.map((a) => `• ${a}`).join("\n")}\n\nMisi kami: menghadirkan pengalaman perjalanan yang *aman, nyaman, dan tak terlupakan* untuk setiap pelanggan.`,
        quickReplies: ["Lihat paket wisata", "Hubungi kami"],
        nextCtx: { lastIntent: "about" },
      };

    case "auth":
      return {
        text: `${prefix}*Akun Amoures Tour:*\n\nUntuk memesan paket wisata, Anda perlu memiliki akun.\n\n• *Daftar:* Klik tombol "Daftar" di pojok kanan atas\n• *Masuk:* Klik "Masuk" dengan email & password Anda\n\nPendaftaran gratis dan hanya butuh 2 menit! Setelah punya akun, Anda bisa langsung memesan paket favorit.`,
        quickReplies: ["Cara pemesanan", "Program mitra B2B"],
        nextCtx: { lastIntent: "auth" },
      };

    case "help":
      return {
        text: `${prefix}Saya *Aira*, dan ini yang bisa saya bantu:\n\n• Informasi & rekomendasi paket wisata\n• Harga dan metode pembayaran\n• Panduan proses pemesanan\n• Program kemitraan B2B\n• Kebijakan pembatalan & refund\n• FAQ & informasi lainnya\n• Kontak & lokasi kantor\n\nTinggal ketik pertanyaan Anda, atau pilih topik di bawah!`,
        quickReplies: [
          "Lihat paket wisata",
          "Cara pemesanan",
          "Program mitra B2B",
          "Hubungi kami",
        ],
        nextCtx: { lastIntent: "help" },
      };

    default: {
      // Cek apakah mungkin nama destinasi (tanpa niat eksplisit)
      const destGuess = tours.find(
        (t) =>
          lower.includes(t.destination.toLowerCase()) ||
          lower.includes(t.title.toLowerCase()),
      );
      if (destGuess)
        return buildResponse(
          "destination_detail",
          sentiment,
          text,
          tours,
          conversationCtx,
        );

      return {
        text: `${prefix}Hmm, saya belum sepenuhnya memahami maksud Anda. Tidak apa-apa!\n\nMungkin saya bisa bantu dengan salah satu topik ini?`,
        quickReplies: [
          "Lihat paket wisata",
          "Cara pemesanan",
          "Program mitra B2B",
          "Hubungi kami",
        ],
        nextCtx: {
          lastIntent: "unknown",
          unknownCount: (conversationCtx.unknownCount || 0) + 1,
        },
      };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ORCHESTRATOR — gabungkan semua layer
// ═══════════════════════════════════════════════════════════════════════════

async function processMessage(text, tours, conversationCtx, prevMessages) {
  // ── Edge case: input tidak valid ──
  const validation = validateInput(text);
  if (!validation.valid) {
    const edgeResponses = {
      empty: {
        text: "Sepertinya pesan Anda kosong. Ada yang ingin Anda tanyakan?",
        quickReplies: ["Lihat paket wisata", "Bantuan"],
        nextCtx: conversationCtx,
      },
      too_short: {
        text: "Hmm, sepertinya pesan Anda kurang lengkap. Bisa ceritakan lebih lanjut apa yang ingin Anda tanyakan?",
        quickReplies: ["Bantuan"],
        nextCtx: conversationCtx,
      },
      gibberish: {
        text: "Maaf, saya tidak bisa membaca pesan tersebut. Bisa coba ketik ulang dalam Bahasa Indonesia atau Inggris?",
        quickReplies: ["Bantuan"],
        nextCtx: conversationCtx,
      },
      too_long: {
        text: "Wah, pertanyaan yang panjang! Agar saya bisa bantu lebih akurat, bisakah Anda ringkas dalam 1-2 kalimat?",
        quickReplies: ["Bantuan"],
        nextCtx: conversationCtx,
      },
    };
    return edgeResponses[validation.reason];
  }

  // ── Edge case: pesan berulang (spam detection) ──
  const lastUserMsgs = prevMessages
    .filter((m) => m.role === "user")
    .slice(-3)
    .map((m) => m.text.toLowerCase().trim());
  if (lastUserMsgs.filter((m) => m === text.toLowerCase().trim()).length >= 2) {
    return {
      text:
        "Saya melihat Anda mengirim pesan yang sama beberapa kali. Mungkin ada yang belum terjawab dengan baik?\n\nCoba saya bantu dengan cara lain, atau langsung hubungi tim kami di *" +
        KB.company.phone +
        "* untuk bantuan lebih cepat.",
      quickReplies: ["Hubungi kami", "Bantuan"],
      nextCtx: conversationCtx,
    };
  }

  // ── Edge case: terlalu banyak 'unknown' berturut-turut ──
  if ((conversationCtx.unknownCount || 0) >= 2) {
    return {
      text:
        "Sepertinya saya kesulitan memahami yang Anda maksud. Tidak apa-apa!\n\nUntuk bantuan langsung, tim kami siap dihubungi:\nWhatsApp: *" +
        KB.company.phone +
        "*\nEmail: *" +
        KB.company.email +
        "*\n\nAtau pilih topik yang tersedia di bawah:",
      quickReplies: ["Lihat paket wisata", "Cara pemesanan", "Hubungi kami"],
      nextCtx: { ...conversationCtx, unknownCount: 0 },
    };
  }

  // ── Normal flow ──
  const sentiment = detectSentiment(text);
  const intent = classifyIntent(text, conversationCtx);
  const response = buildResponse(
    intent,
    sentiment,
    text,
    tours,
    conversationCtx,
  );

  // Simulasi "thinking" — lebih lama untuk respons kompleks
  const thinkTime = intent === "unknown" ? 400 : 600 + Math.random() * 400;
  await new Promise((r) => setTimeout(r, thinkTime));

  return response;
}

// ═══════════════════════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function parseBold(text) {
  return text.split("\n").map((line, i, arr) => (
    <span key={i}>
      {line
        .split(/\*([^*]+)\*/g)
        .map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part,
        )}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

function Message({ msg }) {
  const isBot = msg.role === "bot";
  return (
    <div
      className={`flex items-end gap-2 ${isBot ? "justify-start" : "justify-end"} mb-3`}
    >
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mb-0.5 shadow-sm">
          <Bot size={14} className="text-dark" />
        </div>
      )}
      <div className={`max-w-[84%] ${isBot ? "order-2" : "order-1"}`}>
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isBot
              ? "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
              : "bg-primary text-dark rounded-br-sm font-medium"
            }`}
        >
          {parseBold(msg.text)}
        </div>
        <p
          className={`text-[10px] text-gray-400 mt-0.5 ${isBot ? "pl-1" : "text-right pr-1"}`}
        >
          {msg.time}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm">
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

// ═══════════════════════════════════════════════════════════════════════════
// MAIN CHATBOT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [tours, setTours] = useState([]);
  const [unread, setUnread] = useState(1);
  const [convCtx, setConvCtx] = useState({}); // conversation context/memory
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const now = () =>
    new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Fetch real tour data dari Supabase
  useEffect(() => {
    supabase
      .from("tour_packages")
      .select(
        "id,title,destination,description,price,duration_days,quota,departure_date,is_active",
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data?.length) setTours(data);
      });
  }, []);

  // Welcome message
  useEffect(() => {
    setMessages([
      {
        id: 1,
        role: "bot",
        time: now(),
        text: "Halo! Saya *Aira*, asisten virtual Amoures Tour.\n\nSaya siap membantu Anda merencanakan perjalanan impian ke destinasi terbaik. Ada yang bisa saya bantu?",
        quickReplies: [
          "Lihat paket wisata",
          "Cara pemesanan",
          "Program mitra B2B",
          "Hubungi kami",
        ],
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open && !minimized) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open, minimized]);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (typing) return; // prevent double-send while processing

      const userMsg = {
        id: Date.now(),
        role: "user",
        text: trimmed,
        time: now(),
      };
      setMessages((prev) => {
        const updated = [...prev, userMsg];

        // Process async
        (async () => {
          setInput("");
          setTyping(true);
          const response = await processMessage(
            trimmed,
            tours,
            convCtx,
            updated,
          );
          setConvCtx((prev) => ({ ...prev, ...response.nextCtx }));
          const botMsg = {
            id: Date.now() + 1,
            role: "bot",
            text: response.text,
            time: now(),
            quickReplies: response.quickReplies || [],
          };
          setTyping(false);
          setMessages((prev2) => [...prev2, botMsg]);
        })();

        return updated;
      });
      setInput("");
    },
    [tours, convCtx, typing],
  );

  const handleSend = (e) => {
    e?.preventDefault();
    if (input.trim()) sendMessage(input);
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
          className={`fixed z-[9999] transition-all duration-300 ${minimized ? "opacity-0 pointer-events-none translate-y-4" : "opacity-100 translate-y-0"}`}
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
            <div className="bg-gradient-to-r from-primary to-accent px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 bg-white/30 rounded-full flex items-center justify-center">
                    <Bot size={18} className="text-dark" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
                </div>
                <div>
                  <p className="font-black text-dark text-sm leading-none">
                    Aira
                  </p>
                  <p className="text-dark/60 text-[10px] mt-0.5">
                    Asisten Amoures Tour • Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMinimized(true)}
                  className="w-6 h-6 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
                >
                  <Minimize2 size={12} className="text-dark" />
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    setMinimized(false);
                  }}
                  className="w-6 h-6 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
                >
                  <X size={12} className="text-dark" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50">
              {messages.map((msg) => (
                <div key={msg.id}>
                  <Message msg={msg} />
                  {msg.quickReplies?.length > 0 &&
                    msg.id === messages[messages.length - 1]?.id &&
                    !typing && (
                      <div className="flex flex-wrap gap-1.5 mb-3 pl-9">
                        {msg.quickReplies.map((qr) => (
                          <button
                            key={qr}
                            onClick={() => sendMessage(qr)}
                            className="flex items-center gap-1 text-xs font-semibold text-accent bg-white border border-primary/40 hover:bg-amber-50 px-2.5 py-1.5 rounded-full transition-colors"
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
              className="px-3 py-2.5 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pesan..."
                disabled={typing}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="w-9 h-9 bg-primary hover:bg-primary-hover disabled:opacity-40 rounded-xl flex items-center justify-center transition-all shrink-0 active:scale-95"
              >
                <Send size={15} className="text-dark" />
              </button>
            </form>

            <p className="text-center text-[9px] text-gray-400 pb-1.5 bg-white">
              Powered by Amoures Tour · Bandung
            </p>
          </div>
        </div>
      )}

      {/* ── Floating button ── */}
      <button
        onClick={open ? () => setMinimized((m) => !m) : handleOpen}
        aria-label="Buka chat"
        className="fixed bottom-5 right-4 z-[9999] w-14 h-14 bg-primary hover:bg-primary-hover rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
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
