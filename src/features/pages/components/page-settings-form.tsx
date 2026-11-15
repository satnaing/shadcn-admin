import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { showVariantSelect, useThemeVariants } from '@/shared/hooks/useThemeVariants'
import { FALLBACK_FORM_LOCALES } from '@/shared/constants/locales'
import type { PageDetail, PageSettingsPayload } from '../data/pages.type'

const toPayload = (page: PageDetail): PageSettingsPayload => ({
  title: page.title,
  slug: page.slug,
  status: page.status,
  is_homepage: page.is_homepage,
  publish_at: page.publish_at,
  header_variant: page.header_variant,
  footer_variant: page.footer_variant,
  seo: page.seo,
})

interface PageSettingsFormProps {
  page: PageDetail
  pending: boolean
  onSubmit: (payload: PageSettingsPayload) => void
}

export function PageSettingsForm({ page, pending, onSubmit }: PageSettingsFormProps) {
  const { t } = useTranslation('pages')
  const variants = useThemeVariants()
  const [lang, setLang] = useState<string>(FALLBACK_FORM_LOCALES[0])
  const form = useForm<PageSettingsPayload>({ defaultValues: toPayload(page) })
  const { register, control, handleSubmit } = form

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 overflow-y-auto px-4 pb-4'>
      <Tabs value={lang} onValueChange={setLang}>
        <TabsList>
          {FALLBACK_FORM_LOCALES.map((code) => (
            <TabsTrigger key={code} value={code} className='uppercase'>
              {code}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className='space-y-2' key={`t-${lang}`}>
        <Label>{t('fields.title')}</Label>
        <Input {...register(`title.${lang}`)} />
        <Label>{t('fields.slug')}</Label>
        <Input {...register(`slug.${lang}`)} />
        <Label>{t('seo.title')}</Label>
        <Input {...register(`seo.title.${lang}`)} />
        <Label>{t('seo.description')}</Label>
        <Textarea rows={3} {...register(`seo.description.${lang}`)} />
      </div>
      <div className='space-y-2'>
        <Label>{t('seo.canonical')}</Label>
        <Input {...register('seo.canonical')} />
      </div>
      <div className='grid grid-cols-2 gap-3'>
        <Controller
          control={control}
          name='status'
          render={({ field }) => (
            <div className='space-y-2'>
              <Label>{t('columns.status')}</Label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='draft'>{t('status.draft')}</SelectItem>
                  <SelectItem value='published'>{t('status.published')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
        <div className='space-y-2'>
          <Label>{t('fields.publishAt')}</Label>
          <Input type='datetime-local' {...register('publish_at', { setValueAs: (v) => v || null })} />
        </div>
        {showVariantSelect(variants) && (['header_variant', 'footer_variant'] as const).map((name) => (
          <Controller
            key={name}
            control={control}
            name={name}
            render={({ field }) => (
              <div className='space-y-2'>
                <Label>{t(`fields.${name}`)}</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {variants.map((variant) => (
                      <SelectItem key={variant} value={variant}>{variant}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        ))}
      </div>
      <Controller
        control={control}
        name='is_homepage'
        render={({ field }) => (
          <Label className='flex items-center gap-2'>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            {t('fields.isHomepage')}
          </Label>
        )}
      />
      <Button type='submit' disabled={pending}>{t('actions.save')}</Button>
    </form>
  )
}
