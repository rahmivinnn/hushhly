export type SubscriptionTier = 'Monthly' | 'Annual' | 'Family Plan' | 'Sleep Plan' | 'Premium' | 'Any';
export type DiscountType = 'percentage' | 'fixed' | 'free';
export type DurationType = 'lifetime' | 'months' | 'days' | 'one-time';
export type UserType = 'new' | 'existing' | 'inactive' | 'beta' | 'any';

export interface PromoCodeCondition {
  type: 'maxUses' | 'dateRange' | 'userType' | 'userAction' | 'userTag';
  value: any;
}

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discount: string;
  subscriptionTiers: SubscriptionTier[];
  isActive: boolean;
  discountType: DiscountType;
  discountValue: number;
  duration: DurationType;
  durationValue?: number;
  conditions: PromoCodeCondition[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PromoCodeUsage {
  id: string;
  promoCodeId: string;
  userId: string;
  usedAt: Date;
  subscriptionId: string;
  isActive: boolean;
}

export interface PromoCodeValidationResult {
  isValid: boolean;
  message: string;
  discount?: number;
  discountDuration?: string;
  promoDetails?: PromoCode;
}

// Sample promo codes for development
export const SAMPLE_PROMO_CODES: { [key: string]: PromoCode } = {
  'FREE100': {
    id: 'promo_free100',
    code: 'FREE100',
    description: '100% off for life',
    discount: '100% off for life',
    subscriptionTiers: ['Premium'],
    isActive: true,
    discountType: 'percentage',
    discountValue: 100,
    duration: 'lifetime',
    conditions: [
      { type: 'maxUses', value: 100 }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'DAILY5': {
    id: 'promo_daily5',
    code: 'DAILY5',
    description: 'Free 5-day trial',
    discount: 'Free for 5 days',
    subscriptionTiers: ['Any'],
    isActive: true,
    discountType: 'free',
    discountValue: 100,
    duration: 'days',
    durationValue: 5,
    conditions: [
      { type: 'userType', value: 'new' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'REFOCUS2025': {
    id: 'promo_refocus2025',
    code: 'REFOCUS2025',
    description: '25% off annual plan',
    discount: '25% off annual',
    subscriptionTiers: ['Annual'],
    isActive: true,
    discountType: 'percentage',
    discountValue: 25,
    duration: 'months',
    durationValue: 12,
    conditions: [
      { 
        type: 'dateRange', 
        value: {
          startDate: new Date('2025-01-01T00:00:00Z'),
          endDate: new Date('2025-01-31T23:59:59Z')
        }
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'SOFTLAUNCH': {
    id: 'promo_softlaunch',
    code: 'SOFTLAUNCH',
    description: '100% off for 3 months',
    discount: '100% off for 3 months',
    subscriptionTiers: ['Premium'],
    isActive: true,
    discountType: 'percentage',
    discountValue: 100,
    duration: 'months',
    durationValue: 3,
    conditions: [
      { type: 'userTag', value: 'beta' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'EARLYBIRD50': {
    id: 'promo_earlybird50',
    code: 'EARLYBIRD50',
    description: '50% off for life',
    discount: '50% off for life',
    subscriptionTiers: ['Premium'],
    isActive: true,
    discountType: 'percentage',
    discountValue: 50,
    duration: 'lifetime',
    conditions: [
      { type: 'maxUses', value: 500 }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'NAPTIME30': {
    id: 'promo_naptime30',
    code: 'NAPTIME30',
    description: '30% off 6 months',
    discount: '30% off 6 months',
    subscriptionTiers: ['Monthly', 'Annual'],
    isActive: true,
    discountType: 'percentage',
    discountValue: 30,
    duration: 'months',
    durationValue: 6,
    conditions: [
      { type: 'userTag', value: 'parent' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'SLEEPEASY': {
    id: 'promo_sleepeasy',
    code: 'SLEEPEASY',
    description: '20% off first month',
    discount: '20% off first month',
    subscriptionTiers: ['Sleep Plan', 'Premium'],
    isActive: true,
    discountType: 'percentage',
    discountValue: 20,
    duration: 'months',
    durationValue: 1,
    conditions: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'RESET10': {
    id: 'promo_reset10',
    code: 'RESET10',
    description: '10% off next month',
    discount: '10% off next month',
    subscriptionTiers: ['Monthly'],
    isActive: true,
    discountType: 'percentage',
    discountValue: 10,
    duration: 'months',
    durationValue: 1,
    conditions: [
      { type: 'userType', value: 'inactive' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'MINDFULFAM': {
    id: 'promo_mindfulfam',
    code: 'MINDFULFAM',
    description: '30% off family plan',
    discount: '30% off family plan',
    subscriptionTiers: ['Family Plan'],
    isActive: true,
    discountType: 'percentage',
    discountValue: 30,
    duration: 'lifetime',
    conditions: [
      { type: 'userType', value: 'new' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'MUMTIME25': {
    id: 'promo_mumtime25',
    code: 'MUMTIME25',
    description: '25% off 3 months',
    discount: '25% off 3 months',
    subscriptionTiers: ['Monthly', 'Annual'],
    isActive: true,
    discountType: 'percentage',
    discountValue: 25,
    duration: 'months',
    durationValue: 3,
    conditions: [
      { 
        type: 'dateRange', 
        value: {
          startDate: new Date('2025-05-01T00:00:00Z'),
          endDate: new Date('2025-05-15T23:59:59Z')
        }
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'FOURTHTHRIMETER': {
    id: 'promo_fourththrimeter',
    code: 'FOURTHTHRIMETER',
    description: '50% off 3 months',
    discount: '50% off 3 months',
    subscriptionTiers: ['Monthly'],
    isActive: true,
    discountType: 'percentage',
    discountValue: 50,
    duration: 'months',
    durationValue: 3,
    conditions: [
      { type: 'userTag', value: 'new_mom' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'GIFTWELLNESS': {
    id: 'promo_giftwellness',
    code: 'GIFTWELLNESS',
    description: '100% off 1 month',
    discount: '100% off 1 month',
    subscriptionTiers: ['Monthly'],
    isActive: true,
    discountType: 'percentage',
    discountValue: 100,
    duration: 'months',
    durationValue: 1,
    conditions: [
      { type: 'userAction', value: 'referral' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'BREATHEAGAIN': {
    id: 'promo_breatheagain',
    code: 'BREATHEAGAIN',
    description: '100% off 1 month',
    discount: '100% off 1 month',
    subscriptionTiers: ['Monthly'],
    isActive: true,
    discountType: 'percentage',
    discountValue: 100,
    duration: 'months',
    durationValue: 1,
    conditions: [
      { type: 'userAction', value: 'cancellation' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'CALMTOGETHER': {
    id: 'promo_calmtogether',
    code: 'CALMTOGETHER',
    description: 'Second user free',
    discount: 'Second user free',
    subscriptionTiers: ['Monthly'],
    isActive: true,
    discountType: 'free',
    discountValue: 100,
    duration: 'lifetime',
    conditions: [
      { type: 'userAction', value: 'paired_signup' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'GRATITUDE10': {
    id: 'promo_gratitude10',
    code: 'GRATITUDE10',
    description: '10% off all plans',
    discount: '10% off all plans',
    subscriptionTiers: ['Any'],
    isActive: true,
    discountType: 'percentage',
    discountValue: 10,
    duration: 'lifetime',
    conditions: [
      { 
        type: 'dateRange', 
        value: {
          startDate: new Date('2025-11-20T00:00:00Z'),
          endDate: new Date('2025-11-30T23:59:59Z')
        }
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
};
