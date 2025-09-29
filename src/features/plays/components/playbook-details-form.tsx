import { useState, useEffect } from 'react'
import { FileText } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export interface PlaybookDetailsData {
  name: string
  description: string
  outreachInstructions?: string
}

interface PlaybookDetailsFormProps {
  initialData?: PlaybookDetailsData
  onSave?: (data: PlaybookDetailsData) => Promise<void> | void
  onChange?: (data: PlaybookDetailsData) => void
  loading?: boolean
  disabled?: boolean
  showNameField?: boolean
  showSaveButton?: boolean
  cardProps?: React.ComponentProps<typeof Card>
}

export function PlaybookDetailsForm({
  initialData,
  onSave,
  onChange,
  loading = false,
  disabled = false,
  showNameField = false,
  showSaveButton = true,
  cardProps,
}: PlaybookDetailsFormProps) {
  const [formData, setFormData] = useState<PlaybookDetailsData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    outreachInstructions: initialData?.outreachInstructions || '',
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        outreachInstructions: initialData.outreachInstructions || '',
      })
    }
  }, [initialData])

  const handleChange = (field: keyof PlaybookDetailsData, value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onChange?.(newData)
  }

  const handleSave = async () => {
    if (!onSave) return

    setIsSaving(true)
    try {
      await onSave(formData)
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = initialData
    ? formData.name.trim() !== (initialData.name || '').trim() ||
      formData.description.trim() !== (initialData.description || '').trim() ||
      formData.outreachInstructions?.trim() !== (initialData.outreachInstructions || '').trim()
    : true

  const isDisabled = disabled || loading || isSaving

  return (
    <Card {...cardProps}>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Instructions
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {showNameField && (
          <div className='space-y-2'>
            <Label htmlFor='name'>Name *</Label>
            <Input
              id='name'
              placeholder='Enter playbook name'
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={isDisabled}
              required
            />
          </div>
        )}

        <div className='space-y-4'>
          <div>
            <h3 className='mb-1 text-base font-semibold'>Identity</h3>
            <p className='text-muted-foreground mb-3 text-sm'>
              Tell the Agent what its purpose is and what it's trying to achieve.
            </p>
            <Textarea
              id='description'
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder='My goal is... I always...'
              className='max-h-[200px] min-h-[100px] resize-none'
              disabled={isDisabled}
            />
          </div>
        </div>

        <Accordion type='single' collapsible className='w-full'>
          <AccordionItem value='outreach-instructions'>
            <AccordionTrigger>
              Outreach Instructions <span className='text-muted-foreground ml-1'>(Optional)</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className='space-y-2'>
                <Label htmlFor='outreach-instructions' className='sr-only'>
                  Outreach Instructions
                </Label>
                <Textarea
                  id='outreach-instructions'
                  value={formData.outreachInstructions}
                  onChange={(e) => handleChange('outreachInstructions', e.target.value)}
                  placeholder='Provide specific instructions for outreach messages and communication style'
                  className='max-h-[200px] min-h-[100px] resize-none'
                  disabled={isDisabled}
                />
                <p className='text-muted-foreground text-sm'>
                  Provide specific guidelines for how Swan should communicate and engage with
                  prospects
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {showSaveButton && onSave && (
          <div className='flex justify-end'>
            <Button
              size='sm'
              onClick={handleSave}
              disabled={isDisabled || !hasChanges}
              loading={isSaving}
            >
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
