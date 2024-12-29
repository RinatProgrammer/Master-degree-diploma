import React from 'react'
import { Navigate } from 'react-router-dom'
import { UserService } from '@/services/UserService'

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // Проверка аутентификации и валидности токена
  const isAuthenticated = UserService.isTokenValid()

  if (!isAuthenticated) {
    // Редирект на страницу входа, если пользователь не аутентифицирован
    return <Navigate to="/login" replace />
  }

  // Рендер защищенного компонента, если пользователь аутентифицирован
  return <>{children}</>
}

export default PrivateRoute