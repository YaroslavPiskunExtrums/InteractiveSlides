import { useRoute } from '@store/routing.store'
import { useCallback, useEffect } from 'react'

const useHashRouting = () => {
  const { hash, setHash } = useRoute()

  const changeHashEvent = useCallback(
    (e: HashChangeEvent) => {
      setHash('#' + e.newURL.split('#')?.[1] || '#getStart')
    },
    [setHash]
  )

  useEffect(() => {
    if (!window) return
    window.addEventListener('hashchange', changeHashEvent)
    return () => window.removeEventListener('hashchange', changeHashEvent)
  }, [changeHashEvent])

  return { hash }
}

export { useHashRouting }
