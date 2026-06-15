import { useEffect } from 'react'
import api from '../api/axios'
import { useAuthStore } from '../store/auth.store'

/** Garante que o usuário logado esteja no store (rehidrata via /auth/me após refresh). */
export function useAppUser() {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const setAuth = useAuthStore((s) => s.setAuth)

  useEffect(() => {
    if (token && !user) {
      api
        .get('/auth/me')
        .then((res) => setAuth(res.data, token))
        .catch(() => {
          /* token inválido → ProtectedRoute trata o redirecionamento */
        })
    }
  }, [token, user, setAuth])

  return user
}
