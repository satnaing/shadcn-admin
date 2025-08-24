import { type Control, Controller } from 'react-hook-form';
import { MultiSelect, type MultiSelectOption } from '@/components/ui/multi-select';
import { COUNTRIES } from '@/features/icp/constants/countries';

interface CountrySelectorProps {
  control: Control<any>;
  name: string;
}

export default function CountrySelector({ control, name }: CountrySelectorProps) {
  // Convert countries to MultiSelectOption format
  const countryOptions: MultiSelectOption[] = COUNTRIES.map(country => ({
    label: country.label,
    value: country.value,
  }));

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      render={({ field }) => (
        <MultiSelect
          options={countryOptions}
          onValueChange={field.onChange}
          defaultValue={field.value || []}
          placeholder="Select countries..."
          searchable={true}
          className="w-full"
        />
      )}
    />
  );
}
