 import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface UPIAnalyticsSearchProps {
  onSearch: (params: { report_type: string }) => void
  onReset: () => void
}

export function UPISearch({ onSearch, onReset }: UPIAnalyticsSearchProps) {
  const [fields, setFields] = useState<{ report_type: string }>({
    report_type: '',
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fields.report_type) return // don’t trigger if nothing is selected
    onSearch({ report_type: fields.report_type })
  }

  const handleReset = () => {
    setFields({ report_type: '' })
    onReset()
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
      {/* Report Type Dropdown */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-semibold">
            Report Type
          </label>
          <Select
            value={fields.report_type}
            onValueChange={(value) => setFields({ report_type: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons row */}
      <div className="mt-2 flex w-full gap-2">
        <Button
          type="submit"
          className="h-9"
          disabled={!fields.report_type}
        >
          Search
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-9"
          onClick={handleReset}
          disabled={!fields.report_type}
        >
          Reset
        </Button>
      </div>
    </form>
  )
}
