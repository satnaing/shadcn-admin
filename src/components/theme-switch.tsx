import { IconMoon, IconSun } from '@tabler/icons-react'
import { useTheme } from './theme-provider'
import { Button } from './ui/button'

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  return (
    <Button
      size='icon'
      variant='ghost'
      className='rounded-full'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? <IconMoon size={20} /> : <IconSun size={20} />}
    </Button>
  )
}
