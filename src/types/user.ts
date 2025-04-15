export interface User {
  id: string;
  email: string;
  fullName?: string;
  createdAt?: Date;
  lastActiveAt?: Date;
  isPremium?: boolean;
  subscription?: {
    plan: string;
    startDate: Date;
    endDate: Date;
    status: 'active' | 'canceled' | 'expired' | 'pending';
  };
  tags?: string[];
  actions?: string[];
}

export interface UserSubscription {
  id: string;
  userId: string;
  plan: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'canceled' | 'expired' | 'pending';
  autoRenew: boolean;
  paymentId: string;
  promoCodeId?: string;
  price: number;
  originalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
