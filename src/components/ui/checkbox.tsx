import type { InputHTMLAttributes } from 'react';

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

export function Checkbox({ className = '', ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={[
        'h-4 w-4 rounded border border-[#CBBFD4] text-[#6F3CC3] focus:ring-2 focus:ring-[#B995E8]/40 focus:ring-offset-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
