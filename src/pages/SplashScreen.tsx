import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import { usePromoCodeEnhanced } from '@/hooks/usePromoCodeEnhanced';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { paymentService } from '@/services/paymentService';
import { useAuthSimple } from '@/hooks/useAuthSimple';
import { isAndroid, isIOS } from '@/utils/deviceUtils';
// BalanceDisplay import removed
import { balanceService } from '@/services/balanceService';
import { faceIdService } from '@/services/faceIdService';
import { applePayService } from '@/services/applePayService';
import { biometricService } from '@/services/biometricService';
import { googlePlayService } from '@/services/googlePlayService';
import { FaceIDDialog } from '@/components/ui/face-id-dialog';
import { FingerprintDialog } from '@/components/ui/fingerprint-dialog';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);
  const totalScreens = 9; // Updated to include subscription screen
  const [animating, setAnimating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'verifying' | 'success'>('select');
  const [showFaceIDDialog, setShowFaceIDDialog] = useState(false);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [faceIdFeatures, setFaceIdFeatures] = useState<any>(null);
  const [faceIdConfidence, setFaceIdConfidence] = useState<number | null>(null);
  const [fingerprintConfidence, setFingerprintConfidence] = useState<number | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'fingerprint' | 'screenlock'>('fingerprint');
  const [showBiometricDialog, setShowBiometricDialog] = useState(false);
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
        }, 800); // Increased fade-out animation for more visible effect
      }, currentScreen === 0 ? 2200 : 1800); // Longer delays for better visibility of animations
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

  // Get user's country/region
  const getUserCountry = async (): Promise<string> => {
    try {
      // Try to get country from browser's navigator.language
      const browserLanguage = navigator.language || 'en-US';
      const countryCode = browserLanguage.split('-')[1] || 'US';

      // For a more accurate result, you could use a geolocation API
      // This is a simplified version that just uses the browser's language setting

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return countryCode;
    } catch (error) {
      console.error('Error detecting country:', error);
      return 'US'; // Default to US if detection fails
    }
  };

  const handlePayment = async (method: 'apple' | 'google' | 'balance') => {
    // No need to check for user login here - we assume they're already logged in
    // Just proceed directly to payment processing

    // Show the payment sheet with the appropriate branding
    setShowPaymentSheet(true);
    setPaymentStep('processing');
    setProcessingPayment(true);

    try {
      // Process payment using the payment service with consistent user ID
      const userId = getCurrentUserId();

      // Determine payment method
      let paymentMethodType: 'apple_pay' | 'google_pay' | 'balance';
      if (method === 'apple') {
        paymentMethodType = 'apple_pay';
      } else if (method === 'google') {
        paymentMethodType = 'google_pay';
      } else {
        paymentMethodType = 'balance';
      }

      const paymentResult = await paymentService.processPayment(
        selectedPlan,
        { method: paymentMethodType },
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
  const handleBiometricSuccess = async (features?: any, confidence?: number) => {
    // Store fingerprint confidence for display
    if (confidence !== undefined) setFingerprintConfidence(confidence);

    // Trigger balance update
    window.dispatchEvent(new Event('balance-updated'));

    try {
      // Get the pending payment details from localStorage
      const amount = parseFloat(localStorage.getItem('pendingPaymentAmount') || '0');
      const description = localStorage.getItem('pendingPaymentDescription') || '';
      const userId = localStorage.getItem('pendingPaymentUserId') || getCurrentUserId();
      const plan = localStorage.getItem('pendingPaymentPlan') as 'annual' | 'monthly' || selectedPlan;
      const country = localStorage.getItem('pendingPaymentCountry') || 'US';

      if (!amount || !description) {
        throw new Error('Payment information not found');
      }

      // Set the selected plan based on what was stored
      setSelectedPlan(plan);

      // Show success message
      toast.success('Fingerprint verified');

      // Add a small delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show processing message
      toast.info('Processing Google Play payment...');

      // Process the actual payment with Google Play
      const paymentResult = await googlePlayService.processPayment({
        amount,
        currency: 'USD',
        description,
        userId,
        country
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Google Play payment failed');
      }

      // Add another delay to simulate backend processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Complete the payment process
      setPaymentStep('success');

      // Save subscription details
      const subscriptionDetails = {
        plan: plan, // Use the plan from localStorage
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + (plan === 'annual' ? 12 : 1))),
        autoRenew: true,
        status: 'active' as 'active',
        paymentId: paymentResult.transactionId,
        promoCodeId: activePromo?.id,
        originalPrice: plan === 'annual' ? prices.annual : prices.monthly,
        finalPrice: amount, // Use the actual amount paid from localStorage
        country: country // Include country information
      };

      await paymentService.saveSubscription(userId, subscriptionDetails);

      // Show success message
      toast.success('Payment successful!');

      // Add a delay before closing the payment UI
      setTimeout(() => {
        // Close payment UI and proceed
        setShowBiometricDialog(false);
        setShowPaymentSheet(false);
        setShowPaymentModal(false);

        // Navigate to the next screen
        setCurrentScreen(currentScreen + 1);
      }, 3000);
    } catch (error) {
      console.error('Fingerprint success handler error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred during payment processing');

      // Reset payment UI
      setShowBiometricDialog(false);
      setShowPaymentSheet(false);
      setPaymentStep('select');
    }
  };

  // Handle biometric authentication error
  const handleBiometricError = async (error: string) => {
    console.error('Fingerprint error:', error);
    toast.error(error || 'Fingerprint verification failed');

    // Close the biometric dialog
    setShowBiometricDialog(false);

    // Wait a moment before showing the retry option
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Ask if user wants to try again
    const tryAgain = window.confirm('Would you like to try fingerprint verification again?');

    if (tryAgain) {
      // Try again with Google Play
      handleGooglePlay();
      return;
    }

    // Reset payment UI if user doesn't want to try again
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
      // Convert promo code to uppercase to ensure case-insensitive matching
      const normalizedCode = promoCode.trim().toUpperCase();
      const result = await applyPromoCode(normalizedCode, selectedPlan === 'annual' ? 'Annual' : 'Monthly');

      if (result.isValid) {
        toast.success(result.message);
        // Clear the input field after successful application
        setPromoCode('');
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

  // Handle Google Play with Fingerprint
  const handleGooglePlay = async () => {
    // Check if Google Play is available before proceeding
    if (!isAndroid()) {
      toast.error('Google Play is only available on Android devices');
      return;
    }

    // Show the payment sheet with Google Play branding
    setShowPaymentSheet(true);
    setPaymentStep('processing');
    setProcessingPayment(true);

    try {
      // Get user ID
      const userId = getCurrentUserId();

      // Get user's country/region
      const userCountry = await getUserCountry();
      console.log(`User country detected: ${userCountry}`);

      // Check if Google Play is available
      const isGooglePlayAvailable = await googlePlayService.isAvailable();
      if (!isGooglePlayAvailable) {
        throw new Error('Google Play is not available on this device. Please use an Android device with Google Play support.');
      }

      // Calculate price based on selected plan
      let originalPrice: number, finalPrice: number;

      if (selectedPlan === 'annual') {
        // Annual plan: $59.99 per year
        originalPrice = prices.annual;
        finalPrice = activePromo ? getDiscountedPrice(originalPrice) : originalPrice;

        // Show initializing payment message with annual amount
        toast.info(`Initializing Google Play payment for $${finalPrice.toFixed(2)}/year...`);
      } else {
        // Monthly plan: $5.99 per month
        originalPrice = prices.monthly;
        finalPrice = activePromo ? getDiscountedPrice(originalPrice) : originalPrice;

        // Show initializing payment message with monthly amount
        toast.info(`Initializing Google Play payment for $${finalPrice.toFixed(2)}/month...`);
      }

      await new Promise(resolve => setTimeout(resolve, 2000));

      // First step: Process payment with Google Play
      const paymentDescription = `Subscription to ${selectedPlan === 'monthly' ? 'Monthly' : 'Annual'} Plan`;

      // Store transaction details for verification
      localStorage.setItem('pendingPaymentAmount', finalPrice.toString());
      localStorage.setItem('pendingPaymentDescription', paymentDescription);
      localStorage.setItem('pendingPaymentUserId', userId);
      localStorage.setItem('pendingPaymentPlan', selectedPlan);
      localStorage.setItem('pendingPaymentCountry', userCountry);

      // Second step: Verify with Fingerprint
      setPaymentStep('verifying');

      // Check if Fingerprint is available
      const isBiometricAvailable = await biometricService.isAvailable();
      if (!isBiometricAvailable) {
        throw new Error('Fingerprint authentication is not available on this device. Please use an Android device with fingerprint support.');
      }

      // Show Fingerprint verification message
      toast.info('Please verify with your fingerprint to complete payment');

      // Show the Fingerprint dialog
      setShowBiometricDialog(true);

      // The verification will continue in the onBiometricSuccess handler
      return;
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

  // Handle Apple Pay with Face ID
  const handleApplePay = async () => {
    // Check if Apple Pay is available before proceeding
    if (!isIOS()) {
      toast.error('Apple Pay is only available on iOS devices');
      return;
    }

    // Show the payment sheet with Apple Pay branding
    setShowPaymentSheet(true);
    setPaymentStep('processing');
    setProcessingPayment(true);

    try {
      // Get user ID
      const userId = getCurrentUserId();

      // Check if Apple Pay is available
      const isApplePayAvailable = await applePayService.isAvailable();
      if (!isApplePayAvailable) {
        throw new Error('Apple Pay is not available on this device. Please use an iOS device with Apple Pay support.');
      }

      // Calculate price based on selected plan
      let originalPrice: number, finalPrice: number;

      if (selectedPlan === 'annual') {
        // Annual plan: $59.99 per year
        originalPrice = prices.annual;
        finalPrice = activePromo ? getDiscountedPrice(originalPrice) : originalPrice;

        // Show initializing payment message with annual amount
        toast.info(`Initializing Apple Pay for $${finalPrice.toFixed(2)}/year...`);
      } else {
        // Monthly plan: $5.99 per month
        originalPrice = prices.monthly;
        finalPrice = activePromo ? getDiscountedPrice(originalPrice) : originalPrice;

        // Show initializing payment message with monthly amount
        toast.info(`Initializing Apple Pay for $${finalPrice.toFixed(2)}/month...`);
      }

      await new Promise(resolve => setTimeout(resolve, 2000));

      // First step: Process payment with Apple Pay
      const paymentDescription = `Subscription to ${selectedPlan === 'monthly' ? 'Monthly' : 'Annual'} Plan`;

      // Store transaction details for verification
      localStorage.setItem('pendingPaymentAmount', finalPrice.toString());
      localStorage.setItem('pendingPaymentDescription', paymentDescription);
      localStorage.setItem('pendingPaymentUserId', userId);
      localStorage.setItem('pendingPaymentPlan', selectedPlan);

      // Second step: Verify with Face ID
      setPaymentStep('verifying');

      // Check if Face ID is available
      const isFaceIDAvailable = await faceIdService.isAvailable();
      if (!isFaceIDAvailable) {
        throw new Error('Face ID is not available on this device. Please use an iOS device with Face ID support.');
      }

      // Show Face ID verification message
      toast.info('Please verify with Face ID to complete payment');

      // Show the Face ID dialog
      setShowFaceIDDialog(true);

      // The verification will continue in the onFaceIDSuccess handler
      return;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred during payment');

      // Reset payment UI
      setShowFaceIDDialog(false);
      setShowPaymentSheet(false);
      setPaymentStep('select');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Handle Face ID error
  const handleFaceIDError = async (error: string) => {
    console.error('Face ID error:', error);
    toast.error(error || 'Face ID verification failed');

    // Close the Face ID dialog
    setShowFaceIDDialog(false);

    // Wait a moment before showing the retry option
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Ask if user wants to try again
    const tryAgain = window.confirm('Would you like to try Face ID verification again?');

    if (tryAgain) {
      // Try again with Apple Pay
      handleApplePay();
      return;
    }

    // Reset payment UI if user doesn't want to try again
    setShowPaymentSheet(false);
    setPaymentStep('select');
  };

  // Handle successful Face ID authentication
  const handleFaceIDSuccess = async (features?: any, confidence?: number) => {
    // Store Face ID features and confidence for display
    if (features) setFaceIdFeatures(features);
    if (confidence !== undefined) setFaceIdConfidence(confidence);

    // Trigger balance update
    window.dispatchEvent(new Event('balance-updated'));

    try {
      // Get the pending payment details from localStorage
      const amount = parseFloat(localStorage.getItem('pendingPaymentAmount') || '0');
      const description = localStorage.getItem('pendingPaymentDescription') || '';
      const userId = localStorage.getItem('pendingPaymentUserId') || getCurrentUserId();
      const plan = localStorage.getItem('pendingPaymentPlan') as 'annual' | 'monthly' || selectedPlan;

      if (!amount || !description) {
        throw new Error('Payment information not found');
      }

      // Set the selected plan based on what was stored
      setSelectedPlan(plan);

      // Show success message
      toast.success('Face ID verified');

      // Add a small delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show processing message
      toast.info('Processing Apple Pay payment...');

      // Process the actual payment with Apple Pay
      const paymentResult = await applePayService.processPayment({
        amount,
        currency: 'USD',
        description,
        userId
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Apple Pay payment failed');
      }

      // Add another delay to simulate backend processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Complete the payment process
      setPaymentStep('success');

      // Save subscription details
      const subscriptionDetails = {
        plan: plan, // Use the plan from localStorage
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + (plan === 'annual' ? 12 : 1))),
        autoRenew: true,
        status: 'active' as 'active',
        paymentId: paymentResult.transactionId,
        promoCodeId: activePromo?.id,
        originalPrice: plan === 'annual' ? prices.annual : prices.monthly,
        finalPrice: amount // Use the actual amount paid from localStorage
      };

      await paymentService.saveSubscription(userId, subscriptionDetails);

      // Show success message
      toast.success('Payment successful!');

      // Add a delay before closing the payment UI
      setTimeout(() => {
        // Close payment UI and proceed
        setShowFaceIDDialog(false);
        setShowPaymentSheet(false);
        setShowPaymentModal(false);

        // Navigate to the next screen
        setCurrentScreen(currentScreen + 1);
      }, 3000);
    } catch (error) {
      console.error('Face ID success handler error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred during payment processing');

      // Reset payment UI
      setShowFaceIDDialog(false);
      setShowPaymentSheet(false);
      setPaymentStep('select');
    }
  };

  // Define the content for each screen
  const screens = [
    // Screen 0: Clean blue gradient background with Hushhly logo in center - enhanced with animations
    <div
      key="screen-0"
      className={`flex flex-col h-full ${
        animating
          ? 'opacity-0 scale-90 rotate-3'
          : 'opacity-100 scale-100 rotate-0'
      } transition-all duration-700 ease-in-out overflow-hidden relative`}
      style={{
        background: 'linear-gradient(180deg, #00a0d2 0%, #0076b5 50%, #3a5bb8 100%)'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-32 h-32 rounded-full bg-white/5 animate-float-slow"></div>
        <div className="absolute bottom-[15%] right-[15%] w-40 h-40 rounded-full bg-white/5 animate-float-slow-reverse"></div>
        <div className="absolute top-[40%] right-[20%] w-24 h-24 rounded-full bg-white/5 animate-float-medium"></div>
        <div className="absolute bottom-[30%] left-[25%] w-36 h-36 rounded-full bg-white/5 animate-float-medium-reverse"></div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center relative z-10">
        <img
          src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png"
          alt="Hushhly Logo"
          className="w-64 h-auto brightness-0 invert animate-pulse-subtle"
          style={{ animationDuration: '3s' }}
        />
      </div>
    </div>,

    // Screen 1: White background with Hushhly logo (second screen) - enhanced with animations
    <div
      key="screen-1"
      className={`flex flex-col h-full ${
        animating
          ? 'opacity-0 scale-90 -rotate-3'
          : 'opacity-100 scale-100 rotate-0'
      } transition-all duration-700 ease-in-out bg-white relative overflow-hidden`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[15%] left-[15%] w-40 h-40 rounded-full bg-blue-50 animate-float-slow"></div>
        <div className="absolute bottom-[20%] right-[10%] w-48 h-48 rounded-full bg-blue-50 animate-float-slow-reverse"></div>
        <div className="absolute top-[45%] right-[25%] w-32 h-32 rounded-full bg-blue-50 animate-float-medium"></div>
        <div className="absolute bottom-[35%] left-[20%] w-36 h-36 rounded-full bg-blue-50 animate-float-medium-reverse"></div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center relative z-10">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse-subtle opacity-30 blur-md bg-blue-200 rounded-full" style={{ animationDuration: '4s' }}></div>
          <img
            src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png"
            alt="Hushhly Logo"
            className="w-64 h-auto relative z-10 animate-float-subtle"
            style={{ animationDuration: '6s' }}
          />
        </div>
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
                  <span className="flex flex-col items-start gap-1">
                    <span className="line-through">${prices.annual}/year</span>
                    <span className="text-green-400 no-underline">
                      ${getDiscountedPrice(prices.annual).toFixed(2)}/year
                    </span>
                    <span className="text-xs text-green-300">{activePromo.discount}</span>
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
                  <span className="flex flex-col items-start gap-1">
                    <span className="line-through">${prices.monthly}/month</span>
                    <span className="text-green-400 no-underline">
                      ${getDiscountedPrice(prices.monthly).toFixed(2)}/month
                    </span>
                    <span className="text-xs text-green-300">{activePromo.discount}</span>
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
      {/* Face ID Authentication Dialog */}
      <FaceIDDialog
        isOpen={showFaceIDDialog}
        onClose={() => setShowFaceIDDialog(false)}
        onSuccess={handleFaceIDSuccess}
        onError={handleFaceIDError}
        title="Verify Apple Pay"
        description="Please authenticate with Face ID to complete your payment"
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
                            {isIOS() ? (
                              /* Apple Face ID icon */
                              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9h.01M15 9h.01M8 13a4 4 0 008 0" />
                                <rect width="20" height="20" x="2" y="2" rx="5" />
                              </svg>
                            ) : (
                              /* Google Fingerprint icon */
                              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839-1.132c.06-.411.091-.83.091-1.255a4.99 4.99 0 00-1.383-3.453M4.921 10a5.008 5.008 0 01-1.423-3.883c0-3.316 3.01-6 6.724-6M5.9 20.21a5.001 5.001 0 01-2.38-3.233M13.5 4.206V4a2 2 0 10-4 0v.206a6 6 0 00-.5 10.975M16 11a4 4 0 00-4-4v0" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Payment verification text */}
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {isIOS() ? 'Look at Your Device' : 'Touch Fingerprint Sensor'}
                      </h3>
                      <p className="text-sm text-white/80 mt-2">
                        {isIOS()
                          ? 'Use Face ID to verify this Apple Pay payment'
                          : 'Use your fingerprint to verify this Google Play payment'}
                      </p>

                      {/* Payment security badge */}
                      <div className="mt-6 flex items-center justify-center">
                        <div className="bg-white/10 rounded-full px-3 py-1 flex items-center space-x-1">
                          {isIOS()
                            ? <FaApple size={12} className="text-white" />
                            : <FaGooglePlay size={12} className="text-white" />}
                          <span className="text-xs text-white/80">
                            {isIOS()
                              ? 'Secured by Apple Pay'
                              : 'Secured by Google Play'}
                          </span>
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

                      {/* Apple Pay transaction details */}
                      <div className="mt-6 bg-white/10 rounded-lg p-3 text-left">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-white/60">Plan</span>
                          <span className="text-sm text-white font-medium">
                            {selectedPlan === 'annual' ? 'Annual Premium' : 'Monthly Premium'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-white/60">Amount (USD)</span>
                          <span className="text-sm text-white font-medium">
                            {balanceService.formatBalance(getDiscountedPrice(selectedPlan === 'annual' ? prices.annual : prices.monthly))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-white/60">Payment Method</span>
                          <span className="text-sm text-white font-medium flex items-center">
                            {isIOS() ? (
                              <>
                                <FaApple size={14} className="mr-1" />
                                Apple Pay
                              </>
                            ) : (
                              <>
                                <FaGooglePlay size={14} className="mr-1" />
                                Google Play
                              </>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-white/60">Authentication</span>
                          <span className="text-sm text-white font-medium flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9h.01M15 9h.01M8 13a4 4 0 008 0" />
                              <rect width="20" height="20" x="2" y="2" rx="5" />
                            </svg>
                            Face ID
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
                            {`AP${Date.now().toString().substring(5)}`}
                          </span>
                        </div>
                      </div>

                      {/* Biometric verification details */}
                      {isIOS() ? (
                        // Face ID verification details
                        faceIdFeatures && (
                          <div className="mt-3 bg-white/10 rounded-lg p-3 text-left">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-white/60">Face ID Details</span>
                              <span className="text-xs text-white/80 bg-green-500/30 px-2 py-0.5 rounded-full">
                                Verified
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                              <div className="flex items-center">
                                <div className={`w-1.5 h-1.5 rounded-full ${faceIdFeatures.eyes ? 'bg-green-500' : 'bg-red-500'} mr-1`}></div>
                                <span className="text-white/80">Eyes: {faceIdFeatures.eyes ? 'Detected' : 'Not Detected'}</span>
                              </div>
                              <div className="flex items-center">
                                <div className={`w-1.5 h-1.5 rounded-full ${faceIdFeatures.nose ? 'bg-green-500' : 'bg-red-500'} mr-1`}></div>
                                <span className="text-white/80">Nose: {faceIdFeatures.nose ? 'Detected' : 'Not Detected'}</span>
                              </div>
                              <div className="flex items-center">
                                <div className={`w-1.5 h-1.5 rounded-full ${faceIdFeatures.mouth ? 'bg-green-500' : 'bg-red-500'} mr-1`}></div>
                                <span className="text-white/80">Mouth: {faceIdFeatures.mouth ? 'Detected' : 'Not Detected'}</span>
                              </div>
                              <div className="flex items-center">
                                <div className={`w-1.5 h-1.5 rounded-full ${faceIdFeatures.skinTexture ? 'bg-green-500' : 'bg-red-500'} mr-1`}></div>
                                <span className="text-white/80">Skin: {faceIdFeatures.skinTexture ? 'Detected' : 'Not Detected'}</span>
                              </div>
                              <div className="flex items-center">
                                <div className={`w-1.5 h-1.5 rounded-full ${faceIdFeatures.depthMap ? 'bg-green-500' : 'bg-red-500'} mr-1`}></div>
                                <span className="text-white/80">Depth: {faceIdFeatures.depthMap ? 'Detected' : 'Not Detected'}</span>
                              </div>
                              {faceIdConfidence !== null && (
                                <div className="flex items-center">
                                  <div className={`w-1.5 h-1.5 rounded-full ${faceIdConfidence > 0.9 ? 'bg-green-500' : faceIdConfidence > 0.7 ? 'bg-yellow-500' : 'bg-red-500'} mr-1`}></div>
                                  <span className="text-white/80">Confidence: {Math.round(faceIdConfidence * 100)}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      ) : (
                        // Fingerprint verification details
                        fingerprintConfidence !== null && (
                          <div className="mt-3 bg-white/10 rounded-lg p-3 text-left">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-white/60">Fingerprint Details</span>
                              <span className="text-xs text-white/80 bg-green-500/30 px-2 py-0.5 rounded-full">
                                Verified
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                              <div className="flex items-center">
                                <div className={`w-1.5 h-1.5 rounded-full bg-green-500 mr-1`}></div>
                                <span className="text-white/80">Pattern: Detected</span>
                              </div>
                              <div className="flex items-center">
                                <div className={`w-1.5 h-1.5 rounded-full bg-green-500 mr-1`}></div>
                                <span className="text-white/80">Ridges: Detected</span>
                              </div>
                              <div className="flex items-center">
                                <div className={`w-1.5 h-1.5 rounded-full bg-green-500 mr-1`}></div>
                                <span className="text-white/80">Minutiae: Detected</span>
                              </div>
                              <div className="flex items-center">
                                <div className={`w-1.5 h-1.5 rounded-full ${fingerprintConfidence > 0.9 ? 'bg-green-500' : fingerprintConfidence > 0.7 ? 'bg-yellow-500' : 'bg-red-500'} mr-1`}></div>
                                <span className="text-white/80">Confidence: {Math.round(fingerprintConfidence * 100)}%</span>
                              </div>
                              <div className="flex items-center">
                                <div className={`w-1.5 h-1.5 rounded-full bg-green-500 mr-1`}></div>
                                <span className="text-white/80">Country: {localStorage.getItem('pendingPaymentCountry') || 'US'}</span>
                              </div>
                            </div>
                          </div>
                        )
                      )}

                      {/* Payment security badge */}
                      <div className="mt-6 flex items-center justify-center">
                        <div className="bg-white/10 rounded-full px-3 py-1 flex items-center space-x-1">
                          {isIOS() ? (
                            <>
                              <FaApple size={12} className="text-white" />
                              <span className="text-xs text-white/80">Secured by Apple Pay</span>
                            </>
                          ) : (
                            <>
                              <FaGooglePlay size={12} className="text-white" />
                              <span className="text-xs text-white/80">Secured by Google Play</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {(paymentStep === 'processing' || paymentStep === 'verifying' || paymentStep === 'success') && (
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between text-sm opacity-80">
                        <span>Payment Status</span>
                        <span className="flex items-center">
                          {paymentStep === 'success' && (
                            <>
                              <svg className="w-4 h-4 mr-1 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-green-400">Completed</span>
                            </>
                          )}
                          {paymentStep === 'processing' && (
                            <>
                              <svg className="w-4 h-4 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Processing</span>
                            </>
                          )}
                          {paymentStep === 'verifying' && (
                            <>
                              <svg className="w-4 h-4 mr-1 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              <span>Verifying</span>
                            </>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm opacity-80">
                        <span>Balance After Payment</span>
                        <span className="font-medium">
                          {balanceService.formatBalance(balanceService.getUserBalance(getCurrentUserId()).balance)}
                        </span>
                      </div>
                      {paymentStep === 'success' && (
                        <div className="flex items-center justify-between text-sm opacity-80">
                          <span>View Transactions</span>
                          <button
                            onClick={() => {
                              setShowPaymentSheet(false);
                              setShowPaymentModal(false);
                              navigate('/transaction-history');
                            }}
                            className="text-blue-300 hover:text-blue-200 transition-colors"
                          >
                            History
                          </button>
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
                  {/* Payment Amount Information */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-500">Payment Amount</p>
                      <p className="text-xl font-bold text-green-600">
                        ${activePromo
                          ? getDiscountedPrice(selectedPlan === 'annual' ? prices.annual : prices.monthly).toFixed(2)
                          : (selectedPlan === 'annual' ? prices.annual : prices.monthly).toFixed(2)}
                        <span className="text-sm font-normal text-gray-500 ml-1">
                          {selectedPlan === 'annual' ? '/year' : '/month'}
                        </span>
                      </p>
                      {activePromo && (
                        <p className="text-xs text-green-600 mt-1 flex items-center">
                          <span className="line-through text-gray-400 mr-2">
                            ${selectedPlan === 'annual' ? prices.annual : prices.monthly}
                          </span>
                          {activePromo.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Method Options */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleApplePay}
                      className="w-full bg-black text-white py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-900 transition-colors active:scale-95 transform transition-transform"
                      disabled={!isIOS()}
                    >
                      <FaApple size={24} />
                      <span className="text-lg">Pay with Apple Pay</span>
                    </Button>
                    {!isIOS() && (
                      <p className="text-xs text-red-500 text-center mt-1">
                        Apple Pay is only available on iOS devices
                      </p>
                    )}
                    <p className="text-xs text-gray-500 text-center">
                      Secure payment with advanced Face ID verification
                    </p>

                    <div className="my-2 flex items-center justify-center">
                      <div className="h-px bg-gray-200 flex-grow"></div>
                      <span className="px-2 text-gray-400 text-sm">OR</span>
                      <div className="h-px bg-gray-200 flex-grow"></div>
                    </div>

                    <Button
                      onClick={handleGooglePlay}
                      className="w-full bg-white border border-gray-300 text-gray-800 py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors active:scale-95 transform transition-transform"
                      disabled={!isAndroid()}
                    >
                      <FaGooglePlay size={24} className="text-[#1a73e8]" />
                      <span className="text-lg">Pay with Google Play</span>
                    </Button>
                    {!isAndroid() && (
                      <p className="text-xs text-red-500 text-center mt-1">
                        Google Play is only available on Android devices
                      </p>
                    )}
                    <p className="text-xs text-gray-500 text-center">
                      Secure payment with fingerprint verification
                    </p>
                  </div>

                  {/* Security Information */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2 text-center">
                      Advanced Payment Security
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
                      <div className="mb-3">
                        <p className="font-medium mb-1">Apple Pay Security:</p>
                        <p className="mb-2">Apple's advanced Face ID technology:</p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Detects precise facial features (eyes, nose, mouth)</li>
                          <li>Analyzes skin texture and depth mapping</li>
                          <li>Ensures real-time identity verification</li>
                          <li>Follows Apple Pay security protocols</li>
                          <li>Processes payment only after successful verification</li>
                        </ul>
                      </div>

                      <div className="mt-3">
                        <p className="font-medium mb-1">Google Play Security:</p>
                        <p className="mb-2">Google's advanced fingerprint technology:</p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Detects precise fingerprint patterns and ridges</li>
                          <li>Analyzes unique fingerprint characteristics</li>
                          <li>Ensures real-time identity verification</li>
                          <li>Follows Google Play security protocols</li>
                          <li>Processes payment only after successful verification</li>
                          <li>Detects your country for regional payment processing</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-4 z-20 relative">
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      className="text-gray-600 py-3 px-6 hover:text-gray-800 transition-colors text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg"
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

  // Progress indicators - show for all screens with the bear (screens 2-8), but not for subscription screen (9)
  const renderProgressIndicators = () => {
    // Don't show indicators on subscription screen (screen 9)
    if (currentScreen === 9) {
      return null;
    }

    // Show indicators for screens 2-8 (all screens with the bear)
    if (currentScreen >= 2 && currentScreen <= 8) {
      return (
        <div className="flex space-x-2 absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          {[...Array(7)].map((_, index) => (
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

      {/* Face ID Authentication Dialog */}
      <FaceIDDialog
        isOpen={showFaceIDDialog}
        onClose={() => setShowFaceIDDialog(false)}
        onSuccess={handleFaceIDSuccess}
        onError={handleFaceIDError}
        title="Verify Apple Pay"
        description="Please authenticate with Face ID to complete your payment"
      />

      {/* Fingerprint Authentication Dialog */}
      <FingerprintDialog
        isOpen={showBiometricDialog}
        onClose={() => setShowBiometricDialog(false)}
        onSuccess={handleBiometricSuccess}
        onError={handleBiometricError}
        title="Verify Payment"
        description="Please authenticate with your fingerprint to complete the payment"
      />
    </div>
  );
};

export default SplashScreen;
