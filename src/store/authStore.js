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
    role: 'travel_agent',
    avatar: null,
    company_name: 'PT Budi Tours',
    business_type: 'Travel Agent',
    pic_position: 'Direktur',
    status: 'aktif',
    monthly_travelers: '50-100',
    destinations: ['Domestik'],
  },
  {
    id: 'dummy-agent-001',
    email: 'agent@cvkaryanusantara.com',
    password: 'agent123',
    full_name: 'Jane Smith',
    phone: '087654321098',
    role: 'travel_agent',
    avatar: null,
    company_name: 'CV Karya Nusantara',
    business_type: 'Travel Agent',
    pic_position: 'Travel Manager',
    status: 'aktif',
    monthly_travelers: '100-500',
    destinations: ['Domestik', 'Internasional'],
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
