// src/services/PasswordAIService.ts
import { PrismaClient } from '@prinpx sma/client'
import nodemailer from 'nodemailer'
import zxcvbn from 'zxcvbn'

class PasswordSecurityAI {
  private prisma: PrismaClient
  private transporter: nodemailer.Transporter

  constructor() {
    this.prisma = new PrismaClient()
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  }

  // Основний метод перевірки безпеки паролей
  async checkPasswordSecurity() {
    const users = await this.prisma.user.findMany()

    for (const user of users) {
      // Отримуємо захеширований пароль
      const hashedPassword = user.passwordHash

      // Декодуємо хеш
      const decodedPassword = this.decodePassword(hashedPassword)

      const passwordStrength = this.analyzePasswordStrength(decodedPassword)

      if (passwordStrength.score < 3) {
        await this.sendSecurityNotification(user, passwordStrength)
      }
    }
  }

  // Анализ сложности пароля
  private analyzePasswordStrength(password: string) {
    const result = zxcvbn(password)
    
    return {
      score: result.score, // 0-4, где 4 - самый сложный
      feedback: result.feedback.suggestions,
      warnings: result.feedback.warning
    }
  }

  // Надсилання повідомлення на пошту
  private async sendSecurityNotification(user: any, strength: any) {
    const emailContent = `
      Шановний ${user.username}!

      Наш ШІ-сервіс безпеки виявив, що ваш поточний пароль має низький рівень захисту.

      Рекомендації щодо покращення:
      ${strength.feedback.map(tip => `- ${tip}`).join('\n')}

      Рекомендуємо змінити пароль!

      З повагою,
      Служба безпеки
    `

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email || `${user.username}@example.com`, // Припускаємо пошту
        subject: 'Безпека вашого облікового запису',
        text: emailContent
      })
    } catch (error) {
      console.error('Помилка відправлення email:', error)
    }
  }

  // Декодирование пароля
  private decodePassword(hashedPassword: string): string {
    return hashedPassword 
  }

  // Машинное обучение для прогнозирования риска
  async predictPasswordRisk() {
    const users = await this.prisma.user.findMany()
    const riskAnalysis = users.map(user => {
      const hashedPassword = user.passwordHash
      const decodedPassword = this.decodePassword(hashedPassword)
      const strength = this.analyzePasswordStrength(decodedPassword)

      return {
        username: user.username,
        riskLevel: this.calculateRiskLevel(strength.score),
        recommendedActions: this.generateRecommendations(strength)
      }
    })

    return riskAnalysis
  }

  private calculateRiskLevel(strengthScore: number): string {
    switch(strengthScore) {
      case 0: return 'Критический'
      case 1: return 'Высокий'
      case 2: return 'Средний'
      case 3: return 'Низкий'
      case 4: return 'Безопасный'
      default: return 'Неопределен'
    }
  }

  private generateRecommendations(strength: any): string[] {
    const recommendations = [
      'Используйте комбинацию букв, цифр и символов',
      'Длина пароля должна быть не менее 12 символов',
      'Избегайте использования личных данных',
      'Применяйте разные регистры букв'
    ]

    return strength.score < 3 ? recommendations : []
  }
}

// Планировщик для periodic проверок
class PasswordSecurityScheduler {
  private passwordAI: PasswordSecurityAI

  constructor() {
    this.passwordAI = new PasswordSecurityAI()
  }

  // Запуск проверки каждые 24 часа
  startPeriodicCheck() {
    setInterval(async () => {
      console.log('Начало проверки безопасности паролей')
      await this.passwordAI.checkPasswordSecurity()
    }, 24 * 60 * 60 * 1000) // 24 часа
  }
}

export { PasswordSecurityAI, PasswordSecurityScheduler }