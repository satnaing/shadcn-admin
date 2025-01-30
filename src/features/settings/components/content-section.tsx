import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface ContentSectionProps {
  title: string
  desc: string
  children: React.JSX.Element
}

export default function ContentSection({
  title,
  desc,
  children,
}: ContentSectionProps) {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='flex-none'>
        <h3 className='text-lg font-medium'>{title}</h3>
        <p className='text-sm text-muted-foreground'>{desc}</p>
      </div>
      <Separator className='my-4 flex-none' />
      <ScrollArea className='faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16'>
        <div className='-mx-1 px-1.5 lg:max-w-xl'>{children}</div>
      </ScrollArea>
    </div>
  )
}
