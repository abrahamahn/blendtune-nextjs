// src/client/features/sounds/filters/components/shared/ui/Checkbox.tsx
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
  }
  
  export const Checkbox: React.FC<CheckboxProps> = ({
    label,
    checked,
    onChange,
    ...props
  }) => {
    return (
      <div className="flex flex-row items-center mb-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="active:outline-none focus:outline-none checked:bg-blue-600 dark:checked:bg-blue-600 checked:border-blue-400 dark:checked:border-blue-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 bg-neutral-200 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-500 rounded-md border-2 w-5 h-5 cursor-pointer"
          {...props}
        />
        <span className="ml-2.5 text-neutral-500 dark:text-neutral-200">
          {label}
        </span>
      </div>
    );
  };