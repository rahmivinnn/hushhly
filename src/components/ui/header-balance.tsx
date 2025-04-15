import React from 'react';
import { BalanceDisplay } from './balance-display';
import { Button } from './button';
import { useNavigate } from 'react-router-dom';

interface HeaderBalanceProps {
  showAddFunds?: boolean;
  onAddFundsClick?: () => void;
}

export const HeaderBalance: React.FC<HeaderBalanceProps> = ({
  showAddFunds = false,
  onAddFundsClick
}) => {
  const navigate = useNavigate();

  const handleAddFundsClick = () => {
    if (onAddFundsClick) {
      onAddFundsClick();
    } else {
      // Navigate to a default add funds page if no custom handler
      navigate('/add-funds');
    }
  };

  return (
    <div className="flex items-center justify-between bg-white px-4 py-2 shadow-sm rounded-lg">
      <BalanceDisplay compact />
      
      {showAddFunds && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleAddFundsClick}
          className="ml-2 text-xs"
        >
          Add Funds
        </Button>
      )}
    </div>
  );
};
