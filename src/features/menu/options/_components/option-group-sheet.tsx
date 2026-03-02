import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  useCreateOptionGroup,
  useUpdateOptionGroup,
} from '@/hooks/queries/use-catalog'
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
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  optionGroupSchema,
  OptionType,
  type ProductOptionGroup,
} from '../../data/schema'
import { RecipeInline } from './recipe-inline.tsx'

interface OptionGroupSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: ProductOptionGroup | null
}

export function OptionGroupSheet({
  open,
  onOpenChange,
  initialData,
}: OptionGroupSheetProps) {
  const { mutate: createGroup, isPending: isCreating } = useCreateOptionGroup()
  const { mutate: updateGroup, isPending: isUpdating } = useUpdateOptionGroup()

  const isPending = isCreating || isUpdating

  /* recipeDrawerOpen state removed */
  // Helper to get formatted choice name for display
  const getChoiceName = (index: number) => {
    const name = form.getValues(`choices.${index}.name.en`)
    return name || `Choice ${index + 1}`
  }

  const form = useForm({
    resolver: zodResolver(optionGroupSchema),
    defaultValues: initialData || {
      name: { en: '' },
      type: OptionType.VARIANT,
      sku: '',
      minSelect: 0,
      maxSelect: 1,
      choices: [
        {
          name: { en: '' },
          sku: '',
          price: 0,
          recipes: [],
        },
      ],
    },
  })

  // Reset form when opening or initialData changes
  useEffect(() => {
    if (open) {
      form.reset(
        initialData || {
          name: { en: '' },
          type: OptionType.VARIANT,
          sku: '',
          minSelect: 0,
          maxSelect: 1,
          choices: [
            {
              name: { en: '' },
              sku: '',
              price: 0,
              recipes: [],
            },
          ],
        }
      )
    }
  }, [open, initialData, form])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'choices',
  })

  function onSubmit(data: ProductOptionGroup) {
    // eslint-disable-next-line no-console
    console.log('Submitting Option Group Data:', data)
    // eslint-disable-next-line no-console
    console.log('Initial Data:', initialData)

    if (initialData?.id) {
      // eslint-disable-next-line no-console
      console.log('Updating existing group:', initialData.id)
      updateGroup(
        { id: initialData.id, data },
        {
          onSuccess: (response) => {
            // eslint-disable-next-line no-console
            console.log('Update Success Response:', response)
            toast.success('Option group updated')
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            // eslint-disable-next-line no-console
            console.error('Update Error:', error)
            toast.error('Failed to update option group')
          },
        }
      )
    } else {
      // eslint-disable-next-line no-console
      console.log('Creating new group')
      createGroup(data, {
        onSuccess: (response) => {
          // eslint-disable-next-line no-console
          console.log('Create Success Response:', response)
          toast.success('Option group created')
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          // eslint-disable-next-line no-console
          console.error('Create Error:', error)
          toast.error('Failed to create option group')
        },
      })
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full flex-col gap-6 overflow-y-auto p-4 sm:max-w-2xl'>
        <SheetHeader>
          <SheetTitle>
            {initialData ? 'Edit Option Group' : 'Create Option Group'}
          </SheetTitle>
          <SheetDescription>
            Define a set of options (variants, modifiers, or add-ons) for your
            products.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-1 flex-col'
          >
            <Tabs defaultValue='general' className='flex-1'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='general'>General Settings</TabsTrigger>
                <TabsTrigger value='recipes'>Recipes</TabsTrigger>
              </TabsList>

              <TabsContent value='general' className='flex-1 space-y-6 pt-4'>
                <div className='grid gap-4'>
                  <FormField
                    control={form.control}
                    name='name.en'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Name (Internal/English)</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g. Milk Options' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='type'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select type' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(OptionType).map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='sku'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input placeholder='GRP-MILK-001' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='minSelect'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Selection</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              {...field}
                              value={field.value as number}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormDescription>0 for optional</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='maxSelect'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Selection</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              {...field}
                              value={field.value as number}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Limit choices (e.g. 1 for single pick)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-sm font-medium'>Choices</h3>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        append({
                          name: { en: '' },
                          sku: '',
                          price: 0,
                          recipes: [],
                        })
                      }
                    >
                      <Plus className='mr-2 h-3.5 w-3.5' /> Add Choice
                    </Button>
                  </div>

                  <div className='space-y-4'>
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className='grid gap-4 rounded-lg border p-4'
                      >
                        <div className='grid grid-cols-[1fr_1fr_100px_auto] items-start gap-2'>
                          <FormField
                            control={form.control}
                            name={`choices.${index}.name.en`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='text-xs'>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder='Choice Name' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`choices.${index}.sku`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='text-xs'>SKU</FormLabel>
                                <FormControl>
                                  <Input placeholder='SKU' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`choices.${index}.price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='text-xs'>
                                  Add-on Price
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type='number'
                                    placeholder='Price'
                                    {...field}
                                    value={field.value as number}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className='pt-8'>
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              onClick={() => remove(index)}
                              disabled={fields.length === 1}
                            >
                              <Trash2 className='h-4 w-4 text-muted-foreground hover:text-destructive' />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='recipes' className='flex-1 space-y-6 pt-4'>
                <div className='space-y-1'>
                  <h3 className='font-medium'>Choice Recipes</h3>
                  <p className='text-sm text-muted-foreground'>
                    Define ingredients for each choice below.
                  </p>
                </div>

                <div className='space-y-6'>
                  {fields.map((field, index) => {
                    const choiceId = form.getValues(`choices.${index}.id`)
                    const choiceName = getChoiceName(index)

                    return (
                      <div
                        key={field.id}
                        className='rounded-lg border p-4 shadow-sm'
                      >
                        <h4 className='mb-4 text-sm font-semibold'>
                          {choiceName}
                        </h4>
                        <RecipeInline
                          control={form.control}
                          name={`choices.${index}.recipes`}
                          choiceId={choiceId || null}
                        />
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>

            <div className='mt-6 flex justify-end border-t pt-4'>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Saving...' : initialData ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
