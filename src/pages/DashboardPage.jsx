import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import {
  LayoutGrid,
  Ticket,
  User,
  LogOut,
  Calendar,
  Users,
  Clock,
  MapPin,
  TrendingUp,
  Package,
  Loader2,
  AlertCircle,
  Image,
  X,
  ChevronRight,
  Edit3,
  Save,
  Key,
  FileText,
} from 'lucide-react'
import {
  PriceTagIcon, InvoiceIcon, BriefcaseIcon, SupportIcon,
  ShoppingBagIcon, PackageBoxIcon, ShieldCheckIcon, ArrowRightIcon,
  KeyIcon as CustomKeyIcon, HandshakeIcon,
} from '../components/ui/Icons'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAuth } from '../hooks/useAuth'
import { useUserBookings, useBooking } from '../hooks/useBooking'
import useAuthStore from '../store/authStore'

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatPrice(price) {
  if (!price && price !== 0) return '-'
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
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}

// ─── status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  const labels = {
    pending: 'Menunggu',
    confirmed: 'Dikonfirmasi',
    cancelled: 'Dibatalkan',
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        map[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {labels[status] || status}
    </span>
  )
}

// ─── skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
}

// ─── stat card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-dark">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

// ─── cancel confirm dialog ────────────────────────────────────────────────────

