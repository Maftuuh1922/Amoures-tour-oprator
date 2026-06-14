import { create } from "zustand";
import { supabase } from "../lib/supabase";

const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  fetchProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw error;
      set({ profile: data });
    } catch (err) {
      console.error("fetchProfile error:", err.message);
    }
  },

  initialize: async () => {
    set({ loading: true });
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        set({ user: session.user });
        await get().fetchProfile(session.user.id);
      }
    } catch (err) {
      console.error("initialize error:", err.message);
    } finally {
      set({ loading: false });
    }

    // Listen perubahan auth (login / logout / token refresh)
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        set({ user: session.user });
        await get().fetchProfile(session.user.id);
      } else {
        set({ user: null, profile: null });
      }
    });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },
}));

export default useAuthStore;
