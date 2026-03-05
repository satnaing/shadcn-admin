import { useRef, useState } from 'react'
import {
  FileSpreadsheet,
  AlertCircle,
  ArrowRight,
  Check,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import * as XLSX from 'xlsx'
import { cn } from '@/lib/utils'
import { getTranslation } from '@/utils/i18n'
import { useUnits, useCreateIngredient } from '@/hooks/queries/use-inventory'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface IngredientImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ParsedIngredient {
  id: string
  name: string
  sku: string
  category: string
  unitString: string
  cost: number
  isValid: boolean
  errors: string[]
  overrideUnitId?: string
}

export function IngredientImportDialog({
  open,
  onOpenChange,
}: IngredientImportDialogProps) {
  const [step, setStep] = useState<
    'upload' | 'mapping' | 'preview' | 'importing'
  >('upload')
  const [parsedData, setParsedData] = useState<ParsedIngredient[]>([])
  const [uniqueUnits, setUniqueUnits] = useState<string[]>([])
  const [unitMappings, setUnitMappings] = useState<Record<string, string>>({})
  const [isDragging, setIsDragging] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResults, setImportResults] = useState<{
    success: number
    failed: number
  }>({
    success: 0,
    failed: 0,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: systemUnits } = useUnits()
  const createIngredient = useCreateIngredient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      parseExcel(selectedFile)
    }
  }

  const parseExcel = async (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]

        const rawData = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
        }) as any[][]

        // Find header row index
        let headerRowIndex = 0
        const headerKeywords = ['name', 'sku', 'unit', 'cost']

        for (let i = 0; i < Math.min(rawData.length, 20); i++) {
          const rowStr = JSON.stringify(rawData[i]).toLowerCase()
          let matches = 0
          headerKeywords.forEach((keyword) => {
            if (rowStr.includes(keyword)) matches++
          })

          if (matches >= 2) {
            headerRowIndex = i
            break
          }
        }

        // Re-parse with correct header row
        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          range: headerRowIndex,
        })

        const parsed: ParsedIngredient[] = []
        const units = new Set<string>()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jsonData.forEach((row: any) => {
          const name = row['Name'] || row['name']
          if (!name) return // Filter out rows without name

          const sku = row['SKU'] || row['sku']
          const category = row['Category'] || row['category']
          const unitString = row['Unit'] || row['unit'] || ''
          const cost = parseFloat(
            row['Cost/Unit'] || row['cost'] || row['Price'] || '0'
          )

          const errors: string[] = []
          if (!sku) errors.push('SKU is required')

          if (unitString) units.add(unitString)

          parsed.push({
            id: uuidv4(),
            name: String(name || ''),
            sku: String(sku || ''),
            category: String(category || ''),
            unitString: String(unitString),
            cost: isNaN(cost) ? 0 : cost,
            isValid: errors.length === 0,
            errors,
          })
        })

        setParsedData(parsed)
        setUniqueUnits(Array.from(units))

        if (units.size > 0) {
          setStep('mapping')
        } else {
          setStep('preview')
        }
      } catch (_error) {
        toast.error('Failed to parse Excel file')
      }
    }
    reader.readAsBinaryString(file)
  }

  const handleUnitMappingChange = (
    unitString: string,
    systemUnitId: string
  ) => {
    setUnitMappings((prev) => ({
      ...prev,
      [unitString]: systemUnitId,
    }))
  }

  const proceedToPreview = () => {
    // Validate mappings
    const missingMappings = uniqueUnits.filter((u) => !unitMappings[u])
    if (missingMappings.length > 0) {
      toast.error(`Please map all units: ${missingMappings.join(', ')}`)
      return
    }
    setStep('preview')
  }

  const startImport = async () => {
    setStep('importing')
    setImportProgress(0)

    let successCount = 0
    let failedCount = 0

    // Filter valid items only
    const validItems = parsedData.filter((item) => item.isValid)
    const totalItems = validItems.length

    if (totalItems === 0) {
      toast.error('No valid items to import')
      setStep('preview')
      return
    }

    // Process sequentially to avoid overwhelming the server
    for (let i = 0; i < totalItems; i++) {
      const item = validItems[i]
      const systemUnitId = item.overrideUnitId || unitMappings[item.unitString]

      if (!systemUnitId) {
        failedCount++
        continue
      }

      try {
        await createIngredient.mutateAsync({
          name: { en: item.name }, // Assuming English name from Excel
          sku: item.sku,
          unitId: systemUnitId,
          cost: item.cost,
        })
        successCount++
      } catch (_error) {
        failedCount++
      }

      setImportProgress(Math.round(((i + 1) / totalItems) * 100))
    }

    setImportResults({ success: successCount, failed: failedCount })
    toast.success(
      `Import complete: ${successCount} imported, ${failedCount} failed`
    )

    // Reset after delay or user action? For now let them see the result
  }

  const resetDialog = () => {
    setStep('upload')
    setParsedData([])
    setUniqueUnits([])
    setUnitMappings({})
    setImportProgress(0)
    setImportResults({ success: 0, failed: 0 })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemoveRow = (id: string) => {
    setParsedData((prev) => prev.filter((item) => item.id !== id))
  }

  const handleRowUnitChange = (id: string, unitId: string) => {
    // Find the unit string for this ID to update the mapping just for this?
    // No, we want to override the mapping for this specific row or effectively "set" the unit.
    // Easiest way in this architecture:
    // We can't easily change the "unitString" because that keys the mapping.
    // But we can add a "mappedUnitId" override to the ParsedIngredient item?
    // Or, since we are using unitMappings keyed by string, we can't do row-specific overrides easily if they share the string.
    // BUT if the string is empty or unique, it works.
    // Wait, user requirement: "Allow user to map their own unit".
    // If 5 items have "kg" and I change one, do I change all? Usually yes for "mapping".
    // But if I want to change JUST ONE row's unit?
    // Let's allow changing the "Unit String" effectively, or just add a `finalUnitId` field to ParsedIngredient
    // which defaults to the mapped one but can be overridden.

    setParsedData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, overrideUnitId: unitId }
        }
        return item
      })
    )
  }
  const handleRowChange = (
    id: string,
    field: keyof ParsedIngredient,
    value: string | number
  ) => {
    setParsedData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          // Re-validate
          const errors: string[] = []
          if (!updatedItem.name) errors.push('Name is required')
          if (!updatedItem.sku) errors.push('SKU is required')
          return { ...updatedItem, isValid: errors.length === 0, errors }
        }
        return item
      })
    )
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      parseExcel(file)
    } else if (file) {
      toast.error('Please upload an Excel file (.xlsx, .xls)')
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Only reset if fully closed, but maybe we want to keep state if accidentally closed?
      // For now, reset on close for simplicity
      setTimeout(resetDialog, 300)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='flex max-h-[90vh] max-w-3xl flex-col'>
        <DialogHeader>
          <DialogTitle>Import Ingredients</DialogTitle>
          <DialogDescription>
            Bulk import ingredients from an Excel file.
          </DialogDescription>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto py-4'>
          {step === 'upload' && (
            <div
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/10'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileSpreadsheet className='mb-4 h-12 w-12 text-muted-foreground' />
              <h3 className='mb-2 text-lg font-semibold'>Upload Excel File</h3>
              <p className='mb-4 text-sm text-muted-foreground'>
                Drag and drop or click to select a file (.xlsx, .xls)
              </p>
              <input
                ref={fileInputRef}
                type='file'
                accept='.xlsx, .xls'
                className='hidden'
                onChange={handleFileChange}
              />
              <Button variant='outline'>Select File</Button>
            </div>
          )}

          {step === 'mapping' && (
            <div className='space-y-4'>
              <Alert>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>Map Units</AlertTitle>
                <AlertDescription>
                  Map the units found in your Excel file to the system units.
                </AlertDescription>
              </Alert>

              <div className='grid gap-4'>
                {uniqueUnits.map((unitString) => (
                  <div
                    key={unitString}
                    className='flex items-center justify-between rounded-md border p-3'
                  >
                    <div className='font-medium'>{unitString}</div>
                    <ArrowRight className='mx-4 h-4 w-4 text-muted-foreground' />
                    <Select
                      value={unitMappings[unitString] || ''}
                      onValueChange={(value) =>
                        handleUnitMappingChange(unitString, value)
                      }
                    >
                      <SelectTrigger className='w-[200px]'>
                        <SelectValue placeholder='Select system unit' />
                      </SelectTrigger>
                      <SelectContent>
                        {(Array.isArray(systemUnits)
                          ? systemUnits
                          : (systemUnits as any)?.data || []
                        ).map((u: any) => (
                          <SelectItem key={u.id} value={u.id}>
                            {getTranslation(u.name)} ({getTranslation(u.symbol)}
                            )
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='font-medium'>Data Preview</h3>
                <span className='text-sm text-muted-foreground'>
                  {parsedData.filter((i) => i.isValid).length} valid items found
                </span>
              </div>

              <ScrollArea className='h-[400px] rounded-md border'>
                <div className='min-w-[800px]'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Mapped Unit</TableHead>
                        <TableHead className='text-right'>Cost</TableHead>
                        <TableHead className='w-[50px]'></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.map((item) => {
                        const systemUnitId =
                          item.overrideUnitId || unitMappings[item.unitString]
                        const systemUnit = (
                          Array.isArray(systemUnits)
                            ? systemUnits
                            : (systemUnits as any)?.data || []
                        ).find((u: any) => u.id === systemUnitId)
                        const isMapped = !!systemUnit

                        return (
                          <TableRow key={item.id}>
                            <TableCell className='min-w-[200px]'>
                              <Input
                                value={item.name}
                                onChange={(e) =>
                                  handleRowChange(
                                    item.id,
                                    'name',
                                    e.target.value
                                  )
                                }
                                className={cn(
                                  'h-8',
                                  !item.name && 'border-destructive'
                                )}
                              />
                            </TableCell>
                            <TableCell className='min-w-[150px]'>
                              <Input
                                value={item.sku}
                                onChange={(e) =>
                                  handleRowChange(
                                    item.id,
                                    'sku',
                                    e.target.value
                                  )
                                }
                                className={cn(
                                  'h-8',
                                  !item.sku && 'border-destructive'
                                )}
                              />
                            </TableCell>
                            <TableCell className='min-w-[160px]'>
                              <Select
                                value={systemUnitId || ''}
                                onValueChange={(val) =>
                                  handleRowUnitChange(item.id, val)
                                }
                              >
                                <SelectTrigger
                                  className={`h-8 w-full ${!isMapped ? 'border-destructive' : ''}`}
                                >
                                  <SelectValue
                                    placeholder={
                                      item.unitString || 'Select Unit'
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {(Array.isArray(systemUnits)
                                    ? systemUnits
                                    : (systemUnits as any)?.data || []
                                  ).map((u: any) => (
                                    <SelectItem
                                      key={u.id}
                                      value={u.id || `unit-${u.symbol.en}`}
                                    >
                                      {getTranslation(u.name)} (
                                      {getTranslation(u.symbol)})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className='min-w-[100px] text-right'>
                              <Input
                                type='number'
                                value={item.cost}
                                onChange={(e) =>
                                  handleRowChange(
                                    item.id,
                                    'cost',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className='h-8 text-right'
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8 text-muted-foreground hover:text-destructive'
                                onClick={() => handleRemoveRow(item.id)}
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
                <ScrollBar orientation='horizontal' />
              </ScrollArea>

              {parsedData.length === 0 && (
                <div className='py-8 text-center text-muted-foreground'>
                  No items to display.
                </div>
              )}

              {parsedData.some((i) => !i.isValid && i.errors.length > 0) && (
                <Alert variant='destructive'>
                  <AlertTitle>Validation Errors</AlertTitle>
                  <AlertDescription>
                    Some items have missing required fields or invalid data.
                    These rows will be skipped.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {step === 'importing' && (
            <div className='flex flex-col items-center justify-center space-y-6 py-12'>
              {importProgress < 100 ? (
                <>
                  <h3 className='text-lg font-medium'>
                    Importing Ingredients...
                  </h3>
                  <Progress value={importProgress} className='w-[60%]' />
                  <p className='text-sm text-muted-foreground'>
                    Please wait while we process your file.
                  </p>
                </>
              ) : (
                <>
                  <div className='mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600'>
                    <Check className='h-6 w-6' />
                  </div>
                  <h3 className='text-xl font-semibold'>Import Complete</h3>
                  <div className='space-y-1 text-center'>
                    <p className='font-medium text-green-600'>
                      {importResults.success} successfully imported
                    </p>
                    {importResults.failed > 0 && (
                      <p className='font-medium text-destructive'>
                        {importResults.failed} failed
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => handleOpenChange(false)}
                    className='mt-4'
                  >
                    Close
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {step !== 'importing' && (
            <Button variant='outline' onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
          )}

          {step === 'mapping' && (
            <Button onClick={proceedToPreview}>
              Next <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          )}

          {step === 'preview' && (
            <Button
              onClick={startImport}
              disabled={
                parsedData.filter(
                  (i) =>
                    (i.overrideUnitId || unitMappings[i.unitString]) &&
                    i.isValid
                ).length === 0
              }
            >
              Import Ingredients
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
