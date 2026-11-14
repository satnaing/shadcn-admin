import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { ThemeSummary } from '../data/themes.type'
import { useThemeT } from '../hooks/useThemeT'
import { useCompatibilityQuery, useActivateTheme } from '../hooks/useThemes'

interface ThemeActivateDialogProps {
  theme: ThemeSummary | null
  onClose: () => void
}

/** Shows which existing page sections the new theme's catalogue lacks before switching. */
export function ThemeActivateDialog({ theme, onClose }: ThemeActivateDialogProps) {
  const t = useThemeT()
  const report = useCompatibilityQuery(theme?.id ?? null)
  const activate = useActivateTheme()
  const issues = report.data?.data ?? []

  return (
    <AlertDialog open={theme !== null} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('themesPage.confirmTitle', { name: theme?.name })}</AlertDialogTitle>
          <AlertDialogDescription>{t('themesPage.confirmBody')}</AlertDialogDescription>
        </AlertDialogHeader>

        {report.isLoading && <Skeleton className='h-16 w-full' />}
        {!report.isLoading && issues.length === 0 && (
          <p className='text-sm text-muted-foreground'>{t('themesPage.noIssues')}</p>
        )}
        {issues.length > 0 && (
          <ul className='max-h-48 space-y-1 overflow-auto text-sm'>
            {issues.map((issue) => (
              <li key={`${issue.page}-${issue.component}`}>
                <span className='font-medium'>{issue.page}</span> — {issue.component}
              </li>
            ))}
          </ul>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
          <Button
            disabled={!theme || activate.isPending || report.isLoading}
            onClick={() => theme && activate.mutate(theme.id, { onSuccess: onClose })}
          >
            {t('themesPage.activate')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
