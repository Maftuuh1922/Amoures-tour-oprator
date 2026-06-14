import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Image,
  ClipboardList,
  Building2,
  Users,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Search,
  Filter,
  ChevronDown,
  TrendingUp,
  DollarSign,
  Calendar,
  Star,
  MoreVertical,
  AlertTriangle,
  LogOut,
  Menu,
  ArrowLeft,
  Save,
  Upload,
  Globe,
  Shield,
  BarChart3,
  RefreshCw,
  Plane,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import useAuthStore from "../store/authStore";

// ─── Sidebar Items ─────────────────────────────────────────────────────────────

const SIDEBAR_ITEMS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "packages", label: "Paket Wisata", icon: Package },
  { key: "destinations", label: "Destinasi", icon: MapPin },
  { key: "gallery", label: "Galeri", icon: Image },
  { key: "bookings", label: "Pemesanan", icon: ClipboardList },
  { key: "b2b", label: "Mitra B2B", icon: Building2 },
  { key: "users", label: "Pengguna", icon: Users },
];

// ─── Demo Data ─────────────────────────────────────────────────────────────────

const DEMO_PACKAGES = [
  {
    id: 1,
    title: "Bali Paradise Escape",
    destination: "Bali",
    description:
      "Nikmati keindahan Bali dengan paket lengkap selama 5 hari 4 malam. Termasuk akomodasi bintang 4, tour ke Ubud, Uluwatu, dan Kuta.",
    price: 2500000,
    duration_days: 5,
    image_url:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80",
    quota: 20,
    departure_date: "2025-04-15",
    is_active: true,
  },
  {
    id: 2,
    title: "Lombok Eksotis",
    destination: "Lombok",
    description:
      "Jelajahi keindahan Lombok dengan pantai berpasir putih, Gunung Rinjani, dan Gili Islands yang memesona.",
    price: 2200000,
    duration_days: 4,
    image_url:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
    quota: 15,
    departure_date: "2025-04-20",
    is_active: true,
  },
  {
    id: 3,
    title: "Labuan Bajo Komodo",
    destination: "Labuan Bajo",
    description:
      "Petualangan tak terlupakan di Labuan Bajo, melihat komodo langsung, snorkeling di perairan jernih, dan sunset terbaik.",
    price: 4900000,
    duration_days: 4,
    image_url:
      "https://images.unsplash.com/photo-1570737209810-87a8e7245f88?w=400&q=80",
    quota: 12,
    departure_date: "2025-05-01",
    is_active: true,
  },
  {
    id: 4,
    title: "Yogyakarta Cultural Tour",
    destination: "Yogyakarta",
    description:
      "Jelajahi budaya Jawa yang kaya dengan kunjungan ke Borobudur, Prambanan, Kraton, dan pengalaman membatik.",
    price: 1800000,
    duration_days: 3,
    image_url:
      "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=400&q=80",
    quota: 25,
    departure_date: "2025-05-10",
    is_active: true,
  },
  {
    id: 5,
    title: "Raja Ampat Adventure",
    destination: "Raja Ampat",
    description:
      "Surga bawah laut Raja Ampat dengan diving dan snorkeling di antara terumbu karang terbaik dunia.",
    price: 4900000,
    duration_days: 6,
    image_url:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
    quota: 10,
    departure_date: "2025-06-01",
    is_active: false,
  },
  {
    id: 6,
    title: "Bromo Sunrise Package",
    destination: "Bromo",
    description:
      "Saksikan sunrise spektakuler di Gunung Bromo, salah satu pemandangan paling ikonik di Indonesia.",
    price: 1500000,
    duration_days: 2,
    image_url:
      "https://images.unsplash.com/photo-1573790387438-4da905039392?w=400&q=80",
    quota: 30,
    departure_date: "2025-06-15",
    is_active: true,
  },
];

