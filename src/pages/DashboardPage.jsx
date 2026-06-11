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
} from 'lucide-react'
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

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ profile, bookings, bookingsLoading }) {
  const displayName =
    profile?.full_name || 'Pengguna'

  const total = bookings.length
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length
  const pending = bookings.filter((b) => b.status === 'pending').length
  const totalSpent = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.total_price || 0), 0)

  const recent = bookings.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-bold text-dark">
          Halo, {displayName}! 👋
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Selamat datang di dashboard Anda.
        </p>
      </div>

      {/* Stats */}
      {bookingsLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Booking"
            value={total}
            icon={Package}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            label="Booking Aktif"
            value={confirmed}
            icon={Ticket}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            label="Menunggu Konfirmasi"
            value={pending}
            icon={Clock}
            color="bg-yellow-100 text-yellow-700"
          />
          <StatCard
            label="Total Pembayaran"
            value={formatPrice(totalSpent)}
            icon={TrendingUp}
            color="bg-primary/20 text-accent"
          />
        </div>
      )}

      {/* Recent bookings */}
      <div>
        <h3 className="text-base font-bold text-dark mb-3">Pemesanan Terbaru</h3>
        {bookingsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : recent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="pb-2 pr-4 font-medium">Kode</th>
                  <th className="pb-2 pr-4 font-medium">Paket</th>
                  <th className="pb-2 pr-4 font-medium hidden sm:table-cell">Tanggal</th>
                  <th className="pb-2 pr-4 font-medium hidden md:table-cell">Total</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="py-3 pr-4">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {b.booking_code}
                      </span>
                    </td>
                    <td className="py-3 pr-4 max-w-[140px]">
                      <p className="truncate font-medium text-dark">
                        {b.tour_packages?.title || '-'}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-gray-500 hidden sm:table-cell whitespace-nowrap">
                      {formatDate(b.tour_packages?.departure_date)}
                    </td>
                    <td className="py-3 pr-4 text-gray-700 hidden md:table-cell whitespace-nowrap">
                      {formatPrice(b.total_price)}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Belum ada pemesanan.</p>
        )}
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

// ─── main component ───────────────────────────────────────────────────────────

const TABS = [
  { key: 'overview', label: 'Beranda', icon: LayoutGrid },
  { key: 'bookings', label: 'Pemesanan Saya', icon: Ticket },
  { key: 'profile', label: 'Profil', icon: User },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()
  const { bookings, loading: bookingsLoading, refetch } = useUserBookings()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (profile?.role === 'admin') {
      navigate('/admin')
    }
  }, [profile, navigate])

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
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* ── Breadcrumb ── */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 flex-wrap">
            <Link to="/" className="hover:text-primary transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <span className="text-dark font-medium">Dashboard</span>
          </nav>

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
            <button
              onClick={handleSignOut}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className="hidden xs:inline">Keluar</span>
            </button>
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
                {activeTab === 'overview' && (
                  <OverviewTab
                    profile={profile}
                    bookings={bookings}
                    bookingsLoading={bookingsLoading}
                  />
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

      <Footer />
    </>
  )
}
