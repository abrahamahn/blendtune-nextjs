// src/client/features/sounds/filters/components/shared/ui/SearchInput.tsx
interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
  }
  
  export const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    placeholder = "Search...",
    ...props
  }) => {
    return (
      <div className="w-full flex flex-row mb-4">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full text-xs h-8 rounded-lg bg-white/95 dark:bg-black/90 border border-neutral-400 dark:border-neutral-700 text-neutral-600 dark:text-neutral-200 placeholder-style"
          {...props}
        />
      </div>
    );
  };