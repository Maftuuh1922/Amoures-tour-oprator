import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import useAuthStore from "../store/authStore";

export function useAuth() {
  const { user, profile, loading, logout } = useAuthStore();

  // ── Login dengan email & password ──────────────────────────────────────────
  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    return data;
  };

  // ── Register akun baru ─────────────────────────────────────────────────────
  const register = async ({ email, password, full_name, phone }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, phone },
      },
    });
    if (error) throw new Error(error.message);

    // Buat / update profil di tabel profiles
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name,
        phone,
        role: "user",
      });
    }

    return data;
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const signOut = async () => {
    await logout();
    toast.success("Berhasil keluar");
  };

  return { user, profile, loading, login, register, signOut };
}

export default useAuth;
