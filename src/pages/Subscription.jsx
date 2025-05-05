import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Star, Crown, CreditCard } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import ResponsiveDialog from '@/components/ResponsiveDialog';

const Subscription = () => {
  const navigate = useNavigate();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [paymentStep, setPaymentStep] = useState(1);

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };

  // Handle subscription purchase
  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setPaymentStep(1);
    setIsPaymentOpen(true);
  };

  // Handle payment submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (paymentStep === 1) {
      setPaymentStep(2);
    } else {
      // In a real app, this would process the payment
      setIsPaymentOpen(false);
      setTimeout(() => {
        navigate('/stories');
      }, 500);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-600 to-purple-700">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-6 pb-4 bg-transparent">
        <button onClick={handleBack} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <div className="text-white text-xl font-semibold">Premium Subscription</div>
        <div className="w-6"></div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center mb-6">
          <Crown size={48} className="text-white" />
        </div>

        <h1 className="text-white text-2xl font-bold mb-2 text-center">Unlock Premium Stories</h1>
        <p className="text-gray-200 text-center mb-8">
          Get unlimited access to our entire library of premium sleep stories and meditations.
        </p>

        {/* Subscription Plans */}
        <div className="w-full max-w-md space-y-4 mb-8">
          {/* Monthly Plan */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white text-lg font-semibold">Monthly</h3>
                <p className="text-gray-200 text-sm">Billed monthly</p>
              </div>
              <div className="text-right">
                <div className="text-white text-xl font-bold">$9.99</div>
                <div className="text-gray-200 text-xs">per month</div>
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-gray-200 text-sm">
                <Check size={16} className="text-green-400 mr-2" />
                Access to all premium stories
              </li>
              <li className="flex items-center text-gray-200 text-sm">
                <Check size={16} className="text-green-400 mr-2" />
                New stories added weekly
              </li>
              <li className="flex items-center text-gray-200 text-sm">
                <Check size={16} className="text-green-400 mr-2" />
                Cancel anytime
              </li>
            </ul>
            <button
              className="w-full py-3 bg-white text-indigo-700 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              onClick={() => handleSubscribe('Monthly')}
            >
              Subscribe Monthly
            </button>
          </div>

          {/* Annual Plan */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 border border-white/30 relative">
            <div className="absolute -top-3 right-4 bg-yellow-400 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full">
              BEST VALUE
            </div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white text-lg font-semibold">Annual</h3>
                <p className="text-gray-200 text-sm">Billed annually</p>
              </div>
              <div className="text-right">
                <div className="text-white text-xl font-bold">$79.99</div>
                <div className="text-gray-200 text-xs">$6.67/month</div>
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-gray-200 text-sm">
                <Check size={16} className="text-green-400 mr-2" />
                Access to all premium stories
              </li>
              <li className="flex items-center text-gray-200 text-sm">
                <Check size={16} className="text-green-400 mr-2" />
                New stories added weekly
              </li>
              <li className="flex items-center text-gray-200 text-sm">
                <Check size={16} className="text-green-400 mr-2" />
                Save 33% compared to monthly
              </li>
              <li className="flex items-center text-gray-200 text-sm">
                <Check size={16} className="text-green-400 mr-2" />
                Cancel anytime
              </li>
            </ul>
            <button
              className="w-full py-3 bg-yellow-400 text-indigo-900 rounded-full font-semibold hover:bg-yellow-300 transition-colors"
              onClick={() => handleSubscribe('Annual')}
            >
              Subscribe Annually
            </button>
          </div>
        </div>

        <p className="text-gray-300 text-xs text-center max-w-xs">
          By subscribing, you agree to our Terms of Service and Privacy Policy. Subscriptions automatically renew unless auto-renew is turned off.
        </p>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Payment Dialog */}
      <ResponsiveDialog
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        title={paymentStep === 1 ? "Payment Details" : "Confirm Payment"}
        type="payment"
      >
        <div className="payment-form">
          {paymentStep === 1 ? (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-2">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold">
                  {selectedPlan === 'Monthly' ? '$9.99/month' : '$79.99/year'}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedPlan} Subscription
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors"
              >
                Continue
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">Confirm Your Purchase</h3>
                <p className="text-sm text-gray-500">
                  {selectedPlan} Subscription
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium">{selectedPlan}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium">
                    {selectedPlan === 'Monthly' ? '$9.99' : '$79.99'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-800 font-medium">Total</span>
                  <span className="font-bold">
                    {selectedPlan === 'Monthly' ? '$9.99' : '$79.99'}
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                By confirming, you agree to our Terms of Service and Privacy Policy.
                Your subscription will automatically renew unless canceled.
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setPaymentStep(1)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </ResponsiveDialog>
    </div>
  );
};

export default Subscription;
