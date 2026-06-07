import type { InputHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', type = 'text', ...props }: InputProps) {
  return (
    <input
      type={type}
      className={[
        'h-12 w-full rounded-xl border border-[#DCCFC0] bg-white px-4 text-sm text-[#16151D] placeholder:text-[#9A8FA3] shadow-sm transition-colors focus:border-[#B995E8] focus:outline-none focus:ring-2 focus:ring-[#B995E8]/30 disabled:cursor-not-allowed disabled:bg-[#F4EFE7]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
