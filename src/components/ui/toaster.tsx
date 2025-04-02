import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  variantIconMap,
} from '@/components/ui/toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        icon: CustomIcon,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        const DefaultIcon = variant
          ? variantIconMap[variant as keyof typeof variantIconMap]
          : undefined
        const Icon = CustomIcon || DefaultIcon

        return (
          <Toast key={id} variant={variant} {...props}>
            <div className='flex gap-4'>
              <div className='h-6 w-6'>{Icon && <Icon />}</div>
              <div className='grid gap-1'>
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
