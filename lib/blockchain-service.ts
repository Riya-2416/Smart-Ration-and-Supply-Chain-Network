// Blockchain service for secure transaction recording
export interface BlockchainTransaction {
  id: string
  timestamp: number
  customerAadhaar: string
  shopId: string
  items: Array<{
    name: string
    quantity: number
    unit: string
    price: number
  }>
  totalAmount: number
  hash: string
  previousHash: string
  nonce: number
}

export interface Block {
  index: number
  timestamp: number
  transactions: BlockchainTransaction[]
  hash: string
  previousHash: string
  nonce: number
}

class BlockchainService {
  private chain: Block[] = []
  private pendingTransactions: BlockchainTransaction[] = []
  private difficulty = 4 // Mining difficulty

  constructor() {
    // Create genesis block
    this.createGenesisBlock()
  }

  private createGenesisBlock(): void {
    const genesisBlock: Block = {
      index: 0,
      timestamp: Date.now(),
      transactions: [],
      hash: "0000000000000000000000000000000000000000000000000000000000000000",
      previousHash: "",
      nonce: 0,
    }
    this.chain.push(genesisBlock)
  }

  private calculateHash(
    index: number,
    timestamp: number,
    transactions: BlockchainTransaction[],
    previousHash: string,
    nonce: number,
  ): string {
    const data = index + timestamp + JSON.stringify(transactions) + previousHash + nonce
    return this.sha256(data)
  }

  private sha256(data: string): string {
    // Simplified hash function for demo - in production use crypto.subtle.digest
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(64, "0")
  }

  private mineBlock(block: Block): void {
    const target = "0".repeat(this.difficulty)
    while (block.hash.substring(0, this.difficulty) !== target) {
      block.nonce++
      block.hash = this.calculateHash(block.index, block.timestamp, block.transactions, block.previousHash, block.nonce)
    }
  }

  public createTransaction(transaction: Omit<BlockchainTransaction, "hash" | "id" | "timestamp">): string {
    const txId = this.generateTransactionId()
    const blockchainTx: BlockchainTransaction = {
      ...transaction,
      id: txId,
      timestamp: Date.now(),
      hash: this.sha256(JSON.stringify(transaction) + Date.now()),
      previousHash: this.getLatestBlock().hash,
      nonce: 0,
    }

    this.pendingTransactions.push(blockchainTx)
    return txId
  }

  public mineTransactions(): Block {
    const block: Block = {
      index: this.chain.length,
      timestamp: Date.now(),
      transactions: [...this.pendingTransactions],
      hash: "",
      previousHash: this.getLatestBlock().hash,
      nonce: 0,
    }

    this.mineBlock(block)
    this.chain.push(block)
    this.pendingTransactions = []

    return block
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1]
  }

  public getTransactionById(txId: string): BlockchainTransaction | null {
    for (const block of this.chain) {
      const transaction = block.transactions.find((tx) => tx.id === txId)
      if (transaction) return transaction
    }
    return null
  }

  public verifyTransaction(txId: string): boolean {
    const transaction = this.getTransactionById(txId)
    if (!transaction) return false

    // Verify transaction hash
    const expectedHash = this.sha256(
      JSON.stringify({
        customerAadhaar: transaction.customerAadhaar,
        shopId: transaction.shopId,
        items: transaction.items,
        totalAmount: transaction.totalAmount,
      }) + transaction.timestamp,
    )

    return transaction.hash === expectedHash
  }

  public getChainValidation(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      if (
        currentBlock.hash !==
        this.calculateHash(
          currentBlock.index,
          currentBlock.timestamp,
          currentBlock.transactions,
          currentBlock.previousHash,
          currentBlock.nonce,
        )
      ) {
        return false
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }
    return true
  }

  private generateTransactionId(): string {
    return "TX" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase()
  }

  public getTransactionHistory(customerAadhaar?: string, shopId?: string): BlockchainTransaction[] {
    const allTransactions: BlockchainTransaction[] = []

    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (customerAadhaar && tx.customerAadhaar !== customerAadhaar) continue
        if (shopId && tx.shopId !== shopId) continue
        allTransactions.push(tx)
      }
    }

    return allTransactions.sort((a, b) => b.timestamp - a.timestamp)
  }
}

// Singleton instance
export const blockchainService = new BlockchainService()
