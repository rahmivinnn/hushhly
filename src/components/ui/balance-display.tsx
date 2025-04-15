import React, { useState, useEffect } from 'react';
import { balanceService } from '@/services/balanceService';
import { useAuthSimple } from '@/hooks/useAuthSimple';
import { Button } from './button';
import { toast } from 'sonner';

interface BalanceDisplayProps {
  showAddFunds?: boolean;
  compact?: boolean;
  className?: string;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  showAddFunds = true,
  compact = false,
  className = ''
}) => {
  const { user } = useAuthSimple();
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState('IDR');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingFunds, setIsAddingFunds] = useState(false);

  // Load user balance
  useEffect(() => {
    const loadBalance = () => {
      try {
        if (user?.id) {
          const userBalance = balanceService.getUserBalance(user.id);
          setBalance(userBalance.balance);
          setCurrency(userBalance.currency);
        } else {
          // For anonymous users, create a temporary ID
          const tempUserId = `temp_user_${Date.now()}`;
          const userBalance = balanceService.getUserBalance(tempUserId);
          setBalance(userBalance.balance);
          setCurrency(userBalance.currency);
        }
      } catch (error) {
        console.error('Error loading balance:', error);
        toast.error('Failed to load balance');
      } finally {
        setIsLoading(false);
      }
    };

    loadBalance();
    
    // Refresh balance every 5 seconds
    const intervalId = setInterval(loadBalance, 5000);
    
    return () => clearInterval(intervalId);
  }, [user]);

  // Handle adding funds
  const handleAddFunds = async () => {
    try {
      setIsAddingFunds(true);
      
      // Get user ID (or create temporary one)
      const userId = user?.id || `temp_user_${Date.now()}`;
      
      // Add 500,000 IDR to balance
      const amount = 500000;
      const description = 'Top up balance';
      
      // Process the transaction
      const success = await balanceService.addBalance(userId, amount, description);
      
      if (success) {
        // Update local balance
        const userBalance = balanceService.getUserBalance(userId);
        setBalance(userBalance.balance);
        
        // Show success message
        toast.success(`Added ${balanceService.formatBalance(amount, currency)} to your balance`);
      } else {
        toast.error('Failed to add funds');
      }
    } catch (error) {
      console.error('Error adding funds:', error);
      toast.error('An error occurred while adding funds');
    } finally {
      setIsAddingFunds(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center ${className}`}>
        <span className="font-medium text-sm">
          {balanceService.formatBalance(balance, currency)}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Your Balance</p>
          <p className="text-xl font-bold">
            {balanceService.formatBalance(balance, currency)}
          </p>
        </div>
        
        {showAddFunds && (
          <Button
            size="sm"
            onClick={handleAddFunds}
            disabled={isAddingFunds}
            className="ml-4"
          >
            {isAddingFunds ? 'Adding...' : 'Add Funds'}
          </Button>
        )}
      </div>
    </div>
  );
};
