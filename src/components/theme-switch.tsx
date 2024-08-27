import { IconMoon, IconSun, IconDeviceDesktop } from '@tabler/icons-react';
import { useTheme } from './theme-provider';
import { Button } from './custom/button'; 
import { useEffect, useState } from 'react';

// Define type for handleSelect parameter
type Theme = 'light' | 'dark' | 'system';

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  // Update theme-color meta tag when theme is updated
  useEffect(() => {
    const themeColor = theme === 'dark' ? '#020817' : '#fff';
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    metaThemeColor && metaThemeColor.setAttribute('content', themeColor);
  }, [theme]);

  // Explicitly type the parameter
  const handleSelect = (value: Theme) => {
    setTheme(value);
    setOpen(false);
  };

  return (
    <div className="relative">
      <Button
        size='icon'
        variant='ghost'
        className='rounded-full'
        onClick={() => setOpen(!open)}
      >
        {theme === 'light' ? <IconSun size={20} /> : theme === 'dark' ? <IconMoon size={20} /> : <IconDeviceDesktop size={20} />}
      </Button>
      {open && (
        <div
          className="absolute top-full left-0 mt-2 w-35 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
        >
          <div className="py-1">
    
            <button
              onClick={() => handleSelect('light')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
               Light
            </button>
            <button
              onClick={() => handleSelect('dark')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
               Dark
            </button>
            <button
              onClick={() => handleSelect('system')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
               System
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
