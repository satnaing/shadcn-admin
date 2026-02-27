import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/config/locales'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { useShop, useUpdateShop } from '@/hooks/queries/use-shops'
// We still need the current shop context to know WHICH shop to load
import { useAppStore } from '@/hooks/use-app-store'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { PageTitle } from '@/components/page-title'

const storeProfileSchema = z.object({
  name: z.string().min(2, {
    message: 'Store name must be at least 2 characters.',
  }),
  code: z.string().min(2).max(10),
  phone: z.string(),
  description: z.string().optional(),
  openingHours: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  address: z.string().optional(),
  locationLat: z.coerce.number().optional(),
  locationLong: z.coerce.number().optional(),
  defaultLanguage: z.string().optional().default(DEFAULT_LOCALE),
})

type StoreProfileValues = z.infer<typeof storeProfileSchema>

export default function StoreProfileForm() {
  const { activeShopId } = useAppStore() // Get the currently selected shop ID context

  const { data: activeShop, isLoading } = useShop(activeShopId!)
  const { mutate: updateShopMutate, isPending } = useUpdateShop()

  const form = useForm<StoreProfileValues>({
    resolver: zodResolver(
      storeProfileSchema
    ) as unknown as import('react-hook-form').Resolver<StoreProfileValues>,
    defaultValues: {
      name: '',
      code: '',
      phone: '',
      description: '',
      openingHours: '',
      imageUrl: '',
      coverImageUrl: '',
      address: '',
      locationLat: 0,
      locationLong: 0,
      defaultLanguage: DEFAULT_LOCALE,
    },
  })

  useEffect(() => {
    if (activeShop) {
      form.reset({
        name: activeShop.name?.en || '',
        code: activeShop.code || '',
        phone:
          typeof activeShop.phoneContacts === 'object' &&
          activeShop.phoneContacts !== null
            ? activeShop.phoneContacts.support ||
              activeShop.phoneContacts.manager ||
              ''
            : '',
        description: activeShop.description?.en || '',
        openingHours:
          typeof activeShop.openingHours === 'object' &&
          activeShop.openingHours !== null
            ? Object.values(activeShop.openingHours)[0] || ''
            : '',
        imageUrl:
          typeof activeShop.imageUrl === 'string' ? activeShop.imageUrl : '',
        coverImageUrl:
          typeof activeShop.bannerImageUrl === 'string'
            ? activeShop.bannerImageUrl
            : '',
        address: '', // Currently no explicit field in CreateShopDto, can merge into description later
        locationLat: activeShop.locationLat
          ? Number(activeShop.locationLat)
          : 0,
        locationLong: activeShop.locationLong
          ? Number(activeShop.locationLong)
          : 0,
        defaultLanguage: DEFAULT_LOCALE,
      })
    }
  }, [activeShop, form])

  function onSubmit(data: StoreProfileValues) {
    if (!activeShopId) return

    updateShopMutate(
      {
        id: activeShopId,
        data: {
          name: { en: data.name },
          code: data.code,
          description: { en: data.description || '' },
          // Simple mapping of phone to a general support number role
          phoneContacts: data.phone ? { support: data.phone } : undefined,
          // Simple opening hours mapping to all days if provided
          openingHours: data.openingHours
            ? {
                Monday: data.openingHours,
                Tuesday: data.openingHours,
                Wednesday: data.openingHours,
                Thursday: data.openingHours,
                Friday: data.openingHours,
                Saturday: data.openingHours,
                Sunday: data.openingHours,
              }
            : undefined,
          imageUrl: data.imageUrl,
          bannerImageUrl: data.coverImageUrl,
          locationLat: data.locationLat,
          locationLong: data.locationLong,
        },
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
        title='Store Profile'
        subtitle="Manage your store's public details and settings."
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
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Your store name' {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed on customer
                      receipts.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='code'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Code</FormLabel>
                      <FormControl>
                        <Input placeholder='STOR-001' {...field} />
                      </FormControl>
                      <FormDescription>
                        Unique identifier for this location.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder='+123456789' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description / Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Tell us a little bit about your store'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='openingHours'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening Hours</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g. 9AM - 5PM' {...field} />
                    </FormControl>
                    <FormDescription>
                      Text representation of your operating hours.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='defaultLanguage'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Default Language</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select default language' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SUPPORTED_LOCALES.map((locale) => (
                          <SelectItem key={locale.code} value={locale.code}>
                            {locale.flag} {locale.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This language will be used as the default fallback for
                      this location.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Column: Branding & Location */}
            <div className='space-y-6'>
              <div className='flex items-center gap-2'>
                <h3 className='text-lg font-medium'>Branding</h3>
              </div>

              <FormField
                control={form.control}
                name='imageUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Logo URL</FormLabel>
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
                name='coverImageUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder='https://...' {...field} />
                    </FormControl>
                    {field.value && (
                      <div className='mt-2 aspect-video w-full overflow-hidden rounded-md border'>
                        <img
                          src={field.value}
                          alt='Cover Preview'
                          className='h-full w-full object-cover'
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='mt-6 flex items-center gap-2'>
                <h3 className='text-lg font-medium'>Location</h3>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='locationLat'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='any'
                          placeholder='0.000000'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='locationLong'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='any'
                          placeholder='0.000000'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Map Placeholder */}
              <div className='relative mt-2 flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border bg-muted'>
                {/* Simulate a map iframe using OpenStreetMap */}
                {form.watch('locationLat') && form.watch('locationLong') ? (
                  <iframe
                    width='100%'
                    height='100%'
                    frameBorder='0'
                    scrolling='no'
                    marginHeight={0}
                    marginWidth={0}
                    className='absolute inset-0'
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(form.watch('locationLong')) - 0.01},${Number(form.watch('locationLat')) - 0.01},${Number(form.watch('locationLong')) + 0.01},${Number(form.watch('locationLat')) + 0.01}&layer=mapnik&marker=${form.watch('locationLat')},${form.watch('locationLong')}`}
                  ></iframe>
                ) : (
                  <div className='p-4 text-center'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Map Preview
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Enter coordinates to view map
                    </p>
                  </div>
                )}
              </div>
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
