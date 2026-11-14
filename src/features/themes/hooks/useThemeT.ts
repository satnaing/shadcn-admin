import { useTranslation } from 'react-i18next'

/** `themes` namespace with flat keys (`f.support.phone`): dots in keys are literal. */
export function useThemeT() {
  const { t } = useTranslation('themes')
  return (key: string | string[], options?: Record<string, unknown>) =>
    t(key, { keySeparator: false, ...options }) as string
}
