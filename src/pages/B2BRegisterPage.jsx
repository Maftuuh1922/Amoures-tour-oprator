import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  CheckCircle2,
  FileText,
  ArrowLeft,
  ChevronRight,
  Plane,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

/* ──────────────────────────── Zod schema ──────────────────────────── */

const b2bSchema = z.object({
  company_name: z.string().min(3, 'Nama perusahaan minimal 3 karakter'),
  business_type: z.enum(
    ['Travel Agent', 'Perusahaan', 'Event Organizer', 'Sekolah/Universitas', 'Lainnya'],
    { errorMap: () => ({ message: 'Pilih jenis bisnis' }) }
  ),
  npwp: z.string().optional(),
  address: z.string().min(10, 'Alamat minimal 10 karakter'),
  city: z.string().min(2, 'Isi nama kota'),
  province: z.string().min(2, 'Pilih provinsi'),
  pic_name: z.string().min(3, 'Nama PIC minimal 3 karakter'),
  pic_position: z.string().min(2, 'Jabatan minimal 2 karakter'),
  pic_email: z.string().email('Format email tidak valid'),
  pic_phone: z
    .string()
    .min(10, 'Nomor telepon minimal 10 digit')
    .regex(/^[0-9+\-\s]+$/, 'Hanya boleh angka, +, -, atau spasi'),
  monthly_travelers: z.enum(['< 50', '50-100', '100-500', '> 500'], {
    errorMap: () => ({ message: 'Pilih perkiraan jumlah traveler' }),
  }),
  destinations: z
    .array(z.string())
    .min(1, 'Pilih minimal 1 destinasi'),
  notes: z.string().optional(),
  agreed: z.literal(true, {
    errorMap: () => ({ message: 'Wajib menyetujui syarat & ketentuan' }),
  }),
})

/* ──────────────────────────── constants ───────────────────────────── */

const PROVINCES = [
  'Aceh', 'Bali', 'Banten', 'Bengkulu', 'DI Yogyakarta',
  'DKI Jakarta', 'Gorontalo', 'Jambi', 'Jawa Barat',
  'Jawa Tengah', 'Jawa Timur', 'Kalimantan Barat',
]

const BUSINESS_TYPES = [
  'Travel Agent',
  'Perusahaan',
  'Event Organizer',
  'Sekolah/Universitas',
  'Lainnya',
]

const TRAVELER_OPTIONS = [
  { value: '< 50', label: '< 50 orang', desc: 'Tim kecil atau startup' },
  { value: '50-100', label: '50 – 100 orang', desc: 'Perusahaan menengah' },
  { value: '100-500', label: '100 – 500 orang', desc: 'Korporat besar' },
  { value: '> 500', label: '> 500 orang', desc: 'Enterprise / MICE besar' },
]

const DESTINATION_OPTIONS = [
  { value: 'Domestik', label: 'Domestik', desc: 'Seluruh destinasi Indonesia' },
  { value: 'Internasional', label: 'Internasional', desc: 'Asia, Eropa, Amerika, dll.' },
  { value: 'Umroh & Haji', label: 'Umroh & Haji', desc: 'Paket ibadah ke Tanah Suci' },
  { value: 'MICE/Event', label: 'MICE / Event', desc: 'Meetings, Incentives, Conferences' },
]

const STEPS_META = [
  { label: 'Data Perusahaan', icon: Building2 },
  { label: 'Data PIC', icon: User },
  { label: 'Kebutuhan', icon: Briefcase },
]

const LEFT_BENEFITS = [
  'Harga Mitra Eksklusif hingga 25% off',
  'Account Manager Dedikasi',
  'Invoice Terkonsolidasi Bulanan',
  'Akses Portal B2B 24/7',
  'Support Prioritas < 1 Jam',
]

/* ──────────────────────────── helpers ─────────────────────────────── */

// Fields that belong to each step (for partial validation)
const STEP_FIELDS = {
  1: ['company_name', 'business_type', 'npwp', 'address', 'city', 'province'],
  2: ['pic_name', 'pic_position', 'pic_email', 'pic_phone'],
  3: ['monthly_travelers', 'destinations', 'notes', 'agreed'],
}

