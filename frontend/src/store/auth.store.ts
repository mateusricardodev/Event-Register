import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthStore {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
}

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem('auth_user')
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: loadUser(),
  token: localStorage.getItem('token'),
  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('auth_user', JSON.stringify(user))
    set({ user, token })
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('auth_user')
    set({ user: null, token: null })
  },
}))
