import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { balanceService, Transaction } from '@/services/balanceService';
import { useAuthSimple } from '@/hooks/useAuthSimple';
import { HeaderBalance } from '@/components/ui/header-balance';

const TransactionHistory: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthSimple();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = () => {
      try {
        // Get user ID (or create temporary one)
        const userId = user?.id || `temp_user_${Date.now()}`;
        
        // Get transaction history
        const history = balanceService.getTransactionHistory(userId);
        setTransactions(history);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [user]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">Transaction History</h1>
          </div>
          
          <div className="w-32">
            <HeaderBalance />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex-grow">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{formatDate(transaction.timestamp)}</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                    {transaction.paymentMethod && (
                      <span className="text-xs text-gray-500 ml-2">
                        via {transaction.paymentMethod}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`font-bold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}
                  {balanceService.formatBalance(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
