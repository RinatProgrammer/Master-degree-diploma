import { z } from 'zod'

// Схема валідації для створення користувача
export const UserCreateSchema = z.object({
  username: z.string()
    .min(3, { message: "Ім'я користувача має бути не менше 3 символів" })
    .max(50, { message: "Ім'я користувача не може перевищувати 50 символів" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Ім'я користувача може містити лише літери, цифри та підкреслення" }),

  email: z.string()
    .email({ message: "Некоректна електронна пошта" }),

  password: z.string()
    .min(8, { message: "Пароль має бути не менше 8 символів" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Пароль повинен містити принаймні одну велику літеру, одну малу літеру, одну цифру та один спеціальний символ"
    }),

  role: z.enum(['USER', 'ADMIN', 'MODERATOR']).default('USER')
})

// Схема валідації для оновлення профілю
export const UserUpdateSchema = UserCreateSchema.partial()

// Типи на основі схем валідації
export type UserCreate = z.infer<typeof UserCreateSchema>
export type UserUpdate = z.infer<typeof UserUpdateSchema>

// Інтерфейс моделі користувача
export interface UserModel {
  id: string
  username: string
  email: string
  role: 'USER' | 'ADMIN' | 'MODERATOR'
  createdAt: Date
  lastLogin?: Date
  blockchainPublicKey?: string
}

// Утиліта для перевірки складності пароля
export class PasswordStrengthValidator {
  static evaluateStrength(password: string): {
    score: number
    feedback: string[]
  } {
    const checks = [
      { 
        test: (p: string) => p.length >= 12, 
        feedback: "Додайте більше символів" 
      },
      { 
        test: (p: string) => /[A-Z]/.test(p), 
        feedback: "Додайте великі літери" 
      },
      { 
        test: (p: string) => /[a-z]/.test(p), 
        feedback: "Додайте малі літери" 
      },
      { 
        test: (p: string) => /\d/.test(p), 
        feedback: "Додайте цифри" 
      },
      { 
        test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p), 
        feedback: "Додайте спеціальні символи" 
      }
    ]

    const failedChecks = checks.filter(check => !check.test(password))
    const score = 5 - failedChecks.length

    return {
      score,
      feedback: failedChecks.map(check => check.feedback)
    }
  }
}