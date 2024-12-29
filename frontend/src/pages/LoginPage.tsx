import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserService } from '@/services/UserService'
import { useNavigate } from 'react-router-dom'

interface LoginPageProps {}

const LoginPage: React.FC<LoginPageProps> = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const result = await UserService.login(username, password)
      
      if (result) {
        // Успешный вход, редирект на панель управления
        navigate('/dashboard')
      } else {
        setError('Неверный логин или пароль')
      }
    } catch (err) {
      setError('Произошла ошибка при входе')
    }
  }

  const handleRegister = async () => {
    try {
      const result = await UserService.register(username, password)
      
      if (result) {
        // Успешная регистрация, редирект на панель управления
        navigate('/dashboard')
      } else {
        setError('Не удалось зарегистрироваться')
      }
    } catch (err) {
      setError('Ошибка регистрации')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Вход в систему</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              type="text" 
              placeholder="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input 
              type="password" 
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
            <div className="flex space-x-2">
              <Button 
                type="submit" 
                className="w-full"
              >
                Войти
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleRegister}
              >
                Регистрация
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage