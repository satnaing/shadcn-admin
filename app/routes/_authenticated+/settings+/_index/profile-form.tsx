import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { XIcon } from 'lucide-react'
import { Form, Link, useActionData, useNavigation } from 'react-router'
import type { z } from 'zod'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { profileFormSchema, type action } from './route'

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValue: Partial<ProfileFormValues> = {
  bio: 'I own a computer.',
  urls: ['https://shadcn.com', 'http://twitter.com/shadcn'],
}

export default function ProfileForm() {
  const actionData = useActionData<typeof action>()
  const [form, fields] = useForm({
    lastResult: actionData?.lastResult,
    defaultValue,
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: profileFormSchema }),
  })
  const urls = fields.urls.getFieldList()
  const navigation = useNavigation()

  return (
    <Form method="POST" {...getFormProps(form)} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor={fields.username.id}>Username</Label>
        <Input
          {...getInputProps(fields.username, { type: 'text' })}
          key={fields.username.key}
          placeholder="shadcn"
        />
        <div className="text-[0.8rem] text-muted-foreground">
          This is your public display name. It can be your real name or a
          pseudonym. You can only change this once every 30 days.
        </div>
        <div
          id={fields.username.errorId}
          className="text-[0.8rem] font-medium text-destructive empty:hidden"
        >
          {fields.username.errors}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={fields.email.id}>Email</Label>
        <Select
          key={fields.email.key}
          defaultValue={fields.email.initialValue}
          name={fields.email.name}
          onValueChange={(value) => {
            form.update({
              name: fields.email.name,
              value,
            })
          }}
        >
          <SelectTrigger id={fields.email.id}>
            <SelectValue placeholder="Select a verified email to display" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="m@example.com">m@example.com</SelectItem>
            <SelectItem value="m@google.com">m@google.com</SelectItem>
            <SelectItem value="m@support.com">m@support.com</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-[0.8rem] text-muted-foreground">
          You can manage verified email addresses in your{' '}
          <Link to="/">email settings</Link>.
        </div>
        <div
          id={fields.email.errorId}
          className="text-[0.8rem] font-medium text-destructive empty:hidden"
        >
          {fields.email.errors}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={fields.bio.id}>Bio</Label>
        <Textarea
          {...getTextareaProps(fields.bio)}
          key={fields.bio.key}
          placeholder="Tell us a little bit about yourself"
          className="resize-none"
        />
        <div className="text-[0.8rem] text-muted-foreground">
          You can <span>@mention</span> other users and organizations to link to
          them.
        </div>
        <div
          id={fields.bio.errorId}
          className="text-[0.8rem] font-medium text-destructive empty:hidden"
        >
          {fields.bio.errors}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={fields.urls.id}>URLs</Label>
        <div className="text-[0.8rem] text-muted-foreground">
          Add links to your website, blog, or social media profiles.
        </div>

        {urls.map((url, index) => (
          <div key={url.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                {...getInputProps(url, { type: 'url' })}
                key={url.key}
                placeholder="https://example.com"
                className="flex-1"
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-muted-foreground"
                {...form.remove.getButtonProps({
                  name: fields.urls.name,
                  index,
                })}
              >
                <XIcon />
              </Button>
            </div>
            <div
              id={url.errorId}
              className="text-[0.8rem] font-medium text-destructive empty:hidden"
            >
              {url.errors}
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          {...form.insert.getButtonProps({
            name: fields.urls.name,
          })}
        >
          Add URL
        </Button>
      </div>

      {form.errors && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{form.errors}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={navigation.state === 'submitting'}>
        Update profile
      </Button>
    </Form>
  )
}
