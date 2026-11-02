import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmailTemplateDialog } from './components/email-template-dialog'
import type { EmailTemplate } from './data/marketing.type'
import { useEmailTemplates } from './hooks/useMarketing'
import { useMessagingMutations } from './hooks/useMessagingMutations'

export function EmailTemplatesPage() {
  const { data: templates = [], isLoading } = useEmailTemplates()
  const { saveEmailTemplate } = useMessagingMutations()
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleEdit = (tmpl: EmailTemplate) => {
    setSelectedTemplate(tmpl)
    setDialogOpen(true)
  }

  return (
    <>
      <AdminHeader />
      <Main className='space-y-4 p-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>E-poçt Şablonları</h1>
          <p className='text-sm text-muted-foreground'>
            Sistem e-poçt bildirişlərinin məzmunu və dəyişənləri
          </p>
        </div>
        <div className='rounded-md border bg-card'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Şablon Adı</TableHead>
                <TableHead>Mövzu</TableHead>
                <TableHead>İdentifikator</TableHead>
                <TableHead className='text-center'>Status</TableHead>
                <TableHead className='text-right'>Əməliyyat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className='py-8 text-center text-sm text-muted-foreground'>
                    Yüklənir...
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((t: EmailTemplate) => (
                  <TableRow key={t.id}>
                    <TableCell className='font-medium'>{t.name}</TableCell>
                    <TableCell className='text-sm text-muted-foreground'>{t.subject}</TableCell>
                    <TableCell>
                      <Badge variant='outline' className='font-mono text-xs'>{t.identifier}</Badge>
                    </TableCell>
                    <TableCell className='text-center'>
                      <Badge variant={t.status ? 'default' : 'secondary'}>
                        {t.status ? 'Aktiv' : 'Qeyri-aktiv'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button variant='ghost' size='icon' onClick={() => handleEdit(t)}>
                        <Pencil className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <EmailTemplateDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          template={selectedTemplate}
          onSubmit={(d) => saveEmailTemplate.mutate(d)}
        />
      </Main>
    </>
  )
}
