import { useState } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { startShift, endShift, getCurrentShift } from '@/services/ops'
import { ShiftRole } from '@/types/ops'
import { Clock, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useAppStore } from '@/hooks/use-app-store'
import { BrandLoader } from '@/components/ui/brand-loader'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const startShiftSchema = z.object({
  role: z.nativeEnum(ShiftRole),
  pin: z.string().min(4, 'PIN must be at least 4 digits'),
})

const endShiftSchema = z.object({
  pin: z.string().min(4, 'PIN must be at least 4 digits'),
})

export function ShiftCard() {
  const { user, activeShopId } = useAppStore()
  const queryClient = useQueryClient()
  const [isEnding, setIsEnding] = useState(false)

  const { data: currentShift, isLoading } = useQuery({
    queryKey: ['current-shift'],
    queryFn: getCurrentShift,
  })

  // Start Shift Form
  const startForm = useForm<z.infer<typeof startShiftSchema>>({
    resolver: zodResolver(startShiftSchema),
    defaultValues: {
      pin: '',
    },
  })

  // End Shift Form
  const endForm = useForm<z.infer<typeof endShiftSchema>>({
    resolver: zodResolver(endShiftSchema),
    defaultValues: {
      pin: '',
    },
  })

  const startMutation = useMutation({
    mutationFn: startShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-shift'] })
      toast.success('Shift started successfully')
      startForm.reset()
    },
    onError: () => toast.error('Failed to start shift'),
  })

  const endMutation = useMutation({
    mutationFn: endShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-shift'] })
      toast.success('Shift ended successfully')
      setIsEnding(false)
      endForm.reset()
    },
    onError: () => toast.error('Failed to end shift'),
  })

  if (isLoading) return <BrandLoader />

  if (currentShift) {
    // CLOCKED IN STATE
    return (
      <Card className='border-l-4 border-l-emerald-500'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <UserCheck className='h-5 w-5 text-emerald-500' />
              Active Shift
            </CardTitle>
            <div className='text-sm text-muted-foreground'>
              {currentShift.shiftRole}
            </div>
          </div>
          <CardDescription>
            You are currently clocked in at {user?.fullName || 'Unknown Staff'}
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='rounded-md bg-muted p-4'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Clock className='h-4 w-4' />
              Started at
            </div>
            <div className='mt-1 text-2xl font-bold'>
              {format(new Date(currentShift.startTime), 'HH:mm')}
            </div>
            <div className='text-xs text-muted-foreground'>
              {format(new Date(currentShift.startTime), 'MMMM d, yyyy')}
            </div>
          </div>

          {!isEnding ? (
            <Button
              variant='destructive'
              className='w-full'
              onClick={() => setIsEnding(true)}
            >
              Clock Out
            </Button>
          ) : (
            <Form {...endForm}>
              <form
                onSubmit={endForm.handleSubmit((data) =>
                  endMutation.mutate({ shopId: activeShopId!, pin: data.pin })
                )}
                className='space-y-4'
              >
                <FormField
                  control={endForm.control}
                  name='pin'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter PIN to Confirm</FormLabel>
                      <FormControl>
                        <Input type='password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    className='flex-1'
                    onClick={() => setIsEnding(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    variant='destructive'
                    className='flex-1'
                    disabled={endMutation.isPending}
                  >
                    {endMutation.isPending ? 'Confirming...' : 'Confirm End'}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    )
  }

  // CLOCKED OUT STATE
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Clock className='h-5 w-5' />
          Start Work Shift
        </CardTitle>
        <CardDescription>
          Clock in to start your shift and access operations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...startForm}>
          <form
            onSubmit={startForm.handleSubmit((data) =>
              startMutation.mutate({
                shopId: activeShopId!,
                shiftRole: data.role,
                pin: data.pin,
              })
            )}
            className='space-y-4'
          >
            <FormField
              control={startForm.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shift Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select role' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ShiftRole).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={startForm.control}
              name='pin'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff PIN</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='w-full'
              disabled={startMutation.isPending}
            >
              {startMutation.isPending ? 'Clocking In...' : 'Clock In'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
