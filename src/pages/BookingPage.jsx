import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

import {
  ChevronRight,
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image,
  Home,
  Building2,
  UserCheck,
  BadgePercent,
  FileText,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useTour } from '../hooks/useTours'
import { useBooking } from '../hooks/useBooking'
import { useAuth } from '../hooks/useAuth'

// ─── helpers ────────────────────────────────────────────────────────────────

function formatPrice(price) {
  if (!price && price !== 0) return 'Hubungi Kami'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

// ─── skeleton ───────────────────────────────────────────────────────────────

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
}

function BookingPageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Skeleton className="h-6 w-64 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-56" />
          <Skeleton className="h-40" />
          <Skeleton className="h-24" />
        </div>
        <div>
          <Skeleton className="h-80" />
        </div>
      </div>
    </div>
  )
}

// ─── validation schema ───────────────────────────────────────────────────────

const bookingSchema = z.object({
  passengerCount: z
    .number({ invalid_type_error: 'Masukkan jumlah penumpang' })
    .min(1, 'Minimal 1 penumpang')
    .max(50, 'Maksimal 50 penumpang'),
  notes: z.string().optional(),
  agreement: z.literal(true, {
    errorMap: () => ({ message: 'Anda harus menyetujui syarat & ketentuan' }),
  }),
})

const b2bSchema = z.object({
  companyName: z.string().min(2, 'Nama perusahaan wajib diisi'),
  contactPerson: z.string().min(2, 'Nama PIC wajib diisi'),
  phone: z.string().min(8, 'Nomor telepon tidak valid'),
  email: z.string().email('Format email tidak valid'),
  npwp: z.string().optional(),
  paymentTerm: z.enum(['net7', 'net14', 'net30'], {
    errorMap: () => ({ message: 'Pilih termin pembayaran' }),
  }),
  poNumber: z.string().optional(),
})

// ─── B2B Discount: 10% untuk order B2B
const B2B_DISCOUNT_RATE = 0.10

// ─── success modal ───────────────────────────────────────────────────────────

