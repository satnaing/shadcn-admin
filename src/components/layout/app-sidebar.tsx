import { useLayout } from '@/context/layout-context'
import { Sidebar } from '@/components/ui/sidebar'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { collapsible, variant } = useLayout()
  return <Sidebar {...props} collapsible={collapsible} variant={variant} />
}
