import React from 'react';
import { BalanceDisplay } from './balance-display';

interface HeaderBalanceProps {}

export const HeaderBalance: React.FC<HeaderBalanceProps> = () => {
  return (
    <div className="flex items-center justify-between bg-white px-4 py-2 shadow-sm rounded-lg">
      <BalanceDisplay compact />
      {/* Add Funds button completely removed */}
    </div>
  );
};
