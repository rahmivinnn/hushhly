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
import { useAuth } from '@/hooks/useAuth';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);
  const totalScreens = 9; // Updated to include subscription screen
  const [animating, setAnimating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'verifying' | 'success'>('select');
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const { user } = useAuth();
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

  const handlePayment = async (method: 'apple' | 'google') => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      return;
    }

    // Show the payment sheet with the appropriate branding
    setShowPaymentSheet(true);
    setPaymentStep('processing');
    setProcessingPayment(true);

    try {
      // Process payment using the payment service
      const paymentResult = await paymentService.processPayment(
        selectedPlan,
        { method: method === 'apple' ? 'apple_pay' : 'google_pay' },
        activePromo?.code,
        user.id
      );

      // Second step: Verifying with biometric authentication (Face ID or fingerprint)
      setPaymentStep('verifying');

      // Simulate biometric verification
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verify the payment
      const isVerified = await paymentService.verifyPayment(paymentResult.paymentId || '');

      if (!isVerified) {
        throw new Error('Payment verification failed');
      }

      // Third step: Payment successful
      setPaymentStep('success');

      // Save subscription details
      if (paymentResult.subscriptionDetails) {
        await paymentService.saveSubscription(user.id, paymentResult.subscriptionDetails);
      }

      // After successful payment, close the payment sheet and continue
      setTimeout(() => {
        // Close payment UI and proceed
        setShowPaymentSheet(false);
        setShowPaymentModal(false);

        // Show success toast
        toast.success(`Successfully subscribed to ${selectedPlan === 'annual' ? 'annual' : 'monthly'} plan!`);

        // Continue to next screen
        handleNext();
      }, 1500);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred during payment');

      // Reset payment UI
      setShowPaymentSheet(false);
      setPaymentStep('select');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePromoCodeSubmit = async () => {
    if (!promoCode) {
      toast.error('Please enter a promo code');
      return;
    }

    if (!user) {
      toast.error('Please sign in to use promo codes');
      return;
    }

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
          className="w-64 h-auto brightness-0 invert mb-8"
        />
        <img
          src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png"
          alt="Meditation Bear"
          className="w-48 h-auto animate-pulse-subtle"
          style={{ animationDuration: '3s' }}
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
          className="w-64 h-auto mb-8"
        />
        <img
          src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png"
          alt="Meditation Bear"
          className="w-48 h-auto animate-pulse-subtle"
          style={{ animationDuration: '3s' }}
        />
      </div>
    </div>,

    // Screen 2: Subscription Screen
    <div
      key="screen-2"
      className={`min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-6 flex flex-col relative ${
        animating
          ? 'opacity-0 translate-x-20 scale-95'
          : 'opacity-100 translate-x-0 scale-100'
      } transition-all duration-500 ease-out`}
    >
      {/* Header with Logo and Exit button */}
      <div className="flex items-center mb-6">
        <div className="flex-1"></div>
        <div className="flex-grow flex justify-center">
          <img
            src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png"
            alt="Hushhly Logo"
            className="w-32 h-auto brightness-0 invert"
          />
        </div>
        <div className="flex-1 flex justify-end">
          <button
            onClick={handleNext}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            aria-label="Exit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center text-white mb-8">
        <h1 className="text-3xl font-bold mb-3">Unlock Premium Features</h1>
        <p className="text-lg opacity-90 leading-relaxed">
          Get unlimited access to all meditations, stories, and personalized content
        </p>
      </div>

      {/* Subscription Options */}
      <div className="space-y-4 flex-1">
        {/* Annual Plan */}
        <button
          onClick={() => handleSubscriptionSelect('annual')}
          className={`w-full p-6 rounded-2xl ${
            selectedPlan === 'annual'
              ? 'bg-white text-blue-600 shadow-lg transform scale-105'
              : 'bg-white/20 text-white hover:bg-white/30'
          } transition-all duration-300`}
        >
          <div className="flex justify-between items-center">
            <div className="text-left">
              <div className="font-bold text-xl mb-1">Premium {selectedPlan === 'annual' ? 'Annual' : 'Monthly'}</div>
              <div className="text-base opacity-80">
                {activePromo ? (
                  <span className="flex items-center gap-2">
                    <span className="line-through">${selectedPlan === 'annual' ? prices.annual : prices.monthly}/
                      {selectedPlan === 'annual' ? 'year' : 'month'}</span>
                    <span className="text-green-400 no-underline">
                      ${getDiscountedPrice(selectedPlan === 'annual' ? prices.annual : prices.monthly).toFixed(2)}/
                      {selectedPlan === 'annual' ? 'year' : 'month'}
                    </span>
                  </span>
                ) : (
                  <span>${selectedPlan === 'annual' ? prices.annual : prices.monthly}/
                    {selectedPlan === 'annual' ? 'year' : 'month'}</span>
                )}
              </div>
            </div>
            {selectedPlan === 'annual' && (
              <div className="text-sm font-bold px-3 py-2 bg-blue-100 text-blue-600 rounded-full">
                Best value
              </div>
            )}
          </div>
        </button>

        {/* Monthly Plan */}
        <button
          onClick={() => handleSubscriptionSelect('monthly')}
          className={`w-full p-6 rounded-2xl ${
            selectedPlan === 'monthly'
              ? 'bg-white text-blue-600 shadow-lg transform scale-105'
              : 'bg-white/20 text-white hover:bg-white/30'
          } transition-all duration-300`}
        >
          <div className="flex justify-between items-center">
            <div className="text-left">
              <div className="font-bold text-xl mb-1">Monthly</div>
              <div className="text-base opacity-80">$7.99/month</div>
              <div className="text-sm mt-2 opacity-90">Flexible monthly billing</div>
            </div>
          </div>
        </button>

        {/* Features List */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center text-white">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mr-3">✓</div>
            <span>Unlimited access to all meditations</span>
          </div>
          <div className="flex items-center text-white">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mr-3">✓</div>
            <span>Personalized meditation plans</span>
          </div>
          <div className="flex items-center text-white">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mr-3">✓</div>
            <span>Offline downloads</span>
          </div>
        </div>

        {/* Promo Code Section */}
        <div className="mt-6 space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="bg-white/20 text-white placeholder:text-white/60"
              disabled={isApplyingPromo}
            />
            <Button
              onClick={handlePromoCodeSubmit}
              variant="secondary"
              className="whitespace-nowrap"
              disabled={isApplyingPromo}
            >
              {isApplyingPromo ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying
                </span>
              ) : 'Apply Code'}
            </Button>
          </div>
          {activePromo && (
            <div className="text-white bg-white/20 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{activePromo.code}</p>
                  <p className="text-sm opacity-80">{activePromo.description}</p>
                  <p className="text-xs text-green-400 mt-1">
                    {getFormattedDiscountText(selectedPlan === 'annual' ? prices.annual : prices.monthly)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="text-white hover:text-white/80"
                  onClick={removePromoCode}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-4">
        <Button
          onClick={handleContinue}
          className="w-full bg-white text-blue-600 hover:bg-blue-50 py-6 text-lg font-semibold rounded-xl shadow-lg transform transition hover:scale-105"
        >
          Continue
        </Button>
        <div className="text-center">
          <p className="text-white/80 text-sm">Cancel anytime · Money back guarantee</p>
        </div>
      </div>

      {/* Payment Modal */}
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
                      <div className="flex items-center justify-center mb-4">
                        <div className="animate-pulse w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                          {/* Face ID or Fingerprint icon based on payment method */}
                          {/* Face ID icon */}
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 9h.01M9 9h.01" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-lg font-medium">Verifying with Face ID...</p>
                      <p className="text-sm text-white/70 mt-2">Please authenticate to complete your purchase</p>
                    </div>
                  )}

                  {paymentStep === 'success' && (
                    <div className="text-center py-8">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-lg font-medium">Payment Successful!</p>
                      <p className="text-sm text-white/70 mt-2">
                        Your {selectedPlan === 'annual' ? 'annual' : 'monthly'} subscription is now active
                      </p>
                      <div className="mt-4 bg-white/10 p-3 rounded-lg">
                        <p className="text-sm text-white/90">
                          Next billing date: {new Date(new Date().setMonth(new Date().getMonth() + (selectedPlan === 'annual' ? 12 : 1))).toLocaleDateString()}
                        </p>
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
                  <Button
                    onClick={() => handlePayment('apple')}
                    className="w-full bg-black text-white py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-900 transition-colors"
                  >
                    <FaApple size={24} />
                    <span>Pay with Apple Pay</span>
                  </Button>
                  <Button
                    onClick={() => handlePayment('google')}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
                  >
                    <FcGoogle size={24} />
                    <span>Pay with Google Pay</span>
                  </Button>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
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
