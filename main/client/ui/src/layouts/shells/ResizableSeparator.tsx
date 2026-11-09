// main/client/ui/src/layouts/shells/ResizableSeparator.tsx
import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import '../../styles/components.css';

/** Step size for keyboard resize (percentage or pixels based on unit) */
const KEYBOARD_STEP = 2;
/** Large step size for Shift+Arrow keyboard resize */
const KEYBOARD_STEP_LARGE = 10;

export type ResizableSeparatorProps = ComponentPropsWithoutRef<'div'> & {
  direction?: 'horizontal' | 'vertical' | undefined;
  onResize?: ((delta: number) => void) | undefined;
  onSizeChange?: ((size: number) => void) | undefined;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  currentSize?: number;
  minSize?: number;
  maxSize?: number;
  unit?: '%' | 'px';
  ['aria-label']?: string;
};

/**
 * Resizable separator/handle for dragging between panels.
 */
export const ResizableSeparator = forwardRef<HTMLDivElement, ResizableSeparatorProps>(
  (props, ref) => {
    const {
      direction = 'horizontal',
      onResize,
      onSizeChange,
      onDragStart,
      onDragEnd,
      currentSize,
      minSize = 10,
      maxSize = 90,
      unit = '%',
      'aria-label': ariaLabel,
      className = '',
      ...rest
    } = props;
    const [isDragging, setIsDragging] = useState(false);
    const startPosRef = useRef<number>(0);
    const onResizeRef = useRef(onResize);
    const onDragEndRef = useRef(onDragEnd);

    useLayoutEffect(() => {
      onResizeRef.current = onResize;
      onDragEndRef.current = onDragEnd;
    });

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>): void => {
      e.preventDefault();
      setIsDragging(true);
      onDragStart?.();
      startPosRef.current = direction === 'horizontal' ? e.clientX : e.clientY;
    };

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>): void => {
        if (currentSize === undefined || onSizeChange == null) return;

        const step = e.shiftKey ? KEYBOARD_STEP_LARGE : KEYBOARD_STEP;
        let newSize: number | null = null;

        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            newSize = Math.min(maxSize, currentSize + step);
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            newSize = Math.max(minSize, currentSize - step);
            break;
          case 'Home':
            e.preventDefault();
            newSize = minSize;
            break;
          case 'End':
            e.preventDefault();
            newSize = maxSize;
            break;
        }

        if (newSize !== null && newSize !== currentSize) {
          onSizeChange(newSize);
        }
      },
      [currentSize, maxSize, minSize, onSizeChange],
    );

    useEffect(() => {
      if (!isDragging) return;

      const handleMouseMove = (e: globalThis.MouseEvent): void => {
        const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
        const delta = currentPos - startPosRef.current;
        startPosRef.current = currentPos;
        onResizeRef.current?.(delta);
      };

      const handleMouseUp = (): void => {
        setIsDragging(false);
        onDragEndRef.current?.();
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return (): void => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isDragging, direction]);

    const defaultLabel = direction === 'horizontal' ? 'Resize panel width' : 'Resize panel height';
    const sizeText = currentSize !== undefined ? ` (current: ${String(currentSize)}${unit})` : '';

    return (
      <div
        ref={ref}
        className={`resizable-separator ${isDragging ? 'dragging' : ''} ${className}`.trim()}
        data-direction={direction}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        role="separator"
        tabIndex={0}
        aria-orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
        aria-valuenow={currentSize}
        aria-valuemin={minSize}
        aria-valuemax={maxSize}
        aria-label={ariaLabel ?? `${defaultLabel}${sizeText}`}
        {...rest}
      />
    );
  },
);

ResizableSeparator.displayName = 'ResizableSeparator';
