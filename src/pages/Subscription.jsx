import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Star, Crown } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

const Subscription = () => {
  const navigate = useNavigate();

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };

  // Handle subscription purchase
  const handleSubscribe = (plan) => {
    // In a real app, this would handle payment processing
    alert(`Thank you for choosing the ${plan} plan! This would normally redirect to payment processing.`);
    navigate('/stories');
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
    </div>
  );
};

export default Subscription;
