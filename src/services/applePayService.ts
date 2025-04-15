import { faceIdService } from './faceIdService';
import { balanceService } from './balanceService';
import { isIOS } from '@/utils/deviceUtils';

export interface ApplePaymentDetails {
  amount: number;
  currency: string;
  description: string;
  userId: string;
}

export interface ApplePayResult {
  success: boolean;
  error?: string;
  transactionId?: string;
  authenticationDetails?: {
    faceIdUsed: boolean;
    faceIdConfidence?: number;
    timestamp: number;
  };
}

class ApplePayService {
  // Check if Apple Pay is available on the device
  async isAvailable(): Promise<boolean> {
    try {
      // In a real implementation, this would check:
      // 1. If the device is iOS
      // 2. If the device supports Apple Pay (ApplePaySession.canMakePayments())
      // 3. If the merchant is configured to accept Apple Pay

      // For this implementation, we'll just check if the device is iOS
      return isIOS();
    } catch (error) {
      console.error('Error checking Apple Pay availability:', error);
      return false;
    }
  }

  // Process payment using Apple Pay
  async processPayment(paymentDetails: ApplePaymentDetails): Promise<ApplePayResult> {
    try {
      // Check if Apple Pay is available
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error: 'Apple Pay is not available on this device'
        };
      }

      // Show Apple Pay payment sheet
      await this.showApplePaySheet(paymentDetails);

      // Step 1: Authenticate with Face ID
      const faceIdResult = await faceIdService.authenticate(
        'Verify your identity to complete this payment'
      );

      if (!faceIdResult.success) {
        return {
          success: false,
          error: faceIdResult.error || 'Face ID authentication failed'
        };
      }

      // Step 2: Process the payment
      // In a real implementation, this would send the payment token to the payment processor

      // For this implementation, we'll use our balance service to deduct the balance
      const deductResult = await balanceService.deductBalance(
        paymentDetails.userId,
        paymentDetails.amount,
        paymentDetails.description,
        'apple_pay'
      );

      if (!deductResult.success) {
        return {
          success: false,
          error: deductResult.error || 'Payment processing failed'
        };
      }

      // Step 3: Return the result
      return {
        success: true,
        transactionId: deductResult.transaction?.id || `ap_${Date.now()}${Math.floor(Math.random() * 1000)}`,
        authenticationDetails: {
          faceIdUsed: true,
          faceIdConfidence: faceIdResult.confidence,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      console.error('Apple Pay processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Apple Pay payment failed'
      };
    }
  }

  // Show Apple Pay payment sheet
  private async showApplePaySheet(paymentDetails: ApplePaymentDetails): Promise<void> {
    return new Promise((resolve) => {
      // Create Apple Pay modal
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
      modal.style.zIndex = '9999';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';

      // Create Apple Pay sheet
      const sheet = document.createElement('div');
      sheet.style.width = '90%';
      sheet.style.maxWidth = '400px';
      sheet.style.backgroundColor = '#000';
      sheet.style.borderRadius = '12px';
      sheet.style.padding = '20px';
      sheet.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
      sheet.style.color = '#fff';
      sheet.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

      // Create Apple Pay header
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.justifyContent = 'center';
      header.style.marginBottom = '20px';

      // Apple logo
      const logo = document.createElement('div');
      logo.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>`;

      // Apple Pay text
      const text = document.createElement('div');
      text.textContent = 'Apple Pay';
      text.style.marginLeft = '8px';
      text.style.fontSize = '18px';
      text.style.fontWeight = 'bold';

      header.appendChild(logo);
      header.appendChild(text);

      // Payment details
      const details = document.createElement('div');
      details.style.marginBottom = '20px';

      // Merchant
      const merchant = document.createElement('div');
      merchant.style.display = 'flex';
      merchant.style.justifyContent = 'space-between';
      merchant.style.marginBottom = '10px';

      const merchantLabel = document.createElement('div');
      merchantLabel.textContent = 'Hushhly';
      merchantLabel.style.color = '#aaa';

      const merchantValue = document.createElement('div');
      merchantValue.textContent = paymentDetails.description;

      merchant.appendChild(merchantLabel);
      merchant.appendChild(merchantValue);

      // Amount
      const amount = document.createElement('div');
      amount.style.display = 'flex';
      amount.style.justifyContent = 'space-between';
      amount.style.marginBottom = '10px';

      const amountLabel = document.createElement('div');
      amountLabel.textContent = 'Amount';
      amountLabel.style.color = '#aaa';

      const amountValue = document.createElement('div');
      amountValue.textContent = `$${paymentDetails.amount.toFixed(2)}`;
      amountValue.style.fontWeight = 'bold';

      amount.appendChild(amountLabel);
      amount.appendChild(amountValue);

      details.appendChild(merchant);
      details.appendChild(amount);

      // Pay button
      const button = document.createElement('button');
      button.textContent = 'Pay with Face ID';
      button.style.width = '100%';
      button.style.backgroundColor = '#007AFF';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '8px';
      button.style.padding = '12px';
      button.style.fontSize = '16px';
      button.style.fontWeight = 'bold';
      button.style.cursor = 'pointer';
      button.style.marginTop = '10px';

      // Add Face ID icon
      const faceIdIcon = document.createElement('span');
      faceIdIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="white" style="margin-right: 8px; vertical-align: middle;">
        <path d="M9 9h.01M15 9h.01M8 13a4 4 0 008 0" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <rect width="20" height="20" x="2" y="2" rx="5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
      button.prepend(faceIdIcon);

      // Add click event
      button.onclick = () => {
        document.body.removeChild(modal);
        resolve();
      };

      // Cancel button
      const cancelButton = document.createElement('button');
      cancelButton.textContent = 'Cancel';
      cancelButton.style.width = '100%';
      cancelButton.style.backgroundColor = 'transparent';
      cancelButton.style.color = '#007AFF';
      cancelButton.style.border = 'none';
      cancelButton.style.padding = '12px';
      cancelButton.style.fontSize = '16px';
      cancelButton.style.cursor = 'pointer';
      cancelButton.style.marginTop = '10px';

      // Add click event
      cancelButton.onclick = () => {
        document.body.removeChild(modal);
        resolve();
      };

      // Assemble the sheet
      sheet.appendChild(header);
      sheet.appendChild(details);
      sheet.appendChild(button);
      sheet.appendChild(cancelButton);

      modal.appendChild(sheet);
      document.body.appendChild(modal);

      // Auto-close after 3 seconds to simulate automatic Face ID detection
      setTimeout(() => {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
          resolve();
        }
      }, 3000);
    });
  }
}

// Export singleton instance
export const applePayService = new ApplePayService();
