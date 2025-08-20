import React, { useCallback, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import DropdownPopover from './popover';
import { DropdownOption } from './types';

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  renderOption?: (option: DropdownOption) => React.ReactNode;
  renderSelectedOption?: (option: DropdownOption) => React.ReactNode;
  disabled?: boolean;
  width?: number | string;
  modalPopover?: boolean;
  unclipDropdown?: boolean;
  size?: 'lg' | 'icon' | 'sm' | 'default';
}

export const Dropdown = ({
  options,
  onValueChange,
  onOpenChange,
  placeholder = 'Select an option',
  className = '',
  searchable = false,
  searchPlaceholder = 'Search...',
  renderOption,
  renderSelectedOption,
  disabled = false,
  width = '350',
  size = 'lg',
  modalPopover = false,
  value,
  unclipDropdown = false,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = useMemo(() => {
    const optionsToFilter = [...options];
    const selectedOptionIndex = optionsToFilter.findIndex((option) => option.value === value);
    if (selectedOptionIndex !== -1) {
      const [selectedOption] = optionsToFilter.splice(selectedOptionIndex, 1);
      optionsToFilter.unshift(selectedOption);
    }

    if (!searchable || !searchQuery) return optionsToFilter;
    return optionsToFilter.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery, searchable, value]);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      onOpenChange?.(isOpen);
    },
    [onOpenChange]
  );

  const isValidValue = useMemo(() => {
    return value && options.some((option) => option.value === value);
  }, [value, options]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal={modalPopover}>
      <PopoverTrigger asChild>
        <Button
          size={size}
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-full justify-between', className)}
          style={{ width }}
        >
          {isValidValue ? (
            renderSelectedOption && selectedOption ? (
              renderSelectedOption(selectedOption)
            ) : (
              <div
                className={`flex w-full items-center justify-start text-base ${
                  selectedOption?.icon ? 'gap-2' : ''
                }`}
              >
                {selectedOption?.icon && <div className="h-4 w-4">{selectedOption?.icon}</div>}
                <p className="truncate text-left break-all">{selectedOption?.label}</p>
              </div>
            )
          ) : (
            <span className="text-primary/70 text-xs">{placeholder}</span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('p-0', unclipDropdown && 'w-auto')}
        style={!unclipDropdown ? { width } : undefined}
        align="start"
      >
        <DropdownPopover
          options={filteredOptions}
          selectedOption={value ?? ''}
          onValueChange={onValueChange}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          renderOption={renderOption}
          setOpen={setOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </PopoverContent>
    </Popover>
  );
};
