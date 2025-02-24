interface FilterWrapperProps {
    children: React.ReactNode;
    isDesktop?: boolean;
    width?: string;
    height?: string;
    className?: string;
    bgColor?: string;
    borderColor?: string;
    textColor?: string;
    textSize?: string;
    zIndex?: string;
    position?: string;
    padding?: string;
    shadow?: string;
    rounded?: string;
}

export const FilterWrapper: React.FC<FilterWrapperProps> = ({
    children,
    isDesktop = true,
    width = '',
    height = '',
    className = '',
    bgColor = 'bg-white/95 dark:bg-black/90',
    borderColor = 'border-neutral-200 dark:border-neutral-700',
    textColor = 'text-neutral-300',
    textSize = 'text-xs',
    zIndex = 'z-10',
    position = 'top-0 absolute',
    padding = 'py-4 px-2',
    shadow = 'shadow',
    rounded = 'rounded-lg'
}) => {
    const desktopStyles = `
        hidden md:block 
        ${zIndex} 
        ${position} 
        ${bgColor} 
        border ${borderColor} 
        ${padding} 
        ${shadow} 
        ${rounded} 
        ${textColor} 
        ${textSize} 
        ${width} 
        ${height} 
        ${className}
    `;

    const mobileStyles = `
        block md:hidden 
        ${zIndex} 
        py-4 px-2 
        ${textColor} 
        text-sm 
        ${width} 
        ${height} 
        ${className}
    `;

    return (
        <div className={isDesktop ? desktopStyles : mobileStyles}>
            {children}
        </div>
    );
};