import { isAndroid, isIOS } from '@/utils/deviceUtils';

interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

class BiometricService {
  // Store the last successful authentication time to avoid too frequent prompts
  private lastSuccessfulAuth: number = 0;
  // Authentication is valid for 5 minutes (like Gojek)
  private readonly AUTH_VALID_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  /**
   * Check if biometric authentication is available on the device
   */
  async isAvailable(): Promise<boolean> {
    try {
      // In a real implementation, this would use platform-specific APIs
      // For Android: BiometricManager.canAuthenticate()
      // For iOS: LAContext.canEvaluatePolicy()

      // Check if we have a stored preference for biometric availability
      const hasBiometric = localStorage.getItem('hasBiometric');

      if (hasBiometric === 'true') return true;
      if (hasBiometric === 'false') return false;

      // For this demo, we'll simulate that 70% of devices have biometrics
      // This allows us to test both flows
      const isAvailable = Math.random() < 0.7 && (isAndroid() || isIOS());

      // Store the result so it's consistent for this user session
      localStorage.setItem('hasBiometric', isAvailable.toString());

      return isAvailable;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  /**
   * Get the type of biometric authentication available
   */
  async getBiometricType(): Promise<'fingerprint' | 'face' | 'none'> {
    try {
      // In a real implementation, this would detect the specific type
      // For Android: BiometricManager.canAuthenticate(BIOMETRIC_STRONG)
      // For iOS: LAContext.biometryType

      if (isAndroid()) {
        return 'fingerprint'; // Most Android devices use fingerprint
      } else if (isIOS()) {
        // Newer iOS devices use Face ID, but we'll need a more sophisticated
        // detection in a real app (based on device model)
        return 'face';
      }

      return 'none';
    } catch (error) {
      console.error('Error getting biometric type:', error);
      return 'none';
    }
  }

  /**
   * Check if we need to authenticate again or if a recent authentication is still valid
   */
  isRecentlyAuthenticated(): boolean {
    const now = Date.now();
    return (now - this.lastSuccessfulAuth) < this.AUTH_VALID_DURATION;
  }

  /**
   * Authenticate using biometrics
   * Similar to how Gojek handles biometric authentication for payments
   */
  async authenticate(reason: string = 'Please authenticate to complete your payment'): Promise<BiometricAuthResult> {
    try {
      // If recently authenticated, don't prompt again (like Gojek)
      if (this.isRecentlyAuthenticated()) {
        console.log('Using recent authentication');
        return { success: true };
      }

      // Check if biometrics are available
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error: 'Biometric authentication is not available on this device'
        };
      }

      // Get the biometric type
      const biometricType = await this.getBiometricType();

      // In a real implementation, this would use the native biometric APIs
      // For Android: BiometricPrompt with BIOMETRIC_STRONG
      // For iOS: LAContext.evaluatePolicy with .deviceOwnerAuthenticationWithBiometrics

      let result: BiometricAuthResult;

      if (isAndroid()) {
        // Simulate Android fingerprint authentication (like Gojek)
        console.log('Simulating Android fingerprint authentication');
        result = await this.simulateAndroidFingerprint(reason);
      } else if (isIOS()) {
        // Simulate iOS Face ID authentication (like Gojek)
        console.log('Simulating iOS Face ID authentication');
        result = await this.simulateIOSBiometric(biometricType, reason);
      } else {
        return {
          success: false,
          error: 'Biometric authentication is not supported on this platform'
        };
      }

      // If authentication was successful, update the last successful auth time
      if (result.success) {
        this.lastSuccessfulAuth = Date.now();
      }

      return result;
    } catch (error) {
      console.error('Error during biometric authentication:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during authentication'
      };
    }
  }

  /**
   * Simulate Android fingerprint authentication (similar to Gojek)
   * In a real app, this would use the BiometricPrompt API
   */
  private async simulateAndroidFingerprint(reason: string): Promise<BiometricAuthResult> {
    return new Promise((resolve) => {
      // Simulate a delay for the fingerprint scan
      setTimeout(() => {
        // Simulate a 95% success rate (Gojek-like experience)
        const isSuccessful = Math.random() < 0.95;

        if (isSuccessful) {
          resolve({
            success: true
          });
        } else {
          resolve({
            success: false,
            error: 'Fingerprint not recognized. Please try again.'
          });
        }
      }, 6000); // Durasi yang lebih lama untuk pengalaman yang lebih realistis (6 detik)
    });
  }

  /**
   * Simulate iOS biometric authentication (similar to Gojek)
   * In a real app, this would use the LocalAuthentication framework
   */
  private async simulateIOSBiometric(
    type: 'fingerprint' | 'face' | 'none',
    reason: string
  ): Promise<BiometricAuthResult> {
    return new Promise((resolve) => {
      // Simulate a delay for the biometric scan
      setTimeout(() => {
        // Simulate a 95% success rate (Gojek-like experience)
        const isSuccessful = Math.random() < 0.95;

        if (isSuccessful) {
          resolve({
            success: true
          });
        } else {
          const errorMessage = type === 'face'
            ? 'Face not recognized. Please try again.'
            : 'Fingerprint not recognized. Please try again.';

          resolve({
            success: false,
            error: errorMessage
          });
        }
      }, 7000); // Durasi yang lebih lama untuk Face ID (7 detik)
    });
  }

  /**
   * Authenticate using screen lock (PIN, pattern, or password)
   * This is used as a fallback when biometric authentication is not available
   */
  async authenticateWithScreenLock(reason: string = 'Please authenticate to complete your payment'): Promise<BiometricAuthResult> {
    try {
      // If recently authenticated, don't prompt again
      if (this.isRecentlyAuthenticated()) {
        console.log('Using recent authentication');
        return { success: true };
      }

      // In a real implementation, this would use the device's screen lock
      // For Android: KeyguardManager.createConfirmDeviceCredentialIntent()
      // For iOS: LAContext.evaluatePolicy with .deviceOwnerAuthentication

      return new Promise((resolve) => {
        // Simulate a delay for the screen lock authentication
        setTimeout(() => {
          // Simulate a 98% success rate
          const isSuccessful = Math.random() < 0.98;

          if (isSuccessful) {
            // Update the last successful auth time
            this.lastSuccessfulAuth = Date.now();

            resolve({
              success: true
            });
          } else {
            resolve({
              success: false,
              error: 'Screen lock authentication failed. Please try again.'
            });
          }
        }, 5000); // 5 seconds for screen lock authentication
      });
    } catch (error) {
      console.error('Error during screen lock authentication:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during authentication'
      };
    }
  }
}

// Export singleton instance
export const biometricService = new BiometricService();