const DEMO_DESTINATIONS = [
  {
    id: 1,
    name: "Bali",
    province: "Bali",
    country: "Indonesia",
    description: "Pulau dewata dengan keindahan alam dan budaya yang memesona.",
    image_url:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80",
    packages: 24,
    featured: true,
  },
  {
    id: 2,
    name: "Raja Ampat",
    province: "Papua Barat",
    country: "Indonesia",
    description:
      "Surga bawah laut dengan keanekaragaman hayati laut terbaik di dunia.",
    image_url:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
    packages: 8,
    featured: true,
  },
  {
    id: 3,
    name: "Labuan Bajo",
    province: "NTT",
    country: "Indonesia",
    description: "Pintu gerbang menuju Taman Nasional Komodo yang menakjubkan.",
    image_url:
      "https://images.unsplash.com/photo-1570737209810-87a8e7245f88?w=400&q=80",
    packages: 12,
    featured: true,
  },
  {
    id: 4,
    name: "Yogyakarta",
    province: "DIY",
    country: "Indonesia",
    description: "Kota budaya Jawa dengan candi-candi bersejarah kelas dunia.",
    image_url:
      "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=400&q=80",
    packages: 18,
    featured: false,
  },
  {
    id: 5,
    name: "Lombok",
    province: "NTB",
    country: "Indonesia",
    description:
      "Keindahan alam yang belum terjamah dengan pantai dan gunung yang memesona.",
    image_url:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
    packages: 15,
    featured: false,
  },
  {
    id: 6,
    name: "Bromo",
    province: "Jawa Timur",
    country: "Indonesia",
    description: "Gunung berapi aktif dengan pemandangan sunrise yang ikonik.",
    image_url:
      "https://images.unsplash.com/photo-1573790387438-4da905039392?w=400&q=80",
    packages: 10,
    featured: false,
  },
];

const DEMO_GALLERY = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    alt: "Pantai Bali",
    category: "Destinasi",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&q=80",
    alt: "Pemandangan Alam",
    category: "Hero",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
    alt: "Raja Ampat",
    category: "Destinasi",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
    alt: "Lombok",
    category: "Destinasi",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=600&q=80",
    alt: "Candi Borobudur",
    category: "Destinasi",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1573790387438-4da905039392?w=600&q=80",
    alt: "Bromo Sunrise",
    category: "Destinasi",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1570737209810-87a8e7245f88?w=600&q=80",
    alt: "Labuan Bajo",
    category: "Paket",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80",
    alt: "Travel Adventure",
    category: "Hero",
  },
];

const DEMO_BOOKINGS = [
  {
    id: 1,
    code: "AMR-1A2B3C",
    customer: "Budi Santoso",
    email: "budi@email.com",
    package: "Bali Paradise Escape",
    date: "2025-03-15",
    pax: 3,
    total: 7500000,
    status: "pending",
  },
  {
    id: 2,
    code: "AMR-4D5E6F",
    customer: "Siti Rahayu",
    email: "siti@email.com",
    package: "Lombok Eksotis",
    date: "2025-03-22",
    pax: 2,
    total: 4400000,
    status: "confirmed",
  },
  {
    id: 3,
    code: "AMR-7G8H9I",
    customer: "Ahmad Fauzi",
    email: "ahmad@email.com",
    package: "Raja Ampat Adventure",
    date: "2025-04-01",
    pax: 4,
    total: 19600000,
    status: "pending",
  },
  {
    id: 4,
    code: "AMR-J1K2L3",
    customer: "Dewi Kartika",
    email: "dewi@email.com",
    package: "Labuan Bajo",
    date: "2025-04-10",
    pax: 2,
    total: 9800000,
    status: "confirmed",
  },
  {
    id: 5,
    code: "AMR-M4N5O6",
    customer: "Rizky Pratama",
    email: "rizky@email.com",
    package: "Bromo Sunrise",
    date: "2025-04-15",
    pax: 5,
    total: 7500000,
    status: "cancelled",
  },
];

const DEMO_B2B = [
  {
    id: 1,
    company: "PT Maju Bersama",
    type: "Perusahaan",
    pic: "John Doe",
    email: "john@majubersama.com",
    phone: "081234567890",
    status: "aktif",
    registered: "2025-01-15",
    monthly: "50-100",
  },
  {
    id: 2,
    company: "CV Karya Nusantara",
    type: "Travel Agent",
    pic: "Jane Smith",
    email: "jane@karyanus.com",
    phone: "087654321098",
    status: "aktif",
    registered: "2025-02-03",
    monthly: "100-500",
  },
  {
    id: 3,
    company: "SMA Negeri 5 Jakarta",
    type: "Sekolah/Universitas",
    pic: "Pak Ahmad",
    email: "ahmad@sman5jkt.sch.id",
    phone: "021-12345678",
    status: "pending",
    registered: "2025-03-01",
    monthly: "< 50",
  },
  {
    id: 4,
    company: "EO Spektakuler",
    type: "Event Organizer",
    pic: "Maya Indah",
    email: "maya@eo-spek.com",
    phone: "082198765432",
    status: "pending",
    registered: "2025-03-05",
    monthly: "50-100",
  },
];

