import { toast } from "@/hooks/use-toast";
import { promoCodeService } from './promoCodeService';
import { PromoCode } from '../types/promoCode';
import { balanceService } from './balanceService';

// Payment gateway types
export type PaymentMethod = 'credit_card' | 'apple_pay' | 'google_pay' | 'balance';
export type SubscriptionPlan = 'monthly' | 'annual';

export interface PaymentDetails {
  method: PaymentMethod;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVC?: string;
  billingName?: string;
  billingAddress?: string;
  billingZip?: string;
}

export interface SubscriptionDetails {
  plan: SubscriptionPlan;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  status: 'active' | 'canceled' | 'expired' | 'pending';
  paymentId: string;
  promoCodeId?: string;
  originalPrice?: number;
  finalPrice?: number;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
  subscriptionDetails?: SubscriptionDetails;
  promoCodeApplied?: boolean;
  promoCode?: PromoCode;
}

class PaymentService {
  // Prices in USD
  private prices = {
    monthly: 7.99,
    annual: 59.99
  };

  // Process payment for subscription
  async processPayment(
    plan: SubscriptionPlan,
    paymentDetails: PaymentDetails,
    promoCode?: string,
    userId?: string
  ): Promise<PaymentResult> {
    try {
      // Get base price for the plan
      const originalPrice = this.prices[plan];
      let finalPrice = originalPrice;
      let appliedPromoCode: PromoCode | undefined;
      let promoCodeId: string | undefined;

      // Apply promo code if provided and user ID is available
      if (promoCode && userId) {
        const validationResult = await promoCodeService.validatePromoCode(
          promoCode,
          plan === 'monthly' ? 'Monthly' : 'Annual',
          userId
        );

        if (validationResult.isValid && validationResult.promoDetails) {
          // Calculate discounted price
          finalPrice = this.calculateDiscountedPrice(
            originalPrice,
            validationResult.promoDetails
          );

          appliedPromoCode = validationResult.promoDetails;
          promoCodeId = validationResult.promoDetails.id;
        }
      }

      // Validate payment details first
      if (!this.validatePaymentDetails(paymentDetails)) {
        return {
          success: false,
          error: 'Invalid payment details'
        };
      }

      // Generate payment ID
      const paymentId = `pay_${Math.random().toString(36).substring(2, 15)}`;
      const now = new Date();

      // Calculate subscription end date based on plan
      const endDate = new Date(now);
      if (plan === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      // If promo code gives free months, adjust end date
      if (appliedPromoCode &&
          appliedPromoCode.discountType === 'free' &&
          appliedPromoCode.duration === 'days' &&
          appliedPromoCode.durationValue) {
        endDate.setDate(endDate.getDate() + appliedPromoCode.durationValue);
      }

      // Create subscription details
      const subscriptionDetails: SubscriptionDetails = {
        plan,
        startDate: now,
        endDate,
        autoRenew: true,
        status: 'pending', // Start as pending until payment is confirmed
        paymentId,
        promoCodeId,
        originalPrice,
        finalPrice
      };

      // Convert price to IDR (assuming prices are in USD)
      const priceInIDR = Math.round(finalPrice * 15000); // Approximate USD to IDR conversion

      // Use real balance deduction with consistent user ID
      const userIdToUse = userId || this.getTempUserId();
      const paymentDescription = `Subscription to ${plan === 'monthly' ? 'Monthly' : 'Annual'} Plan`;

      // Process the actual payment by deducting from user balance
      const deductResult = await balanceService.deductBalance(
        userIdToUse,
        priceInIDR,
        paymentDescription,
        paymentDetails.method
      );

      if (!deductResult.success) {
        return {
          success: false,
          error: deductResult.error || 'Payment failed'
        };
      }

      // Payment successful, update subscription status
      subscriptionDetails.status = 'active';

      // Return successful result
      const result: PaymentResult = {
        success: true,
        paymentId,
        subscriptionDetails,
        promoCodeApplied: !!promoCodeId,
        promoCode: appliedPromoCode
      };

      // Record promo code usage if payment was successful
      if (result.success && userId && promoCodeId) {
        await promoCodeService.recordPromoCodeUsage(
          promoCodeId,
          userId,
          result.paymentId || ''
        );
      }

      return result;
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown payment error'
      };
    }
  }

