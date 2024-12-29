import axios from 'axios'
import { UserService } from './UserService'

interface Block {
  index: number
  timestamp: number
  data: string
  previousHash: string
  hash: string
  nonce: number
}

interface BlockchainInfo {
  blockCount: number
  lastBlockHash: string
  difficulty: number
  pendingTransactions: number
}

export class BlockchainService {
  private static API_URL = 'http://localhost:3001/api/blockchain'

  // Отримання інформації про блокчейн
  static async getBlockchainInfo(): Promise<BlockchainInfo | null> {
    const token = UserService.getToken()
    if (!token) return null

    try {
      const response = await axios.get<BlockchainInfo>(`${this.API_URL}/info`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      console.error('Blockchain info error:', error)
      return null
    }
  }

  // Отримання списку блоків
  static async getBlocks(page: number = 1, limit: number = 10): Promise<Block[]> {
    const token = UserService.getToken()
    if (!token) return []

    try {
      const response = await axios.get<Block[]>(`${this.API_URL}/blocks`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      console.error('Fetching blocks error:', error)
      return []
    }
  }

  // Створення нового блоку
  static async createBlock(data: string): Promise<Block | null> {
    const token = UserService.getToken()
    if (!token) return null

    try {
      const response = await axios.post<Block>(`${this.API_URL}/blocks`, 
        { data },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      return response.data
    } catch (error) {
      console.error('Create block error:', error)
      return null
    }
  }

  // Перевірка цілісності ланцюжка блоків
  static async validateBlockchain(): Promise<boolean> {
    const token = UserService.getToken()
    if (!token) return false

    try {
      const response = await axios.get<boolean>(`${this.API_URL}/validate`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      console.error('Blockchain validation error:', error)
      return false
    }
  }

  // Отримання детальної інформації про конкретний блок
  static async getBlockDetails(blockHash: string): Promise<Block | null> {
    const token = UserService.getToken()
    if (!token) return null

    try {
      const response = await axios.get<Block>(`${this.API_URL}/blocks/${blockHash}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      console.error('Block details error:', error)
      return null
    }
  }

  // Отримання транзакцій користувача
  static async getUserTransactions(): Promise<any[]> {
    const token = UserService.getToken()
    if (!token) return []

    try {
      const response = await axios.get<any[]>(`${this.API_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      console.error('User transactions error:', error)
      return []
    }
  }
}