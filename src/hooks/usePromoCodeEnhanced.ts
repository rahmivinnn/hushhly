import { useState, useEffect } from 'react';
import { PromoCode, PromoCodeValidationResult, SubscriptionTier } from '../types/promoCode';
import { promoCodeService } from '../services/promoCodeService';
import { useAuthSimple } from './useAuthSimple';

interface UsePromoCodeReturn {
  applyPromoCode: (code: string, plan: SubscriptionTier) => Promise<PromoCodeValidationResult>;
  removePromoCode: () => void;
  activePromo: PromoCode | null;
  isValidating: boolean;
  calculateDiscountedPrice: (originalPrice: number) => number;
  getFormattedDiscountText: (originalPrice: number) => string;
}

export const usePromoCodeEnhanced = (): UsePromoCodeReturn => {
  const [activePromo, setActivePromo] = useState<PromoCode | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const { user } = useAuthSimple();

  // Initialize promo code service with sample data
  useEffect(() => {
    promoCodeService.initializeSamplePromoCodes();
  }, []);

  const applyPromoCode = async (code: string, plan: SubscriptionTier): Promise<PromoCodeValidationResult> => {
    // Generate a temporary user ID if user is not logged in
    const userId = user?.id || `temp_user_${Date.now()}`;

    setIsValidating(true);

    try {
      const validationResult = await promoCodeService.validatePromoCode(
        code,
        plan,
        userId
      );

      if (validationResult.isValid && validationResult.promoDetails) {
        setActivePromo(validationResult.promoDetails);
      }

      return validationResult;
    } catch (error) {
      console.error('Error applying promo code:', error);
      return {
        isValid: false,
        message: 'An error occurred while validating the promo code'
      };
    } finally {
      setIsValidating(false);
    }
  };

  const removePromoCode = () => {
    setActivePromo(null);
  };

  const calculateDiscountedPrice = (originalPrice: number): number => {
    if (!activePromo) return originalPrice;

    if (activePromo.discountType === 'free') return 0;

    if (activePromo.discountType === 'percentage') {
      const discountAmount = (originalPrice * activePromo.discountValue) / 100;
      return Math.max(0, originalPrice - discountAmount);
    }

    if (activePromo.discountType === 'fixed') {
      return Math.max(0, originalPrice - activePromo.discountValue);
    }

    return originalPrice;
  };

  const getFormattedDiscountText = (originalPrice: number): string => {
    if (!activePromo) return '';

    const discountedPrice = calculateDiscountedPrice(originalPrice);
    const savings = originalPrice - discountedPrice;

    if (savings <= 0) return '';

    if (activePromo.discountType === 'free') {
      if (activePromo.duration === 'lifetime') {
        return 'Free forever';
      } else if (activePromo.duration === 'months' && activePromo.durationValue) {
        return `Free for ${activePromo.durationValue} ${activePromo.durationValue === 1 ? 'month' : 'months'}`;
      } else if (activePromo.duration === 'days' && activePromo.durationValue) {
        return `Free for ${activePromo.durationValue} ${activePromo.durationValue === 1 ? 'day' : 'days'}`;
      }
      return 'Free';
    }

    if (activePromo.discountType === 'percentage') {
      return `${activePromo.discountValue}% off (Save $${savings.toFixed(2)})`;
    }

    if (activePromo.discountType === 'fixed') {
      return `$${activePromo.discountValue} off`;
    }

    return '';
  };

  return {
    applyPromoCode,
    removePromoCode,
    activePromo,
    isValidating,
    calculateDiscountedPrice,
    getFormattedDiscountText
  };
};
