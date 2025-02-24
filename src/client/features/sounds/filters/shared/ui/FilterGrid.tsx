interface FilterGridProps {
    children: React.ReactNode;
    columns?: 2 | 3 | 4;
    maxHeight?: string;
    isScrollable?: boolean;
    width?: string;
    borderColor?: string;
    gap?: string;
}
  
export const FilterGrid: React.FC<FilterGridProps> = ({
    children,
    columns = 2,
    maxHeight = "h-72",
    isScrollable = true,
    width = "w-full",
    borderColor = "border-neutral-400 dark:border-neutral-700",
    gap = "gap-0"
}) => {
    // Dynamically generate grid columns class
    const gridColumnClass = columns === 2 
        ? "grid-cols-2" 
        : columns === 3 
        ? "grid-cols-3" 
        : "grid-cols-4";

    return (
        <div className={`
            ${width} 
            border rounded-md ${borderColor} 
            grid ${gridColumnClass} 
            ${gap}
            ${isScrollable ? `overflow-y-auto scrollbar ${maxHeight}` : ''}
        `}>
            {children}
        </div>
    );
};