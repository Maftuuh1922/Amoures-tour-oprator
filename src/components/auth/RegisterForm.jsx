import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  User,
  Phone,
  Mail,
  Lock,
  CheckCircle2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

// ─── Validation Schema ────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(3, 'Nama lengkap minimal 3 karakter')
      .max(100, 'Nama terlalu panjang'),
    phone: z
      .string()
      .min(10, 'Nomor HP minimal 10 digit')
      .max(15, 'Nomor HP terlalu panjang')
      .regex(/^[0-9]+$/, 'Nomor HP hanya boleh berisi angka'),
    email: z
      .string()
      .min(1, 'Email wajib diisi')
      .email('Format email tidak valid'),
    password: z
      .string()
      .min(8, 'Password minimal 8 karakter'),
    confirmPassword: z
      .string()
      .min(1, 'Konfirmasi password wajib diisi'),
    terms: z.boolean().refine((val) => val === true, {
      message: 'Anda harus menyetujui Syarat & Ketentuan',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password dan konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  })

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FieldError({ message }) {
  if (!message) return null
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-500">
      <AlertCircle size={13} className="flex-shrink-0" />
      {message}
    </p>
  )
}

function InputField({
  id,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  registration,
  error,
  disabled,
  Icon,
  rightSlot,
}) {
  const hasError = Boolean(error)
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={17} />
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          {...registration}
          className={[
            'w-full py-3 border rounded-xl bg-gray-50 text-[#1A1A1A] placeholder-gray-400',
            'focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent',
            'transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed',
            Icon ? 'pl-10' : 'pl-4',
            rightSlot ? 'pr-12' : 'pr-4',
            hasError
              ? 'border-red-400 bg-red-50 focus:ring-red-300'
              : 'border-gray-200 focus:ring-primary',
          ].join(' ')}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
      <FieldError message={error?.message} />
    </div>
  )
}

function PasswordToggle({ show, onToggle, disabled }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
      className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
    >
      {show ? <EyeOff size={17} /> : <Eye size={17} />}
    </button>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register: registerUser, resendEmail } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { terms: false },
  })

  const onSubmit = async (data) => {
    try {
      await registerUser({
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        password: data.password,
      })
      toast.success('Registrasi berhasil! Silakan cek email untuk verifikasi.')
      navigate('/login')
    } catch (error) {
      const msg = error?.message?.toLowerCase() || '';
      if (msg.includes('already registered')) {
        try {
          await resendEmail(data.email);
          toast.success('Email sudah terdaftar tapi belum diverifikasi. Kami telah mengirim ulang link verifikasi ke email Anda!');
          navigate('/login');
        } catch (resendErr) {
          toast.error('Akun sudah terdaftar. Gagal mengirim ulang verifikasi: ' + resendErr.message);
        }
      } else {
        toast.error(error?.message || 'Registrasi gagal. Silakan coba lagi.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

      {/* ── Nama Lengkap ── */}
      <InputField
        id="reg-full-name"
        label="Nama Lengkap"
        placeholder="Nama lengkap Anda"
        autoComplete="name"
        registration={register('full_name')}
        error={errors.full_name}
        disabled={isSubmitting}
        Icon={User}
      />

      {/* ── Nomor HP ── */}
      <InputField
        id="reg-phone"
        label="Nomor HP"
        type="tel"
        placeholder="08xxxxxxxxxx"
        autoComplete="tel"
        registration={register('phone')}
        error={errors.phone}
        disabled={isSubmitting}
        Icon={Phone}
      />

      {/* ── Email ── */}
      <InputField
        id="reg-email"
        label="Email"
        type="email"
        placeholder="nama@email.com"
        autoComplete="email"
        registration={register('email')}
        error={errors.email}
        disabled={isSubmitting}
        Icon={Mail}
      />

      {/* ── Password ── */}
      <InputField
        id="reg-password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Minimal 8 karakter"
        autoComplete="new-password"
        registration={register('password')}
        error={errors.password}
        disabled={isSubmitting}
        Icon={Lock}
        rightSlot={
          <PasswordToggle
            show={showPassword}
            onToggle={() => setShowPassword((p) => !p)}
            disabled={isSubmitting}
          />
        }
      />

      {/* ── Konfirmasi Password ── */}
      <InputField
        id="reg-confirm-password"
        label="Konfirmasi Password"
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="Ulangi password Anda"
        autoComplete="new-password"
        registration={register('confirmPassword')}
        error={errors.confirmPassword}
        disabled={isSubmitting}
        Icon={Lock}
        rightSlot={
          <PasswordToggle
            show={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((p) => !p)}
            disabled={isSubmitting}
          />
        }
      />

      {/* ── Terms & Conditions ── */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group select-none">
          <input
            type="checkbox"
            {...register('terms')}
            disabled={isSubmitting}
            className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-gray-300 text-primary
              focus:ring-primary focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <span className="text-sm text-gray-600 leading-relaxed">
            Saya setuju dengan{' '}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Syarat & Ketentuan
            </a>{' '}
            dan{' '}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Kebijakan Privasi
            </a>
          </span>
        </label>
        <FieldError message={errors.terms?.message} />
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 px-6 bg-primary hover:bg-primary-hover text-dark font-semibold rounded-xl
          shadow-md transition-all duration-200 flex items-center justify-center gap-2
          shadow-md hover:shadow-lg active:scale-[0.98]
          disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 mt-1"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Mendaftar...
          </>
        ) : (
          <>
            <CheckCircle2 size={20} />
            Daftar Sekarang
          </>
        )}
      </button>
    </form>
  )
}
