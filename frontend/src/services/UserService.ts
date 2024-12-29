import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

interface User {
  id: string
  username: string
  role: string
  email?: string
}

interface LoginResponse {
  token: string
  user: User
}

export class UserService {
  private static API_URL = 'http://localhost:3001/api/auth'
  private static TOKEN_KEY = 'user_token'

  // Метод регистрации
  static async register(username: string, password: string): Promise<User | null> {
    try {
      const response = await axios.post<LoginResponse>(`${this.API_URL}/register`, {
        username,
        password
      })

      this.saveToken(response.data.token)
      return response.data.user
    } catch (error) {
      console.error('Registration error:', error)
      return null
    }
  }

  // Метод входа
  static async login(username: string, password: string): Promise<User | null> {
    try {
      const response = await axios.post<LoginResponse>(`${this.API_URL}/login`, {
        username,
        password
      })

      this.saveToken(response.data.token)
      return response.data.user
    } catch (error) {
      console.error('Login error:', error)
      return null
    }
  }

  // Получение текущего пользователя
  static async getCurrentUser(): Promise<User | null> {
    const token = this.getToken()
    if (!token) return null

    try {
      const response = await axios.get<User>(`${this.API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      console.error('Get current user error:', error)
      this.logout()
      return null
    }
  }

  // Проверка валидности токена
  static isTokenValid(): boolean {
    const token = this.getToken()
    if (!token) return false

    try {
      const decoded = jwtDecode(token)
      return decoded.exp ? decoded.exp * 1000 > Date.now() : false
    } catch (error) {
      return false
    }
  }

  // Сохранение токена
  private static saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  // Получение токена
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  // Выход
  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    window.location.href = '/login'
  }

  // Обновление профиля
  static async updateProfile(userData: Partial<User>): Promise<User | null> {
    const token = this.getToken()
    if (!token) return null

    try {
      const response = await axios.put<User>(`${this.API_URL}/profile`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      console.error('Profile update error:', error)
      return null
    }
  }
}