/* ──────────────────────────── sub-components ──────────────────────── */

function FieldError({ message }) {
  if (!message) return null
  return (
    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
      <span className="w-3.5 h-3.5 rounded-full border border-red-400 flex items-center justify-center text-[10px] font-black flex-shrink-0">!</span>
      {message}
    </p>
  )
}

function Label({ children, required }) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {children}
      {required && <span className="text-primary ml-0.5">*</span>}
    </label>
  )
}

const inputCls =
  'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-dark bg-white placeholder-gray-400'

const selectCls =
  'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-dark bg-white appearance-none'

/* ──────────────────────────── page ────────────────────────────────── */

export default function B2BRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(b2bSchema),
    defaultValues: {
      destinations: [],
      agreed: undefined,
    },
  })

  const watchedDestinations = watch('destinations') || []
  const watchedTravelers = watch('monthly_travelers')

  /* ── navigation ── */
  const goNext = async () => {
    const fields = STEP_FIELDS[currentStep]
    const valid = await trigger(fields)
    if (valid) setCurrentStep((s) => s + 1)
  }

  const goBack = () => setCurrentStep((s) => s - 1)

  /* ── destination checkbox toggle ── */
  const toggleDestination = (val) => {
    const current = getValues('destinations') || []
    if (current.includes(val)) {
      setValue('destinations', current.filter((d) => d !== val), { shouldValidate: true })
    } else {
      setValue('destinations', [...current, val], { shouldValidate: true })
    }
  }

  /* ── final submit ── */
  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800)) // simulate API
    toast.success(
      'Permohonan kemitraan berhasil dikirim! Tim kami akan menghubungi dalam 1x24 jam.'
    )
    navigate('/b2b')
  }

  /* ──────────────── render ──────────────── */
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 pt-20 min-h-screen">
        {/* ── Left panel (desktop only) ── */}
        <aside className="hidden lg:flex flex-col lg:w-2/5 bg-[#1A1A1A] sticky top-0 h-screen overflow-y-auto p-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Plane className="w-5 h-5 text-dark" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-white font-black text-lg leading-tight">Amoures</p>
              <p className="text-primary text-xs font-semibold tracking-wider uppercase">
                Daftar Mitra B2B
              </p>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-black text-white mb-2 leading-tight">
              Bergabunglah dengan
              <br />
              <span className="text-primary">500+ Mitra Bisnis</span>
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Nikmati kemudahan pengelolaan perjalanan korporat dengan platform
              B2B terpercaya kami.
            </p>

            {/* Benefits */}
            <ul className="space-y-4 mb-10">
              {LEFT_BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{b}</span>
                </li>
              ))}
            </ul>

            {/* Testimonial */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-primary fill-primary" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">
                "Sejak bergabung sebagai mitra B2B Amoures, pengelolaan perjalanan
                bisnis kami jadi jauh lebih efisien. Invoice otomatis dan harga
                eksklusif sangat membantu."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-black text-sm">BT</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">Budi Santoso</p>
                  <p className="text-gray-400 text-xs">Travel Manager, PT Bangun Terus</p>
                </div>
              </div>
            </div>
          </div>

          {/* Already a partner */}
          <p className="text-gray-500 text-sm mt-8">
            Sudah menjadi mitra?{' '}
            <a href="mailto:b2b@amourestour.com" className="text-primary hover:underline font-semibold">
              Hubungi tim kami
            </a>
          </p>
        </aside>

        {/* ── Right panel (form) ── */}
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-12">
            {/* Back link */}
            <Link
              to="/b2b"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke halaman B2B
            </Link>

            {/* Step indicator */}
            <div className="flex items-center mb-10">
              {STEPS_META.map((step, idx) => {
                const num = idx + 1
                const isCompleted = currentStep > num
                const isActive = currentStep === num
                return (
                  <div key={step.label} className="flex items-center flex-1 last:flex-none">
                    {/* Circle */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 ${
                          isCompleted
                            ? 'bg-primary text-dark shadow-md shadow-primary/30'
                            : isActive
                            ? 'bg-primary text-dark shadow-md shadow-primary/30'
                            : 'bg-white border-2 border-gray-200 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <span>{num}</span>
                        )}
                      </div>
                      <span
                        className={`text-xs mt-1.5 font-medium whitespace-nowrap ${
                          isActive ? 'text-primary' : isCompleted ? 'text-primary' : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {/* Connector line */}
                    {idx < STEPS_META.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-3 mb-5 transition-all duration-500 ${
                          currentStep > num ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* ────── STEP 1: Data Perusahaan ────── */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-black text-dark mb-1">Data Perusahaan</h2>
                    <p className="text-gray-500 text-sm">Informasi umum tentang perusahaan Anda</p>
                  </div>

                  <div>
                    <Label required>Nama Perusahaan</Label>
                    <input
                      {...register('company_name')}
                      placeholder="PT / CV / Yayasan ..."
                      className={inputCls}
                    />
                    <FieldError message={errors.company_name?.message} />
                  </div>

                  <div>
                    <Label required>Jenis Bisnis</Label>
                    <div className="relative">
                      <select {...register('business_type')} className={selectCls}>
                        <option value="">-- Pilih Jenis Bisnis --</option>
                        {BUSINESS_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                    </div>
                    <FieldError message={errors.business_type?.message} />
                  </div>

                  <div>
                    <Label>NPWP Perusahaan <span className="text-gray-400 font-normal">(opsional)</span></Label>
                    <input
                      {...register('npwp')}
                      placeholder="00.000.000.0-000.000"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <Label required>Alamat Lengkap</Label>
                    <textarea
                      {...register('address')}
                      rows={3}
                      placeholder="Jl. Nama Jalan No. XX, Kelurahan, Kecamatan"
                      className={`${inputCls} resize-none`}
                    />
                    <FieldError message={errors.address?.message} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label required>Kota</Label>
                      <input
                        {...register('city')}
                        placeholder="Bandung"
                        className={inputCls}
                      />
                      <FieldError message={errors.city?.message} />
                    </div>
                    <div>
                      <Label required>Provinsi</Label>
                      <div className="relative">
                        <select {...register('province')} className={selectCls}>
                          <option value="">-- Pilih Provinsi --</option>
                          {PROVINCES.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                      </div>
                      <FieldError message={errors.province?.message} />
                    </div>
                  </div>
                </div>
              )}

              {/* ────── STEP 2: Data PIC ────── */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-black text-dark mb-1">Data PIC</h2>
                    <p className="text-gray-500 text-sm">
                      Person In Charge yang bertanggung jawab atas akun mitra
                    </p>
                  </div>

                  <div>
                    <Label required>Nama Lengkap PIC</Label>
                    <input
                      {...register('pic_name')}
                      placeholder="Nama sesuai KTP"
                      className={inputCls}
                    />
                    <FieldError message={errors.pic_name?.message} />
                  </div>

                  <div>
                    <Label required>Jabatan / Posisi</Label>
                    <input
                      {...register('pic_position')}
                      placeholder="Travel Manager, Procurement, dll."
                      className={inputCls}
                    />
                    <FieldError message={errors.pic_position?.message} />
                  </div>

                  <div>
                    <Label required>Email Bisnis</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        {...register('pic_email')}
                        type="email"
                        placeholder="nama@perusahaan.com"
                        className={`${inputCls} pl-11`}
                      />
                    </div>
                    <FieldError message={errors.pic_email?.message} />
                  </div>

                  <div>
                    <Label required>Nomor Telepon / WhatsApp</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        {...register('pic_phone')}
                        type="tel"
                        placeholder="+62 812 xxxx xxxx"
                        className={`${inputCls} pl-11`}
                      />
                    </div>
                    <FieldError message={errors.pic_phone?.message} />
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <span className="font-semibold text-dark">Informasi PIC</span> akan
                      digunakan sebagai kontak utama untuk komunikasi dengan Account Manager
                      dedikasi Anda.
                    </p>
                  </div>
                </div>
              )}

              {/* ────── STEP 3: Kebutuhan & Konfirmasi ────── */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-dark mb-1">Kebutuhan & Konfirmasi</h2>
                    <p className="text-gray-500 text-sm">
                      Bantu kami memahami kebutuhan perjalanan bisnis Anda
                    </p>
                  </div>

                  {/* Monthly travelers */}
                  <div>
                    <Label required>Perkiraan Traveler per Bulan</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {TRAVELER_OPTIONS.map(({ value, label, desc }) => {
                        const isSelected = watchedTravelers === value
                        return (
                          <label
                            key={value}
                            className={`relative flex flex-col gap-0.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              value={value}
                              {...register('monthly_travelers')}
                              className="sr-only"
                            />
                            <span className={`font-bold text-sm ${isSelected ? 'text-primary' : 'text-dark'}`}>
                              {label}
                            </span>
                            <span className="text-xs text-gray-400">{desc}</span>
                            {isSelected && (
                              <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-primary" />
                            )}
                          </label>
                        )
                      })}
                    </div>
                    <FieldError message={errors.monthly_travelers?.message} />
                  </div>

                  {/* Destinations */}
                  <div>
                    <Label required>Destinasi yang Dibutuhkan</Label>
                    <p className="text-gray-400 text-xs mb-3">Pilih satu atau lebih</p>
                    <div className="grid grid-cols-2 gap-3">
                      {DESTINATION_OPTIONS.map(({ value, label, desc }) => {
                        const isSelected = watchedDestinations.includes(value)
                        return (
                          <button
                            type="button"
                            key={value}
                            onClick={() => toggleDestination(value)}
                            className={`relative flex flex-col gap-0.5 p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <span className={`font-bold text-sm ${isSelected ? 'text-primary' : 'text-dark'}`}>
                              {label}
                            </span>
                            <span className="text-xs text-gray-400">{desc}</span>
                            {isSelected && (
                              <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-primary" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                    <FieldError message={errors.destinations?.message} />
                  </div>

                  {/* Notes */}
                  <div>
                    <Label>Catatan Tambahan <span className="text-gray-400 font-normal">(opsional)</span></Label>
                    <textarea
                      {...register('notes')}
                      rows={3}
                      placeholder="Ceritakan lebih lanjut tentang kebutuhan perjalanan bisnis Anda..."
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  {/* Agreement */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <div className="relative mt-0.5">
                        <input
                          type="checkbox"
                          {...register('agreed')}
                          className="sr-only"
                        />
                        <div
                          onClick={() => {
                            const current = getValues('agreed')
                            setValue('agreed', current ? undefined : true, { shouldValidate: true })
                          }}
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all ${
                            watch('agreed')
                              ? 'bg-primary border-primary'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          {watch('agreed') && (
                            <svg className="w-3 h-3 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 leading-relaxed">
                        Saya menyetujui{' '}
                        <Link to="/terms" className="text-primary font-semibold hover:underline">
                          Syarat & Ketentuan
                        </Link>{' '}
                        dan{' '}
                        <Link to="/privacy" className="text-primary font-semibold hover:underline">
                          Kebijakan Privasi
                        </Link>{' '}
                        Amoures Tour untuk program kemitraan B2B.
                      </span>
                    </label>
                    <FieldError message={errors.agreed?.message} />
                  </div>
                </div>
              )}

              {/* ── Navigation buttons ── */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-dark font-semibold transition-colors px-4 py-2.5 rounded-xl hover:bg-gray-100"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="bg-primary hover:bg-[#FFA000] text-dark font-bold px-6 py-3 rounded-xl inline-flex items-center gap-2 shadow-md shadow-primary/25 transition-all"
                  >
                    Lanjut
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-[#FFA000] text-dark font-bold px-6 py-3 rounded-xl inline-flex items-center gap-2 shadow-md shadow-primary/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        Kirim Permohonan
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>

            {/* Progress text */}
            <p className="text-center text-gray-400 text-xs mt-6">
              Langkah {currentStep} dari 3 — Data Anda aman dan terenkripsi
            </p>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
