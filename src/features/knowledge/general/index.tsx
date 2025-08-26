import { useState, useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useOrgInfoQuery,
  useOrgInfoUpdateMutation,
} from '@/graphql/operations/operations.generated'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Page } from '@/components/page'
import { GeneralKnowledgeSkeleton } from './components/general-knowledge-skeleton'

const orgInfoSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  description: z.string().min(1, 'Description is required'),
  competitors: z.string().optional(),
})

type OrgInfoFormValues = z.infer<typeof orgInfoSchema>

export default function GeneralKnowledge() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data, loading, error } = useOrgInfoQuery()
  const [updateOrgInfo] = useOrgInfoUpdateMutation()

  const form = useForm<OrgInfoFormValues>({
    resolver: zodResolver(orgInfoSchema),
    defaultValues: {
      name: '',
      description: '',
      competitors: '',
    },
  })

  // Update form values when data is loaded from API
  useEffect(() => {
    if (data?.orgInfo) {
      form.reset({
        name: data.orgInfo.name || '',
        description: data.orgInfo.description || '',
        competitors: data.orgInfo.competitors || '',
      })
    }
  }, [data, form])

  const onSubmit = async (values: OrgInfoFormValues) => {
    setIsSubmitting(true)
    try {
      await updateOrgInfo({
        variables: {
          input: values,
        },
      })

      toast.success('Organization information updated successfully')
    } catch (_error) {
      toast.error('Failed to update organization information')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (error) {
    return (
      <Page
        title='General Knowledge'
        description='Manage general information about your organization to help Swan better understand your business'
        className='max-w-4xl'
      >
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load organization information</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground text-sm'>{error.message}</p>
          </CardContent>
        </Card>
      </Page>
    )
  }

  return (
    <Page
      title='General Knowledge'
      description='Manage general information about your organization to help Swan better understand your business'
      className='max-w-4xl'
      loading={loading}
      skeleton={<GeneralKnowledgeSkeleton />}
    >
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your organization name' {...field} />
                    </FormControl>
                    <FormDescription>The official name of your organization</FormDescription>
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
                        placeholder='Describe what your organization does...'
                        className='min-h-[120px]'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A comprehensive description of your organization's mission, products, and
                      services
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='competitors'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competitors</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Describe your main competitors and how you differentiate...'
                        className='min-h-[120px]'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Who are your main competitors and how does your organization differentiate
                      itself?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex justify-end pt-4'>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Page>
  )
}
