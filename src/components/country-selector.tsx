import { type Control, Controller } from 'react-hook-form'
import { COUNTRIES, REGIONS } from '@/constants/countries'
import {
  MultiSelect,
  type MultiSelectGroup,
  type MultiSelectOption,
} from '@/components/ui/multi-select'

interface CountrySelectorProps {
  control: Control<any>
  name: string
  withRegions?: boolean
}

export default function CountrySelector({
  control,
  name,
  withRegions = false,
}: CountrySelectorProps) {
  const options: MultiSelectOption[] | MultiSelectGroup[] = withRegions
    ? [
        {
          heading: 'Regions',
          options: REGIONS.map((region) => ({
            label: region.label,
            value: region.value,
          })),
        },
        {
          heading: 'Countries',
          options: COUNTRIES.map((country) => ({
            label: country.label,
            value: country.value,
          })),
        },
      ]
    : COUNTRIES.map((country) => ({
        label: country.label,
        value: country.value,
      }))

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      render={({ field }) => (
        <MultiSelect
          options={options}
          maxCount={6}
          animationConfig={{
            optionHoverAnimation: 'none',
            badgeAnimation: 'none',
          }}
          onValueChange={field.onChange}
          defaultValue={field.value || []}
          placeholder={withRegions ? 'Select countries or regions...' : 'Select countries...'}
          searchable={true}
          className='w-full'
        />
      )}
    />
  )
}
