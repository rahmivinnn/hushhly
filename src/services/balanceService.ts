import { toast } from 'sonner';

// Interface untuk data saldo pengguna
export interface UserBalance {
  userId: string;
  balance: number;
  currency: string;
  lastUpdated: number;
  transactions: Transaction[];
}

// Interface untuk transaksi
export interface Transaction {
  id: string;
  amount: number;
  type: 'debit' | 'credit';
  description: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod?: string;
}

// Kunci untuk menyimpan data di localStorage
const BALANCE_STORAGE_KEY = 'hushhly_user_balance';
const DEFAULT_BALANCE = 1000000; // 1 juta rupiah sebagai saldo default

/**
 * Service untuk mengelola saldo pengguna
 */
export const balanceService = {
  /**
   * Mendapatkan saldo pengguna
   * @param userId ID pengguna
   * @returns Data saldo pengguna
   */
  getUserBalance(userId: string): UserBalance {
    try {
      // Coba ambil data dari localStorage
      const storedData = localStorage.getItem(BALANCE_STORAGE_KEY);
      
      if (storedData) {
        const balances = JSON.parse(storedData) as Record<string, UserBalance>;
        
        // Jika data pengguna sudah ada, kembalikan
        if (balances[userId]) {
          return balances[userId];
        }
      }
      
      // Jika tidak ada data, buat data baru
      const newBalance: UserBalance = {
        userId,
        balance: DEFAULT_BALANCE,
        currency: 'IDR',
        lastUpdated: Date.now(),
        transactions: []
      };
      
      // Simpan data baru
      this.saveUserBalance(userId, newBalance);
      
      return newBalance;
    } catch (error) {
      console.error('Error getting user balance:', error);
      
      // Kembalikan data default jika terjadi error
      return {
        userId,
        balance: DEFAULT_BALANCE,
        currency: 'IDR',
        lastUpdated: Date.now(),
        transactions: []
      };
    }
  },
  
  /**
   * Menyimpan data saldo pengguna
   * @param userId ID pengguna
   * @param balanceData Data saldo pengguna
   */
  saveUserBalance(userId: string, balanceData: UserBalance): void {
    try {
      // Coba ambil data dari localStorage
      const storedData = localStorage.getItem(BALANCE_STORAGE_KEY);
      let balances: Record<string, UserBalance> = {};
      
      if (storedData) {
        balances = JSON.parse(storedData);
      }
      
      // Update data pengguna
      balances[userId] = {
        ...balanceData,
        lastUpdated: Date.now()
      };
      
      // Simpan kembali ke localStorage
      localStorage.setItem(BALANCE_STORAGE_KEY, JSON.stringify(balances));
    } catch (error) {
      console.error('Error saving user balance:', error);
      toast.error('Gagal menyimpan data saldo');
    }
  },
  
  /**
   * Menambah saldo pengguna
   * @param userId ID pengguna
   * @param amount Jumlah yang ditambahkan
   * @param description Deskripsi transaksi
   * @returns Status keberhasilan
   */
  async addBalance(userId: string, amount: number, description: string): Promise<boolean> {
    try {
      // Dapatkan data saldo pengguna
      const balanceData = this.getUserBalance(userId);
      
      // Buat transaksi baru
      const transaction: Transaction = {
        id: `TRX${Date.now()}${Math.floor(Math.random() * 1000)}`,
        amount,
        type: 'credit',
        description,
        timestamp: Date.now(),
        status: 'pending'
      };
      
      // Tambahkan transaksi ke daftar transaksi
      balanceData.transactions.unshift(transaction);
      
      // Simpan perubahan
      this.saveUserBalance(userId, balanceData);
      
      // Simulasi proses backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update status transaksi menjadi completed
      const updatedBalanceData = this.getUserBalance(userId);
      const transactionIndex = updatedBalanceData.transactions.findIndex(t => t.id === transaction.id);
      
      if (transactionIndex !== -1) {
        updatedBalanceData.transactions[transactionIndex].status = 'completed';
        updatedBalanceData.balance += amount;
        
        // Simpan perubahan
        this.saveUserBalance(userId, updatedBalanceData);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error adding balance:', error);
      toast.error('Gagal menambah saldo');
      return false;
    }
  },
  
  /**
   * Mengurangi saldo pengguna (untuk pembayaran)
   * @param userId ID pengguna
   * @param amount Jumlah yang dikurangi
   * @param description Deskripsi transaksi
   * @param paymentMethod Metode pembayaran
   * @returns Status keberhasilan dan detail transaksi
   */
  async deductBalance(
    userId: string, 
    amount: number, 
    description: string,
    paymentMethod?: string
  ): Promise<{ success: boolean; transaction?: Transaction; error?: string }> {
    try {
      // Dapatkan data saldo pengguna
      const balanceData = this.getUserBalance(userId);
      
      // Cek apakah saldo mencukupi
      if (balanceData.balance < amount) {
        return { 
          success: false, 
          error: 'Saldo tidak mencukupi' 
        };
      }
      
      // Buat transaksi baru
      const transaction: Transaction = {
        id: `TRX${Date.now()}${Math.floor(Math.random() * 1000)}`,
        amount,
        type: 'debit',
        description,
        timestamp: Date.now(),
        status: 'pending',
        paymentMethod
      };
      
      // Tambahkan transaksi ke daftar transaksi
      balanceData.transactions.unshift(transaction);
      
      // Simpan perubahan
      this.saveUserBalance(userId, balanceData);
      
      // Simulasi proses backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update status transaksi menjadi completed
      const updatedBalanceData = this.getUserBalance(userId);
      const transactionIndex = updatedBalanceData.transactions.findIndex(t => t.id === transaction.id);
      
      if (transactionIndex !== -1) {
        updatedBalanceData.transactions[transactionIndex].status = 'completed';
        updatedBalanceData.balance -= amount;
        
        // Simpan perubahan
        this.saveUserBalance(userId, updatedBalanceData);
        
        return { 
          success: true, 
          transaction: updatedBalanceData.transactions[transactionIndex] 
        };
      }
      
      return { 
        success: false, 
        error: 'Gagal memproses transaksi' 
      };
    } catch (error) {
      console.error('Error deducting balance:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Gagal mengurangi saldo' 
      };
    }
  },
  
  /**
   * Mendapatkan riwayat transaksi pengguna
   * @param userId ID pengguna
   * @returns Daftar transaksi
   */
  getTransactionHistory(userId: string): Transaction[] {
    try {
      const balanceData = this.getUserBalance(userId);
      return balanceData.transactions;
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return [];
    }
  },
  
  /**
   * Format saldo dengan format mata uang
   * @param amount Jumlah saldo
   * @param currency Mata uang
   * @returns String saldo dengan format mata uang
   */
  formatBalance(amount: number, currency: string = 'IDR'): string {
    try {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (error) {
      console.error('Error formatting balance:', error);
      return `${currency} ${amount}`;
    }
  }
};
