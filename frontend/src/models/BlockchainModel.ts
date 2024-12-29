import crypto from 'crypto'

// Інтерфейс для блоку
export interface BlockInterface {
  index: number
  timestamp: number
  data: string
  previousHash: string
  hash: string
  nonce: number
}

// Клас для створення блоку
export class Block implements BlockInterface {
  public hash: string
  public nonce: number = 0

  constructor(
    public index: number,
    public timestamp: number,
    public data: string,
    public previousHash: string = ''
  ) {
    this.hash = this.calculateHash()
  }

  // Метод обчислення хешу блоку
  calculateHash(): string {
    return crypto
      .createHash('sha256')
      .update(
        this.index + 
        this.previousHash + 
        this.timestamp + 
        JSON.stringify(this.data) + 
        this.nonce
      )
      .digest('hex')
  }

  // Майнінг блоку з певною складністю
  mineBlock(difficulty: number): void {
    const target = Array(difficulty + 1).join('0')
    
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++
      this.hash = this.calculateHash()
    }

    console.log(`Block mined: ${this.hash}`)
  }
}

// Клас ланцюжка блоків
export class Blockchain {
  private chain: Block[]
  private difficulty: number
  private pendingTransactions: any[]
  private miningReward: number

  constructor(difficulty: number = 4, miningReward: number = 10) {
    this.chain = [this.createGenesisBlock()]
    this.difficulty = difficulty
    this.pendingTransactions = []
    this.miningReward = miningReward
  }

  // Створення першого блоку (Genesis Block)
  private createGenesisBlock(): Block {
    return new Block(0, Date.now(), 'Genesis Block', '0')
  }

  // Отримання останнього блоку в ланцюжку
  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1]
  }

  // Додавання нового блоку
  addBlock(newBlock: Block): void {
    newBlock.previousHash = this.getLatestBlock().hash
    newBlock.mineBlock(this.difficulty)
    this.chain.push(newBlock)
  }

  // Перевірка цілісності ланцюжка
  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      // Перевірка хешу поточного блоку
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false
      }

      // Перевірка зв'язку між блоками
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }
    return true
  }

  // Додавання транзакції до очікуючих
  addTransaction(transaction: any): void {
    this.pendingTransactions.push(transaction)
  }

  // Майнінг очікуючих транзакцій
  minePendingTransactions(miningRewardAddress: string): void {
    const block = new Block(
      this.chain.length, 
      Date.now(), 
      JSON.stringify(this.pendingTransactions)
    )
    this.addBlock(block)

    // Нарахування винагороди майнеру
    this.pendingTransactions = [
      {
        from: 'network',
        to: miningRewardAddress,
        amount: this.miningReward
      }
    ]
  }

  // Отримання балансу гаманця
  getBalanceOfAddress(address: string): number {
    let balance = 0

    for (const block of this.chain) {
      const transactions = JSON.parse(block.data)
      
      for (const transaction of transactions) {
        if (transaction.from === address) {
          balance -= transaction.amount
        }
        
        if (transaction.to === address) {
          balance += transaction.amount
        }
      }
    }

    return balance
  }

  // Експорт ланцюжка як JSON
  toJSON(): string {
    return JSON.stringify(this.chain, null, 2)
  }

  // Імпорт ланцюжка з JSON
  static fromJSON(json: string): Blockchain {
    const parsedChain = JSON.parse(json)
    const blockchain = new Blockchain()
    blockchain['chain'] = parsedChain.map((blockData: BlockInterface) => 
      new Block(
        blockData.index, 
        blockData.timestamp, 
        blockData.data, 
        blockData.previousHash
      )
    )
    return blockchain
  }
}

// Приклад використання
export function createBlockchainExample() {
  const blockchain = new Blockchain()
  
  blockchain.addTransaction({ 
    from: 'user1', 
    to: 'user2', 
    amount: 50 
  })
  
  blockchain.minePendingTransactions('miner-address')
  
  console.log('Is blockchain valid?', blockchain.isChainValid())
  console.log('Blockchain:', blockchain.toJSON())
}