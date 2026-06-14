import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import useAuthStore from "../../store/authStore";

// ─── Validation Schema ────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

// ─── Field Error ──────────────────────────────────────────────────────────────

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-500">
      <AlertCircle size={13} className="flex-shrink-0" />
      {message}
    </p>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    // ─── Dummy Authentication Bypass ───
    const DUMMY_ACCOUNTS = {
      "admin@amoures.id": { role: "admin", status: "approved", full_name: "Admin", pic: "Admin", company: "Amoures Admin" },
      "ahmadtour@gmail.com": { role: "travel_agent", status: "unverified", full_name: "Ahmad Fauzi", pic: "Ahmad Fauzi", company: "" },
      "galaxytour@gmail.com": { role: "travel_agent", status: "pending", full_name: "Budi Santoso", pic: "Budi Santoso", company: "CV Galaxy Tour & Travel" },
      "sunriseholiday@gmail.com": { role: "travel_agent", status: "approved", full_name: "Siti Rahayu", pic: "Siti Rahayu", company: "PT Sunrise Holiday Indonesia" },
      "donitour@gmail.com": { role: "travel_agent", status: "rejected", full_name: "Doni Kusuma", pic: "Doni Kusuma", company: "UD Doni Travel", reject_reason: "Dokumen NPWP tidak terbaca, harap upload ulang" }
    };

    if (DUMMY_ACCOUNTS[data.email]) {
      const acc = DUMMY_ACCOUNTS[data.email];
      useAuthStore.setState({
        user: { id: "dummy-" + data.email, email: data.email },
        profile: {
          id: "dummy-" + data.email,
          role: acc.role,
          status: acc.status,
          full_name: acc.full_name,
          company_name: acc.company,
          pic_name: acc.pic,
          reject_reason: acc.reject_reason || null
        },
      });
      toast.success("Login Data Buatan berhasil! Selamat datang kembali.");
      navigate(acc.role === "admin" ? "/admin" : "/dashboard");
      return;
    }

    try {
      // Login via Supabase Auth
      const result = await login({
        email: data.email,
        password: data.password,
      });
      const userId = result?.user?.id;

      // Fetch profile dari tabel profiles untuk cek role
      let role = "user";
      if (userId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .single();
        role = profile?.role || "user";
      }

      toast.success("Login berhasil! Selamat datang kembali.");

      // Redirect berdasarkan role dari tabel profiles atau fallback email
      if (role === "admin" || data.email === "admin@moures.com") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(
        error?.message || "Login gagal. Periksa email dan password Anda.",
      );
    }
  };

  const inputBase =
    "w-full px-4 py-3 border rounded-xl bg-gray-50 text-[#1A1A1A] placeholder-gray-400 " +
    "focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent " +
    "transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* ── Email ── */}
      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          disabled={isSubmitting}
          {...register("email")}
          className={`${inputBase} ${errors.email ? "border-red-400 bg-red-50 focus:ring-red-300" : "border-gray-200"}`}
        />
        <FieldError message={errors.email?.message} />
      </div>

      {/* ── Password ── */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="login-password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Link
            to="/forgot-password"
            tabIndex={-1}
            className="text-sm font-medium text-accent hover:text-primary-hover transition-colors"
          >
            Lupa password?
          </Link>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Masukkan password Anda"
            disabled={isSubmitting}
            {...register("password")}
            className={`${inputBase} pr-12 ${errors.password ? "border-red-400 bg-red-50 focus:ring-red-300" : "border-gray-200"}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isSubmitting}
            aria-label={
              showPassword ? "Sembunyikan password" : "Tampilkan password"
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <FieldError message={errors.password?.message} />
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 px-6 bg-primary hover:bg-primary-hover text-dark font-semibold rounded-xl
          shadow-md transition-all duration-200 flex items-center justify-center gap-2
          shadow-md hover:shadow-lg active:scale-[0.98]
          disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Memproses...
          </>
        ) : (
          "Masuk"
        )}
      </button>

      {/* ── Dummy Credentials Helpers ── */}
      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-3">
        <p className="text-xs text-center font-semibold text-gray-500 uppercase tracking-widest">
          Data Buatan (Testing Alur B2B)
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              document.getElementById("login-email").value = "admin@amoures.id";
              document.getElementById("login-password").value = "Admin@123";
              toast.success("Admin diisi.");
            }}
            className="py-2 px-2 bg-white border border-gray-200 hover:bg-gray-50 text-[10px] font-semibold text-gray-700 rounded-lg transition-colors"
          >
            Isi Admin
          </button>
          <button
            type="button"
            onClick={() => {
              document.getElementById("login-email").value = "ahmadtour@gmail.com";
              document.getElementById("login-password").value = "Agent@123";
              toast.success("Agent Unverified diisi.");
            }}
            className="py-2 px-2 bg-white border border-gray-200 hover:bg-gray-50 text-[10px] font-semibold text-gray-700 rounded-lg transition-colors"
          >
            Agent (Unverified)
          </button>
          <button
            type="button"
            onClick={() => {
              document.getElementById("login-email").value = "galaxytour@gmail.com";
              document.getElementById("login-password").value = "Agent@123";
              toast.success("Agent Pending diisi.");
            }}
            className="py-2 px-2 bg-white border border-gray-200 hover:bg-gray-50 text-[10px] font-semibold text-gray-700 rounded-lg transition-colors"
          >
            Agent (Pending)
          </button>
          <button
            type="button"
            onClick={() => {
              document.getElementById("login-email").value = "sunriseholiday@gmail.com";
              document.getElementById("login-password").value = "Agent@123";
              toast.success("Agent Approved diisi.");
            }}
            className="py-2 px-2 bg-white border border-gray-200 hover:bg-gray-50 text-[10px] font-semibold text-gray-700 rounded-lg transition-colors"
          >
            Agent (Approved)
          </button>
          <button
            type="button"
            onClick={() => {
              document.getElementById("login-email").value = "donitour@gmail.com";
              document.getElementById("login-password").value = "Agent@123";
              toast.success("Agent Rejected diisi.");
            }}
            className="col-span-2 py-2 px-2 bg-white border border-gray-200 hover:bg-gray-50 text-[10px] font-semibold text-gray-700 rounded-lg transition-colors"
          >
            Agent (Rejected)
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center">Klik tombol di atas, lalu klik "Masuk".</p>
      </div>
    </form>
  );
}
