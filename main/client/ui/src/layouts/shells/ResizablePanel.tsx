// main/client/ui/src/layouts/shells/ResizablePanel.tsx
import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { ResizableSeparator } from './ResizableSeparator';
import '../../styles/components.css';

type ResizablePanelProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode;
  size?: number | undefined;
  defaultSize?: number | undefined;
  minSize?: number | undefined;
  maxSize?: number | undefined;
  unit?: '%' | 'px' | undefined;
  collapsed?: boolean | undefined;
  direction?: 'horizontal' | 'vertical' | undefined;
  invertResize?: boolean | undefined;
  onResize?: ((size: number) => void) | undefined;
};

type ResizablePanelGroupProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode;
  direction?: 'horizontal' | 'vertical' | undefined;
  reverse?: boolean | undefined;
};

/**
 * Individual resizable panel with keyboard-accessible resize handle.
 */
export const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>((props, ref) => {
  const {
    children,
    size: controlledSize,
    defaultSize = 50,
    minSize = 10,
    maxSize = 90,
    unit = '%',
    collapsed = false,
    direction = 'horizontal',
    invertResize = false,
    onResize,
    className = '',
    style,
    ...rest
  } = props;

  const isControlled = controlledSize !== undefined;
  const [internalSize, setInternalSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const size = isControlled ? controlledSize : internalSize;

  const handleResize = useCallback(
    (delta: number): void => {
      const adjustedDelta = invertResize ? -delta : delta;
      const prevSize = size;

      let newSize: number;
      if (unit === 'px') {
        newSize = Math.max(minSize, Math.min(maxSize, prevSize + adjustedDelta));
      } else {
        const containerEl = panelRef.current?.parentElement;
        const containerSize =
          containerEl != null
            ? direction === 'horizontal'
              ? containerEl.clientWidth
              : containerEl.clientHeight
            : direction === 'horizontal'
              ? window.innerWidth
              : window.innerHeight;
        const deltaPercent = (adjustedDelta / containerSize) * 100;
        newSize = Math.max(minSize, Math.min(maxSize, prevSize + deltaPercent));
      }

      if (!isControlled) {
        setInternalSize(newSize);
      }
      onResize?.(newSize);
    },
    [direction, invertResize, isControlled, maxSize, minSize, onResize, size, unit],
  );

  const handleSizeChange = useCallback(
    (newSize: number): void => {
      const clampedSize = Math.max(minSize, Math.min(maxSize, newSize));
      if (!isControlled) {
        setInternalSize(clampedSize);
      }
      onResize?.(clampedSize);
    },
    [isControlled, maxSize, minSize, onResize],
  );

  const currentSize = collapsed ? 0 : size;
  const flexBasis = unit === 'px' ? `${String(currentSize)}px` : `${String(currentSize)}%`;
  const panelStyle = {
    flexBasis,
    flexShrink: 0,
    flexGrow: 0,
    transition: isDragging ? 'none' : 'flex-basis 0.3s ease',
    ...style,
    ...(collapsed
      ? {
          borderTop: 'none',
          borderBottom: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          padding: 0,
          overflow: 'hidden',
        }
      : {}),
  };

  const domProps = rest;

  const mergedRef = useCallback(
    (node: HTMLDivElement | null): void => {
      (panelRef as { current: HTMLDivElement | null }).current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref !== null) {
        (ref as { current: HTMLDivElement | null }).current = node;
      }
    },
    [ref],
  );

  return (
    <>
      <div
        ref={mergedRef}
        className={`resizable-panel ${className}`.trim()}
        style={panelStyle}
        {...domProps}
      >
        {children}
      </div>
      {!collapsed && (
        <ResizableSeparator
          direction={direction}
          onResize={handleResize}
          onSizeChange={handleSizeChange}
          onDragStart={() => {
            setIsDragging(true);
          }}
          onDragEnd={() => {
            setIsDragging(false);
          }}
          currentSize={size}
          minSize={minSize}
          maxSize={maxSize}
          unit={unit}
        />
      )}
    </>
  );
});

ResizablePanel.displayName = 'ResizablePanel';

/**
 * Container for resizable panels
 */
export const ResizablePanelGroup = forwardRef<HTMLDivElement, ResizablePanelGroupProps>(
  (props, ref) => {
    const {
      children,
      direction = 'horizontal',
      reverse = false,
      className = '',
      style,
      ...rest
    } = props;

    const getFlexDirection = (): 'row' | 'row-reverse' | 'column' | 'column-reverse' => {
      if (direction === 'horizontal') {
        return reverse ? 'row-reverse' : 'row';
      }
      return reverse ? 'column-reverse' : 'column';
    };

    return (
      <div
        ref={ref}
        className={`resizable-panel-group ${className}`.trim()}
        style={{ flexDirection: getFlexDirection(), ...style }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

ResizablePanelGroup.displayName = 'ResizablePanelGroup';
