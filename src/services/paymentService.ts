import { toast } from "@/hooks/use-toast";

// Payment gateway types
export type PaymentMethod = 'credit_card' | 'apple_pay' | 'google_pay';
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
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
  subscriptionDetails?: SubscriptionDetails;
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
    promoCode?: string
  ): Promise<PaymentResult> {
    try {
      // In a real implementation, this would make an API call to a payment processor
      // For now, we'll simulate the API call with a promise
      
      // Simulate network request
      const result = await new Promise<PaymentResult>((resolve, reject) => {
        setTimeout(() => {
          // Simulate successful payment (in real implementation, this would be the response from payment gateway)
          if (this.validatePaymentDetails(paymentDetails)) {
            const paymentId = `pay_${Math.random().toString(36).substring(2, 15)}`;
            const now = new Date();
            
            // Calculate subscription end date based on plan
            const endDate = new Date(now);
            if (plan === 'monthly') {
              endDate.setMonth(endDate.getMonth() + 1);
            } else {
              endDate.setFullYear(endDate.getFullYear() + 1);
            }
            
            resolve({
              success: true,
              paymentId,
              subscriptionDetails: {
                plan,
                startDate: now,
                endDate,
                autoRenew: true,
                status: 'active',
                paymentId
              }
            });
          } else {
            reject({
              success: false,
              error: 'Invalid payment details'
            });
          }
        }, 2000); // Simulate network delay
      });
      
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
        setTimeout(() => {
          // Simulate 95% success rate for payment verification
          const isVerified = Math.random() < 0.95;
          resolve(isVerified);
        }, 1500);
      });
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }
  
  // Calculate price with promo code applied
  calculatePrice(plan: SubscriptionPlan, promoCode?: string): number {
    // In a real implementation, this would validate the promo code and apply discount
    // For now, we'll just return the base price
    return this.prices[plan];
  }
  
  // Save subscription to user profile
  saveSubscription(userId: string, subscriptionDetails: SubscriptionDetails): boolean {
    try {
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
        user.subscription.status = 'canceled';
        user.subscription.autoRenew = false;
        
        // Save updated user data
        localStorage.setItem('user', JSON.stringify(user));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return false;
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
  
  // Private helper methods
  private validatePaymentDetails(details: PaymentDetails): boolean {
    // In a real implementation, this would validate payment details
    // For now, we'll just check if required fields are present based on payment method
    
    if (details.method === 'credit_card') {
      return !!(details.cardNumber && details.cardExpiry && details.cardCVC);
    } else if (details.method === 'apple_pay' || details.method === 'google_pay') {
      // For mobile payment methods, we don't need additional validation
      return true;
    }
    
    return false;
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