const DEMO_USERS = [
  {
    id: 1,
    name: "PT Budi Tours",
    email: "budi@email.com",
    role: "travel_agent",
    joined: "2025-01-10",
    bookings: 5,
  },
  {
    id: 2,
    name: "Admin Utama",
    email: "admin@amoures.com",
    role: "admin",
    joined: "2024-12-01",
    bookings: 0,
  },
  {
    id: 3,
    name: "Siti Travel & Tour",
    email: "siti@email.com",
    role: "travel_agent",
    joined: "2025-01-20",
    bookings: 3,
  },
  {
    id: 4,
    name: "Ahmad Holiday",
    email: "ahmad@email.com",
    role: "travel_agent",
    joined: "2025-02-05",
    bookings: 2,
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatIDR(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const INPUT_CLS =
  "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors bg-white";
const LABEL_CLS = "block text-sm font-medium text-gray-700 mb-1";

// ─── Toggle Switch ─────────────────────────────────────────────────────────────

function Toggle({ checked, label, registerProps }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer w-fit mt-1">
      <div className="relative">
        <input type="checkbox" className="sr-only peer" {...registerProps} />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 shadow-inner" />
      </div>
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
    </label>
  );
}

// ─── Status Badge ──────────────────────────────────────────────────────────────

const STATUS_STYLE = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  aktif: "bg-green-100 text-green-700",
  ditolak: "bg-red-100 text-red-700",
};
const STATUS_LABEL = {
  pending: "Pending",
  confirmed: "Dikonfirmasi",
  cancelled: "Dibatalkan",
  aktif: "Aktif",
  ditolak: "Ditolak",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

// ─── Delete Confirm Dialog ─────────────────────────────────────────────────────

function DeleteConfirmDialog({ isOpen, onClose, onConfirm, title, itemName }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <h3 className="text-base font-bold text-dark">
            {title ?? "Konfirmasi Hapus"}
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Yakin ingin menghapus{" "}
          <span className="font-semibold text-dark">"{itemName}"</span>?
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Zod Schemas ───────────────────────────────────────────────────────────────

const packageSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  destination: z.string().min(2, "Destinasi minimal 2 karakter"),
  description: z.string().min(20, "Deskripsi minimal 20 karakter"),
  price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
  duration_days: z.coerce.number().min(1, "Durasi minimal 1 hari"),
  quota: z.coerce.number().min(1, "Kuota minimal 1"),
  departure_date: z.string().min(1, "Tanggal wajib diisi"),
  image_url: z.string().url("URL gambar tidak valid"),
  is_active: z.boolean(),
});

const destinationSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  province: z.string().min(2, "Provinsi minimal 2 karakter"),
  country: z.string().min(2, "Negara minimal 2 karakter"),
  description: z.string().optional().default(""),
  image_url: z.string().url("URL gambar tidak valid"),
  featured: z.boolean(),
});

const gallerySchema = z.object({
  url: z.string().url("URL gambar tidak valid"),
  alt: z.string().min(2, "Deskripsi minimal 2 karakter"),
  category: z.string().min(1, "Kategori wajib dipilih"),
});

// ─── Package Modal ─────────────────────────────────────────────────────────────

function PackageModal({ isOpen, onClose, editingPackage, onSave }) {
  const defaultVals = {
    title: "",
    destination: "",
    description: "",
    price: 0,
    duration_days: 1,
    quota: 1,
    departure_date: "",
    image_url: "",
    is_active: true,
  };
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(packageSchema),
    defaultValues: defaultVals,
  });

  const imageUrl = watch("image_url");
  const isActive = watch("is_active");

  useEffect(() => {
    if (isOpen) reset(editingPackage ? { ...editingPackage } : defaultVals);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingPackage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
          <h2 className="text-lg font-bold text-dark">
            {editingPackage ? "Edit Paket" : "Tambah Paket Baru"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="p-6 space-y-4">
          {/* Judul */}
          <div>
            <label className={LABEL_CLS}>Judul Paket</label>
            <input
              {...register("title")}
              className={INPUT_CLS}
              placeholder="Contoh: Bali Paradise Escape"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Destinasi + Harga */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Destinasi</label>
              <input
                {...register("destination")}
                className={INPUT_CLS}
                placeholder="Contoh: Bali"
              />
              {errors.destination && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.destination.message}
                </p>
              )}
            </div>
            <div>
              <label className={LABEL_CLS}>Harga (Rp)</label>
              <input
                type="number"
                {...register("price")}
                className={INPUT_CLS}
                placeholder="2500000"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          {/* Durasi + Kuota */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Durasi (Hari)</label>
              <input
                type="number"
                {...register("duration_days")}
                className={INPUT_CLS}
                placeholder="5"
              />
              {errors.duration_days && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.duration_days.message}
                </p>
              )}
            </div>
            <div>
              <label className={LABEL_CLS}>Kuota (Pax)</label>
              <input
                type="number"
                {...register("quota")}
                className={INPUT_CLS}
                placeholder="20"
              />
              {errors.quota && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.quota.message}
                </p>
              )}
            </div>
          </div>

          {/* Tanggal + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Tanggal Keberangkatan</label>
              <input
                type="date"
                {...register("departure_date")}
                className={INPUT_CLS}
              />
              {errors.departure_date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.departure_date.message}
                </p>
              )}
            </div>
            <div>
              <label className={LABEL_CLS}>Status Paket</label>
              <Toggle
                registerProps={register("is_active")}
                label={isActive ? "Aktif" : "Nonaktif"}
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className={LABEL_CLS}>URL Gambar Utama</label>
            <input
              {...register("image_url")}
              className={INPUT_CLS}
              placeholder="https://images.unsplash.com/..."
            />
            {errors.image_url && (
              <p className="text-red-500 text-xs mt-1">
                {errors.image_url.message}
              </p>
            )}
            {imageUrl &&
              (imageUrl.startsWith("http://") ||
                imageUrl.startsWith("https://")) && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-xl mt-2 border border-gray-100"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
          </div>

          {/* Deskripsi */}
          <div>
            <label className={LABEL_CLS}>Deskripsi</label>
            <textarea
              {...register("description")}
              rows={4}
              className={`${INPUT_CLS} resize-none`}
              placeholder="Deskripsi lengkap paket wisata..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-dark font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <Save size={16} /> Simpan Paket
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Destination Modal ─────────────────────────────────────────────────────────

