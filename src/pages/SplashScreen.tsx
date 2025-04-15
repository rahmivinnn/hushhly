import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { usePromoCodeEnhanced } from '@/hooks/usePromoCodeEnhanced';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { paymentService } from '@/services/paymentService';
import { useAuthSimple } from '@/hooks/useAuthSimple';
import { biometricService } from '@/services/biometricService';
import { FingerprintDialog } from '@/components/ui/fingerprint-dialog';
import { isAndroid, isIOS } from '@/utils/deviceUtils';
import { BalanceDisplay } from '@/components/ui/balance-display';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);
  const totalScreens = 9; // Updated to include subscription screen
  const [animating, setAnimating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'verifying' | 'success'>('select');
  const [showBiometricDialog, setShowBiometricDialog] = useState(false);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'fingerprint' | 'screenlock'>(
    (localStorage.getItem('verificationMethod') as 'fingerprint' | 'screenlock') || 'fingerprint'
  );
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const { user } = useAuthSimple();
  const {
    applyPromoCode,
    removePromoCode,
    activePromo,
    isValidating,
    calculateDiscountedPrice,
    getFormattedDiscountText
  } = usePromoCodeEnhanced();

  const prices = {
    annual: 59.99,
    monthly: 5.99
  };

  const handleSubscriptionSelect = (plan: 'annual' | 'monthly') => {
    setSelectedPlan(plan);
  };

  // Auto advance from first screen (blue gradient with hushhly blue logo) to second screen (white background)
  // and then from second screen to third screen (bear image)
  useEffect(() => {
    if (currentScreen < 2) { // Auto-advance for first and second screens
      const timer = setTimeout(() => {
        setAnimating(true);
        setTimeout(() => {
          setCurrentScreen(currentScreen + 1);
          setAnimating(false);
        }, 600); // Increase fade-out animation for more visible effect
      }, currentScreen === 0 ? 1800 : 1200); // Longer delays for better visibility
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleNext = () => {
    if (currentScreen < totalScreens - 1) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentScreen(currentScreen + 1);
        setAnimating(false);
      }, 500);
    } else {
      setAnimating(true);
      setTimeout(() => {
        navigate('/sign-up');
      }, 500);
    }
  };

  const handleBack = () => {
    if (currentScreen > 1) { // Only allow going back after the intro screen
      setAnimating(true);
      setTimeout(() => {
        setCurrentScreen(currentScreen - 1);
        setAnimating(false);
      }, 500);
    }
  };

  const handleSkip = () => {
    setAnimating(true);
    setTimeout(() => {
      navigate('/sign-up');
    }, 300);
  };

  const handleLogin = () => {
    setAnimating(true);
    setTimeout(() => {
      navigate('/sign-in');
    }, 300);
  };

  const handleSignUp = () => {
    setAnimating(true);
    setTimeout(() => {
      navigate('/sign-up');
    }, 300);
  };

  const handleContinue = () => {
    setShowPaymentModal(true);
  };

  // Get consistent temporary user ID
  const getTempUserId = () => {
    // Check if we already have a temporary ID in localStorage
    let tempId = localStorage.getItem('temp_user_id');

    // If not, create a new one and store it
    if (!tempId) {
      tempId = `temp_user_${Date.now()}`;
      localStorage.setItem('temp_user_id', tempId);
    }

    return tempId;
  };

  // Get current user ID (real or temporary)
  const getCurrentUserId = () => {
    return user?.id || getTempUserId();
  };

  const handlePayment = async (method: 'apple' | 'google') => {
    // No need to check for user login here - we assume they're already logged in
    // Just proceed directly to payment processing

    // Show the payment sheet with the appropriate branding
    setShowPaymentSheet(true);
    setPaymentStep('processing');
    setProcessingPayment(true);

    try {
      // Process payment using the payment service with consistent user ID
      const userId = getCurrentUserId();

      const paymentResult = await paymentService.processPayment(
        selectedPlan,
        { method: method === 'apple' ? 'apple_pay' : 'google_pay' },
        activePromo?.code,
        userId
      );

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      // Store payment info in localStorage for the biometric flow
      localStorage.setItem('pendingPaymentId', paymentResult.paymentId || '');
      localStorage.setItem('pendingPaymentResult', JSON.stringify(paymentResult));

      // Second step: Verify with biometrics
      setPaymentStep('verifying');

      // Simulate payment processing delay
      toast.info('Initializing payment...');
      await new Promise(resolve => setTimeout(resolve, 3500));

      // Check if we should use biometric authentication
      const isBiometricAvailable = await biometricService.isAvailable();

      // If user selected fingerprint but it's not available, show a message
      if (verificationMethod === 'fingerprint' && !isBiometricAvailable) {
        toast.error('Fingerprint authentication is not available on this device');
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.info('Switching to screen lock verification...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        localStorage.setItem('verificationMethod', 'screenlock');
        setVerificationMethod('screenlock');
      }

      if (verificationMethod === 'fingerprint' && isBiometricAvailable) {
        // For Android, show fingerprint dialog
        if (isAndroid()) {
          // Show a toast to instruct the user
          toast.info('Please verify with your fingerprint to complete payment');

          // Add a small delay before showing the dialog
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Show the fingerprint dialog
          setShowBiometricDialog(true);

          // The verification will continue in the onBiometricSuccess handler
          return;
        } else {
          // For iOS, use Face ID (handled in the UI animation)
          toast.info('Please verify with Face ID to complete payment');

          // Longer delay for Face ID animation
          await new Promise(resolve => setTimeout(resolve, 4000));

          // Verify with biometric service
          const biometricResult = await biometricService.authenticate(
            'Please authenticate to complete your purchase'
          );

          if (!biometricResult.success) {
            throw new Error(biometricResult.error || 'Face ID verification failed');
          }

          // Show success message
          toast.success('Face ID verified');

          // Additional delay after successful verification
          await new Promise(resolve => setTimeout(resolve, 3000));

          // Show processing message
          toast.info('Processing payment...');

          // Add another delay
          await new Promise(resolve => setTimeout(resolve, 4000));
        }
      } else {
        // Use screen lock verification (either by choice or as fallback)
        toast.info('Verifying with screen lock...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Use the screen lock authentication method
        const screenLockResult = await biometricService.authenticateWithScreenLock(
          'Please authenticate to complete your purchase'
        );

        if (!screenLockResult.success) {
          throw new Error(screenLockResult.error || 'Screen lock verification failed');
        }

        // Show success message
        toast.success('Screen lock verified');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show processing message
        toast.info('Processing payment...');
        await new Promise(resolve => setTimeout(resolve, 4000));
      }

      // Verify the payment with backend
      const isVerified = await paymentService.verifyPayment(paymentResult.paymentId || '');

      if (!isVerified) {
        throw new Error('Payment verification failed');
      }

      // Complete the payment process
      completePaymentProcess(paymentResult);

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred during payment');

      // Reset payment UI
      setShowBiometricDialog(false);
      setShowPaymentSheet(false);
      setPaymentStep('select');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Handle successful biometric authentication
  const handleBiometricSuccess = async () => {
    // Trigger balance update
    window.dispatchEvent(new Event('balance-updated'));
    try {
      // Show success message
      toast.success('Fingerprint verified');

      // Keep dialog visible longer to show success state
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Close the dialog
      setShowBiometricDialog(false);

      // Show processing message
      toast.info('Processing payment...');

      // Add a longer delay to simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Show verifying message
      toast.info('Verifying payment...');

      // Add another delay to simulate backend verification
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Verify the payment with backend
      const paymentId = localStorage.getItem('pendingPaymentId');
      if (!paymentId) {
        throw new Error('Payment ID not found');
      }

      const isVerified = await paymentService.verifyPayment(paymentId);

      if (!isVerified) {
        throw new Error('Payment verification failed');
      }

      // Show verification success message
      toast.success('Payment verification successful');

      // Add a delay after verification
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get payment result from local storage
      const paymentResultJson = localStorage.getItem('pendingPaymentResult');
      if (!paymentResultJson) {
        throw new Error('Payment result not found');
      }

      const paymentResult = JSON.parse(paymentResultJson);

      // Complete the payment process
      completePaymentProcess(paymentResult);

    } catch (error) {
      console.error('Biometric verification error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred during verification');

      // Reset payment UI
      setShowPaymentSheet(false);
      setPaymentStep('select');
    }
  };

  // Handle biometric authentication error
  const handleBiometricError = async (error: string) => {
    // Trigger balance update
    window.dispatchEvent(new Event('balance-updated'));
    // Show error message
    toast.error(error || 'Fingerprint verification failed');

    // Close the biometric dialog
    setShowBiometricDialog(false);

    // Wait a moment before showing the screen lock option
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Ask if user wants to try screen lock instead
    const useScreenLock = window.confirm('Would you like to try using screen lock instead?');

    if (useScreenLock) {
      try {
        // Show screen lock verification message
        toast.info('Verifying with screen lock...');

        // Use the screen lock authentication method
        const screenLockResult = await biometricService.authenticateWithScreenLock(
          'Please authenticate to complete your purchase'
        );

        if (screenLockResult.success) {
          // Show success message
          toast.success('Screen lock verified');

          // Wait a moment before proceeding
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Show processing message
          toast.info('Processing payment...');

          // Wait a moment before proceeding
          await new Promise(resolve => setTimeout(resolve, 3000));

          // Get payment result from local storage
          const paymentId = localStorage.getItem('pendingPaymentId');
          const paymentResultJson = localStorage.getItem('pendingPaymentResult');

          if (paymentId && paymentResultJson) {
            // Verify the payment
            const isVerified = await paymentService.verifyPayment(paymentId);

            if (isVerified) {
              // Parse the payment result
              const paymentResult = JSON.parse(paymentResultJson);

              // Complete the payment process
              completePaymentProcess(paymentResult);
              return;
            }
          }

          throw new Error('Payment verification failed');
        } else {
          throw new Error(screenLockResult.error || 'Screen lock verification failed');
        }
      } catch (error) {
        console.error('Screen lock verification error:', error);
        toast.error(error instanceof Error ? error.message : 'An error occurred during verification');
      }
    }

    // Reset payment UI if screen lock failed or was declined
    setShowPaymentSheet(false);
    setPaymentStep('select');
  };

  // Complete the payment process after successful verification
  const completePaymentProcess = async (paymentResult: any) => {
    // Trigger balance update
    window.dispatchEvent(new Event('balance-updated'));
    try {
      // Third step: Payment successful
      setPaymentStep('success');

      // Save subscription details
      if (paymentResult.subscriptionDetails) {
        // Use consistent user ID
        const userId = getCurrentUserId();
        await paymentService.saveSubscription(userId, paymentResult.subscriptionDetails);
      }

      // After successful payment, show success message first
      toast.success(`Payment verified successfully!`);

      // Add a longer delay before completing the process
      setTimeout(() => {
        // Show processing message
        toast.info(`Finalizing your subscription...`);

        // Add another delay to simulate backend processing
        setTimeout(() => {
          // Close payment UI and proceed
          setShowBiometricDialog(false);
          setShowPaymentSheet(false);
          setShowPaymentModal(false);

          // Show success toast
          toast.success(`Successfully subscribed to ${selectedPlan === 'annual' ? 'annual' : 'monthly'} plan!`);

          // Continue to next screen
          handleNext();

          // Clean up local storage
          localStorage.removeItem('pendingPaymentId');
          localStorage.removeItem('pendingPaymentResult');
        }, 4000); // 4 seconds for backend processing
      }, 3000); // 3 seconds after verification
    } catch (error) {
      console.error('Error completing payment:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred while completing payment');
    }
  };

  const handlePromoCodeSubmit = async () => {
    if (!promoCode) {
      // Don't show error, just return silently
      return;
    }

    // No need to check for user login - we'll handle anonymous users

    setIsApplyingPromo(true);
    try {
      const result = await applyPromoCode(promoCode, selectedPlan === 'annual' ? 'Annual' : 'Monthly');

      if (result.isValid) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      toast.error('An error occurred while applying the promo code');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const getDiscountedPrice = (originalPrice: number) => {
    return calculateDiscountedPrice(originalPrice);
  };

  // Define the content for each screen
  const screens = [
    // Screen 0: Clean blue gradient background with Hushhly logo in center
    <div
      key="screen-0"
      className={`flex flex-col h-full ${
        animating
          ? 'opacity-0 scale-90 rotate-3'
          : 'opacity-100 scale-100 rotate-0'
      } transition-all duration-700 ease-in-out`}
      style={{
        background: 'linear-gradient(180deg, #00a0d2 0%, #0076b5 50%, #3a5bb8 100%)'
      }}
    >
      <div className="flex-grow flex flex-col items-center justify-center">
        <img
          src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png"
          alt="Hushhly Logo"
          className="w-64 h-auto brightness-0 invert"
        />
      </div>
    </div>,

    // Screen 1: White background with Hushhly logo (second screen)
    <div
      key="screen-1"
      className={`flex flex-col h-full ${
        animating
          ? 'opacity-0 scale-90 -rotate-3'
          : 'opacity-100 scale-100 rotate-0'
      } transition-all duration-700 ease-in-out bg-white`}
    >
      <div className="flex-grow flex flex-col items-center justify-center">
        <img
          src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png"
          alt="Hushhly Logo"
          className="w-64 h-auto"
        />
      </div>
    </div>,

    // Screen 2: Subscription Screen
    <div
      key="screen-2"
      className={`min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-4 flex flex-col relative overflow-auto ${
        animating
          ? 'opacity-0 translate-x-20 scale-95'
          : 'opacity-100 translate-x-0 scale-100'
      } transition-all duration-500 ease-out`}
      style={{ maxHeight: '100vh' }}
    >
      {/* Header with Logo and Exit button - Ultra compact */}
      <div className="flex items-center mb-2 sticky top-0 z-10 bg-gradient-to-b from-blue-400 to-transparent pt-1">
        <div className="flex-1"></div>
        <div className="flex-grow flex justify-center">
          <img
            src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png"
            alt="Hushhly Logo"
            className="w-20 h-auto brightness-0 invert"
          />
        </div>
        <div className="flex-1 flex justify-end">
          <button
            onClick={handleNext}
            className="p-1 text-white hover:bg-white/20 rounded-full transition-colors"
            aria-label="Exit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content - Ultra compact */}
      <div className="text-center text-white mb-2">
        <h1 className="text-xl font-bold mb-1">Unlock Premium Features</h1>
        <p className="text-sm opacity-90 leading-relaxed">
          Get unlimited access to all meditations, stories, and personalized content
        </p>
      </div>

      {/* Subscription Options - Ultra compact */}
      <div className="space-y-3 flex-1">
        {/* Annual Plan - Ultra compact */}
        <button
          onClick={() => handleSubscriptionSelect('annual')}
          className={`w-full p-3 rounded-lg ${
            selectedPlan === 'annual'
              ? 'bg-white text-blue-600 shadow-lg transform scale-105'
              : 'bg-white/20 text-white hover:bg-white/30'
          } transition-all duration-300`}
        >
          <div className="flex justify-between items-center">
            <div className="text-left">
              <div className="font-bold text-base mb-0.5">Premium Annual</div>
              <div className="text-sm opacity-80">
                {activePromo ? (
                  <span className="flex items-center gap-1">
                    <span className="line-through">${prices.annual}/year</span>
                    <span className="text-green-400 no-underline">
                      ${getDiscountedPrice(prices.annual).toFixed(2)}/year
                    </span>
                  </span>
                ) : (
                  <span>${prices.annual}/year</span>
                )}
              </div>
            </div>
            {selectedPlan === 'annual' && (
              <div className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                Best value
              </div>
            )}
          </div>
        </button>

        {/* Monthly Plan - Ultra compact */}
        <button
          onClick={() => handleSubscriptionSelect('monthly')}
          className={`w-full p-3 rounded-lg ${
            selectedPlan === 'monthly'
              ? 'bg-white text-blue-600 shadow-lg transform scale-105'
              : 'bg-white/20 text-white hover:bg-white/30'
          } transition-all duration-300`}
        >
          <div className="flex justify-between items-center">
            <div className="text-left">
              <div className="font-bold text-base mb-0.5">Monthly</div>
              <div className="text-sm opacity-80">
                {activePromo ? (
                  <span className="flex items-center gap-1">
                    <span className="line-through">${prices.monthly}/month</span>
                    <span className="text-green-400 no-underline">
                      ${getDiscountedPrice(prices.monthly).toFixed(2)}/month
                    </span>
                  </span>
                ) : (
                  <span>${prices.monthly}/month</span>
                )}
              </div>
              <div className="text-xs mt-1 opacity-90">Flexible monthly billing</div>
            </div>
          </div>
        </button>

        {/* Features List - More compact */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-white">
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center mr-2 text-xs">✓</div>
            <span className="text-sm">Unlimited access to all meditations</span>
          </div>
          <div className="flex items-center text-white">
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center mr-2 text-xs">✓</div>
            <span className="text-sm">Personalized meditation plans</span>
          </div>
          <div className="flex items-center text-white">
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center mr-2 text-xs">✓</div>
            <span className="text-sm">Offline downloads</span>
          </div>
        </div>

        {/* Promo Code Section - More compact and optional */}
        <div className="mt-4">
          {!activePromo ? (
            <div className="flex items-center">
              <button
                onClick={() => document.getElementById('promoCodeInput')?.focus()}
                className="text-sm text-white/80 hover:text-white flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Have a promo code?
              </button>

              <div className="ml-2 flex-grow max-w-[200px]">
                <div className="flex items-center">
                  <Input
                    id="promoCodeInput"
                    type="text"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="bg-white/20 text-white placeholder:text-white/60 h-8 text-sm"
                    disabled={isApplyingPromo}
                    onKeyDown={(e) => e.key === 'Enter' && handlePromoCodeSubmit()}
                  />
                  {promoCode && (
                    <Button
                      onClick={handlePromoCodeSubmit}
                      variant="ghost"
                      className="h-8 px-2 ml-1"
                      disabled={isApplyingPromo}
                    >
                      {isApplyingPromo ? (
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-white bg-white/20 p-2 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-sm">{activePromo.code}</p>
                    <p className="text-xs text-green-400">
                      {getFormattedDiscountText(selectedPlan === 'annual' ? prices.annual : prices.monthly)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white h-8 px-2"
                  onClick={removePromoCode}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom with higher z-index for guaranteed visibility */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-blue-600 via-blue-600 to-transparent pb-6 pt-8">
        <Button
          onClick={handleContinue}
          className="w-full bg-white text-blue-600 hover:bg-blue-50 py-3 text-lg font-semibold rounded-xl shadow-lg transform transition hover:scale-105"
        >
          Continue
        </Button>
        <div className="text-center mt-2">
          <p className="text-white/80 text-xs">Cancel anytime · Money back guarantee</p>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind fixed button */}
      <div className="h-24"></div>

      {/* Payment Modal */}
      {/* Fingerprint Authentication Dialog */}
      <FingerprintDialog
        isOpen={showBiometricDialog}
        onClose={() => setShowBiometricDialog(false)}
        onSuccess={handleBiometricSuccess}
        onError={handleBiometricError}
        title="Verify Payment"
        description="Please authenticate with your fingerprint to complete the payment"
      />

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-11/12 max-w-md">
            {showPaymentSheet ? (
              <div className="relative">
                {/* Apple Pay / Google Pay Sheet */}
                <div className={`${paymentStep === 'processing' || paymentStep === 'verifying' || paymentStep === 'success' ? 'bg-black' : ''} text-white p-6 rounded-2xl relative overflow-hidden`}>
                  {/* Payment method header - Apple Pay or Google Pay */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-lg font-medium flex items-center">
                      {paymentStep === 'processing' && (
                        <>
                          {selectedPlan === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
                        </>
                      )}
                    </div>
                    <div className="text-lg font-medium">
                      {activePromo ? (
                        <span className="text-green-400">
                          ${getDiscountedPrice(selectedPlan === 'annual' ? prices.annual : prices.monthly).toFixed(2)}
                        </span>
                      ) : (
                        <span>
                          ${selectedPlan === 'annual' ? prices.annual : prices.monthly}
                        </span>
                      )}
                    </div>
                  </div>

                  {paymentStep === 'processing' && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-2 border-white border-t-transparent mx-auto mb-4"></div>
                      <p className="text-lg">Processing payment...</p>
                    </div>
                  )}

                  {paymentStep === 'verifying' && (
                    <div className="text-center py-8">
                      <div className="flex items-center justify-center mb-4 relative">
                        {/* Gojek-style animated verification UI */}
                        <div className="relative">
                          {/* Animated rings */}
                          <div className="absolute inset-0 rounded-full bg-white/30 animate-ping opacity-25"></div>
                          <div className="absolute inset-2 rounded-full bg-white/40 animate-pulse opacity-20"></div>

                          {/* Main icon container */}
                          <div className="animate-pulse w-20 h-20 rounded-full bg-white/20 flex items-center justify-center relative z-10">
                            {isAndroid() ? (
                              /* Fingerprint icon for Android - Gojek style */
                              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839-1.132c.06-.411.091-.83.091-1.255a4.99 4.99 0 00-1.383-3.453M4.921 10a5.008 5.008 0 01-1.423-3.883c0-3.316 3.01-6 6.724-6M5.9 20.21a5.001 5.001 0 01-2.38-3.233M13.5 4.206V4a2 2 0 10-4 0v.206a6 6 0 00-.5 10.975M16 11a4 4 0 00-4-4v0" />
                              </svg>
                            ) : (
                              /* Face ID icon for iOS - Gojek style */
                              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 9h.01M9 9h.01" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Gojek-style verification text */}
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {isAndroid() ? 'Touch Fingerprint Sensor' : 'Look at Your Device'}
                      </h3>
                      <p className="text-sm text-white/80 mt-2">
                        {isAndroid()
                          ? 'Use your fingerprint to verify this payment'
                          : 'Use Face ID to verify this payment'}
                      </p>

                      {/* Gojek-style security badge */}
                      <div className="mt-6 flex items-center justify-center">
                        <div className="bg-white/10 rounded-full px-3 py-1 flex items-center space-x-1">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span className="text-xs text-white/80">Secured by Hushhly Pay</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentStep === 'success' && (
                    <div className="text-center py-8">
                      {/* Gojek-style success animation */}
                      <div className="flex items-center justify-center mb-6 relative">
                        {/* Success animation rings */}
                        <div className="absolute w-24 h-24 rounded-full bg-green-400/20 animate-pulse"></div>
                        <div className="absolute w-20 h-20 rounded-full bg-green-400/30"></div>

                        {/* Success checkmark */}
                        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center z-10">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>

                      {/* Gojek-style success text */}
                      <h3 className="text-xl font-semibold text-white mb-1">Payment Successful!</h3>
                      <p className="text-sm text-white/80 mt-2">
                        Your {selectedPlan === 'annual' ? 'annual' : 'monthly'} subscription is now active
                      </p>

                      {/* Gojek-style transaction details */}
                      <div className="mt-6 bg-white/10 rounded-lg p-3 text-left">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-white/60">Plan</span>
                          <span className="text-sm text-white font-medium">
                            {selectedPlan === 'annual' ? 'Annual Premium' : 'Monthly Premium'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-white/60">Amount</span>
                          <span className="text-sm text-white font-medium">
                            ${getDiscountedPrice(selectedPlan === 'annual' ? prices.annual : prices.monthly).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-white/60">Next billing</span>
                          <span className="text-sm text-white font-medium">
                            {new Date(new Date().setMonth(new Date().getMonth() + (selectedPlan === 'annual' ? 12 : 1))).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-white/60">Transaction ID</span>
                          <span className="text-sm text-white font-medium">
                            {`TRX${Date.now().toString().substring(5)}`}
                          </span>
                        </div>
                      </div>

                      {/* Gojek-style security badge */}
                      <div className="mt-6 flex items-center justify-center">
                        <div className="bg-white/10 rounded-full px-3 py-1 flex items-center space-x-1">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span className="text-xs text-white/80">Secured by Hushhly Pay</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {(paymentStep === 'processing' || paymentStep === 'verifying' || paymentStep === 'success') && (
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between text-sm opacity-80">
                        <span>Payment Method</span>
                        <span className="flex items-center">
                          {/* Show appropriate icon based on payment method */}
                          {paymentStep === 'success' && (
                            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                            </svg>
                          )}
                          ••••4242
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm opacity-80">
                        <span>Billing Address</span>
                        <span>Default</span>
                      </div>
                      {paymentStep === 'success' && (
                        <div className="flex items-center justify-between text-sm opacity-80">
                          <span>Receipt</span>
                          <span className="text-blue-300">Email</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Complete Purchase</h3>
                  <p className="text-gray-600 mt-2">
                    {selectedPlan === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
                    {activePromo ? (
                      <>
                        <span className="line-through text-gray-400 mx-2">
                          ${selectedPlan === 'annual' ? prices.annual : prices.monthly}
                        </span>
                        <span className="text-green-600 font-medium">
                          ${getDiscountedPrice(selectedPlan === 'annual' ? prices.annual : prices.monthly).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="ml-2">
                        ${selectedPlan === 'annual' ? prices.annual : prices.monthly}
                        {selectedPlan === 'annual' ? '/year' : '/month'}
                      </span>
                    )}
                  </p>
                  {activePromo && (
                    <div className="mt-2 text-sm text-green-600 flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {activePromo.description}
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {/* Balance Display */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <BalanceDisplay />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => navigate('/transaction-history')}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        View Transactions
                      </button>
                    </div>
                  </div>

                  {/* Payment Method Options */}
                  <div className="space-y-3">
                    <Button
                      onClick={() => handlePayment('apple')}
                      className="w-full bg-black text-white py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-900 transition-colors"
                    >
                      <FaApple size={20} />
                      <span>Pay with Apple Pay</span>
                    </Button>
                    <Button
                      onClick={() => handlePayment('google')}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
                    >
                      <FcGoogle size={20} />
                      <span>Pay with Google Pay</span>
                    </Button>
                  </div>

                  {/* Verification Method Options */}
                  <div className="mt-2 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2 text-center">Verification Method</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          // Set verification method to fingerprint
                          localStorage.setItem('verificationMethod', 'fingerprint');
                          setVerificationMethod('fingerprint');
                          toast.info('Will verify with fingerprint');
                        }}
                        variant={verificationMethod !== 'screenlock' ? 'default' : 'outline'}
                        className="flex-1 text-sm py-2 flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839-1.132c.06-.411.091-.83.091-1.255a4.99 4.99 0 00-1.383-3.453M4.921 10a5.008 5.008 0 01-1.423-3.883c0-3.316 3.01-6 6.724-6M5.9 20.21a5.001 5.001 0 01-2.38-3.233M13.5 4.206V4a2 2 0 10-4 0v.206a6 6 0 00-.5 10.975M16 11a4 4 0 00-4-4v0" />
                        </svg>
                        Fingerprint
                      </Button>
                      <Button
                        onClick={() => {
                          // Set verification method to screen lock
                          localStorage.setItem('verificationMethod', 'screenlock');
                          setVerificationMethod('screenlock');
                          toast.info('Will verify with screen lock');
                        }}
                        variant={verificationMethod === 'screenlock' ? 'default' : 'outline'}
                        className="flex-1 text-sm py-2 flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Screen Lock
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      className="text-gray-600 py-2 px-4 hover:text-gray-800 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>,

    // Screen 3: Welcome to Hushhly with bear image
    <div
      key="screen-3"
      className={`flex flex-col items-center justify-between h-full px-8 text-center bg-white ${
        animating
          ? 'opacity-0 translate-x-20 scale-95'
          : 'opacity-100 translate-x-0 scale-100'
      } transition-all duration-500 ease-out`}
    >
      {/* Back button and Skip text in the header */}
      <div className="w-full flex justify-between items-center pt-6 px-4">
        <button onClick={handleBack} className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <button onClick={handleSkip} className="text-xs text-meditation-lightBlue hover:text-meditation-mediumBlue transition-colors">
          Skip for now
        </button>
      </div>

      <div className="mb-2">
        <img
          src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png"
          alt="Hushhly Logo"
          className="w-40 h-auto"
        />
      </div>
      <h2 className="text-meditation-lightBlue text-lg font-medium mb-8 animate-fade-in">Welcome to Hushhly</h2>
      <div>
        <img
          src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png"
          alt="Meditation Bear"
          className="w-48 h-auto mb-8 animate-pulse-subtle"
          style={{ animationDuration: '3s' }}
        />
      </div>
      <p className="text-sm text-gray-600 mb-10 animate-slide-up">
        A smarter way to experience <br /> the benefits of daily meditation <br /> and mindfulness
      </p>
      <Button
        onClick={handleNext}
        className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 rounded-full flex items-center animate-scale-in mb-6"
      >
        Next <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>,

    // Screen 4: Personalized Meditation Plans
    <div
      key="screen-4"
      className={`flex flex-col items-center justify-between h-full px-8 text-center bg-white ${
        animating
          ? 'opacity-0 translate-x-20 scale-95'
          : 'opacity-100 translate-x-0 scale-100'
      } transition-all duration-500 ease-out`}
    >
      {/* Back button and Skip text in the header */}
      <div className="w-full flex justify-between items-center pt-6 px-4">
        <button onClick={handleBack} className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <button onClick={handleSkip} className="text-xs text-meditation-lightBlue hover:text-meditation-mediumBlue transition-colors">
          Skip for now
        </button>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="mb-2">
          <img
            src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png"
            alt="Hushhly Logo"
            className="w-40 h-auto"
          />
        </div>
        <h2 className="text-meditation-lightBlue text-lg font-medium mb-8 animate-fade-in">Personalized Meditation Plans</h2>
        <div>
          <img
            src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png"
            alt="Meditation Bear"
            className="w-48 h-auto mb-8 animate-pulse-subtle"
            style={{ animationDuration: '3s' }}
          />
        </div>
        <p className="text-sm text-gray-600 mb-10 animate-slide-up">
          Tailored meditations based on your <br /> goals, mood, and schedule to <br /> maximize benefits
        </p>
        <Button
          onClick={handleNext}
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 rounded-full flex items-center animate-scale-in mb-6"
        >
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>,

    // Screen 5: AI Enhanced Experience
    <div
      key="screen-5"
      className={`flex flex-col items-center justify-between h-full px-8 text-center bg-white ${
        animating
          ? 'opacity-0 translate-x-20 scale-95'
          : 'opacity-100 translate-x-0 scale-100'
      } transition-all duration-500 ease-out`}
    >
      {/* Back button and Skip text in the header */}
      <div className="w-full flex justify-between items-center pt-6 px-4">
        <button onClick={handleBack} className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <button onClick={handleSkip} className="text-xs text-meditation-lightBlue hover:text-meditation-mediumBlue transition-colors">
          Skip for now
        </button>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="mb-2">
          <img
            src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png"
            alt="Hushhly Logo"
            className="w-40 h-auto"
          />
        </div>
        <h2 className="text-meditation-lightBlue text-lg font-medium mb-8 animate-fade-in">AI Enhanced Experience</h2>
        <div>
          <img
            src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png"
            alt="Meditation Bear"
            className="w-48 h-auto mb-8 animate-pulse-subtle"
            style={{ animationDuration: '3s' }}
          />
        </div>
        <p className="text-sm text-gray-600 mb-10 animate-slide-up">
          Our AI learns your preferences to <br /> improve your mindfulness journey <br /> over time
        </p>
        <Button
          onClick={handleNext}
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 rounded-full flex items-center animate-scale-in mb-6"
        >
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>,

    // Screen 6: Progress Tracking & Insights
    <div
      key="screen-6"
      className={`flex flex-col items-center justify-between h-full px-8 text-center bg-white ${
        animating
          ? 'opacity-0 translate-x-20 scale-95'
          : 'opacity-100 translate-x-0 scale-100'
      } transition-all duration-500 ease-out`}
    >
      {/* Back button and Skip text in the header */}
      <div className="w-full flex justify-between items-center pt-6 px-4">
        <button onClick={handleBack} className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <button onClick={handleSkip} className="text-xs text-meditation-lightBlue hover:text-meditation-mediumBlue transition-colors">
          Skip for now
        </button>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="mb-2">
          <img
            src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png"
            alt="Hushhly Logo"
            className="w-40 h-auto"
          />
        </div>
        <h2 className="text-meditation-lightBlue text-lg font-medium mb-8 animate-fade-in">Progress Tracking & Insights</h2>
        <div>
          <img
            src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png"
            alt="Meditation Bear"
            className="w-48 h-auto mb-8 animate-pulse-subtle"
            style={{ animationDuration: '3s' }}
          />
        </div>
        <p className="text-sm text-gray-600 mb-10 animate-slide-up">
          Track your meditation journey and <br /> get personalized insights to <br /> improve
        </p>
        <Button
          onClick={handleNext}
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 rounded-full flex items-center animate-scale-in mb-6"
        >
          Get Started <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>,

    // Screen 7: Get Started - Blue gradient background (NEW)
    <div
      key="screen-7"
      className={`flex flex-col items-center justify-between h-full px-8 text-center bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700 ${
        animating
          ? 'opacity-0 translate-x-20 scale-95'
          : 'opacity-100 translate-x-0 scale-100'
      } transition-all duration-500 ease-out relative`}
    >
      {/* Back button in the header */}
      <div className="w-full flex justify-start items-center pt-6 px-4">
        <button onClick={handleBack} className="p-2 text-white hover:bg-blue-600/50 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow">
        {/* White Hushhly text logo */}
        <img
          src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png"
          alt="Hushhly Logo"
          className="w-64 h-auto animate-float mb-6 brightness-0 invert"
        />
        <h2 className="text-white text-xl font-medium mb-6 animate-fade-in">Find Your Calm, Anytime, Anywhere</h2>
        <div>
          <img
            src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png"
            alt="Meditation Bear"
            className="w-48 h-auto mb-8 animate-pulse-subtle"
            style={{ animationDuration: '3s' }}
          />
        </div>
        <p className="text-sm text-white mb-10 animate-slide-up">
          Your journey to mindfulness begins here
        </p>
        <Button
          onClick={handleNext}
          className="bg-white text-blue-600 hover:bg-blue-50 px-16 py-6 rounded-full flex items-center justify-center animate-pulse-subtle w-full"
          style={{ animationDuration: '2s' }}
        >
          <span className="text-lg">Get Started</span>
        </Button>
      </div>

      {/* Empty div for spacing */}
      <div className="py-6"></div>
    </div>,

    // Screen 8: Login/Signup - Blue gradient background (NEW)
    <div
      key="screen-8"
      className={`flex flex-col items-center h-full px-8 text-center bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700 overflow-auto ${
        animating
          ? 'opacity-0 translate-x-20 scale-95'
          : 'opacity-100 translate-x-0 scale-100'
      } transition-all duration-500 ease-out relative`}
    >
      {/* Back button in the header */}
      <div className="w-full flex justify-start items-center sticky top-0 pt-6 px-4 bg-gradient-to-b from-blue-400 to-blue-400/80 z-10">
        <button onClick={handleBack} className="p-2 text-white hover:bg-blue-600/50 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center w-full py-6">
        {/* White Hushhly text logo */}
        <img
          src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png"
          alt="Hushhly Logo"
          className="w-64 h-auto mb-6 brightness-0 invert"
        />
        <h2 className="text-white text-xl font-medium mb-6 animate-fade-in">Find Your Calm, Anytime, Anywhere</h2>
        <div>
          <img
            src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png"
            alt="Meditation Bear"
            className="w-48 h-auto mb-8 animate-pulse-subtle"
            style={{ animationDuration: '3s' }}
          />
        </div>

        <div className="w-full space-y-4 mt-4 mb-8">
          <Button
            onClick={handleLogin}
            className="bg-white text-blue-600 hover:bg-blue-50 rounded-full flex items-center justify-center w-full py-6 animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="text-lg">Login</span>
          </Button>

          <Button
            onClick={handleSignUp}
            className="bg-transparent text-white border-2 border-white hover:bg-white/10 rounded-full flex items-center justify-center w-full py-6 animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="text-lg">Sign up</span>
          </Button>

          <div className="flex items-center justify-center space-x-2 py-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="h-px bg-white/30 flex-grow"></div>
            <span className="text-white/80">Or Continue with</span>
            <div className="h-px bg-white/30 flex-grow"></div>
          </div>

          <div className="flex justify-center space-x-4 pb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => {
                // Open Google authentication popup
                const width = 500;
                const height = 600;
                const left = window.screenX + (window.outerWidth - width) / 2;
                const top = window.screenY + (window.outerHeight - height) / 2;
                window.open(
                  'https://accounts.google.com/o/oauth2/auth?client_id=123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com&redirect_uri=https://hushhly.vercel.app/auth/google/callback&response_type=code&scope=email%20profile',
                  'Google Login',
                  `width=${width},height=${height},left=${left},top=${top}`
                );
              }}
              className="bg-white p-4 rounded-xl flex items-center justify-center w-24 hover:bg-blue-50 transition-colors"
            >
              <FcGoogle size={24} />
            </button>
            <button
              onClick={() => {
                // Open Apple authentication popup
                const width = 500;
                const height = 600;
                const left = window.screenX + (window.outerWidth - width) / 2;
                const top = window.screenY + (window.outerHeight - height) / 2;
                window.open(
                  'https://appleid.apple.com/auth/authorize?client_id=com.hushhly.service&redirect_uri=https://hushhly.vercel.app/auth/apple/callback&response_type=code&scope=name%20email',
                  'Apple Login',
                  `width=${width},height=${height},left=${left},top=${top}`
                );
              }}
              className="bg-white p-4 rounded-xl flex items-center justify-center w-24 hover:bg-blue-50 transition-colors"
            >
              <FaApple size={24} className="text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>,

    // Screen 9: Subscription Screen
    <div
      key="screen-9"
      className={`flex flex-col items-center justify-between h-full px-8 text-center bg-white ${
        animating
          ? 'opacity-0 translate-x-20 scale-95'
          : 'opacity-100 translate-x-0 scale-100'
      } transition-all duration-500 ease-out`}
    >
      {/* Back button and Skip text in the header */}
      <div className="w-full flex justify-between items-center pt-6 px-4">
        <button onClick={handleBack} className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <button onClick={handleSkip} className="text-xs text-meditation-lightBlue hover:text-meditation-mediumBlue transition-colors">
          Skip for now
        </button>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="mb-2">
          <img
            src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png"
            alt="Hushhly Logo"
            className="w-40 h-auto"
          />
        </div>
        <h2 className="text-meditation-lightBlue text-lg font-medium mb-8 animate-fade-in">Subscription</h2>
        <div>
          <img
            src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png"
            alt="Meditation Bear"
            className="w-48 h-auto mb-8 animate-pulse-subtle"
            style={{ animationDuration: '3s' }}
          />
        </div>
        <p className="text-sm text-gray-600 mb-10 animate-slide-up">
          Choose the plan that's right for you
        </p>
        <Button
          onClick={handleNext}
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 rounded-full flex items-center animate-scale-in mb-6"
        >
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  ];

  // Progress indicators - only show for content screens (screens 2-5)
  const renderProgressIndicators = () => {
    if (currentScreen >= 2 && currentScreen <= 5) {
      return (
        <div className="flex space-x-2 absolute bottom-10 left-1/2 transform -translate-x-1/2">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index + 2 === currentScreen
                  ? 'bg-blue-500 scale-125'
                  : index + 2 < currentScreen
                    ? 'bg-blue-400 opacity-70'
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      );
    }
    return null;
  };

  // Update useEffect to navigate to quiz page after all screens
  useEffect(() => {
    if (currentScreen === totalScreens) {
      navigate('/quiz');
    }
  }, [currentScreen, navigate, totalScreens]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Current screen content */}
      {screens[currentScreen]}

      {/* Progress indicators */}
      {renderProgressIndicators()}
    </div>
  );
};

export default SplashScreen;
