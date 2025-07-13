import { Link, useRouter } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User, CreditCard, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getAuthToken, signOut } from '@/features/auth/utils/auth.util'
import { SupabaseInstance } from '@/services/supabase.service'

export function ProfileDropdown() {
  const router = useRouter()
  const [user, setUser] = useState<{ 
    name: string; 
    email: string; 
    avatar?: string 
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAuthToken()
      
      if (!token) {
        setLoading(false)
        return
      }

      const supabase = SupabaseInstance.getSupabase()
      
      try {
        // Get the current user session
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          setUser({
            name: user.user_metadata?.full_name || user.email || 'User',
            email: user.email || '',
            avatar: user.user_metadata?.avatar_url
          })
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    await signOut()
    router.navigate({ to: '/sign-in' })
  }

  if (loading || !user) {
    return (
      <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
        <Avatar className='h-8 w-8'>
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{user.name}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/settings' className="w-full">
              <User className="mr-2 h-4 w-4" />
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/settings' className="w-full">
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/settings' className="w-full">
              <Settings className="mr-2 h-4 w-4" />
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}