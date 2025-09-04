import { IconHubspot } from '@/assets/brand-icons'

export function HubspotTriggerCard() {
  return (
    <div className='bg-muted/30 relative cursor-default rounded-lg border border-dashed p-4'>
      <div className='flex items-start gap-3'>
        <div className='rounded-lg bg-orange-500/10 p-2'>
          <IconHubspot className='h-5 w-5 text-orange-500' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='mb-1 flex items-center gap-2'>
            <h4 className='truncate font-medium'>HubSpot Workflow</h4>
            <span className='bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs'>
              Default
            </span>
          </div>
          <p className='text-muted-foreground line-clamp-2 text-sm'>
            Any play can be triggered by using the dedicated Swan workflow action in HubSpot
          </p>
        </div>
      </div>
    </div>
  )
}