function SuccessModal({ bookingCode, onClose }) {
  const navigate = useNavigate()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-slide-up">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-dark mb-2">Pemesanan Berhasil!</h2>
        <p className="text-gray-500 mb-5 text-sm">
          Terima kasih telah memesan paket wisata bersama Amoures. Tim kami akan
          segera menghubungi Anda untuk konfirmasi pembayaran.
        </p>

        <div className="bg-primary/10 rounded-xl px-4 py-3 mb-6">
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
            Kode Pemesanan
          </p>
          <p className="font-mono text-xl font-bold text-dark tracking-wider">
            {bookingCode}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-dark font-semibold rounded-xl transition-colors text-sm"
          >
            Lihat Booking
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-2.5 border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-colors text-sm"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── main component ─────────────────────────────────────────────────────────

const SERVICE_FEE_PER_PERSON = 15000
const PAYMENT_TERM_LABELS = { net7: 'NET 7 Hari', net14: 'NET 14 Hari', net30: 'NET 30 Hari' }

export default function BookingPage() {
  const { packageId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const { tour, loading: tourLoading } = useTour(packageId)
  const { createBooking } = useBooking()
  const { user, profile } = useAuth()

  const initialPassengers = location.state?.passengerCount ?? 1
  const [successBooking, setSuccessBooking] = useState(null)
  const [orderMethod, setOrderMethod] = useState('retail') // 'retail' | 'b2b'

  // Main booking form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: { passengerCount: initialPassengers, notes: '', agreement: false },
  })

  // B2B form
  const {
    register: regB2B,
    handleSubmit: handleB2B,
    formState: { errors: b2bErrors },
    getValues: getB2BValues,
    trigger: triggerB2B,
  } = useForm({
    resolver: zodResolver(b2bSchema),
    defaultValues: { companyName: '', contactPerson: '', phone: '', email: '', npwp: '', paymentTerm: 'net14', poNumber: '' },
  })

  const passengerCount = watch('passengerCount') || 1
  const pricePerPerson = tour?.price || 0
  const subtotal = pricePerPerson * passengerCount
  const serviceFee = orderMethod === 'b2b' ? 0 : SERVICE_FEE_PER_PERSON * passengerCount
  const b2bDiscount = orderMethod === 'b2b' ? Math.round(subtotal * B2B_DISCOUNT_RATE) : 0
  const totalPrice = subtotal + serviceFee - b2bDiscount

  useEffect(() => {
    if (!user && !tourLoading) {
      toast.error('Anda harus login terlebih dahulu')
      navigate('/login', { state: { from: `/booking/${packageId}` } })
    }
  }, [user, tourLoading, navigate, packageId])

  const onSubmit = async (data) => {
    try {
      let b2bDetails = null
      if (orderMethod === 'b2b') {
        const valid = await triggerB2B()
        if (!valid) { toast.error('Lengkapi data perusahaan B2B terlebih dahulu'); return }
        b2bDetails = getB2BValues()
      }
      const booking = await createBooking({
        packageId,
        passengerCount: data.passengerCount,
        totalPrice,
        notes: data.notes || null,
        orderMethod,
        b2bDetails,
      })
      setSuccessBooking(booking)
    } catch (err) {
      toast.error(err.message || 'Gagal membuat pemesanan. Silakan coba lagi.')
    }
  }

  if (tourLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-6">
          <BookingPageSkeleton />
        </div>
        <Footer />
      </>
    )
  }

  if (!tour) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
          <AlertCircle className="w-16 h-16 text-gray-300" />
          <h2 className="text-xl font-semibold text-dark">Paket Tur Tidak Ditemukan</h2>
          <Link
            to="/tours"
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-dark font-semibold rounded-lg transition-colors"
          >
            Lihat Semua Paket
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const quota = tour.quota_available ?? tour.max_participants ?? 20
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email || ''
  const displayEmail = user?.email || ''
  const displayPhone = profile?.phone || user?.user_metadata?.phone || ''

  return (
    <>
      <Navbar />

      {successBooking && (
        <SuccessModal
          bookingCode={successBooking.booking_code}
          onClose={() => setSuccessBooking(null)}
        />
      )}

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ── Breadcrumb & Title ── */}
          <div className="mb-6">
            <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-2 flex-wrap">
              <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                Beranda
              </Link>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <Link to="/tours" className="hover:text-primary transition-colors">
                Paket Tur
              </Link>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <Link
                to={`/tours/${packageId}`}
                className="hover:text-primary transition-colors truncate max-w-[140px]"
              >
                {tour.title}
              </Link>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <span className="text-dark font-medium">Pemesanan</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-bold text-dark">
              Formulir Pemesanan
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ── LEFT: Form ── */}
              <div className="lg:col-span-2 space-y-5">

                {/* ── Order Method Toggle ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-base font-bold text-dark mb-4">Metode Pemesanan</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'retail', icon: UserCheck, label: 'Retail / Perorangan', desc: 'Pemesanan langsung untuk individu atau keluarga' },
                      { key: 'b2b', icon: Building2, label: 'B2B / Perusahaan', desc: 'Pemesanan korporat · Diskon 10% · Pembayaran via invoice' },
                    ].map(({ key, icon: Icon, label, desc }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setOrderMethod(key)}
                        className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                          orderMethod === key
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${orderMethod === key ? 'text-primary' : 'text-gray-400'}`} />
                        <p className={`text-sm font-semibold ${orderMethod === key ? 'text-dark' : 'text-gray-600'}`}>{label}</p>
                        <p className="text-xs text-gray-500 leading-snug">{desc}</p>
                      </button>
                    ))}
                  </div>
                  {orderMethod === 'b2b' && (
                    <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                      <BadgePercent className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <p className="text-xs text-amber-700 font-medium">Anda mendapatkan <span className="font-bold">diskon 10%</span> + bebas biaya layanan untuk pemesanan B2B!</p>
                    </div>
                  )}
                </div>

                {/* ── B2B Company Form (conditional) ── */}
                {orderMethod === 'b2b' && (
                  <div className="bg-white rounded-2xl shadow-sm border-2 border-primary/30 p-6">
                    <h2 className="text-base font-bold text-dark mb-4 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary" />
                      Data Perusahaan
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { field: 'companyName', label: 'Nama Perusahaan', placeholder: 'PT. Contoh Jaya', type: 'text', required: true },
                        { field: 'contactPerson', label: 'Nama PIC / Contact Person', placeholder: 'Budi Santoso', type: 'text', required: true },
                        { field: 'phone', label: 'No. Telepon Perusahaan', placeholder: '0211234567', type: 'tel', required: true },
                        { field: 'email', label: 'Email Perusahaan', placeholder: 'procurement@perusahaan.com', type: 'email', required: true },
                        { field: 'npwp', label: 'NPWP Perusahaan', placeholder: '12.345.678.9-012.000', type: 'text', required: false },
                        { field: 'poNumber', label: 'Nomor PO / Referensi', placeholder: 'PO-2025-001', type: 'text', required: false },
                      ].map(({ field, label, placeholder, type, required }) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
                          </label>
                          <input
                            type={type}
                            placeholder={placeholder}
                            {...regB2B(field)}
                            className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition ${
                              b2bErrors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200'
                            }`}
                          />
                          {b2bErrors[field] && (
                            <p className="mt-1 text-xs text-red-500">{b2bErrors[field].message}</p>
                          )}
                        </div>
                      ))}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Termin Pembayaran <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[{ val: 'net7', label: 'NET 7 Hari' }, { val: 'net14', label: 'NET 14 Hari' }, { val: 'net30', label: 'NET 30 Hari' }].map(({ val, label }) => (
                            <label key={val} className="cursor-pointer">
                              <input type="radio" value={val} {...regB2B('paymentTerm')} className="sr-only peer" />
                              <div className="border-2 rounded-xl px-3 py-2.5 text-sm font-medium text-center transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-dark border-gray-200 text-gray-500 hover:border-gray-300">
                                {label}
                              </div>
                            </label>
                          ))}
                        </div>
                        {b2bErrors.paymentTerm && (
                          <p className="mt-1 text-xs text-red-500">{b2bErrors.paymentTerm.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 1: Data Pemesan */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-base font-bold text-dark mb-4 flex items-center gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-dark text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    Data Pemesan
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        readOnly
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        value={displayEmail}
                        readOnly
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        No. Handphone
                      </label>
                      <input
                        type="tel"
                        value={displayPhone}
                        readOnly
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm cursor-not-allowed"
                      />
                      {!displayPhone && (
                        <p className="mt-1.5 text-xs text-amber-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Nomor HP belum diisi.{' '}
                          <Link to="/dashboard" className="underline">
                            Update profil
                          </Link>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Detail Pemesanan */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-base font-bold text-dark mb-4 flex items-center gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-dark text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    Detail Pemesanan
                  </h2>

                  <div className="space-y-4">
                    {/* Passenger Count */}
                    <div>
                      <label
                        htmlFor="passengerCount"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Jumlah Penumpang
                        <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <input
                        id="passengerCount"
                        type="number"
                        min={1}
                        max={quota}
                        {...register('passengerCount', { valueAsNumber: true })}
                        className={`w-full px-4 py-2.5 border rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition ${
                          errors.passengerCount
                            ? 'border-red-400 bg-red-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      />
                      {errors.passengerCount && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.passengerCount.message}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">
                        Kuota tersedia: {quota} orang
                      </p>
                    </div>

                    {/* Notes */}
                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Catatan / Permintaan Khusus
                        <span className="text-gray-400 font-normal ml-1">(opsional)</span>
                      </label>
                      <textarea
                        id="notes"
                        rows={3}
                        placeholder="Contoh: alergi makanan tertentu, kebutuhan kursi roda, dll."
                        {...register('notes')}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Konfirmasi */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-base font-bold text-dark mb-4 flex items-center gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-dark text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    Konfirmasi
                  </h2>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      {...register('agreement')}
                      className="mt-0.5 w-4 h-4 accent-primary cursor-pointer flex-shrink-0"
                    />
                    <span className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
                      Saya telah membaca dan menyetujui{' '}
                      <Link
                        to="/terms"
                        target="_blank"
                        className="text-primary font-medium hover:underline"
                      >
                        syarat & ketentuan
                      </Link>{' '}
                      pemesanan yang berlaku di Amoures Tour Operator.
                    </span>
                  </label>
                  {errors.agreement && (
                    <p className="mt-2 text-xs text-red-500 flex items-center gap-1 ml-7">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.agreement.message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-5 w-full py-3.5 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-dark font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      'Konfirmasi Pemesanan'
                    )}
                  </button>
                </div>
              </div>

              {/* ── RIGHT: Order Summary ── */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Tour thumbnail */}
                    <div className="relative h-36 bg-gray-100">
                      {tour.image_url ? (
                        <img
                          src={tour.image_url}
                          alt={tour.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-light to-primary">
                          <Image className="w-10 h-10 text-white/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white font-semibold text-sm leading-tight line-clamp-2">
                          {tour.title}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-white/80">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="text-xs">{tour.destination}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      {/* Meta */}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{formatDate(tour.departure_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{tour.duration ? `${tour.duration} Hari` : '-'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{passengerCount} Penumpang</span>
                      </div>

                      {/* Price breakdown */}
                      <div className="border-t border-gray-100 pt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">{formatPrice(pricePerPerson)} × {passengerCount}</span>
                          <span className="font-medium text-dark">{formatPrice(subtotal)}</span>
                        </div>
                        {orderMethod === 'b2b' ? (
                          <div className="flex justify-between text-sm">
                            <span className="text-green-600 flex items-center gap-1"><BadgePercent className="w-3.5 h-3.5" /> Diskon B2B 10%</span>
                            <span className="font-medium text-green-600">- {formatPrice(b2bDiscount)}</span>
                          </div>
                        ) : (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Biaya layanan × {passengerCount}</span>
                            <span className="font-medium text-dark">{formatPrice(serviceFee)}</span>
                          </div>
                        )}
                      </div>

                      {/* Total highlighted */}
                      <div className="bg-primary rounded-xl px-4 py-3 flex items-center justify-between">
                        <span className="font-semibold text-dark text-sm">Total</span>
                        <span className="font-extrabold text-dark text-lg">{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment methods */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Metode Pembayaran</p>
                    {orderMethod === 'b2b' ? (
                      <div className="space-y-2">
                        {['Invoice NET 7/14/30 Hari', 'Transfer Bank (Bukti PO)', 'Virtual Account Perusahaan'].map((m) => (
                          <div key={m} className="flex items-center gap-2 border border-primary/20 bg-primary/5 rounded-lg px-3 py-2">
                            <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-xs font-medium text-dark">{m}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {['Transfer Bank', 'Virtual Account', 'QRIS', 'E-Wallet'].map((method) => (
                          <div key={method} className="border border-gray-100 rounded-lg px-3 py-2 text-xs text-center text-gray-600 bg-gray-50">{method}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  )
}
