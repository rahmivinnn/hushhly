export interface PromoCode {
  code: string;
  discount: string;
  subscriptionTier: string[];
  rules: string;
  isValid: boolean;
  discountType: 'percentage' | 'fixed' | 'free';
  discountValue: number;
  duration: 'lifetime' | 'months' | 'days' | 'one-time';
  durationValue?: number;
}

export const PROMO_CODES: { [key: string]: PromoCode } = {
  'FREE100': {
    code: 'FREE100',
    discount: '100% off for life',
    subscriptionTier: ['Premium'],
    rules: 'First 100 users only',
    isValid: true,
    discountType: 'percentage',
    discountValue: 100,
    duration: 'lifetime'
  },
  'EARLYBIRD50': {
    code: 'EARLYBIRD50',
    discount: '50% off for life',
    subscriptionTier: ['Premium'],
    rules: 'Next 500 users only',
    isValid: true,
    discountType: 'percentage',
    discountValue: 50,
    duration: 'lifetime'
  },
  'NAPTIME30': {
    code: 'NAPTIME30',
    discount: '30% off 6 months',
    subscriptionTier: ['Monthly', 'Annual'],
    rules: 'For parents with little time',
    isValid: true,
    discountType: 'percentage',
    discountValue: 30,
    duration: 'months',
    durationValue: 6
  },
  'DAILY5': {
    code: 'DAILY5',
    discount: 'Free for 5 days',
    subscriptionTier: ['Any'],
    rules: 'New users only',
    isValid: true,
    discountType: 'free',
    discountValue: 100,
    duration: 'days',
    durationValue: 5
  },
  'SLEEPEASY': {
    code: 'SLEEPEASY',
    discount: '20% off first month',
    subscriptionTier: ['Sleep Plan', 'Premium'],
    rules: 'One-time use',
    isValid: true,
    discountType: 'percentage',
    discountValue: 20,
    duration: 'months',
    durationValue: 1
  },
  'RESET10': {
    code: 'RESET10',
    discount: '10% off next month',
    subscriptionTier: ['Monthly'],
    rules: 'For inactive users (>30 days)',
    isValid: true,
    discountType: 'percentage',
    discountValue: 10,
    duration: 'months',
    durationValue: 1
  },
  'MINDFULFAM': {
    code: 'MINDFULFAM',
    discount: '30% off family plan',
    subscriptionTier: ['Family Plan'],
    rules: 'New family signups only',
    isValid: true,
    discountType: 'percentage',
    discountValue: 30,
    duration: 'lifetime'
  },
  'MUMTIME25': {
    code: 'MUMTIME25',
    discount: '25% off 3 months',
    subscriptionTier: ['Monthly', 'Annual'],
    rules: 'Seasonal (Mother\'s Day)',
    isValid: true,
    discountType: 'percentage',
    discountValue: 25,
    duration: 'months',
    durationValue: 3
  },
  'FOURTHTHRIMETER': {
    code: 'FOURTHTHRIMETER',
    discount: '50% off 3 months',
    subscriptionTier: ['Monthly'],
    rules: 'For new moms (via onboarding tag)',
    isValid: true,
    discountType: 'percentage',
    discountValue: 50,
    duration: 'months',
    durationValue: 3
  },
  'REFOCUS2025': {
    code: 'REFOCUS2025',
    discount: '25% off annual',
    subscriptionTier: ['Annual'],
    rules: 'Valid Jan 1-31 only',
    isValid: true,
    discountType: 'percentage',
    discountValue: 25,
    duration: 'months',
    durationValue: 12
  },
  'GIFTWELLNESS': {
    code: 'GIFTWELLNESS',
    discount: '100% off 1 month',
    subscriptionTier: ['Monthly'],
    rules: 'Activated on referral or gift checkout',
    isValid: true,
    discountType: 'percentage',
    discountValue: 100,
    duration: 'months',
    durationValue: 1
  },
  'BREATHEAGAIN': {
    code: 'BREATHEAGAIN',
    discount: '100% off 1 month',
    subscriptionTier: ['Monthly'],
    rules: 'Offer after cancellation',
    isValid: true,
    discountType: 'percentage',
    discountValue: 100,
    duration: 'months',
    durationValue: 1
  },
  'CALMTOGETHER': {
    code: 'CALMTOGETHER',
    discount: 'Second user free',
    subscriptionTier: ['Monthly'],
    rules: 'Applies to paired signups only',
    isValid: true,
    discountType: 'free',
    discountValue: 100,
    duration: 'lifetime'
  },
  'GRATITUDE10': {
    code: 'GRATITUDE10',
    discount: '10% off all plans',
    subscriptionTier: ['Any'],
    rules: 'Valid during Thanksgiving week',
    isValid: true,
    discountType: 'percentage',
    discountValue: 10,
    duration: 'lifetime'
  },
  'SOFTLAUNCH': {
    code: 'SOFTLAUNCH',
    discount: '100% off for 3 months',
    subscriptionTier: ['Premium'],
    rules: 'Beta users only',
    isValid: true,
    discountType: 'percentage',
    discountValue: 100,
    duration: 'months',
    durationValue: 3
  }
}; 