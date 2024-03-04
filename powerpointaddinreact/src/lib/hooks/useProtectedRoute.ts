import { checkProtectedRoute } from '@lib/utils/protectedRoutes'
import { useRoute } from '@store/routing.store'
import { useEffect } from 'react'

export const useProtectedRoute = () => {
  const { hash } = useRoute()

  useEffect(() => {
    checkProtectedRoute(hash)
  }, [hash])
}
