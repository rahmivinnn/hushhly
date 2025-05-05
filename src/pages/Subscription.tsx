import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from '@/components/BottomNavigation';

const Subscription: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSelectPlan = (plan: 'monthly' | 'yearly') => {
    setSelectedPlan(plan);
  };

  const handleSubscribe = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      // Save subscription status to localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          user.isPremium = true;
          user.subscription = {
            plan: selectedPlan,
            startDate: new Date().toISOString(),
            endDate: selectedPlan === 'monthly' 
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            autoRenew: true
          };
          localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
          console.error('Error saving subscription:', error);
        }
      }

      // Show success message and redirect after a delay
      setTimeout(() => {
        toast({
          title: "Subscription Successful",
          description: "Welcome to Hushhly Premium! Enjoy all premium content.",
        });
        navigate('/sleep-stories');
      }, 2000);
    }, 2000);
  };

  const features = [
    "Access to 100+ premium sleep stories",
    "Exclusive meditation content",
    "Ad-free experience",
    "Offline listening",
    "Personalized recommendations",
    "Priority customer support"
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 flex items-center justify-between">
        <button onClick={handleBack} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white">Premium Subscription</h1>
        <div className="w-6"></div> {/* For balance */}
      </header>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-20">
        {paymentSuccess ? (
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for subscribing to Hushhly Premium. You now have access to all premium features.
            </p>
            <div className="animate-pulse text-sm text-gray-500">
              Redirecting you back...
            </div>
          </div>
        ) : (
          <>
            {/* Subscription Plans */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-6">
              <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <h2 className="text-xl font-bold">Choose Your Plan</h2>
                <p className="text-sm opacity-90">Unlock all premium features</p>
              </div>

              <div className="p-4">
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => handleSelectPlan('monthly')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      selectedPlan === 'monthly'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800">Monthly</h3>
                        <p className="text-sm text-gray-500">Billed monthly</p>
                      </div>
                      {selectedPlan === 'monthly' && (
                        <div className="bg-indigo-500 text-white p-1 rounded-full">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-indigo-600">$7.99<span className="text-sm font-normal text-gray-500">/month</span></div>
                  </button>

                  <button
                    onClick={() => handleSelectPlan('yearly')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      selectedPlan === 'yearly'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800">Yearly</h3>
                        <p className="text-sm text-gray-500">Billed annually</p>
                      </div>
                      {selectedPlan === 'yearly' && (
                        <div className="bg-indigo-500 text-white p-1 rounded-full">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-indigo-600">
                      $59.99<span className="text-sm font-normal text-gray-500">/year</span>
                    </div>
                    <div className="mt-1 bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full inline-block">
                      Save 37%
                    </div>
                  </button>
                </div>

                <button
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                  className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full py-3 font-medium flex items-center justify-center ${
                    isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} className="mr-2" />
                      Subscribe Now
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
              <h3 className="font-bold text-gray-800 mb-4">Premium Features</h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-indigo-100 text-indigo-600 p-1 rounded-full mr-3 mt-0.5">
                      <Check size={14} />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Terms */}
            <div className="text-center text-white text-xs opacity-80 px-6">
              By subscribing, you agree to our Terms of Service and Privacy Policy. You can cancel your subscription anytime from your profile.
            </div>
          </>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Subscription;
