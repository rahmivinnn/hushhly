import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Calendar, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { paymentService, SubscriptionDetails, PaymentMethod } from '@/services/paymentService';

const SubscriptionManagement: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    // Load subscription details
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const subDetails = paymentService.getSubscriptionDetails(user.email);
        setSubscriptionDetails(subDetails);

        // If no subscription, redirect to subscription page
        if (!subDetails) {
          toast({
            title: "No Subscription Found",
            description: "You don't have an active subscription. Let's get you started!",
          });
          navigate('/subscription');
        }
      } catch (error) {
        console.error('Error loading subscription details:', error);
        toast({
          title: "Error",
          description: "Failed to load subscription details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    } else {
      // No user found, redirect to sign in
      toast({
        title: "Please Sign In",
        description: "You need to sign in to manage your subscription",
      });
      navigate('/sign-in');
    }
  }, []);

  const handleCancelSubscription = async () => {
    setProcessingAction(true);
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('User not found');
      }

      const user = JSON.parse(userData);
      const canceled = await paymentService.cancelSubscription(user.email);

      if (canceled) {
        // Update subscription details
        const subDetails = paymentService.getSubscriptionDetails(user.email);
        setSubscriptionDetails(subDetails);
        setShowCancelModal(false);

        toast({
          title: "Subscription Canceled",
          description: "Your subscription has been canceled. You'll still have access until the end of your billing period."
        });
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while canceling your subscription",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleUpgradeSubscription = async () => {
    setProcessingAction(true);
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('User not found');
      }

      const user = JSON.parse(userData);

      // Process payment for annual plan
      const paymentResult = await paymentService.processPayment(
        'annual',
        { method: 'credit_card' }
      );

      if (paymentResult.success && paymentResult.subscriptionDetails) {
        // Verify payment
        const isVerified = await paymentService.verifyPayment(paymentResult.paymentId || '');

        if (isVerified) {
          // Save subscription to user profile
          const saved = paymentService.saveSubscription(
            user.email,
            paymentResult.subscriptionDetails
          );

          if (saved) {
            // Update subscription details
            const subDetails = paymentService.getSubscriptionDetails(user.email);
            setSubscriptionDetails(subDetails);
            setShowUpgradeModal(false);

            toast({
              title: "Subscription Upgraded",
              description: "Your subscription has been upgraded to the annual plan."
            });
          } else {
            throw new Error('Failed to save subscription');
          }
        } else {
          throw new Error('Payment verification failed');
        }
      } else {
        throw new Error(paymentResult.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while upgrading your subscription",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading subscription details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white py-3 px-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={() => navigate('/profile')} className="text-gray-600">
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center">
          <img
            src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png"
            alt="Shh"
            className="h-6" style={{ filter: 'invert(30%) sepia(36%) saturate(1137%) hue-rotate(210deg) brightness(94%) contrast(85%)' }}
          />
        </div>

        <div className="w-5"></div> {/* Empty div for spacing */}
      </div>

      {/* Title */}
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold">Subscription Management</h1>
        <p className="text-gray-600">Manage your premium subscription</p>
      </div>

      {/* Subscription Details */}
      {subscriptionDetails && (
        <div className="px-6">
          {/* Current Plan */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white mb-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold mb-1">
                  {subscriptionDetails.plan === 'annual' ? 'Annual' : 'Monthly'} Plan
                </h3>
                <p className="opacity-90">
                  {subscriptionDetails.plan === 'annual'
                    ? '$59.99 per year'
                    : '$7.99 per month'}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                subscriptionDetails.status === 'active'
                  ? 'bg-green-500/20 text-white'
                  : 'bg-yellow-500/20 text-white'
              }`}>
                {subscriptionDetails.status === 'active' ? 'Active' : 'Canceled'}
              </div>
            </div>

            {subscriptionDetails.status === 'canceled' && (
              <div className="bg-white/20 p-3 rounded-lg mb-4 flex items-start">
                <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  Your subscription has been canceled but will remain active until the end of the current billing period.
                </p>
              </div>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <span className="font-medium">
                  {subscriptionDetails.status === 'active' ? 'Active' : 'Canceled'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Start Date:</span>
                <span className="font-medium">{formatDate(subscriptionDetails.startDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Next Billing Date:</span>
                <span className="font-medium">{formatDate(subscriptionDetails.endDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Auto-Renew:</span>
                <span className="font-medium">
                  {subscriptionDetails.autoRenew ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            {subscriptionDetails.status === 'active' && (
              <div className="flex space-x-2">
                {subscriptionDetails.plan === 'monthly' && (
                  <Button
                    onClick={() => setShowUpgradeModal(true)}
                    className="flex-1 bg-white text-blue-600 hover:bg-blue-50"
                  >
                    <RefreshCw size={16} className="mr-1" />
                    Upgrade to Annual
                  </Button>
                )}
                <Button
                  onClick={() => setShowCancelModal(true)}
                  className="flex-1 bg-white/20 text-white hover:bg-white/30"
                  variant="outline"
                >
                  Cancel Subscription
                </Button>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <h3 className="text-lg font-bold mb-3 flex items-center">
              <CreditCard size={18} className="mr-2" />
              Payment Method
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-6 bg-gray-800 rounded mr-3"></div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-xs text-gray-500">Expires 12/25</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Change
              </Button>
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <h3 className="text-lg font-bold mb-3 flex items-center">
              <Calendar size={18} className="mr-2" />
              Billing History
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">
                    {subscriptionDetails.plan === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(subscriptionDetails.startDate)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {subscriptionDetails.plan === 'annual' ? '$59.99' : '$7.99'}
                  </p>
                  <p className="text-xs text-green-500 flex items-center">
                    <CheckCircle size={12} className="mr-1" />
                    Paid
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Cancel Subscription</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel your subscription? You'll still have access to premium features until the end of your current billing period.
              </p>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1"
                  variant="outline"
                  disabled={processingAction}
                >
                  Keep Subscription
                </Button>
                <Button
                  onClick={handleCancelSubscription}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  disabled={processingAction}
                >
                  {processingAction ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Yes, Cancel'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Subscription Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Upgrade to Annual Plan</h3>
              <p className="text-gray-600 mb-4">
                Upgrade to our annual plan and save 37% compared to the monthly plan.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Monthly Plan</span>
                  <span>$7.99/month</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Annual Cost</span>
                  <span>$95.88/year</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-blue-100">
                  <span className="font-medium">Annual Plan</span>
                  <span className="font-bold text-blue-600">$59.99/year</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-medium">You Save</span>
                  <span className="font-bold text-green-600">$35.89</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1"
                  variant="outline"
                  disabled={processingAction}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpgradeSubscription}
                  className="flex-1"
                  disabled={processingAction}
                >
                  {processingAction ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Upgrade Now'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
