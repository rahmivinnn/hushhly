import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  serverTimestamp,
  increment,
  Timestamp,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  PromoCode, 
  PromoCodeUsage, 
  PromoCodeValidationResult, 
  SubscriptionTier,
  SAMPLE_PROMO_CODES
} from '../types/promoCode';
import { User } from '../types/user';

class PromoCodeService {
  // Collection references
  private promoCodesCollection = collection(db, 'promoCodes');
  private promoCodeUsagesCollection = collection(db, 'promoCodeUsages');
  private usersCollection = collection(db, 'users');

  // Initialize with sample promo codes if needed
  async initializeSamplePromoCodes() {
    try {
      // Check if promo codes already exist
      const snapshot = await getDocs(query(this.promoCodesCollection, limit(1)));
      
      if (snapshot.empty) {
        // Add sample promo codes
        const promises = Object.values(SAMPLE_PROMO_CODES).map(promoCode => {
          return addDoc(this.promoCodesCollection, {
            ...promoCode,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            usageCount: 0
          });
        });
        
        await Promise.all(promises);
        console.log('Sample promo codes initialized');
      }
    } catch (error) {
      console.error('Error initializing sample promo codes:', error);
    }
  }

  // Get promo code by code
  async getPromoCodeByCode(code: string): Promise<PromoCode | null> {
    try {
      const q = query(this.promoCodesCollection, where('code', '==', code.toUpperCase()));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }
      
      const promoCodeDoc = snapshot.docs[0];
      return { 
        id: promoCodeDoc.id, 
        ...promoCodeDoc.data() 
      } as PromoCode;
    } catch (error) {
      console.error('Error getting promo code:', error);
      return null;
    }
  }

  // Validate promo code
  async validatePromoCode(
    code: string, 
    subscriptionTier: SubscriptionTier,
    userId: string
  ): Promise<PromoCodeValidationResult> {
    try {
      // Get promo code
      const promoCode = await this.getPromoCodeByCode(code);
      
      if (!promoCode) {
        return {
          isValid: false,
          message: 'Invalid promo code'
        };
      }
      
      // Check if promo code is active
      if (!promoCode.isActive) {
        return {
          isValid: false,
          message: 'This promo code has expired'
        };
      }
      
      // Check if promo code applies to the selected subscription tier
      if (!promoCode.subscriptionTiers.includes(subscriptionTier) && 
          !promoCode.subscriptionTiers.includes('Any')) {
        return {
          isValid: false,
          message: `This promo code is not valid for ${subscriptionTier} plan`
        };
      }
      
      // Check conditions
      const user = await this.getUserById(userId);
      
      if (!user) {
        return {
          isValid: false,
          message: 'User not found'
        };
      }
      
      for (const condition of promoCode.conditions) {
        switch (condition.type) {
          case 'maxUses':
            const usageCount = await this.getPromoCodeUsageCount(promoCode.id);
            if (usageCount >= condition.value) {
              return {
                isValid: false,
                message: 'This promo code has reached its usage limit'
              };
            }
            break;
            
          case 'dateRange':
            const now = new Date();
            const startDate = condition.value.startDate instanceof Timestamp 
              ? condition.value.startDate.toDate() 
              : new Date(condition.value.startDate);
            const endDate = condition.value.endDate instanceof Timestamp 
              ? condition.value.endDate.toDate() 
              : new Date(condition.value.endDate);
              
            if (now < startDate || now > endDate) {
              return {
                isValid: false,
                message: 'This promo code is not valid at this time'
              };
            }
            break;
            
          case 'userType':
            if (condition.value === 'new' && user.createdAt && 
                (new Date().getTime() - user.createdAt.getTime()) > 7 * 24 * 60 * 60 * 1000) {
              return {
                isValid: false,
                message: 'This promo code is only valid for new users'
              };
            }
            
            if (condition.value === 'inactive' && user.lastActiveAt && 
                (new Date().getTime() - user.lastActiveAt.getTime()) < 30 * 24 * 60 * 60 * 1000) {
              return {
                isValid: false,
                message: 'This promo code is only valid for inactive users'
              };
            }
            
            if (condition.value === 'beta' && !user.tags?.includes('beta')) {
              return {
                isValid: false,
                message: 'This promo code is only valid for beta users'
              };
            }
            break;
            
          case 'userTag':
            if (!user.tags?.includes(condition.value)) {
              return {
                isValid: false,
                message: `This promo code requires the ${condition.value} tag`
              };
            }
            break;
            
          case 'userAction':
            if (!user.actions?.includes(condition.value)) {
              return {
                isValid: false,
                message: `This promo code is only valid after ${condition.value}`
              };
            }
            break;
        }
      }
      
      // Check if user has already used this promo code
      const hasUsed = await this.hasUserUsedPromoCode(userId, promoCode.id);
      if (hasUsed) {
        return {
          isValid: false,
          message: 'You have already used this promo code'
        };
      }
      
      // All checks passed
      return {
        isValid: true,
        message: `${promoCode.discount} applied successfully!`,
        discount: promoCode.discountValue,
        discountDuration: promoCode.duration,
        promoDetails: promoCode
      };
    } catch (error) {
      console.error('Error validating promo code:', error);
      return {
        isValid: false,
        message: 'An error occurred while validating the promo code'
      };
    }
  }

  // Record promo code usage
  async recordPromoCodeUsage(
    promoCodeId: string, 
    userId: string, 
    subscriptionId: string
  ): Promise<boolean> {
    try {
      // Add usage record
      await addDoc(this.promoCodeUsagesCollection, {
        promoCodeId,
        userId,
        subscriptionId,
        usedAt: serverTimestamp(),
        isActive: true
      });
      
      // Increment usage count
      const promoCodeRef = doc(this.promoCodesCollection, promoCodeId);
      await updateDoc(promoCodeRef, {
        usageCount: increment(1),
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error recording promo code usage:', error);
      return false;
    }
  }

  // Cancel promo code usage (if payment fails)
  async cancelPromoCodeUsage(
    promoCodeId: string, 
    userId: string
  ): Promise<boolean> {
    try {
      // Find usage record
      const q = query(
        this.promoCodeUsagesCollection, 
        where('promoCodeId', '==', promoCodeId),
        where('userId', '==', userId),
        where('isActive', '==', true)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return false;
      }
      
      // Update usage record
      const usageDoc = snapshot.docs[0];
      await updateDoc(doc(this.promoCodeUsagesCollection, usageDoc.id), {
        isActive: false,
        cancelledAt: serverTimestamp()
      });
      
      // Decrement usage count
      const promoCodeRef = doc(this.promoCodesCollection, promoCodeId);
      await updateDoc(promoCodeRef, {
        usageCount: increment(-1),
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error cancelling promo code usage:', error);
      return false;
    }
  }

  // Check if user has used promo code
  async hasUserUsedPromoCode(userId: string, promoCodeId: string): Promise<boolean> {
    try {
      const q = query(
        this.promoCodeUsagesCollection, 
        where('userId', '==', userId),
        where('promoCodeId', '==', promoCodeId),
        where('isActive', '==', true)
      );
      
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking if user has used promo code:', error);
      return false;
    }
  }

  // Get promo code usage count
  async getPromoCodeUsageCount(promoCodeId: string): Promise<number> {
    try {
      const promoCodeRef = doc(this.promoCodesCollection, promoCodeId);
      const promoCodeDoc = await getDoc(promoCodeRef);
      
      if (!promoCodeDoc.exists()) {
        return 0;
      }
      
      return promoCodeDoc.data().usageCount || 0;
    } catch (error) {
      console.error('Error getting promo code usage count:', error);
      return 0;
    }
  }

  // Get user by ID
  private async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(this.usersCollection, userId));
      
      if (!userDoc.exists()) {
        return null;
      }
      
      return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // For development/testing: Get all promo codes
  async getAllPromoCodes(): Promise<PromoCode[]> {
    try {
      const snapshot = await getDocs(this.promoCodesCollection);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PromoCode));
    } catch (error) {
      console.error('Error getting all promo codes:', error);
      return [];
    }
  }

  // For development/testing: Get promo code usage history
  async getPromoCodeUsageHistory(promoCodeId: string): Promise<PromoCodeUsage[]> {
    try {
      const q = query(this.promoCodeUsagesCollection, where('promoCodeId', '==', promoCodeId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PromoCodeUsage));
    } catch (error) {
      console.error('Error getting promo code usage history:', error);
      return [];
    }
  }

  // For development/testing: Get user's promo code usage history
  async getUserPromoCodeUsageHistory(userId: string): Promise<PromoCodeUsage[]> {
    try {
      const q = query(this.promoCodeUsagesCollection, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PromoCodeUsage));
    } catch (error) {
      console.error('Error getting user promo code usage history:', error);
      return [];
    }
  }
}

export const promoCodeService = new PromoCodeService();
