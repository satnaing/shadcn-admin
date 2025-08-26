import { useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
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
import { Textarea } from '@/components/ui/textarea'
import {
  usePersonaUpsertMutation,
  type PersonaFieldsFragment,
} from '../../graphql/operations.generated'

const personaFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1300, 'Query must be less than 1300 characters'),
  valueProp: z
    .string()
    .min(1, 'Value proposition is required')
    .max(1300, 'Value proposition must be less than 1300 characters'),
  targetMarketIds: z.array(z.string()).min(1, 'At least one segment is required'),
})

type PersonaFormValues = z.infer<typeof personaFormSchema>

interface PersonaFormProps {
  persona?: PersonaFieldsFragment | null
  targetMarketId: string
  onSuccess: () => void
  onCancel: () => void
}

export default function PersonaForm({
  persona,
  targetMarketId,
  onSuccess,
  onCancel,
}: PersonaFormProps) {
  const [upsertPersona, { loading }] = usePersonaUpsertMutation({
    refetchQueries: ['TargetMarket', 'Personas'],
  })

  const form = useForm<PersonaFormValues>({
    resolver: zodResolver(personaFormSchema),
    defaultValues: {
      name: '',
      description: '',
      valueProp: '',
      targetMarketIds: [targetMarketId],
    },
  })

  useEffect(() => {
    if (persona) {
      form.reset({
        name: persona.name,
        description: persona.description || '',
        valueProp: persona.valueProp || '',
        // When editing, include all existing target markets plus the current one
        targetMarketIds: Array.from(
          new Set([...persona.targetMarkets.map((tm: any) => tm.targetMarketId), targetMarketId])
        ),
      })
    } else {
      form.reset({
        name: '',
        description: '',
        valueProp: '',
        targetMarketIds: [targetMarketId],
      })
    }
  }, [persona, targetMarketId, form])

  const onSubmit = async (data: PersonaFormValues) => {
    try {
      await upsertPersona({
        variables: {
          input: {
            id: persona?.id,
            name: data.name,
            description: data.description,
            valueProp: data.valueProp,
            maxContacts: 0, // As requested, ignoring max contacts
            targetMarketIds: data.targetMarketIds,
          },
        },
      })

      toast.success(`Persona ${persona ? 'updated' : 'created'} successfully`)

      onSuccess()
    } catch (error) {
      toast.error('Error saving persona', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Sales Leaders' {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='The most senior Sales executives at the company'
                  className='min-h-[100px]'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                How should Swan find this persona? Either provide job titles that match this
                persona, or describe it in plain English.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='valueProp'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value Proposition</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="We help sales leaders increase their team's productivity by automating lead qualification and personalized outreach..."
                  className='min-h-[120px]'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Describe what your company's value proposition is for this specific persona. What
                unique benefits do you offer them? How do you solve their specific pain points?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end gap-2'>
          <Button type='button' variant='outline' onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type='submit' disabled={loading}>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {persona ? 'Save' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
