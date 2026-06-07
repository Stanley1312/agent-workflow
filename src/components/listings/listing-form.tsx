"use client";

import type { FormEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export type ListingFormValues = {
  title: string;
  price: string;
  category: string;
  condition: string;
  location: string;
  description: string;
};

export type ListingFormErrors = Partial<Record<keyof ListingFormValues, string>> & {
  form?: string;
};

export type ListingFormProps = {
  defaultValues?: Partial<ListingFormValues>;
  errors?: ListingFormErrors;
  isSubmitting?: boolean;
  submitLabel: string;
  onSubmit: (values: ListingFormValues) => void | Promise<void>;
};

const FIELD_ORDER: Array<{
  name: keyof ListingFormValues;
  label: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
}> = [
  { name: 'title', label: 'Title', placeholder: 'Vintage denim jacket', autoComplete: 'off' },
  { name: 'price', label: 'Price', type: 'number', placeholder: '48', autoComplete: 'off' },
  { name: 'category', label: 'Category', placeholder: 'Clothing', autoComplete: 'off' },
  { name: 'condition', label: 'Condition', placeholder: 'Like new', autoComplete: 'off' },
  { name: 'location', label: 'Location', placeholder: 'Brooklyn, NY', autoComplete: 'address-level2' },
  { name: 'description', label: 'Description', placeholder: 'Describe the item, size, and details', autoComplete: 'off' },
];

const DEFAULT_VALUES: ListingFormValues = {
  title: '',
  price: '',
  category: '',
  condition: '',
  location: '',
  description: '',
};

function getFieldId(name: keyof ListingFormValues): string {
  return `listing-${name}`;
}

export function ListingForm({
  defaultValues,
  errors,
  isSubmitting = false,
  submitLabel,
  onSubmit,
}: ListingFormProps) {
  const values = { ...DEFAULT_VALUES, ...defaultValues };

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    void onSubmit({
      title: String(formData.get('title') ?? ''),
      price: String(formData.get('price') ?? ''),
      category: String(formData.get('category') ?? ''),
      condition: String(formData.get('condition') ?? ''),
      location: String(formData.get('location') ?? ''),
      description: String(formData.get('description') ?? ''),
    });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {errors?.form ? (
        <p className="rounded-2xl border border-[#F3B4B4] bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {FIELD_ORDER.map((field) => {
          const fieldId = getFieldId(field.name);
          const errorId = `${fieldId}-error`;
          const helpId = `${fieldId}-help`;
          const fieldError = errors?.[field.name];
          const isTextArea = field.name === 'description';
          const commonProps = {
            id: fieldId,
            name: field.name,
            defaultValue: values[field.name],
            'aria-invalid': fieldError ? true : undefined,
            'aria-describedby': fieldError ? errorId : helpId,
            placeholder: field.placeholder,
            autoComplete: field.autoComplete,
            className: fieldError ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/30' : undefined,
          } as const;

          return (
            <div key={field.name} className={field.name === 'description' ? 'md:col-span-2' : undefined}>
              <label className="mb-2 block text-sm font-medium text-[#17151F]" htmlFor={fieldId}>
                {field.label}
              </label>
              {isTextArea ? (
                <textarea
                  {...commonProps}
                  rows={5}
                  className={[
                    'min-h-32 w-full rounded-xl border border-[#DCCFC0] bg-white px-4 py-3 text-sm text-[#16151D] placeholder:text-[#9A8FA3] shadow-sm transition-colors focus:border-[#B995E8] focus:outline-none focus:ring-2 focus:ring-[#B995E8]/30 disabled:cursor-not-allowed disabled:bg-[#F4EFE7]',
                    fieldError ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/30' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
              ) : (
                <Input {...commonProps} type={field.type ?? 'text'} />
              )}
              <p id={helpId} className="mt-2 text-xs text-[#6B6774]">
                {field.name === 'price' ? 'Enter a numeric price in USD.' : field.name === 'description' ? 'Describe the item clearly for buyers.' : 'Required field.'}
              </p>
              {fieldError ? (
                <p id={errorId} className="mt-2 text-sm text-[#DC2626]" role="alert">
                  {fieldError}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="submit" disabled={isSubmitting} className="rounded-2xl px-6 py-3.5 text-base">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
