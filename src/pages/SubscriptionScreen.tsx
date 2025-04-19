import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { paymentService, PaymentMethod, SubscriptionPlan } from '@/services/paymentService';
import { usePromoCode } from '@/hooks/usePromoCode';
import { X, ArrowLeft, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SubscriptionScreen: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('annual');
  const [promoCode, setPromoCode] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'verifying' | 'success'>('select');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { applyPromoCode, removePromoCode, activePromo, calculateDiscountedPrice } = usePromoCode();

  const prices = {
    annual: 59.99,
    monthly: 7.99
  };

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      // Redirect to sign in if not logged in
      toast({
        title: "Please sign in",
        description: "You need to sign in before subscribing"
      });
      navigate('/sign-in');
    }
  }, []);

  const handleSubscribe = () => {
    setShowPaymentModal(true);
  };

  const handlePayment = async (method: PaymentMethod) => {
    setProcessingPayment(true);
    setPaymentStep('processing');

    try {
      // Get user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('User not found');
      }

      const user = JSON.parse(userData);

      // Process payment - add a small delay to simulate initial processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const paymentResult = await paymentService.processPayment(
        selectedPlan,
        { method },
        activePromo?.code
      );

      if (paymentResult.success && paymentResult.subscriptionDetails) {
        setPaymentStep('verifying');

        // Verify payment
        const isVerified = await paymentService.verifyPayment(paymentResult.paymentId || '');

        if (isVerified) {
          // Save subscription to user profile
          const saved = paymentService.saveSubscription(
            user.email,
            paymentResult.subscriptionDetails
          );

          if (saved) {
            // Add a small delay before showing success to make it feel more realistic
            await new Promise(resolve => setTimeout(resolve, 1000));

            setPaymentStep('success');
            setPaymentSuccess(true);

            // Show success message and redirect after a delay
            setTimeout(() => {
              setShowPaymentModal(false);
              toast({
                title: "Subscription Activated",
                description: `Your ${selectedPlan} subscription has been activated successfully!`
              });
              navigate('/home');
            }, 3000);
          } else {
            throw new Error('Failed to save subscription');
          }
        } else {
          throw new Error('Payment verification failed. Please try again or contact support.');
        }
      } else {
        throw new Error(paymentResult.error || 'Payment failed. Please try again later.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An error occurred during payment processing",
        variant: "destructive"
      });
      setProcessingPayment(false);
      setPaymentStep('select');
    }
  };

  const handlePromoCodeSubmit = () => {
    if (!promoCode) {
      toast({
        title: "Missing Code",
        description: "Please enter a promo code",
        variant: "destructive"
      });
      return;
    }

    // Convert promo code to uppercase to ensure case-insensitive matching
    const normalizedCode = promoCode.trim().toUpperCase();
    const result = applyPromoCode(normalizedCode, selectedPlan === 'annual' ? 'Annual' : 'Monthly');

    if (result.isValid) {
      toast({
        title: "Promo Code Applied",
        description: result.message
      });
      // Clear the input field after successful application
      setPromoCode('');
    } else {
      toast({
        title: "Invalid Code",
        description: result.message,
        variant: "destructive"
      });
    }
  };

  const getDiscountedPrice = (originalPrice: number) => {
    return calculateDiscountedPrice(originalPrice);
  };

  const handleExit = () => {
    navigate('/home');
    toast({
      title: "Subscription Skipped",
      description: "You can subscribe anytime from your profile."
    });
  };

  const [showInfoTooltip, setShowInfoTooltip] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-6 flex flex-col relative">
      {/* Exit Button */}
      <motion.button
        className="absolute top-4 left-4 bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-colors z-10"
        onClick={handleExit}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X size={24} />
      </motion.button>

      {/* Back Button */}
      <motion.button
        className="absolute top-4 right-4 bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-colors z-10"
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowLeft size={24} />
      </motion.button>

      {/* Header */}
      <motion.div
        className="text-center text-white mb-8 mt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-2">Experience Hushhly for Free</h1>
        <p className="text-lg opacity-90">
          Discover new daily meditations and soothing bedtime stories tailored to your journey.
        </p>
      </motion.div>

      {/* Subscription Options */}
      <div className="space-y-4 flex-1">
        {/* Annual Plan */}
        <motion.button
          onClick={() => setSelectedPlan('annual')}
          className={`w-full p-4 rounded-xl ${
            selectedPlan === 'annual'
              ? 'bg-white text-blue-600'
              : 'bg-white/20 text-white'
          } transition-all duration-200 relative overflow-hidden`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedPlan === 'annual' && (
            <motion.div
              className="absolute inset-0 bg-white"
              layoutId="selectedPlan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ zIndex: -1 }}
            />
          )}
          <div className="flex justify-between items-center">
            <div className="text-left">
              <div className="font-bold text-lg">Premium Annual</div>
              <div className="text-sm opacity-80">$59.99/year</div>
              {activePromo && selectedPlan === 'annual' && (
                <div className="text-xs text-green-600 mt-1 font-medium">
                  {getDiscountedPrice(prices.annual).toFixed(2)} with discount
                </div>
              )}
            </div>
            {selectedPlan === 'annual' && (
              <motion.div
                className="text-sm font-bold px-2 py-1 bg-blue-100 text-blue-600 rounded flex items-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <Check size={14} className="mr-1" />
                Best value
              </motion.div>
            )}
          </div>
        </motion.button>

        {/* Monthly Plan */}
        <motion.button
          onClick={() => setSelectedPlan('monthly')}
          className={`w-full p-4 rounded-xl ${
            selectedPlan === 'monthly'
              ? 'bg-white text-blue-600'
              : 'bg-white/20 text-white'
          } transition-all duration-200 relative overflow-hidden`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {selectedPlan === 'monthly' && (
            <motion.div
              className="absolute inset-0 bg-white"
              layoutId="selectedPlan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ zIndex: -1 }}
            />
          )}
          <div className="flex justify-between items-center">
            <div className="text-left">
              <div className="font-bold text-lg">Monthly</div>
              <div className="text-sm opacity-80">$7.99/month</div>
              {activePromo && selectedPlan === 'monthly' && (
                <div className="text-xs text-green-600 mt-1 font-medium">
                  {getDiscountedPrice(prices.monthly).toFixed(2)} with discount
                </div>
              )}
            </div>
            {selectedPlan === 'monthly' && (
              <motion.div
                className="text-sm font-bold px-2 py-1 bg-blue-100 text-blue-600 rounded flex items-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <Check size={14} className="mr-1" />
                Selected
              </motion.div>
            )}
          </div>
        </motion.button>

        {/* Promo Code Section */}
        <motion.div
          className="mt-6 p-4 rounded-xl bg-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center text-white text-left mb-2">
            <span>Have a code?</span>
            <motion.button
              className="ml-2 text-white/70 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowInfoTooltip(!showInfoTooltip)}
            >
              <Info size={14} />
            </motion.button>

            {/* Info Tooltip */}
            <AnimatePresence>
              {showInfoTooltip && (
                <motion.div
                  className="absolute bg-white text-blue-600 p-2 rounded-lg shadow-lg text-xs max-w-[200px] z-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  Enter a valid promo code to get a discount on your subscription.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 p-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-white"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={handlePromoCodeSubmit}
              >
                Redeem
              </Button>
            </motion.div>
          </div>

          <AnimatePresence>
            {activePromo && (
              <motion.div
                className="mt-2 text-white text-sm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs mr-2 inline-flex items-center">
                  <Check size={12} className="mr-1" />
                  Applied
                </span>
                {activePromo.discount}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-4">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Button
            onClick={handleSubscribe}
            className="w-full bg-white text-blue-600 hover:bg-blue-50 py-6 text-lg font-semibold rounded-xl shadow-lg"
          >
            Subscribe Now
          </Button>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <p className="text-white/80 text-sm">Cancel anytime</p>
        </motion.div>

        <motion.button
          onClick={handleExit}
          className="w-full text-white/70 hover:text-white py-2 text-sm font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          Skip for now
        </motion.button>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-4 w-11/12 max-w-sm max-h-[85vh] overflow-y-auto relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Close button for payment modal */}
              {!processingPayment && !paymentSuccess && (
                <motion.button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
                  onClick={() => setShowPaymentModal(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              )}
            {paymentSuccess ? (
              <div className="p-4 text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 className="text-lg font-bold mb-1">Payment Successful!</h3>
                <p className="text-gray-600 mb-3 text-sm">Welcome to Hushhly Premium.</p>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg text-white text-center">
                  <p className="font-medium text-sm">Premium features unlocked!</p>
                </div>
              </div>
            ) : processingPayment ? (
              <div className="relative">
                {/* Payment Processing UI */}
                <div className="bg-black text-white p-4 rounded-2xl w-full">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-base font-medium">
                      {selectedPlan === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
                    </div>
                    <div className="text-base font-medium">
                      ${selectedPlan === 'annual' ?
                        (activePromo ? getDiscountedPrice(prices.annual) : prices.annual).toFixed(2) :
                        (activePromo ? getDiscountedPrice(prices.monthly) : prices.monthly).toFixed(2)}
                      {activePromo && (
                        <div className="text-xs text-green-400 mt-0.5">
                          {activePromo.discount}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment method indicator */}
                  <div className="mb-4 flex items-center">
                    <div className="bg-white/10 px-3 py-1 rounded-full text-sm flex items-center">
                      {paymentStep === 'processing' && (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing payment...
                        </>
                      )}
                      {paymentStep === 'verifying' && (
                        <>
                          <svg className="animate-pulse -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Verifying payment...
                        </>
                      )}
                      {paymentStep === 'success' && (
                        <>
                          <svg className="-ml-1 mr-2 h-4 w-4 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Payment successful!
                        </>
                      )}
                    </div>
                  </div>

                  {paymentStep === 'processing' && (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-10 w-10 border-2 border-white border-t-transparent mx-auto mb-3"></div>
                      <p className="text-base">Processing payment...</p>
                      <p className="text-xs text-gray-400 mt-1">Please don't close this window.</p>
                    </div>
                  )}

                  {paymentStep === 'verifying' && (
                    <div className="text-center py-4">
                      <div className="flex items-center justify-center mb-3">
                        <div className="animate-pulse w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-base">Verifying payment...</p>
                      <p className="text-xs text-gray-400 mt-1">Confirming with payment provider.</p>
                    </div>
                  )}

                  {paymentStep === 'success' && (
                    <div className="text-center py-4">
                      <div className="flex items-center justify-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-base">Payment Successful!</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Payment Amount</h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    {selectedPlan === 'annual' ?
                      `$${(activePromo ? getDiscountedPrice(prices.annual) : prices.annual).toFixed(2)}/year` :
                      `$${(activePromo ? getDiscountedPrice(prices.monthly) : prices.monthly).toFixed(2)}/month`}
                    {activePromo && (
                      <span className="ml-2 text-green-500 text-xs">
                        ({activePromo.discount})
                      </span>
                    )}
                  </p>
                </div>
                <div className="space-y-4">
                  <Button
                    onClick={() => handlePayment('apple_pay')}
                    className="w-full bg-black text-white py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-900 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.92 12.29 4.24 17 6 19.47c.8 1.21 1.8 2.58 3.12 2.53s1.75-.82 3.28-.82 2 .82 3.3.79 2.22-1.23 3.06-2.45a11 11 0 0 0 1.38-2.85 4.41 4.41 0 0 1-2.68-4.04z"></path></svg>
                    <span className="text-sm">Pay with Apple Pay</span>
                  </Button>
                  <Button
                    onClick={() => handlePayment('google_pay')}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 24c6.624 0 12-5.376 12-12s-5.376-12-12-12-12 5.376-12 12 5.376 12 12 12zm0-22.5c5.799 0 10.5 4.701 10.5 10.5s-4.701 10.5-10.5 10.5-10.5-4.701-10.5-10.5 4.701-10.5 10.5-10.5z"/><path d="M15.75 12c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-1.5 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-1.5 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-1.5 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75z"/></svg>
                    <span className="text-sm">Pay with Google Play</span>
                  </Button>
                  <Button
                    onClick={() => handlePayment('credit_card')}
                    className="w-full bg-gray-800 text-white py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                    <span className="text-sm">Pay with Credit Card</span>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionScreen;