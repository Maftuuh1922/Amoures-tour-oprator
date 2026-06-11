import { create } from 'zustand'

// ─── Dummy Users ──────────────────────────────────────────────────────────────
export const DUMMY_USERS = [
  {
    id: 'dummy-admin-001',
    email: 'admin@moures.com',
    password: 'admin123',
    full_name: 'Admin Moures',
    phone: '08123456789',
    role: 'admin',
    avatar: null,
  },
  {
    id: 'dummy-user-001',
    email: 'user@moures.com',
    password: 'user123',
    full_name: 'Budi Santoso',
    phone: '08987654321',
    role: 'user',
    avatar: null,
  },
]

// ─── Store ────────────────────────────────────────────────────────────────────
const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: false,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  initialize: () => {
    // Restore session from localStorage (dummy persistence)
    const saved = localStorage.getItem('dummy_auth_user')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        set({ user: parsed, profile: parsed, loading: false })
      } catch {
        set({ loading: false })
      }
    } else {
      set({ loading: false })
    }
  },

  logout: () => {
    localStorage.removeItem('dummy_auth_user')
    set({ user: null, profile: null })
  },
}))

export default useAuthStore
