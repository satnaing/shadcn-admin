import { Form, useNavigation, type FetcherWithComponents } from 'react-router'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

interface ConfirmDialogProps<T> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  disabled?: boolean
  desc: React.JSX.Element | string
  cancelBtnText?: string
  confirmText?: React.ReactNode
  destructive?: boolean
  isLoading?: boolean
  fetcher?: FetcherWithComponents<T>
  action?: string
  className?: string
  children?: React.ReactNode
}

export function ConfirmDialog<T>(props: ConfirmDialogProps<T>) {
  const {
    title,
    desc,
    children,
    className,
    confirmText,
    cancelBtnText,
    destructive,
    isLoading,
    disabled = false,
    fetcher,
    action,
    ...actions
  } = props
  const navigation = useNavigation()

  return (
    <AlertDialog {...actions}>
      <AlertDialogContent className={cn(className && className)}>
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>{desc}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelBtnText ?? 'Cancel'}
          </AlertDialogCancel>
          {fetcher ? (
            <fetcher.Form method="POST" action={action}>
              <Button
                type="submit"
                variant={destructive ? 'destructive' : 'default'}
                disabled={
                  disabled || isLoading || fetcher.state === 'submitting'
                }
              >
                {confirmText ?? 'Continue'}
              </Button>
            </fetcher.Form>
          ) : (
            <Form method="POST" action={action}>
              <Button
                type="submit"
                variant={destructive ? 'destructive' : 'default'}
                disabled={
                  disabled || isLoading || navigation.state === 'submitting'
                }
              >
                {confirmText ?? 'Continue'}
              </Button>
            </Form>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
