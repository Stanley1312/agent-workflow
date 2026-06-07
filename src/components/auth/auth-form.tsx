"use client";

import type { ReactNode } from 'react';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type AuthField = {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  autoComplete?: string;
};

export type AuthFormState = {
  message: string | null;
  fieldErrors?: Partial<Record<string, string[]>>;
  redirectTo?: string;
};

export type AuthFormProps = {
  activeTab: 'signin' | 'signup';
  title: string;
  subtitle: string;
  fields: AuthField[];
  primaryActionLabel: string;
  secondaryActionLabel: string;
  secondaryActionHref: string;
  action: (previousState: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  initialState?: AuthFormState;
  children?: ReactNode;
};

const initialFormState: AuthFormState = { message: null };

export function AuthForm({
  activeTab,
  title,
  subtitle,
  fields,
  primaryActionLabel,
  secondaryActionLabel,
  secondaryActionHref,
  action,
  initialState = initialFormState,
  children,
}: AuthFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [router, state.redirectTo]);

  return (
    <div className="w-full max-w-[520px] rounded-[28px] border border-[#E7E3DA] bg-white p-6 shadow-[0_8px_24px_rgba(17,15,23,0.08)] lg:p-8">
      <div className="mb-6 inline-flex rounded-full bg-[#F7F6F3] p-1 text-sm font-semibold text-[#6B6774]" role="tablist" aria-label="Authentication mode">
        <span role="tab" aria-selected={activeTab === 'signup'} className={['rounded-full px-4 py-2 transition-colors', activeTab === 'signup' ? 'bg-[#6F3CC3] text-white shadow-sm' : 'bg-transparent'].join(' ')}>
          Sign up
        </span>
        <span role="tab" aria-selected={activeTab === 'signin'} className={['rounded-full px-4 py-2 transition-colors', activeTab === 'signin' ? 'bg-[#6F3CC3] text-white shadow-sm' : 'bg-transparent'].join(' ')}>
          Sign in
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-[32px] font-extrabold tracking-tight text-[#17151F]">{title}</h1>
        <p className="text-sm leading-6 text-[#6B6774]">{subtitle}</p>
      </div>

      {state.message ? (
        <div role="alert" aria-live="polite" className="mt-6 rounded-2xl border border-[#E6C9D1] bg-[#FFF4F7] px-4 py-3 text-sm font-medium text-[#8B2742]">
          {state.message}
        </div>
      ) : null}

      <form className="mt-8 space-y-5" action={formAction}>
        {children}
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.id} className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B6774]">
              {field.label}
            </label>
            <Input id={field.id} name={field.id} type={field.type} placeholder={field.placeholder} autoComplete={field.autoComplete} aria-invalid={Boolean(state.fieldErrors?.[field.id]?.length)} />
            {state.fieldErrors?.[field.id]?.[0] ? <p className="text-sm text-[#8B2742]">{state.fieldErrors[field.id]?.[0]}</p> : null}
          </div>
        ))}

        <Button type="submit" className="mt-2 h-12 w-full rounded-2xl bg-[#B995E8] text-base font-semibold text-white shadow-sm hover:bg-[#A77BDD]">
          {primaryActionLabel}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-[#6B6774]">
        <a href={secondaryActionHref} className="font-semibold text-[#6F3CC3] hover:underline">
          {secondaryActionLabel}
        </a>
      </div>
    </div>
  );
}
