import { type SVGProps } from 'react'
import { SwanFullLogoBlack } from '@/assets/swan/swan-full-logo-black'
import { SwanFullLogoWhite } from '@/assets/swan/swan-full-logo-white'
import { SwanSymbolBlack } from '@/assets/swan/swan-symbol-black'
import { SwanSymbolWhite } from '@/assets/swan/swan-symbol-white'
import { useTheme } from '@/context/theme-provider'

interface SwanLogoProps extends SVGProps<SVGSVGElement> {
  symbolOnly?: boolean
}

export function SwanLogo({ symbolOnly = false, ...props }: SwanLogoProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  if (symbolOnly) {
    return isDark ? <SwanSymbolWhite {...props} /> : <SwanSymbolBlack {...props} />
  }

  return isDark ? <SwanFullLogoWhite {...props} /> : <SwanFullLogoBlack {...props} />
}
