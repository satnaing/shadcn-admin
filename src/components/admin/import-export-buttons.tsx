import { useRef } from 'react'
import { Download, Upload, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { PermissionGuard } from '@/components/guard/permission-guard'
import { useExcelOperations } from '@/hooks/use-excel-operations'

interface ImportExportButtonsProps {
  exportUrl: string
  importUrl?: string
  fileName: string
  exportPermission: string
  importPermission?: string
  onImportSuccess?: () => void
}

export function ImportExportButtons({
  exportUrl,
  importUrl,
  fileName,
  exportPermission,
  importPermission,
  onImportSuccess,
}: ImportExportButtonsProps) {
  const { t } = useTranslation('common')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { exportMutation, importMutation } = useExcelOperations({
    exportUrl,
    importUrl,
    fileName,
  })

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    importMutation.mutate(file, {
      onSuccess: () => {
        onImportSuccess?.()
        if (fileInputRef.current) fileInputRef.current.value = ''
      },
      onSettled: () => {
        if (fileInputRef.current) fileInputRef.current.value = ''
      },
    })
  }

  return (
    <div className='flex items-center gap-2'>
      <PermissionGuard permission={exportPermission}>
        <Button
          variant='outline'
          size='sm'
          onClick={() => exportMutation.mutate()}
          disabled={exportMutation.isPending}
        >
          {exportMutation.isPending ? (
            <Loader2 className='mr-1 h-4 w-4 animate-spin' />
          ) : (
            <Download className='mr-1 h-4 w-4' />
          )}
          {t('excel.export')}
        </Button>
      </PermissionGuard>

      {importUrl && importPermission && (
        <PermissionGuard permission={importPermission}>
          <Button
            variant='outline'
            size='sm'
            onClick={() => fileInputRef.current?.click()}
            disabled={importMutation.isPending}
          >
            {importMutation.isPending ? (
              <Loader2 className='mr-1 h-4 w-4 animate-spin' />
            ) : (
              <Upload className='mr-1 h-4 w-4' />
            )}
            {t('excel.import')}
          </Button>
          <input
            ref={fileInputRef}
            type='file'
            accept='.xlsx,.xls,.csv'
            className='hidden'
            onChange={handleImport}
          />
        </PermissionGuard>
      )}
    </div>
  )
}
