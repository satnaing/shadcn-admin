import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { EntityFormPage } from '@/components/forms/entity-form-page'
import { LocaleFormTabs } from '@/components/forms/locale-form-tabs'
import { useErrorLocale } from '@/components/forms/use-error-locale'
import { useEnglishSlugSync } from '@/components/forms/use-english-slug-sync'
import {
  type BlogFormValues,
  blogDefaults,
  blogSchema,
  blogToForm,
  blogToPayload,
} from '../data/blogs.schema'
import type { BlogDetail } from '../data/blogs.type'
import { useBlogMutations } from '../hooks/use-blog-mutations'
import { BlogFormAside } from './blog-form-aside'
import { BlogLocaleFields } from './blog-locale-fields'

/** Mount with `key={blog?.id}` so edit data is loaded once into the form. */
export function BlogForm({ blog }: { blog?: BlogDetail }) {
  const { t } = useTranslation('blogs')
  const navigate = useNavigate()
  const { create, update } = useBlogMutations()
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: blog ? blogToForm(blog) : blogDefaults,
  })
  useEnglishSlugSync(form)
  const { errorLocale, onInvalid } = useErrorLocale()

  const isCreate = !blog
  const mutation = isCreate ? create : update
  const submit = form.handleSubmit((values) => {
    const payload = blogToPayload(values)
    const onSuccess = () => navigate({ to: '/admin/blogs' })
    if (blog) update.mutate({ id: blog.id, values: payload }, { onSuccess })
    else create.mutate(payload, { onSuccess })
  }, onInvalid)

  return (
    <EntityFormPage
      backTo='/admin/blogs'
      form={form}
      title={t(isCreate ? 'form.createTitle' : 'form.editTitle')}
      description={t('form.description')}
      isCreate={isCreate}
      isPending={mutation.isPending}
      labels={{
        saving: t('form.saving'),
        saveAndExit: t('form.save'),
        updating: t('form.saving'),
        updateAndExit: t('form.save'),
      }}
      onSubmit={submit}
    >
      <div className='grid gap-6 lg:grid-cols-[1fr_20rem]'>
        <LocaleFormTabs key={errorLocale} defaultLocale={errorLocale}>{(locale) => <BlogLocaleFields form={form} locale={locale} />}</LocaleFormTabs>
        <BlogFormAside form={form} />
      </div>
    </EntityFormPage>
  )
}
