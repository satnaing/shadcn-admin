// ... existing imports ...
import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
} from '@/hooks/queries/use-catalog'
import { Button } from '@/components/ui/button'
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { MultiLangImageUpload } from '@/components/custom/multi-lang-image-upload'
import { MultiLangInput } from '@/components/custom/multi-lang-input'
import { MultiLangTextarea } from '@/components/custom/multi-lang-textarea'
import { type Category } from '../../data/schema'

const categorySchema = z.object({
  name: z.record(z.string(), z.string()).refine((data) => !!data['en'], {
    message: 'English name is required',
  }),
  description: z.record(z.string(), z.string()).optional(),
  slug: z.string().min(1, 'Slug is required'),
  parentId: z.string().nullable().optional(),
  sortOrder: z.coerce.number().default(0),
  imageUrl: z.record(z.string(), z.string()).optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface CategorySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: CategoryFormValues | null
}

// ... imports

export function CategorySheet({
  open,
  onOpenChange,
  initialData,
}: CategorySheetProps & { initialData?: { id?: string } | null }) {
  // Extend props to allow ID check
  const { data: categories } = useCategories()
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory()
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory()

  const isPending = isCreating || isUpdating

  const form = useForm<
    z.input<typeof categorySchema>,
    unknown,
    CategoryFormValues
  >({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || {
      name: { en: '' },
      description: {},
      slug: '',
      sortOrder: 0,
      imageUrl: {},
    },
  })

  useEffect(() => {
    if (open) {
      form.reset(
        initialData || {
          name: { en: '' },
          description: {},
          slug: '',
          sortOrder: 0,
          imageUrl: {},
        }
      )
    }
  }, [open, initialData, form])

  function onSubmit(data: CategoryFormValues) {
    const categoryId = (initialData as { id?: string })?.id

    // Sanitise payload: remove parentId if it's 'none' or falsy
    const payload = { ...data }
    if (payload.parentId === 'none' || !payload.parentId) {
      delete payload.parentId
    }

    if (categoryId) {
      updateCategory(
        { id: categoryId, data: payload },
        {
          onSuccess: () => {
            toast.success('Category updated successfully')
            onOpenChange(false)
            form.reset()
          },
          onError: () => {
            toast.error('Failed to update category')
          },
        }
      )
    } else {
      createCategory(payload, {
        onSuccess: () => {
          toast.success('Category created successfully')
          onOpenChange(false)
          form.reset()
        },
        onError: () => {
          toast.error('Failed to create category')
        },
      })
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='p-4 sm:max-w-xl'>
        <SheetHeader className='p-0'>
          <SheetTitle>
            {initialData ? 'Edit Category' : 'Create Category'}
          </SheetTitle>
          <SheetDescription>
            {initialData
              ? 'Update category details.'
              : 'Add a new category to organize your menu items.'}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 py-4'
          >
            <FormField
              control={form.control}
              name='imageUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Image</FormLabel>
                  <FormControl>
                    <MultiLangImageUpload
                      value={field.value || {}}
                      onChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiLangInput
                      label='Name'
                      placeholder='e.g. Hot Coffee'
                      value={field.value as Record<string, string>}
                      onChange={(val) => {
                        field.onChange(val)
                        // Auto-generate slug if empty, using English name
                        if (!form.getValues('slug') && val['en']) {
                          form.setValue(
                            'slug',
                            val['en']
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/(^-|-$)/g, '')
                          )
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiLangTextarea
                      label='Description (Optional)'
                      placeholder='Category description...'
                      value={(field.value || {}) as Record<string, string>}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='slug'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g. hot-coffee' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='sortOrder'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        value={field.value as number | string}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value || 0))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='parentId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select parent (optional)' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='none'>None</SelectItem>
                      {(Array.isArray(categories)
                        ? categories
                        : (categories as any)?.data || []
                      ).map((category: Category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id || `cat-${category.slug}`}
                        >
                          {category.name['en']}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end pt-4'>
              <Button type='submit' disabled={isPending}>
                {isPending
                  ? 'Saving...'
                  : initialData
                    ? 'Update Category'
                    : 'Create Category'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
