import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { PermissionGuard } from '@/components/guard'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PERMISSIONS } from '@/shared/permissions'
import type { PromptItem } from '../data/ai.type'
import { useAiPrompts } from '../hooks/use-ai'
import { AiPromptDialog } from './ai-prompt-dialog'

/** AEC "Prompt Templates": one card per template; only the text can be edited, never the variables. */
export function AiPromptsPage() {
  const { t } = useTranslation('ai')
  const [editing, setEditing] = useState<PromptItem | null>(null)
  const prompts = useAiPrompts().data?.data ?? []

  return (
    <AdminPageShell title={t('prompts.title')} description={t('prompts.description')}>
      <div className='grid max-w-4xl gap-4'>
        {prompts.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className='text-base'>{t(`prompts.names.${item.identifier}`)}</CardTitle>
              <CardAction>
                <PermissionGuard permission={PERMISSIONS.AI.PROMPTS_MANAGE}>
                  <Button size='sm' variant='outline' onClick={() => setEditing(item)}>
                    <Pencil className='size-4' /> {t('actions.edit')}
                  </Button>
                </PermissionGuard>
              </CardAction>
            </CardHeader>
            <CardContent>
              <pre className='max-h-56 overflow-auto rounded-md bg-muted p-3 text-sm whitespace-pre-wrap'>{item.prompt}</pre>
            </CardContent>
          </Card>
        ))}
      </div>
      {editing && <AiPromptDialog key={editing.id} item={editing} onOpenChange={(open) => !open && setEditing(null)} />}
    </AdminPageShell>
  )
}
