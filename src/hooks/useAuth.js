import toast from 'react-hot-toast'
import { DUMMY_USERS } from '../store/authStore'
import useAuthStore from '../store/authStore'

// ─── useAuth Hook ─────────────────────────────────────────────────────────────
export function useAuth() {
  const { user, profile, loading, logout: storeLogout } = useAuthStore()

  const login = async ({ email, password }) => {
    // Simulasi loading
    await new Promise((r) => setTimeout(r, 600))

    const found = DUMMY_USERS.find(
      (u) => u.email === email && u.password === password
    )

    if (!found) {
      throw new Error('Email atau password salah.')
    }

    const { password: _pw, ...safeUser } = found

    // Simpan ke store & localStorage
    useAuthStore.setState({ user: safeUser, profile: safeUser })
    localStorage.setItem('dummy_auth_user', JSON.stringify(safeUser))

    return safeUser
  }

  const register = async ({ email, password, full_name, phone }) => {
    await new Promise((r) => setTimeout(r, 600))

    const exists = DUMMY_USERS.find((u) => u.email === email)
    if (exists) throw new Error('Email sudah terdaftar.')

    const newUser = {
      id: `dummy-user-${Date.now()}`,
      email,
      full_name,
      phone,
      role: 'user',
      avatar: null,
    }

    DUMMY_USERS.push({ ...newUser, password })
    useAuthStore.setState({ user: newUser, profile: newUser })
    localStorage.setItem('dummy_auth_user', JSON.stringify(newUser))

    return newUser
  }

  const signOut = async () => {
    storeLogout()
    toast.success('Berhasil keluar')
  }

  return { user, profile, loading, login, register, signOut }
}

export default useAuth
