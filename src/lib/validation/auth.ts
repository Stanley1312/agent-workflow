import { z } from 'zod';

const emailSchema = z.string().trim().min(1, 'Email is required').email('Enter a valid email address');
const passwordSchema = z.string().min(1, 'Password is required');
const displayNameSchema = z.string().trim().min(1, 'Display name is required');
const rememberMeSchema = z.boolean().optional().default(false);
const acceptTermsSchema = z.boolean().refine((value) => value, 'You must accept the terms to continue');

export const registrationInputSchema = z
  .object({
    name: displayNameSchema,
    email: emailSchema,
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
    acceptTerms: acceptTermsSchema,
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export const loginInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: rememberMeSchema,
});

export type RegistrationInput = z.infer<typeof registrationInputSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
