import { biometricService } from './biometricService';
import { balanceService } from './balanceService';
import { isAndroid } from '@/utils/deviceUtils';

export interface GooglePlayPaymentDetails {
  amount: number;
  currency: string;
  description: string;
  userId: string;
  country?: string;
}

export interface GooglePlayResult {
  success: boolean;
  error?: string;
  transactionId?: string;
  authenticationDetails?: {
    fingerprintUsed: boolean;
    fingerprintConfidence?: number;
    timestamp: number;
    country?: string;
  };
}

class GooglePlayService {
  // Check if Google Play is available on the device
  async isAvailable(): Promise<boolean> {
    try {
      // In a real implementation, this would check:
      // 1. If the device is Android
      // 2. If the device supports Google Play (via Google Play Services)
      // 3. If the merchant is configured to accept Google Play payments

      // For this implementation, we'll just check if the device is Android
      return isAndroid();
    } catch (error) {
      console.error('Error checking Google Play availability:', error);
      return false;
    }
  }

  // Process payment using Google Play
  async processPayment(paymentDetails: GooglePlayPaymentDetails): Promise<GooglePlayResult> {
    try {
      // Check if Google Play is available
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error: 'Google Play is not available on this device'
        };
      }

      // Show Google Play payment sheet
      await this.showGooglePlaySheet(paymentDetails);

      // Step 1: Authenticate with Fingerprint
      const fingerprintResult = await biometricService.authenticate(
        'Verify your identity to complete this payment'
      );

      if (!fingerprintResult.success) {
        return {
          success: false,
          error: fingerprintResult.error || 'Fingerprint authentication failed'
        };
      }

      // Step 2: Process the payment
      // In a real implementation, this would send the payment token to the payment processor

      // Add a delay to simulate real payment processing
      await new Promise(resolve => setTimeout(resolve, 2500 + Math.random() * 1500));

      // Simulate occasional payment failures (10% chance)
      if (Math.random() < 0.1) {
        return {
          success: false,
          error: 'Payment declined. Please check your Google Play account settings or try a different payment method.'
        };
      }

      // For this implementation, we'll use our balance service to deduct the balance
      const deductResult = await balanceService.deductBalance(
        paymentDetails.userId,
        paymentDetails.amount,
        paymentDetails.description,
        'google_play'
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
        transactionId: deductResult.transaction?.id || `gp_${Date.now()}${Math.floor(Math.random() * 1000)}`,
        authenticationDetails: {
          fingerprintUsed: true,
          fingerprintConfidence: fingerprintResult.confidence,
          timestamp: Date.now(),
          country: paymentDetails.country
        }
      };
    } catch (error) {
      console.error('Google Play processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Google Play payment failed'
      };
    }
  }

  // Show Google Play payment sheet
  private async showGooglePlaySheet(paymentDetails: GooglePlayPaymentDetails): Promise<void> {
    return new Promise((resolve) => {
      // Create Google Play modal
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

      // Create Google Play sheet
      const sheet = document.createElement('div');
      sheet.style.width = '90%';
      sheet.style.maxWidth = '400px';
      sheet.style.backgroundColor = '#fff';
      sheet.style.borderRadius = '12px';
      sheet.style.padding = '20px';
      sheet.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
      sheet.style.color = '#333';
      sheet.style.fontFamily = 'Roboto, sans-serif';

      // Create Google Play header
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.justifyContent = 'center';
      header.style.marginBottom = '20px';

      // Google Play logo
      const logo = document.createElement('div');
      logo.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#5F6368">
        <path d="M3.609 1.814L13.792 12 3.609 22.186c-.181.181-.29.435-.29.704 0 .269.109.523.29.704.181.181.435.29.704.29.269 0 .523-.109.704-.29L15.21 13.41c.181-.181.29-.435.29-.704 0-.269-.109-.523-.29-.704L5.027 1.814c-.181-.181-.435-.29-.704-.29-.269 0-.523.109-.704.29-.181.181-.29.435-.29.704 0 .269.109.523.29.704z"/>
        <path d="M10.609 1.814L20.792 12 10.609 22.186c-.181.181-.29.435-.29.704 0 .269.109.523.29.704.181.181.435.29.704.29.269 0 .523-.109.704-.29L22.21 13.41c.181-.181.29-.435.29-.704 0-.269-.109-.523-.29-.704L12.027 1.814c-.181-.181-.435-.29-.704-.29-.269 0-.523.109-.704.29-.181.181-.29.435-.29.704 0 .269.109.523.29.704z"/>
      </svg>`;

      // Google Play text
      const text = document.createElement('div');
      text.textContent = 'Google Play';
      text.style.marginLeft = '8px';
      text.style.fontSize = '18px';
      text.style.fontWeight = 'bold';
      text.style.color = '#5F6368';

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
      merchantLabel.style.color = '#5F6368';

      const merchantValue = document.createElement('div');
      merchantValue.textContent = paymentDetails.description;
      merchantValue.style.color = '#202124';

      merchant.appendChild(merchantLabel);
      merchant.appendChild(merchantValue);

      // Amount
      const amount = document.createElement('div');
      amount.style.display = 'flex';
      amount.style.justifyContent = 'space-between';
      amount.style.marginBottom = '10px';

      const amountLabel = document.createElement('div');
      amountLabel.textContent = 'Amount';
      amountLabel.style.color = '#5F6368';

      const amountValue = document.createElement('div');
      amountValue.textContent = `$${paymentDetails.amount.toFixed(2)}`;
      amountValue.style.fontWeight = 'bold';
      amountValue.style.color = '#202124';

      amount.appendChild(amountLabel);
      amount.appendChild(amountValue);

      // Country
      if (paymentDetails.country) {
        const country = document.createElement('div');
        country.style.display = 'flex';
        country.style.justifyContent = 'space-between';
        country.style.marginBottom = '10px';

        const countryLabel = document.createElement('div');
        countryLabel.textContent = 'Country';
        countryLabel.style.color = '#5F6368';

        const countryValue = document.createElement('div');
        countryValue.textContent = paymentDetails.country;
        countryValue.style.color = '#202124';

        country.appendChild(countryLabel);
        country.appendChild(countryValue);

        details.appendChild(country);
      }

      details.appendChild(merchant);
      details.appendChild(amount);

      // Pay button
      const button = document.createElement('button');
      button.textContent = 'Pay with Fingerprint';
      button.style.width = '100%';
      button.style.backgroundColor = '#1a73e8';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '4px';
      button.style.padding = '12px';
      button.style.fontSize = '16px';
      button.style.fontWeight = 'bold';
      button.style.cursor = 'pointer';
      button.style.marginTop = '10px';

      // Add Fingerprint icon
      const fingerprintIcon = document.createElement('span');
      fingerprintIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="white" style="margin-right: 8px; vertical-align: middle;">
        <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12zM14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z"/>
      </svg>`;
      button.prepend(fingerprintIcon);

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
      cancelButton.style.color = '#1a73e8';
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

      // Auto-close after 3-5 seconds to simulate a more realistic Google Pay flow
      setTimeout(() => {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
          resolve();
        }
      }, 3000 + Math.random() * 2000);
    });
  }
}

// Export singleton instance
export const googlePlayService = new GooglePlayService();
