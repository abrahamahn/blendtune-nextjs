// main/apps/web/src/client/components/form/FormField.tsx
// One field grammar for every form: label + input + error line, tokens only.
// Composes the @ui field primitives; password inputs get the toggle for free.
import { Input, PasswordInput } from '@ui';
import { forwardRef } from 'react';

import type { ComponentPropsWithoutRef } from 'react';

export type FormFieldProps = ComponentPropsWithoutRef<'input'> & {
  label: string;
  /** Error message, rendered below the input (also sets aria-invalid) */
  error?: string;
  /** Helper text displayed below the input */
  description?: string;
};

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>((props, ref) => {
  const { type, ...rest } = props;
  return type === 'password' ? (
    <PasswordInput ref={ref} showToggle {...rest} />
  ) : (
    <Input.Field ref={ref} type={type} {...rest} />
  );
});

FormField.displayName = 'FormField';
