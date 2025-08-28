import * as React from 'react'
import * as z from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type Trigger,
  TriggerType,
  TrackingScriptIdentificationMode,
} from '@/graphql/global/types.generated'
import { Plus, X, ExternalLink, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { generateTrackingScript } from '@/utils/tracking-script'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CountrySelector from '@/components/country-selector'
import { Loadable } from '@/components/loadable'
import {
  useTrackingScriptUpdateMutation,
  useTrackingScriptQuery,
  useTrackingScriptDomainUpdateMutation,
} from '../../../graphql/operations.generated'

const websiteVisitorSchema = z.object({
  excludedPaths: z.array(z.object({ path: z.string().min(1, 'Path is required') })).optional(),
  allowedCountryCodes: z.array(z.string()).optional(),
  minimumSessionTimeSec: z.number().min(1).max(120).optional(),
  identificationMode: z.nativeEnum(TrackingScriptIdentificationMode).optional(),
  dailyLimit: z.number().min(1).max(1000).optional(),
})

type WebsiteVisitorConfig = z.infer<typeof websiteVisitorSchema>

interface TriggerConfigModalProps {
  trigger: Trigger | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function TriggerConfigModal({
  trigger,
  isOpen,
  onClose,
  onSuccess,
}: TriggerConfigModalProps) {
  const [updateTrackingScript, { loading }] = useTrackingScriptUpdateMutation()
  const [updateDomain, { loading: domainLoading }] = useTrackingScriptDomainUpdateMutation()
  const { data: trackingScriptData, loading: queryLoading } = useTrackingScriptQuery({
    skip: !isOpen || trigger?.type !== TriggerType.NewWebsiteVisitor,
  })

  // Domain state
  const [domain, setDomain] = React.useState('')
  const [domainError, setDomainError] = React.useState<string | null>(null)

  const trackingScript = trackingScriptData?.trackingScript

  // Use tracking script data if available, otherwise fall back to trigger config or defaults
  const defaultConfig: WebsiteVisitorConfig = React.useMemo(() => {
    return {
      excludedPaths: trackingScript?.excludedPaths || [],
      allowedCountryCodes: trackingScript?.allowedCountryCodes || [],
      minimumSessionTimeSec: trackingScript?.minimumSessionTimeSec || 10,
      identificationMode:
        trackingScript?.identificationMode || TrackingScriptIdentificationMode.All,
      dailyLimit: trackingScript?.dailyLimit || 100,
    }
  }, [trackingScript])

  const form = useForm<WebsiteVisitorConfig>({
    resolver: zodResolver(websiteVisitorSchema),
    defaultValues: defaultConfig,
  })

  // Reset form when tracking script data changes
  React.useEffect(() => {
    if (trackingScript) {
      form.reset(defaultConfig)
      setDomain(trackingScript.domain || '')
    }
  }, [trackingScript, defaultConfig, form])

  // Domain validation function
  const validateDomain = (value: string): boolean => {
    const trimmed = value.trim()
    if (!trimmed.includes('.') || trimmed.includes(' ')) {
      setDomainError('Please enter a valid domain (must include "." and no spaces)')
      return false
    }
    setDomainError(null)
    return true
  }

  // Domain update handler
  const handleDomainUpdate = async () => {
    const trimmedDomain = domain.trim()

    if (!validateDomain(trimmedDomain)) {
      return
    }

    try {
      await updateDomain({
        variables: {
          input: {
            domain: trimmedDomain,
          },
        },
      })

      toast.success(
        'Domain updated successfully! Tag @swan in Slack to verify the script installation.'
      )
      onSuccess?.()
    } catch (error: any) {
      toast.error(`Failed to update domain: ${error.message}`)
    }
  }

  // Domain change handler
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDomain(value)
    if (value) {
      validateDomain(value)
    } else {
      setDomainError(null)
    }
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'excludedPaths',
  })

  const handleSave = async (data: WebsiteVisitorConfig) => {
    try {
      await updateTrackingScript({
        variables: {
          input: {
            excludedPaths: data.excludedPaths,
            allowedCountryCodes: data.allowedCountryCodes,
            minimumSessionTimeSec: data.minimumSessionTimeSec,
            identificationMode: data.identificationMode || TrackingScriptIdentificationMode.All,
            dailyLimit: data.dailyLimit,
          },
        },
      })

      toast.success('Trigger configuration saved')
      onSuccess?.()
      onClose()
    } catch (error: any) {
      toast.error(`Failed to save configuration: ${error.message}`)
    }
  }

  if (!trigger || trigger.type !== TriggerType.NewWebsiteVisitor) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Configure Website Visitor Trigger</DialogTitle>
        </DialogHeader>

        <Loadable isLoading={queryLoading} label='Loading settings...'>
          <Tabs defaultValue='settings' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='settings'>Settings</TabsTrigger>
              <TabsTrigger value='script'>Script</TabsTrigger>
            </TabsList>

            <TabsContent value='settings' className='mt-6 space-y-6'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSave)} className='space-y-8'>
                  {/* Excluded Paths */}
                  <FormItem>
                    <FormLabel>Excluded Paths</FormLabel>
                    <FormDescription>
                      The script will not be loaded on pages containing these paths
                    </FormDescription>
                    <div className='space-y-2'>
                      {fields.map((field, index) => (
                        <FormField
                          key={field.id}
                          control={form.control}
                          name={`excludedPaths.${index}.path`}
                          render={({ field }) => (
                            <div className='flex items-center gap-2'>
                              <span className='text-muted-foreground w-6 text-sm'>
                                {index + 1}.
                              </span>
                              <FormControl>
                                <Input {...field} placeholder='/excluded-path' className='flex-1' />
                              </FormControl>
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                onClick={() => remove(index)}
                              >
                                <X className='h-4 w-4' />
                              </Button>
                            </div>
                          )}
                        />
                      ))}
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => append({ path: '' })}
                      >
                        <Plus className='mr-2 h-4 w-4' />
                        Add Path
                      </Button>
                    </div>
                  </FormItem>

                  {/* Minimum Session Time */}
                  <FormField
                    control={form.control}
                    name='minimumSessionTimeSec'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Session Time (seconds)</FormLabel>
                        <FormDescription>
                          Sessions shorter than this will not be identified
                        </FormDescription>
                        <FormControl>
                          <div className='flex items-center gap-4'>
                            <Slider
                              min={1}
                              max={120}
                              step={1}
                              value={[field.value || 10]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className='flex-1'
                            />
                            <span className='w-12 text-right text-sm font-medium'>
                              {field.value || 10}s
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Allowed Countries */}
                  <FormItem>
                    <FormLabel>Allowed Countries</FormLabel>
                    <FormDescription>Only identify visitors from these countries</FormDescription>
                    <FormControl>
                      <CountrySelector control={form.control} name='allowedCountryCodes' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  {/* Identification Mode */}
                  <FormField
                    control={form.control}
                    name='identificationMode'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormLabel>Who should we identify?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className='flex flex-col space-y-1'
                          >
                            <FormItem className='flex items-center space-y-0 space-x-3'>
                              <FormControl>
                                <RadioGroupItem value={TrackingScriptIdentificationMode.All} />
                              </FormControl>
                              <FormLabel className='font-normal'>
                                People (USA Only) & Companies (Global)
                              </FormLabel>
                            </FormItem>
                            <FormItem className='flex items-center space-y-0 space-x-3'>
                              <FormControl>
                                <RadioGroupItem
                                  value={TrackingScriptIdentificationMode.OnlyContacts}
                                />
                              </FormControl>
                              <FormLabel className='font-normal'>Only People (USA Only)</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Daily Limit */}
                  <FormField
                    control={form.control}
                    name='dailyLimit'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Identification Limit</FormLabel>
                        <FormDescription>Maximum identifications per day</FormDescription>
                        <FormControl>
                          <div className='flex items-center gap-2'>
                            <Input
                              type='number'
                              min={1}
                              max={1000}
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              className='w-32'
                            />
                            <span className='text-muted-foreground text-sm'>identifications</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type='button' variant='outline' onClick={onClose} disabled={loading}>
                      Cancel
                    </Button>
                    <Button type='submit' loading={loading}>
                      Save Configuration
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value='script' className='mt-6 space-y-6'>
              <div className='space-y-6'>
                {/* Domain Management Section */}
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <Label>Allowed Domain</Label>
                    {trackingScript?.isVerified !== undefined && (
                      <div
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          trackingScript.isVerified
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {trackingScript.isVerified ? 'Verified' : 'Not Verified'}
                      </div>
                    )}
                  </div>
                  <div className='flex gap-2'>
                    <Input
                      placeholder='example.com'
                      value={domain}
                      onChange={handleDomainChange}
                      className={domainError ? 'border-red-500' : ''}
                    />
                    <Button
                      onClick={handleDomainUpdate}
                      disabled={
                        !!domainError || domain === (trackingScript?.domain || '') || domainLoading
                      }
                      loading={domainLoading}
                    >
                      Update Domain
                    </Button>
                  </div>
                  {domainError ? (
                    <p className='text-sm text-red-500'>{domainError}</p>
                  ) : (
                    <p className='text-muted-foreground text-sm'>
                      The tracking script will only run on this domain
                    </p>
                  )}
                </div>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label>Installation Code</Label>
                    <p className='text-muted-foreground text-sm'>
                      Add the following code to the{' '}
                      <code className='bg-muted rounded px-1 py-0.5'>head</code> tag section of your
                      website to start identifying your website visitors.{' '}
                      <a
                        href='https://swan-ai.notion.site/script-setup'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary inline-flex items-center gap-1 hover:underline'
                      >
                        Detailed Instructions <ExternalLink className='h-3 w-3' />
                      </a>
                    </p>
                    <div className='relative w-full'>
                      <pre className='bg-muted rounded-md p-4 text-sm break-all whitespace-pre-wrap'>
                        <code>{generateTrackingScript(trackingScript?.pk)}</code>
                      </pre>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute top-2 right-2'
                        onClick={() => {
                          navigator.clipboard.writeText(generateTrackingScript(trackingScript?.pk))
                          toast.success('Tracking script copied to clipboard')
                        }}
                      >
                        <Copy className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Loadable>
      </DialogContent>
    </Dialog>
  )
}
