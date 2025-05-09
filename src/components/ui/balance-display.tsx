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
  showAddFunds = false, // Default to false to hide Add Funds button
  compact = false,
  className = ''
}) => {
  const { user } = useAuthSimple();
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(true);

  // Get consistent temporary user ID
  const getTempUserId = () => {
    // Check if we already have a temporary ID in localStorage
    let tempId = localStorage.getItem('temp_user_id');

    // If not, create a new one and store it
    if (!tempId) {
      tempId = `temp_user_${Date.now()}`;
      localStorage.setItem('temp_user_id', tempId);
    }

    return tempId;
  };

  // Get current user ID (real or temporary)
  const getCurrentUserId = () => {
    return user?.id || getTempUserId();
  };

  // Load user balance
  useEffect(() => {
    const loadBalance = () => {
      try {
        const userId = getCurrentUserId();
        const userBalance = balanceService.getUserBalance(userId);
        setBalance(userBalance.balance);
        setCurrency(userBalance.currency);
      } catch (error) {
        console.error('Error loading balance:', error);
        toast.error('Failed to load balance');
      } finally {
        setIsLoading(false);
      }
    };

    loadBalance();

    // Refresh balance every 1 second for more real-time updates
    const intervalId = setInterval(loadBalance, 1000);

    // Listen for custom event for balance updates
    const handleBalanceUpdate = () => loadBalance();
    window.addEventListener('balance-updated', handleBalanceUpdate);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('balance-updated', handleBalanceUpdate);
    };
  }, [user]);

  // Add Funds functionality removed

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

        {/* Add Funds button removed */}
      </div>
    </div>
  );
};