function DestinationModal({ isOpen, onClose, editingDest, onSave }) {
  const defaultVals = {
    name: "",
    province: "",
    country: "Indonesia",
    description: "",
    image_url: "",
    featured: false,
  };
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(destinationSchema),
    defaultValues: defaultVals,
  });

  const imageUrl = watch("image_url");
  const isFeatured = watch("featured");

  useEffect(() => {
    if (isOpen) reset(editingDest ? { ...editingDest } : defaultVals);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingDest]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
          <h2 className="text-lg font-bold text-dark">
            {editingDest ? "Edit Destinasi" : "Tambah Destinasi"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Nama Destinasi</label>
              <input
                {...register("name")}
                className={INPUT_CLS}
                placeholder="Bali"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className={LABEL_CLS}>Provinsi</label>
              <input
                {...register("province")}
                className={INPUT_CLS}
                placeholder="Bali"
              />
              {errors.province && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.province.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>Negara</label>
            <input
              {...register("country")}
              className={INPUT_CLS}
              placeholder="Indonesia"
            />
            {errors.country && (
              <p className="text-red-500 text-xs mt-1">
                {errors.country.message}
              </p>
            )}
          </div>

          <div>
            <label className={LABEL_CLS}>URL Gambar</label>
            <input
              {...register("image_url")}
              className={INPUT_CLS}
              placeholder="https://images.unsplash.com/..."
            />
            {errors.image_url && (
              <p className="text-red-500 text-xs mt-1">
                {errors.image_url.message}
              </p>
            )}
            {imageUrl &&
              (imageUrl.startsWith("http://") ||
                imageUrl.startsWith("https://")) && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-xl mt-2"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
          </div>

          <div>
            <label className={LABEL_CLS}>Deskripsi</label>
            <textarea
              {...register("description")}
              rows={3}
              className={`${INPUT_CLS} resize-none`}
              placeholder="Deskripsi singkat destinasi..."
            />
          </div>

          <div>
            <label className={LABEL_CLS}>Tampilkan di Beranda</label>
            <Toggle
              registerProps={register("featured")}
              label={
                isFeatured ? "Ditampilkan di Beranda" : "Tidak Ditampilkan"
              }
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-dark font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Save size={16} /> Simpan Destinasi
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Gallery Modal ─────────────────────────────────────────────────────────────

function GalleryModal({ isOpen, onClose, onSave }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(gallerySchema),
    defaultValues: { url: "", alt: "", category: "Destinasi" },
  });

  const imageUrl = watch("url");

  useEffect(() => {
    if (isOpen) reset({ url: "", alt: "", category: "Destinasi" });
  }, [isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-dark">Tambah Gambar</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="p-6 space-y-4">
          <div>
            <label className={LABEL_CLS}>URL Gambar</label>
            <input
              {...register("url")}
              className={INPUT_CLS}
              placeholder="https://images.unsplash.com/..."
            />
            {errors.url && (
              <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>
            )}
            {imageUrl &&
              (imageUrl.startsWith("http://") ||
                imageUrl.startsWith("https://")) && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-xl mt-2"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
          </div>
          <div>
            <label className={LABEL_CLS}>Deskripsi / Alt Text</label>
            <input
              {...register("alt")}
              className={INPUT_CLS}
              placeholder="Pantai Bali"
            />
            {errors.alt && (
              <p className="text-red-500 text-xs mt-1">{errors.alt.message}</p>
            )}
          </div>
          <div>
            <label className={LABEL_CLS}>Kategori</label>
            <select {...register("category")} className={INPUT_CLS}>
              <option value="Destinasi">Destinasi</option>
              <option value="Hero">Hero</option>
              <option value="Paket">Paket</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-dark font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Upload size={16} /> Tambah Gambar
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── B2B Detail Modal ──────────────────────────────────────────────────────────

function B2BDetailModal({ isOpen, onClose, partner }) {
  if (!isOpen || !partner) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-dark">Detail Mitra B2B</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Informasi Perusahaan
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Nama Perusahaan", value: partner.company },
                { label: "Jenis", value: partner.type },
                { label: "PIC", value: partner.pic },
                { label: "Telepon", value: partner.phone },
                { label: "Email", value: partner.email },
                { label: "Tgl Daftar", value: formatDate(partner.registered) },
                {
                  label: "Est. Pemesanan",
                  value: `${partner.monthly} pax/bln`,
                },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-dark">{value}</p>
                </div>
              ))}
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Status</p>
                <StatusBadge status={partner.status} />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Overview ─────────────────────────────────────────────────────────────

function OverviewTab({ onNavigate }) {
  const stats = [
    {
      label: "Total Paket",
      value: "48",
      change: "+3 bulan ini",
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Booking",
      value: "1.284",
      change: "+127 bulan ini",
      icon: ClipboardList,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Pending Booking",
      value: "23",
      change: "Perlu konfirmasi",
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Total Pendapatan",
      value: "Rp 4,8M",
      change: "+18% vs bulan lalu",
      icon: DollarSign,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const handleExport = () => {
    // Generate simple CSV for bookings
    const headers = "ID,Code,Customer,Package,Date,Pax,Total,Status";
    const rows = DEMO_BOOKINGS.map(b => `${b.id},${b.code},${b.customer},${b.package},${b.date},${b.pax},${b.total},${b.status}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "laporan_booking.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    import('react-hot-toast').then(({ default: toast }) => {
      toast.success("Laporan berhasil diunduh!");
    });
  };

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, change, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 truncate">{label}</p>
                <p className="text-3xl font-black text-dark mt-1">{value}</p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ml-2 ${color}`}
              >
                <Icon size={20} />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={12} className="text-green-500" />
              <p className="text-xs text-green-600">{change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-dark">Pemesanan Terbaru</h3>
          <button
            onClick={() => onNavigate("bookings")}
            className="text-sm text-primary font-semibold hover:underline"
          >
            Lihat Semua
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Kode",
                  "Mitra B2B",
                  "Paket",
                  "Tanggal",
                  "Total",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {DEMO_BOOKINGS.map((b) => (
                <tr
                  key={b.code}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-mono font-semibold text-dark">
                    {b.code}
                  </td>
                  <td className="px-6 py-4 text-sm text-dark">{b.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {b.package}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(b.date)}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-dark">
                    {formatIDR(b.total)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onNavigate("packages")}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-dark font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          <Plus size={16} /> Tambah Paket
        </button>
        <button
          onClick={() => onNavigate("bookings")}
          className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-dark font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          <ClipboardList size={16} /> Lihat Booking Baru
        </button>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-dark font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          <BarChart3 size={16} /> Export Laporan
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Paket Wisata ─────────────────────────────────────────────────────────

function PackagesTab() {
  const [packages, setPackages] = useState(DEMO_PACKAGES);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = packages.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.destination.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSave = (data) => {
    if (editingPackage) {
      setPackages((prev) =>
        prev.map((p) => (p.id === editingPackage.id ? { ...p, ...data } : p)),
      );
      toast.success("Paket berhasil diperbarui");
    } else {
      setPackages((prev) => [...prev, { ...data, id: Date.now() }]);
      toast.success("Paket baru berhasil ditambahkan");
    }
    setShowModal(false);
    setEditingPackage(null);
  };

  const handleDelete = () => {
    setPackages((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    toast.success("Paket berhasil dihapus");
    setDeleteTarget(null);
  };

  const toggleStatus = (id) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p)),
    );
  };

  const openAdd = () => {
    setEditingPackage(null);
    setShowModal(true);
  };
  const openEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditingPackage(null);
  };

  return (
    <div>
      <PackageModal
        isOpen={showModal}
        onClose={closeModal}
        editingPackage={editingPackage}
        onSave={handleSave}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Paket"
        itemName={deleteTarget?.title}
      />

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari paket atau destinasi..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 px-4 py-2.5 rounded-xl text-sm transition-colors">
            <Filter size={14} /> Filter
            <ChevronDown size={14} />
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-dark font-bold px-5 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap"
          >
            <Plus size={16} /> Tambah Paket Baru
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[
                  "Foto",
                  "Paket",
                  "Harga",
                  "Durasi",
                  "Kuota",
                  "Keberangkatan",
                  "Status",
                  "Aksi",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((pkg) => (
                <tr
                  key={pkg.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-4 py-3">
                    <img
                      src={pkg.image_url}
                      alt={pkg.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-dark text-sm">
                      {pkg.title}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {pkg.destination}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-dark">
                    {formatIDR(pkg.price)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {pkg.duration_days} Hari
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {pkg.quota} Pax
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(pkg.departure_date)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(pkg.id)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        pkg.is_active
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {pkg.is_active ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(pkg)}
                        className="p-1.5 text-primary hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(pkg)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-16 text-center text-sm text-gray-400"
                  >
                    Tidak ada paket ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Destinasi ────────────────────────────────────────────────────────────

function DestinationsTab() {
  const [destinations, setDestinations] = useState(DEMO_DESTINATIONS);
  const [showModal, setShowModal] = useState(false);
  const [editingDest, setEditingDest] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleSave = (data) => {
    if (editingDest) {
      setDestinations((prev) =>
        prev.map((d) => (d.id === editingDest.id ? { ...d, ...data } : d)),
      );
      toast.success("Destinasi berhasil diperbarui");
    } else {
      setDestinations((prev) => [
        ...prev,
        { ...data, id: Date.now(), packages: 0 },
      ]);
      toast.success("Destinasi baru berhasil ditambahkan");
    }
    setShowModal(false);
    setEditingDest(null);
  };

  const handleDelete = () => {
    setDestinations((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    toast.success("Destinasi berhasil dihapus");
    setDeleteTarget(null);
  };

  const toggleFeatured = (id) => {
    setDestinations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, featured: !d.featured } : d)),
    );
  };

  return (
    <div>
      <DestinationModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingDest(null);
        }}
        editingDest={editingDest}
        onSave={handleSave}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Destinasi"
        itemName={deleteTarget?.name}
      />

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {destinations.length} destinasi tersedia
        </p>
        <button
          onClick={() => {
            setEditingDest(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-dark font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          <Plus size={16} /> Tambah Destinasi
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="relative">
              <img
                src={dest.image_url}
                alt={dest.name}
                className="w-full h-40 object-cover"
              />
              {dest.featured && (
                <span className="absolute top-2 right-2 bg-primary text-dark text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Star size={10} /> Featured
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-dark">{dest.name}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <Globe size={10} /> {dest.province}, {dest.country}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                <Package size={10} className="inline mr-1" />
                {dest.packages} paket tersedia
              </p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                <button
                  onClick={() => toggleFeatured(dest.id)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    dest.featured
                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {dest.featured ? "Unfeature" : "Set Featured"}
                </button>
                <button
                  onClick={() => {
                    setEditingDest(dest);
                    setShowModal(true);
                  }}
                  className="p-1.5 text-primary hover:bg-yellow-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => setDeleteTarget(dest)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Galeri ───────────────────────────────────────────────────────────────

const CATEGORY_COLOR = {
  Destinasi: "bg-blue-100 text-blue-700",
  Hero: "bg-purple-100 text-purple-700",
  Paket: "bg-green-100 text-green-700",
};

function GalleryTab() {
  const [gallery, setGallery] = useState(DEMO_GALLERY);
  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleSave = (data) => {
    setGallery((prev) => [...prev, { ...data, id: Date.now() }]);
    toast.success("Gambar berhasil ditambahkan");
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
    toast.success("Gambar berhasil dihapus");
  };

  return (
    <div>
      <GalleryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />

      {/* Lightbox */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
          />
          <button
            className="absolute top-4 right-4 p-2.5 bg-white/10 hover:bg-white/25 rounded-xl transition-colors"
            onClick={() => setPreviewUrl(null)}
          >
            <X size={20} className="text-white" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {gallery.length} gambar di galeri
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-dark font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          <Plus size={16} /> Tambah Gambar
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((img) => (
          <div
            key={img.id}
            className="relative group rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm"
          >
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => setPreviewUrl(img.url)}
                className="p-2 bg-white/20 hover:bg-white/40 rounded-xl transition-colors"
                title="Preview"
              >
                <Eye size={16} className="text-white" />
              </button>
              <button
                onClick={() => handleDelete(img.id)}
                className="p-2 bg-red-500/80 hover:bg-red-500 rounded-xl transition-colors"
                title="Hapus"
              >
                <Trash2 size={16} className="text-white" />
              </button>
            </div>
            {/* Footer */}
            <div className="p-2.5">
              <p className="text-xs font-medium text-dark truncate">
                {img.alt}
              </p>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${CATEGORY_COLOR[img.category] ?? "bg-gray-100 text-gray-700"}`}
              >
                {img.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Pemesanan ────────────────────────────────────────────────────────────

const BOOKING_FILTER_TABS = [
  { key: "all", label: "Semua" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Dikonfirmasi" },
  { key: "cancelled", label: "Dibatalkan" },
];

function BookingsTab() {
  const [bookings, setBookings] = useState(DEMO_BOOKINGS);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = bookings.filter((b) => {
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    const matchSearch =
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const confirmBooking = (id) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "confirmed" } : b)),
    );
    toast.success("Booking berhasil dikonfirmasi");
  };

  const cancelBooking = (id) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
    );
    toast.success("Booking berhasil dibatalkan");
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode atau nama mitra..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white"
          />
        </div>
        {/* Filter tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 shrink-0">
          {BOOKING_FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === tab.key
                  ? "bg-primary text-dark"
                  : "text-gray-500 hover:text-dark hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[
                  "Kode",
                  "Mitra B2B",
                  "Paket",
                  "Tanggal",
                  "Pax",
                  "Total",
                  "Status",
                  "Aksi",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-4 py-4 text-sm font-mono font-semibold text-dark">
                    {b.code}
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-dark">
                      {b.customer}
                    </p>
                    <p className="text-xs text-gray-400">{b.email}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 max-w-[160px] truncate">
                    {b.package}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {formatDate(b.date)}
                  </td>
                  <td className="px-4 py-4 text-sm text-dark">{b.pax} pax</td>
                  <td className="px-4 py-4 text-sm font-semibold text-dark">
                    {formatIDR(b.total)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-4">
                    {b.status === "pending" ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => confirmBooking(b.id)}
                          title="Konfirmasi"
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          onClick={() => cancelBooking(b.id)}
                          title="Batalkan"
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        title="Lihat Detail"
                        className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-16 text-center text-sm text-gray-400"
                  >
                    Tidak ada data ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Mitra B2B ────────────────────────────────────────────────────────────

function B2BTab() {
  const [partners, setPartners] = useState(DEMO_B2B);
  const [selectedPartner, setSelectedPartner] = useState(null);

  const activatePartner = (id) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "aktif" } : p)),
    );
    toast.success("Mitra berhasil diaktifkan");
  };

  const rejectPartner = (id) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "ditolak" } : p)),
    );
    toast.success("Mitra telah ditolak");
  };

  return (
    <div>
      <B2BDetailModal
        isOpen={!!selectedPartner}
        onClose={() => setSelectedPartner(null)}
        partner={selectedPartner}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-dark">Daftar Mitra B2B</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
            {partners.length} total mitra
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[
                  "Perusahaan",
                  "Jenis",
                  "PIC",
                  "Email",
                  "Status",
                  "Tgl Daftar",
                  "Aksi",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {partners.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-4 py-4">
                    <p className="text-sm font-semibold text-dark">
                      {p.company}
                    </p>
                    <p className="text-xs text-gray-400">{p.phone}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">{p.type}</td>
                  <td className="px-4 py-4 text-sm text-dark">{p.pic}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{p.email}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {formatDate(p.registered)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {p.status === "pending" && (
                        <>
                          <button
                            onClick={() => activatePartner(p.id)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Check size={11} /> Aktifkan
                          </button>
                          <button
                            onClick={() => rejectPartner(p.id)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <X size={11} /> Tolak
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedPartner(p)}
                        className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Detail"
                      >
                        <Eye size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Pengguna ─────────────────────────────────────────────────────────────

function UsersTab() {
  const [users, setUsers] = useState(DEMO_USERS);
  const [confirmToggle, setConfirmToggle] = useState(null);

  const executeToggle = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, role: u.role === "admin" ? "travel_agent" : "admin" } : u,
      ),
    );
    toast.success("Role pengguna berhasil diubah");
    setConfirmToggle(null);
  };

  return (
    <div>
      {/* Confirm Dialog */}
      {confirmToggle && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center shrink-0">
                <Shield size={20} className="text-yellow-600" />
              </div>
              <h3 className="text-base font-bold text-dark">
                Ubah Role Pengguna
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Ubah role{" "}
              <span className="font-semibold text-dark">
                {confirmToggle.name}
              </span>{" "}
              menjadi{" "}
              <span className="font-semibold text-dark">
                {confirmToggle.role === "admin" ? "Mitra B2B" : "Admin"}
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmToggle(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => executeToggle(confirmToggle.id)}
                className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover text-dark font-bold rounded-xl text-sm transition-colors"
              >
                Ya, Ubah
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-dark">Daftar Pengguna</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
            {users.length} total pengguna
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[
                  "Pengguna",
                  "Email",
                  "Role",
                  "Tgl Bergabung",
                  "Total Booking",
                  "Aksi",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-dark shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <p className="text-sm font-semibold text-dark">
                        {u.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">{u.email}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${u.role === "admin" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}
                    >
                      {u.role === "admin" ? (
                        <Shield size={10} />
                      ) : (
                        <Users size={10} />
                      )}
                      {u.role === "admin" ? "Admin" : "Mitra B2B"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {formatDate(u.joined)}
                  </td>
                  <td className="px-4 py-4 text-sm text-dark">
                    {u.bookings} booking
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => setConfirmToggle(u)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        u.role === "admin"
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      }`}
                    >
                      {u.role === "admin" ? "Jadikan User" : "Jadikan Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main: AdminPage ───────────────────────────────────────────────────────────

const TAB_TITLES = {
  overview: "Overview",
  packages: "Paket Wisata",
  destinations: "Destinasi",
  gallery: "Galeri",
  bookings: "Pemesanan",
  b2b: "Mitra B2B",
  users: "Pengguna",
};

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, profile, loading, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // ── Auth Guard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const isAdmin = profile?.role?.toLowerCase() === "admin" || user?.email === "admin@moures.com";
    if (!loading && (!user || !isAdmin)) {
      toast.error("Akses ditolak. Halaman ini khusus administrator.");
      navigate("/");
    }
  }, [user, profile, loading, navigate]);

  // ── Close sidebar on outside click (mobile) ──────────────────────────────────
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const isAdmin = profile?.role?.toLowerCase() === "admin" || user?.email === "admin@moures.com";
  if (!user || !isAdmin) return null;

  const handleLogout = () => {
    logout();
    toast.success("Berhasil keluar");
    navigate("/");
  };

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ── Sidebar Content (shared between desktop & mobile) ────────────────────────
  function SidebarContent() {
    return (
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-none">
                Amoures
              </p>
              <p className="text-primary text-xs font-semibold">.admin</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {SIDEBAR_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all rounded-xl ${
                activeTab === key
                  ? "bg-primary text-dark font-bold"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        {/* Back to site */}
        <div className="px-3 pb-1">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl text-xs transition-all"
          >
            <ArrowLeft size={14} /> Kembali ke Website
          </Link>
        </div>

        {/* User Card */}
        <div className="mx-3 mb-4 p-3 bg-white/5 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-dark font-bold text-sm shrink-0">
              {(profile?.full_name || user?.email || "A")
                .charAt(0)
                .toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">
                {profile?.full_name || "Admin"}
              </p>
              <p className="text-gray-500 text-xs">Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              title="Keluar"
              className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ── Sidebar Desktop ─────────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-64 bg-dark fixed inset-y-0 left-0 z-30 flex-col">
        <SidebarContent />
      </aside>

      {/* ── Sidebar Mobile Overlay ───────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark flex flex-col md:hidden transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* ── Main Area ───────────────────────────────────────────────────────── */}
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-bold text-dark text-base leading-none">
                {TAB_TITLES[activeTab]}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
                Dashboard / {TAB_TITLES[activeTab]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 border-r border-gray-200 pr-3 mr-1">
              <Calendar size={13} />
              <span>{today}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-dark text-white text-xs font-semibold px-3 py-1.5 rounded-xl">
              <Shield size={12} /> Admin
            </div>
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 px-3 py-1.5 border border-gray-200 rounded-xl hover:border-red-200 hover:bg-red-50 transition-colors"
            >
              <LogOut size={13} /> Keluar
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          {activeTab === "overview" && (
            <OverviewTab onNavigate={setActiveTab} />
          )}
          {activeTab === "packages" && <PackagesTab />}
          {activeTab === "destinations" && <DestinationsTab />}
          {activeTab === "gallery" && <GalleryTab />}
          {activeTab === "bookings" && <BookingsTab />}
          {activeTab === "b2b" && <B2BTab />}
          {activeTab === "users" && <UsersTab />}
        </main>
      </div>
    </div>
  );
}
