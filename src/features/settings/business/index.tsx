import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
import {
  useBusinessProfile,
  useUpdateBusinessProfile,
} from '@/hooks/queries/use-business'
import { BrandLoader } from '@/components/ui/brand-loader'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PageTitle } from '@/components/page-title'

const businessProfileSchema = z.object({
  name: z.string().min(2, {
    message: 'Business name must be at least 2 characters.',
  }),
  supportEmail: z.string().email().optional().or(z.literal('')),
  logoUrl: z.string().url().optional().or(z.literal('')),
  bannerImageUrl: z.string().url().optional().or(z.literal('')),
})

type BusinessProfileValues = z.infer<typeof businessProfileSchema>

export default function BusinessProfileForm() {
  const { data: profile, isLoading } = useBusinessProfile()
  const { mutate: updateProfile, isPending } = useUpdateBusinessProfile()

  const form = useForm<BusinessProfileValues>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      name: '',
      supportEmail: '',
      logoUrl: '',
      bannerImageUrl: '',
    },
  })

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name?.en || '',
        supportEmail: profile.supportEmail || '',
        logoUrl: profile.logoUrl || '',
        bannerImageUrl:
          typeof profile.bannerImageUrl === 'string'
            ? profile.bannerImageUrl
            : '', // handle localized banner in future if needed
      })
    }
  }, [profile, form])

  function onSubmit(data: BusinessProfileValues) {
    updateProfile(
      {
        name: { en: data.name },
        supportEmail: data.supportEmail,
        logoUrl: data.logoUrl,
        bannerImageUrl: data.bannerImageUrl,
      },
      {
        onSuccess: () => {
          showSubmittedData(data)
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className='flex h-[80vh] w-full items-center justify-center p-6'>
        <BrandLoader />
      </div>
    )
  }

  return (
    <div className='flex flex-col space-y-4 p-6 pt-6'>
      <PageTitle
        title='Business Setup'
        subtitle='Manage global business configuration.'
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='max-w-4xl space-y-8'
        >
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            {/* Left Column: Basic Details */}
            <div className='space-y-6'>
              <div className='flex items-center gap-2'>
                <h3 className='text-lg font-medium'>Basic Details</h3>
              </div>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Your Business Name' {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the top-level company name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='supportEmail'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Email</FormLabel>
                    <FormControl>
                      <Input placeholder='support@example.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Column: Branding */}
            <div className='space-y-6'>
              <div className='flex items-center gap-2'>
                <h3 className='text-lg font-medium'>Branding</h3>
              </div>

              <FormField
                control={form.control}
                name='logoUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder='https://...' {...field} />
                    </FormControl>
                    {field.value && (
                      <div className='mt-2 size-20 overflow-hidden rounded-md border'>
                        <img
                          src={field.value}
                          alt='Logo Preview'
                          className='h-full w-full object-cover'
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='bannerImageUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder='https://...' {...field} />
                    </FormControl>
                    {field.value && (
                      <div className='mt-2 aspect-video w-full overflow-hidden rounded-md border'>
                        <img
                          src={field.value}
                          alt='Banner Preview'
                          className='h-full w-full object-cover'
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className='flex justify-end'>
            <Button type='submit' size='lg' disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