  // Verify payment status
  async verifyPayment(paymentId: string): Promise<boolean> {
    try {
      // In a real implementation, this would make an API call to verify payment status
      // For now, we'll simulate the API call with a promise

      return await new Promise<boolean>((resolve) => {
        // Simulate a longer verification process (3-5 seconds)
        const verificationTime = 3000 + Math.random() * 2000;

        setTimeout(() => {
          // Simulate 80% success rate for payment verification
          // This makes the payment process more realistic
          const isVerified = Math.random() < 0.8;
          resolve(isVerified);
        }, verificationTime);
      });
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }

  // Calculate price with promo code applied
  async calculatePrice(plan: SubscriptionPlan, promoCode?: string, userId?: string): Promise<number> {
    const originalPrice = this.prices[plan];

    if (!promoCode || !userId) {
      return originalPrice;
    }

    // Validate promo code
    const validationResult = await promoCodeService.validatePromoCode(
      promoCode,
      plan === 'monthly' ? 'Monthly' : 'Annual',
      userId
    );

    if (validationResult.isValid && validationResult.promoDetails) {
      // Calculate discounted price
      return this.calculateDiscountedPrice(originalPrice, validationResult.promoDetails);
    }

    return originalPrice;
  }

  // Calculate discounted price based on promo code
  calculateDiscountedPrice(originalPrice: number, promoCode: PromoCode): number {
    if (!promoCode) return originalPrice;

    if (promoCode.discountType === 'free') return 0;

    if (promoCode.discountType === 'percentage') {
      const discountAmount = (originalPrice * promoCode.discountValue) / 100;
      return Math.max(0, originalPrice - discountAmount);
    }

    if (promoCode.discountType === 'fixed') {
      return Math.max(0, originalPrice - promoCode.discountValue);
    }

    return originalPrice;
  }

  // Save subscription to user profile
  async saveSubscription(userId: string, subscriptionDetails: SubscriptionDetails): Promise<boolean> {
    try {
      // In a real implementation, this would save to a database
      // For now, we'll use localStorage

      // Get current user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        return false;
      }

      // Update user data with subscription details
      const user = JSON.parse(userData);
      user.subscription = subscriptionDetails;
      user.isPremium = subscriptionDetails.status === 'active';

      // Save updated user data
      localStorage.setItem('user', JSON.stringify(user));

      // In a real implementation, you would also save to Firestore
      // const userRef = doc(db, 'users', userId);
      // await updateDoc(userRef, {
      //   subscription: subscriptionDetails,
      //   isPremium: subscriptionDetails.status === 'active',
      //   updatedAt: serverTimestamp()
      // });

      return true;
    } catch (error) {
      console.error('Error saving subscription:', error);
      return false;
    }
  }

  // Cancel subscription
  async cancelSubscription(userId: string): Promise<boolean> {
    try {
      // Get current user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        return false;
      }

      // Update user data with canceled subscription
      const user = JSON.parse(userData);
      if (user.subscription) {
        // Store the original subscription details
        const originalSubscription = { ...user.subscription };

        // Update subscription status
        user.subscription.status = 'canceled';
        user.subscription.autoRenew = false;

        // Save updated user data
        localStorage.setItem('user', JSON.stringify(user));

        // In a real implementation, you would also update Firestore
        // const userRef = doc(db, 'users', userId);
        // await updateDoc(userRef, {
        //   'subscription.status': 'canceled',
        //   'subscription.autoRenew': false,
        //   updatedAt: serverTimestamp()
        // });

        // If there was a promo code, update its usage status
        if (originalSubscription.promoCodeId) {
          // In a real implementation, you would update the promo code usage
          // const usageQuery = query(
          //   collection(db, 'promoCodeUsages'),
          //   where('promoCodeId', '==', originalSubscription.promoCodeId),
          //   where('userId', '==', userId),
          //   where('isActive', '==', true)
          // );
          //
          // const usageSnapshot = await getDocs(usageQuery);
          // if (!usageSnapshot.empty) {
          //   const usageDoc = usageSnapshot.docs[0];
          //   await updateDoc(doc(db, 'promoCodeUsages', usageDoc.id), {
          //     isActive: false,
          //     cancelledAt: serverTimestamp()
          //   });
          // }
        }

        // Offer a win-back promo code
        this.offerWinbackPromoCode(userId);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return false;
    }
  }

  // Offer a win-back promo code after cancellation
  private async offerWinbackPromoCode(userId: string): Promise<void> {
    try {
      // In a real implementation, you would check if the user is eligible for a win-back offer
      // and add the 'cancellation' action to their profile

      // const userRef = doc(db, 'users', userId);
      // await updateDoc(userRef, {
      //   actions: arrayUnion('cancellation'),
      //   updatedAt: serverTimestamp()
      // });

      // For now, we'll just simulate this by showing a toast
      toast({
        title: "Special Offer",
        description: "Use code BREATHEAGAIN for 1 month free when you resubscribe!"
      });
    } catch (error) {
      console.error('Error offering win-back promo code:', error);
    }
  }

  // Check if user has active subscription
  hasActiveSubscription(userId: string): boolean {
    try {
      // Get current user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        return false;
      }

      // Check if user has active subscription
      const user = JSON.parse(userData);
      return user.isPremium === true &&
             user.subscription?.status === 'active' &&
             new Date(user.subscription.endDate) > new Date();
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  }

  // Get subscription details
  getSubscriptionDetails(userId: string): SubscriptionDetails | null {
    try {
      // Get current user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        return null;
      }

      // Get subscription details
      const user = JSON.parse(userData);
      return user.subscription || null;
    } catch (error) {
      console.error('Error getting subscription details:', error);
      return null;
    }
  }

  // Get consistent temporary user ID
  private getTempUserId(): string {
    // Check if we already have a temporary ID in localStorage
    let tempId = localStorage.getItem('temp_user_id');

    // If not, create a new one and store it
    if (!tempId) {
      tempId = `temp_user_${Date.now()}`;
      localStorage.setItem('temp_user_id', tempId);
    }

    return tempId;
  }

  // Private helper methods
  private validatePaymentDetails(details: PaymentDetails): boolean {
    // In a real implementation, this would validate payment details
    // For now, we'll just check if required fields are present based on payment method

    if (details.method === 'credit_card') {
      return !!(details.cardNumber && details.cardExpiry && details.cardCVC);
    } else if (details.method === 'apple_pay' || details.method === 'google_pay' || details.method === 'balance') {
      // For mobile payment methods and balance, we don't need additional validation
      return true;
    }

    return false;
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
