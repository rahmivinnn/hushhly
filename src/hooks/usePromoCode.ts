import { useState } from 'react';
import { PROMO_CODES, PromoCode } from '@/types/promo';

interface UsePromoCodeReturn {
  applyPromoCode: (code: string, plan: string) => { 
    isValid: boolean;
    message: string;
    discount?: number;
    discountDuration?: string;
    promoDetails?: PromoCode;
  };
  removePromoCode: () => void;
  activePromo: PromoCode | null;
  calculateDiscountedPrice: (originalPrice: number) => number;
}

export const usePromoCode = (): UsePromoCodeReturn => {
  const [activePromo, setActivePromo] = useState<PromoCode | null>(null);

  const applyPromoCode = (code: string, plan: string) => {
    const upperCode = code.toUpperCase();
    const promoCode = PROMO_CODES[upperCode];

    if (!promoCode) {
      return {
        isValid: false,
        message: 'Invalid promo code'
      };
    }

    if (!promoCode.isValid) {
      return {
        isValid: false,
        message: 'This promo code has expired'
      };
    }

    // Check if the promo code is valid for the selected plan
    if (!promoCode.subscriptionTier.includes(plan) && !promoCode.subscriptionTier.includes('Any')) {
      return {
        isValid: false,
        message: `This promo code is not valid for ${plan} plan`
      };
    }

    setActivePromo(promoCode);
    
    return {
      isValid: true,
      message: `${promoCode.discount} applied successfully!`,
      discount: promoCode.discountValue,
      discountDuration: promoCode.duration,
      promoDetails: promoCode
    };
  };

  const removePromoCode = () => {
    setActivePromo(null);
  };

  const calculateDiscountedPrice = (originalPrice: number): number => {
    if (!activePromo) return originalPrice;

    if (activePromo.discountType === 'free') return 0;

    if (activePromo.discountType === 'percentage') {
      const discountAmount = (originalPrice * activePromo.discountValue) / 100;
      return originalPrice - discountAmount;
    }

    if (activePromo.discountType === 'fixed') {
      return Math.max(0, originalPrice - activePromo.discountValue);
    }

    return originalPrice;
  };

  return {
    applyPromoCode,
    removePromoCode,
    activePromo,
    calculateDiscountedPrice
  };
}; 