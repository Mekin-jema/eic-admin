import { z } from 'zod'

export const emailSchema = z
  .string()
  .trim()
  .email('Enter a valid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, 'Use upper, lower, and a number')

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Password is required'),
})

export const forgotPasswordFormSchema = z.object({
  email: emailSchema,
})

export const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  })

export const otpFormSchema = z.object({
  code: z
    .string()
    .min(6, 'Enter the 6-digit code')
    .max(6, 'Code must be 6 digits')
    .regex(/^\d{6}$/, 'Code must be numeric'),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>
export type OtpFormValues = z.infer<typeof otpFormSchema>
