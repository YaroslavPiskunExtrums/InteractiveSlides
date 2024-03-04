import { getConfigFromOfficeSettings } from '@lib/utils/addin'
import { useConfig } from '@store/config.store'
import { useEffect } from 'react'

export const useSetConfig = () => {
  const { setConfig } = useConfig()

  useEffect(() => {
    setConfig(getConfigFromOfficeSettings())
  }, [])
}
