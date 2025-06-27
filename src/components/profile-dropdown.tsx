import { Link } from '@tanstack/react-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/context/auth-context'

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export function ProfileDropdown() {
  const { user } = useAuth();
  const email = user?.email || '';
  const avatarLetters = email.slice(0, 2).toUpperCase() || 'U';

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            {/* Optionally use AvatarImage if you have user images */}
            {/* <AvatarImage src={user?.avatarUrl} alt={email} /> */}
            <AvatarFallback>{avatarLetters}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm leading-none font-medium'>{email }</p>
            {/* <p className='text-muted-foreground text-xs leading-none'>
              {email}
            </p> */}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            try {
              localStorage.removeItem('token');
              document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('auth_token='))
                ?.split('=')[1];
              await fetch(`${BACKEND_BASE_URL}/v1/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                  'Authorization': token ? `Bearer ${token}` : '',
                },
              });
              window.location.href = '/sign-in';
            } catch (_) {
              alert('Logout failed.');
            }
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
