import { Check } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { DropdownOption } from '../types';

interface DropdownPopoverProps {
  options: DropdownOption[];
  selectedOption: string;
  onValueChange?: (value: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  renderOption?: (option: DropdownOption) => React.ReactNode;
  setOpen?: (open: boolean) => void;
  searchQuery?: string;
  setSearchQuery?: (search: string) => void;
}

const DropdownPopover = ({
  options,
  selectedOption,
  onValueChange,
  searchable,
  searchPlaceholder,
  renderOption,
  setOpen,
  searchQuery,
  setSearchQuery,
}: DropdownPopoverProps) => {
  return (
    <Command className="w-full" shouldFilter={false} filter={() => 1}>
      {searchable && (
        <div className="sticky top-0 z-10">
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            className="bg-transparent text-sm placeholder:opacity-50"
            onValueChange={setSearchQuery}
          />
        </div>
      )}
      <CommandList className="w-full">
        <CommandEmpty className="flex h-16 items-center justify-center text-sm">
          No results found.
        </CommandEmpty>
        <CommandGroup>
          {options.map((option) => {
            return (
              <CommandItem
                key={option.value}
                value={option.value}
                className="flex-1"
                onSelect={() => {
                  onValueChange?.(option.value);
                  setOpen?.(false);
                }}
              >
                {renderOption ? (
                  renderOption(option)
                ) : (
                  <div className="flex min-w-0 items-center gap-2">
                    {option.icon}
                    <p className="min-w-0 flex-1 text-sm">{option.label}</p>
                  </div>
                )}
                <Check
                  className={cn(
                    'text-primary mr-2 ml-auto h-4 w-4 text-base',
                    selectedOption === option.value ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default DropdownPopover;
