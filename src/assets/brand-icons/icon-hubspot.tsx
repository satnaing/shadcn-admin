import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'

export function IconHubspot({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      role='img'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      className={cn('[&>path]:fill-current', className)}
      fill='currentColor'
      {...props}
    >
      <title>HubSpot</title>
      <path d='M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067c0 .89.535 1.67 1.267 1.945v2.857a6.754 6.754 0 00-3.811 2.339l-5.336-3.946A2.598 2.598 0 007.4 5.467a2.505 2.505 0 00-.534-1.542 2.532 2.532 0 00-3.62-.269 2.532 2.532 0 00-.269 3.62c.4.535 1.069.869 1.779.869.133 0 .269 0 .401-.033l5.27 3.913a6.729 6.729 0 00-.269 1.879 6.776 6.776 0 006.752 6.752 6.752 6.752 0 100-13.504c-.067 0-.167 0-.234.033zM16.837 18.332a4.484 4.484 0 01-4.47-4.47 4.508 4.508 0 014.47-4.468 4.484 4.484 0 014.469 4.469 4.508 4.508 0 01-4.47 4.469z' />
    </svg>
  )
}
