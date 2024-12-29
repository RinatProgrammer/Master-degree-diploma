import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserService } from '@/services/UserService'
import { BlockchainService } from '@/services/BlockchainService'
import { useNavigate } from 'react-router-dom'

interface UserData {
  username: string
  role: string
  lastLogin: string
}

interface BlockchainInfo {
  blockCount: number
  lastBlockHash: string
}

const DashboardPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получение данных пользователя
        const user = await UserService.getCurrentUser()
        setUserData(user)

        // Получение информации о блокчейне
        const blockchain = await BlockchainService.getBlockchainInfo()
        setBlockchainInfo(blockchain)
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
        // Перенаправление на страницу входа при ошибке
        navigate('/login')
      }
    }

    fetchData()
  }, [navigate])

  const handleLogout = () => {
    UserService.logout()
    navigate('/login')
  }

  const handleViewTransactions = () => {
    navigate('/transactions')
  }

  if (!userData) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Профиль пользователя</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p><strong>Имя пользователя:</strong> {userData.username}</p>
              <p><strong>Роль:</strong> {userData.role}</p>
              <p><strong>Последний вход:</strong> {userData.lastLogin}</p>
              <div className="flex space-x-4">
                <Button onClick={handleViewTransactions}>
                  Мои транзакции
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                >
                  Выйти
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Информация о блокчейне</CardTitle>
          </CardHeader>
          <CardContent>
            {blockchainInfo ? (
              <div className="space-y-4">
                <p><strong>Количество блоков:</strong> {blockchainInfo.blockCount}</p>
                <p><strong>Хеш последнего блока:</strong> 
                  <code className="block bg-gray-100 p-2 mt-2 truncate">
                    {blockchainInfo.lastBlockHash}
                  </code>
                </p>
              </div>
            ) : (
              <p>Загрузка информации о блокчейне...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage