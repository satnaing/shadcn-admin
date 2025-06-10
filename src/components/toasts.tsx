import { IconProps } from '@tabler/icons-react'
import type { Icon } from '@tabler/icons-react'
import { useToast } from '@/hooks/use-toast'

const BaseToast = ({
  title,
  description,
  withCodeBlcok,
  Icon,
}: {
  title: string
  description?: string
  withCodeBlcok: boolean
  Icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
}) => {
  const { toast } = useToast()
  toast({
    variant: 'default',
    title: title,
    icon: Icon,
    description: withCodeBlcok ? (
      <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
        <code className='text-white'>
          {typeof description === 'object'
            ? JSON.stringify(description, null, 2)
            : description}
        </code>
      </pre>
    ) : (
      description
    ),
  })
}
