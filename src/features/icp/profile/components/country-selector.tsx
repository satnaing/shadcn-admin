import { type Control, Controller } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { useState } from 'react';
import { COUNTRIES, REGIONS, getFlagEmoji } from '@/features/icp/constants/countries';

interface CountrySelectorProps {
  control: Control<any>;
  name: string;
  withRegions?: boolean;
}

export default function CountrySelector({ control, name, withRegions = true }: CountrySelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Combine regions and countries if withRegions is true
  const allOptions = withRegions 
    ? [...REGIONS, ...COUNTRIES]
    : COUNTRIES;

  const filteredOptions = allOptions.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      render={({ field }) => {
        const selectedValues = field.value || [];

        const addLocation = (value: string) => {
          if (!selectedValues.includes(value)) {
            field.onChange([...selectedValues, value]);
          }
          setInputValue('');
          setShowSuggestions(false);
        };

        const removeLocation = (value: string) => {
          field.onChange(selectedValues.filter((v: string) => v !== value));
        };

        // Find the label for a value
        const getLabel = (value: string) => {
          const option = allOptions.find(opt => opt.value === value);
          return option ? option.label : value;
        };

        // Check if it's a country code to show flag
        const isCountryCode = (value: string) => {
          return COUNTRIES.some(country => country.value === value);
        };

        return (
          <div className="space-y-2">
            <div className="relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filteredOptions.length > 0) {
                      addLocation(filteredOptions[0].value);
                    }
                  }
                }}
                placeholder="Type to search countries or regions..."
              />
              {showSuggestions && filteredOptions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
                  <div className="max-h-60 overflow-auto p-1">
                    {withRegions && filteredOptions.some(opt => REGIONS.includes(opt)) && (
                      <>
                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                          Regions
                        </div>
                        {filteredOptions
                          .filter(opt => REGIONS.includes(opt))
                          .map((option) => (
                            <Button
                              key={option.value}
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => addLocation(option.value)}
                            >
                              {option.label}
                            </Button>
                          ))}
                      </>
                    )}
                    {filteredOptions.some(opt => COUNTRIES.includes(opt)) && (
                      <>
                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                          Countries
                        </div>
                        {filteredOptions
                          .filter(opt => COUNTRIES.includes(opt))
                          .map((option) => (
                            <Button
                              key={option.value}
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => addLocation(option.value)}
                            >
                              {getFlagEmoji(option.value)} {option.label}
                            </Button>
                          ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            {selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedValues.map((value: string) => (
                  <Badge 
                    key={value} 
                    variant="secondary" 
                    className="gap-1 pr-1"
                  >
                    <span>
                      {isCountryCode(value) && getFlagEmoji(value)} {getLabel(value)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeLocation(value);
                      }}
                      className="ml-1 rounded-sm hover:bg-secondary-foreground/20"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}