function CancelDialog({ bookingCode, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-dark mb-2">Batalkan Pemesanan?</h3>
        <p className="text-sm text-gray-500 mb-1">
          Kode booking:{' '}
          <span className="font-mono font-semibold text-dark">{bookingCode}</span>
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Ya, Batalkan
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── booking card ─────────────────────────────────────────────────────────────

function BookingCard({ booking, onCancel }) {
  const tour = booking.tour_packages || {}
  const isB2B = booking.order_method === 'b2b'
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-0">
        {/* Image */}
        <div className="relative w-full sm:w-28 h-32 sm:h-auto flex-shrink-0 bg-gray-100">
          {tour.image_url ? (
            <img src={tour.image_url} alt={tour.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-light to-primary">
              <Image className="w-8 h-8 text-white/50" />
            </div>
          )}
        </div>
        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="min-w-0">
              <p className="font-semibold text-dark text-sm truncate">{tour.title || 'Paket Tur'}</p>
              {tour.destination && (
                <div className="flex items-center gap-1 mt-0.5 text-gray-400 text-xs">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span>{tour.destination}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isB2B && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  🏢 B2B
                </span>
              )}
              <StatusBadge status={booking.status} />
            </div>
          </div>
          {isB2B && booking.b2b_details && (
            <p className="mt-1 text-xs text-blue-600">{booking.b2b_details.companyName} · {booking.b2b_details.contactPerson}</p>
          )}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <span className="font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px]">{booking.booking_code}</span>
            </div>
            {tour.departure_date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>{formatDate(tour.departure_date)}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span>{booking.passenger_count} orang</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
            <span className="font-bold text-dark text-sm">{formatPrice(booking.total_price)}</span>
            {booking.status === 'pending' && (
              <button onClick={() => onCancel(booking)} className="text-xs text-red-500 hover:text-red-700 font-medium border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors">Batalkan</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Legal Documents Tab ────────────────────────────────────────────────────────

function LegalDocumentsTab({ profile }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-dark flex items-center gap-2">
          <ShieldCheckIcon className="text-primary w-6 h-6" />
          Dokumen Legalitas
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Kelola berkas legalitas perusahaan Anda untuk kemitraan B2B.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        {[
          { label: "NIB (Nomor Induk Berusaha)", status: "Terverifikasi", statusCls: "bg-green-100 text-green-700" },
          { label: "NPWP Perusahaan", status: "Terverifikasi", statusCls: "bg-green-100 text-green-700" },
          { label: "KTP Direktur / Penanggung Jawab", status: "Terverifikasi", statusCls: "bg-green-100 text-green-700" },
        ].map((doc, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-dark text-sm">{doc.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">Format: PDF/JPG • Diunggah 14 Jan 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${doc.statusCls}`}>
                {doc.status}
              </span>
              <button className="text-primary hover:text-primary-hover text-sm font-semibold hover:underline">
                Perbarui
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
        <p className="text-sm text-blue-800 leading-relaxed">
          Dokumen legalitas Anda telah diverifikasi oleh tim Amoures. Anda dapat melakukan pemesanan paket B2B dan menikmati berbagai kemudahan fasilitas Tempo/Invoice.
        </p>
      </div>
    </div>
  )
}


// ─── Bookings Tab ─────────────────────────────────────────────────────────────

function BookingsTab({ bookings, bookingsLoading, onRefetch }) {
  const { cancelBooking } = useBooking()
  const [filter, setFilter] = useState('all')
  const [cancelTarget, setCancelTarget] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  const filters = [
    { key: 'all', label: 'Semua' },
    { key: 'pending', label: 'Menunggu' },
    { key: 'confirmed', label: 'Dikonfirmasi' },
    { key: 'cancelled', label: 'Dibatalkan' },
  ]

  const filtered =
    filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)

  const handleCancel = async () => {
    if (!cancelTarget) return
    setCancelling(true)
    try {
      await cancelBooking(cancelTarget.id)
      toast.success('Pemesanan berhasil dibatalkan')
      onRefetch()
      setCancelTarget(null)
    } catch (err) {
      toast.error(err.message || 'Gagal membatalkan pemesanan')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="space-y-5">
      {cancelTarget && (
        <CancelDialog
          bookingCode={cancelTarget.booking_code}
          onConfirm={handleCancel}
          onClose={() => setCancelTarget(null)}
          loading={cancelling}
        />
      )}

      <h2 className="text-xl font-bold text-dark">Pemesanan Saya</h2>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f.key
                ? 'bg-primary text-dark shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
            <span className="ml-1.5 text-xs opacity-60">
              (
              {f.key === 'all'
                ? bookings.length
                : bookings.filter((b) => b.status === f.key).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {bookingsLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              onCancel={setCancelTarget}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Ticket className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-base font-semibold text-dark mb-1">
            Belum Ada Pemesanan
          </h3>
          <p className="text-sm text-gray-400 mb-5 max-w-xs">
            Anda belum memiliki pemesanan paket wisata. Yuk, mulai rencanakan
            perjalanan Anda!
          </p>
          <Link
            to="/tours"
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-dark font-semibold rounded-xl transition-colors text-sm"
          >
            Lihat Paket Wisata
          </Link>
        </div>
      )}
    </div>
  )
}

// ─── Profile Tab ─────────────────────────────────────────────────────────────

const profileSchema = z.object({
  full_name: z.string().min(2, 'Nama minimal 2 karakter'),
  phone: z.string().optional(),
  avatar_url: z.string().url('URL tidak valid').optional().or(z.literal('')),
})

const passwordSchema = z
  .object({
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  })

function ProfileTab({ profile, user }) {
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || user?.user_metadata?.full_name || '',
      phone: profile?.phone || user?.user_metadata?.phone || '',
      avatar_url: profile?.avatar_url || '',
    },
  })

  const {
    register: regPass,
    handleSubmit: handlePass,
    reset: resetPass,
    formState: { errors: passErrors },
  } = useForm({ resolver: zodResolver(passwordSchema) })

  const onSaveProfile = async (data) => {
    setSavingProfile(true)
    try {
      // Update dummy store profile
      useAuthStore.setState((s) => ({
        profile: { ...s.profile, full_name: data.full_name, phone: data.phone || null },
        user: { ...s.user, full_name: data.full_name },
      }))
      const saved = JSON.parse(localStorage.getItem('dummy_auth_user') || '{}')
      localStorage.setItem('dummy_auth_user', JSON.stringify({ ...saved, full_name: data.full_name, phone: data.phone || null }))
      toast.success('Profil berhasil diperbarui')
    } catch (err) {
      toast.error(err.message || 'Gagal memperbarui profil')
    } finally {
      setSavingProfile(false)
    }
  }

  const onChangePassword = async (data) => {
    setSavingPassword(true)
    await new Promise((r) => setTimeout(r, 600))
    toast.success('Password berhasil diubah (dummy mode)')
    resetPass()
    setSavingPassword(false)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-dark">Profil Saya</h2>

      {/* Edit profile */}
      <form
        onSubmit={handleProfile(onSaveProfile)}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4"
      >
        <h3 className="text-base font-semibold text-dark flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-primary" />
          Edit Profil
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...regProfile('full_name')}
            className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition ${
              profileErrors.full_name ? 'border-red-400 bg-red-50' : 'border-gray-200'
            }`}
          />
          {profileErrors.full_name && (
            <p className="mt-1 text-xs text-red-500">{profileErrors.full_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            readOnly
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-sm cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            No. Handphone
          </label>
          <input
            type="tel"
            {...regProfile('phone')}
            placeholder="08xxxxxxxxxx"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            URL Foto Profil
            <span className="text-gray-400 font-normal ml-1">(opsional)</span>
          </label>
          <input
            type="url"
            {...regProfile('avatar_url')}
            placeholder="https://example.com/photo.jpg"
            className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition ${
              profileErrors.avatar_url ? 'border-red-400 bg-red-50' : 'border-gray-200'
            }`}
          />
          {profileErrors.avatar_url && (
            <p className="mt-1 text-xs text-red-500">{profileErrors.avatar_url.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={savingProfile}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-dark font-semibold rounded-xl transition-colors text-sm disabled:opacity-60"
        >
          {savingProfile ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Simpan Perubahan
        </button>
      </form>

      {/* Change password */}
      <form
        onSubmit={handlePass(onChangePassword)}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4"
      >
        <h3 className="text-base font-semibold text-dark flex items-center gap-2">
          <Key className="w-4 h-4 text-primary" />
          Ganti Password
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Password Baru <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            {...regPass('password')}
            placeholder="Minimal 8 karakter"
            className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition ${
              passErrors.password ? 'border-red-400 bg-red-50' : 'border-gray-200'
            }`}
          />
          {passErrors.password && (
            <p className="mt-1 text-xs text-red-500">{passErrors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Konfirmasi Password Baru <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            {...regPass('confirmPassword')}
            placeholder="Ulangi password baru"
            className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition ${
              passErrors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-200'
            }`}
          />
          {passErrors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {passErrors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={savingPassword}
          className="flex items-center gap-2 px-6 py-2.5 bg-dark hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors text-sm disabled:opacity-60"
        >
          {savingPassword ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Key className="w-4 h-4" />
          )}
          Ubah Password
        </button>
      </form>
    </div>
  )
}

// ─── B2B Agent Tab ────────────────────────────────────────────────────────────

function B2BAgentTab({ profile, bookings, bookingsLoading }) {
  const b2bBookings = bookings.filter((b) => b.order_method === 'b2b')
  const totalSpent = b2bBookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((s, b) => s + (b.total_price || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark to-gray-800 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">Mitra B2B Aktif</p>
            <h2 className="text-2xl font-black">{profile?.company_name || 'Perusahaan Anda'}</h2>
            <p className="text-gray-400 mt-1 text-sm">{profile?.business_type} · {profile?.pic_position}</p>
          </div>
          <span className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold">
            ✓ Terverifikasi
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {[
            { label: 'Total Order B2B', value: b2bBookings.length },
            { label: 'Order Aktif', value: b2bBookings.filter((b) => b.status === 'confirmed').length },
            { label: 'Total Pembayaran', value: formatPrice(totalSpent) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xl font-black text-amber-400">{value}</p>
              <p className="text-gray-400 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            Icon: PriceTagIcon,
            title: 'Diskon 10%',
            desc: 'Setiap pemesanan B2B',
            color: 'bg-amber-50 text-amber-600',
            border: 'border-amber-100',
          },
          {
            Icon: InvoiceIcon,
            title: 'Invoice NET',
            desc: '7 / 14 / 30 hari',
            color: 'bg-blue-50 text-blue-600',
            border: 'border-blue-100',
          },
          {
            Icon: BriefcaseIcon,
            title: 'Account Manager',
            desc: 'Dedikasi 24/7',
            color: 'bg-purple-50 text-purple-600',
            border: 'border-purple-100',
          },
          {
            Icon: SupportIcon,
            title: 'Priority Support',
            desc: 'Respons < 1 jam',
            color: 'bg-green-50 text-green-600',
            border: 'border-green-100',
          },
        ].map(({ Icon, title, desc, color, border }) => (
          <div
            key={title}
            className={`bg-white rounded-xl border ${border} shadow-sm p-4 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow group`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
              <Icon size={20} />
            </div>
            <p className="font-bold text-dark text-sm leading-tight">{title}</p>
            <p className="text-gray-400 text-xs">{desc}</p>
          </div>
        ))}
      </div>

      {/* Quick Order */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-dark mb-4 flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <ShoppingBagIcon size={18} />
          </span>
          Pesan Paket B2B
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Sebagai mitra B2B, Anda mendapatkan <strong className="text-dark">diskon 10%</strong> dan
          pembayaran via invoice untuk setiap pemesanan.
        </p>
        <Link
          to="/tours"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-dark font-bold rounded-xl transition-all text-sm shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
        >
          Lihat Paket Wisata
          <ArrowRightIcon size={16} />
        </Link>
      </div>

      {/* B2B Bookings */}
      <div>
        <h3 className="font-bold text-dark mb-3">Riwayat Order B2B</h3>
        {bookingsLoading ? (
          <Skeleton className="h-20" />
        ) : b2bBookings.length > 0 ? (
          <div className="space-y-3">
            {b2bBookings.map((b) => (
              <div key={b.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded inline-block mb-1">{b.booking_code}</p>
                  <p className="text-sm font-semibold text-dark">{b.tour_packages?.title || 'Paket Tur'}</p>
                  {b.b2b_details && (
                    <p className="text-xs text-gray-400 mt-0.5">{b.b2b_details.companyName} · {b.b2b_details.paymentTerm?.toUpperCase()}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-dark text-sm">{formatPrice(b.total_price)}</p>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-gray-100 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <PackageBoxIcon size={32} className="text-gray-300" />
            </div>
            <div className="text-center">
              <p className="text-gray-700 font-semibold text-sm">Belum ada order B2B</p>
              <p className="text-gray-400 text-xs mt-1">Mulai buat pemesanan pertama Anda</p>
            </div>
            <Link
              to="/tours"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-dark text-sm font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              Mulai Pesan <ArrowRightIcon size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

const TABS = [
  { key: 'b2b', label: 'Dashboard Mitra', icon: LayoutGrid },
  { key: 'bookings', label: 'Semua Pemesanan', icon: Ticket },
  { key: 'legal', label: 'Legalitas', icon: PackageBoxIcon },
  { key: 'profile', label: 'Profil', icon: User },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()
  const { bookings, loading: bookingsLoading, refetch } = useUserBookings()
  const [activeTab, setActiveTab] = useState('b2b')

  const isAgent = true // Selalu B2B di sistem ini

  useEffect(() => {
    const isAdmin = profile?.role?.toLowerCase() === 'admin' || user?.email === 'admin@moures.com';
    if (isAdmin) {
      navigate('/admin')
    }
  }, [profile, user, navigate])

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email || 'Pengguna'
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Dashboard Top Bar ── */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo + back to site */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <img src="/logo.png" alt="Amoures" className="h-9 w-auto object-contain group-hover:scale-105 transition-transform" />
            </Link>
            <span className="hidden sm:block text-gray-200 text-lg font-light">|</span>
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors font-medium"
            >
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              Kembali ke Situs
            </Link>
          </div>

          {/* Page title */}
          <div className="flex-1 text-center hidden md:block">
            <span className="text-sm font-semibold text-gray-500 tracking-wide uppercase">
              Portal B2B Mitra
            </span>
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-3">
            {isAgent && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[11px] font-bold border border-green-200">
                <HandshakeIcon size={11} />
                Travel Agent
              </span>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-dark font-bold text-sm flex-shrink-0">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-dark leading-tight">{displayName}</p>
                <p className="text-[11px] text-gray-400 truncate max-w-[140px]">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 border border-red-100 hover:border-red-200 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* ── Mobile Tab Nav ── */}
          <div className="flex gap-1 bg-white border border-gray-100 shadow-sm rounded-2xl p-1.5 mb-6 lg:hidden overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === tab.key
                      ? 'bg-primary text-dark shadow-sm'
                      : 'text-gray-500 hover:text-dark hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden xs:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* ── SIDEBAR ── */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
                {/* User info */}
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 px-6 py-8 text-center border-b border-gray-100">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={displayName}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-3 ring-4 ring-white shadow"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-3 ring-4 ring-white shadow text-dark text-2xl font-bold">
                      {initials}
                    </div>
                  )}
                  <p className="font-bold text-dark text-base">{displayName}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{user?.email}</p>
                  {isAgent && (
                    <span className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold border border-green-200">
                      <HandshakeIcon size={10} />
                      Travel Agent
                    </span>
                  )}
                </div>

                {/* Nav items */}
                <nav className="p-3 space-y-1">
                  {TABS.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                          activeTab === tab.key
                            ? 'bg-primary text-dark'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-dark'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {tab.label}
                      </button>
                    )
                  })}

                  <div className="pt-2 border-t border-gray-100 mt-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 flex-shrink-0" />
                      Keluar
                    </button>
                  </div>
                </nav>
              </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <main className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                {activeTab === 'b2b' && (
                  <B2BAgentTab
                    profile={profile}
                    bookings={bookings}
                    bookingsLoading={bookingsLoading}
                  />
                )}
                {activeTab === 'legal' && (
                  <LegalDocumentsTab profile={profile} />
                )}
                {activeTab === 'bookings' && (
                  <BookingsTab
                    bookings={bookings}
                    bookingsLoading={bookingsLoading}
                    onRefetch={refetch}
                  />
                )}
                {activeTab === 'profile' && (
                  <ProfileTab profile={profile} user={user} />
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
