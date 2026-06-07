import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const VARIANT_CLASS_NAMES: Record<ButtonVariant, string> = {
  primary:
    'bg-[#B995E8] text-white shadow-[0_10px_25px_rgba(185,149,232,0.35)] hover:bg-[#9F78D9] focus-visible:ring-[#B995E8]',
  secondary:
    'bg-[#F4EFE7] text-[#16151D] border border-[#DDD5C8] hover:bg-[#ECE4D8] focus-visible:ring-[#6F3CC3]',
  ghost:
    'bg-transparent text-[#5B4F6C] hover:bg-[#F4EFE7] focus-visible:ring-[#6F3CC3]',
};

export function Button({
  variant = 'primary',
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60',
        VARIANT_CLASS_NAMES[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
