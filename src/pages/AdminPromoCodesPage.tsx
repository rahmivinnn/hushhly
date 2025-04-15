import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { promoCodeService } from '@/services/promoCodeService';
import { PromoCode, SubscriptionTier, DiscountType, DurationType } from '@/types/promoCode';
import { toast } from 'sonner';
import { useAuthSimple } from '@/hooks/useAuthSimple';

const AdminPromoCodesPage: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const { user } = useAuthSimple();

  // New promo code form state
  const [newPromoCode, setNewPromoCode] = useState<{
    code: string;
    description: string;
    discount: string;
    subscriptionTiers: SubscriptionTier[];
    discountType: DiscountType;
    discountValue: number;
    duration: DurationType;
    durationValue?: number;
    maxUses?: number;
    startDate?: string;
    endDate?: string;
    userType?: string;
    userTag?: string;
    userAction?: string;
  }>({
    code: '',
    description: '',
    discount: '',
    subscriptionTiers: ['Any'],
    discountType: 'percentage',
    discountValue: 0,
    duration: 'one-time',
  });

  // Load promo codes
  useEffect(() => {
    const loadPromoCodes = async () => {
      try {
        setLoading(true);
        const codes = await promoCodeService.getAllPromoCodes();
        setPromoCodes(codes);
      } catch (error) {
        console.error('Error loading promo codes:', error);
        toast.error('Failed to load promo codes');
      } finally {
        setLoading(false);
      }
    };

    loadPromoCodes();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPromoCode(prev => ({ ...prev, [name]: value }));
  };

  // Handle subscription tier selection
  const handleTierChange = (tier: SubscriptionTier) => {
    setNewPromoCode(prev => {
      const tiers = [...prev.subscriptionTiers];
      const index = tiers.indexOf(tier);

      if (index === -1) {
        tiers.push(tier);
      } else {
        tiers.splice(index, 1);
      }

      return { ...prev, subscriptionTiers: tiers };
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to add promo codes');
      return;
    }

    try {
      // Prepare conditions array
      const conditions = [];

      if (newPromoCode.maxUses) {
        conditions.push({ type: 'maxUses', value: newPromoCode.maxUses });
      }

      if (newPromoCode.startDate && newPromoCode.endDate) {
        conditions.push({
          type: 'dateRange',
          value: {
            startDate: new Date(newPromoCode.startDate),
            endDate: new Date(newPromoCode.endDate)
          }
        });
      }

      if (newPromoCode.userType) {
        conditions.push({ type: 'userType', value: newPromoCode.userType });
      }

      if (newPromoCode.userTag) {
        conditions.push({ type: 'userTag', value: newPromoCode.userTag });
      }

      if (newPromoCode.userAction) {
        conditions.push({ type: 'userAction', value: newPromoCode.userAction });
      }

      // Create promo code object
      const promoCode: Partial<PromoCode> = {
        code: newPromoCode.code.toUpperCase(),
        description: newPromoCode.description,
        discount: newPromoCode.discount,
        subscriptionTiers: newPromoCode.subscriptionTiers,
        isActive: true,
        discountType: newPromoCode.discountType,
        discountValue: Number(newPromoCode.discountValue),
        duration: newPromoCode.duration,
        durationValue: newPromoCode.durationValue ? Number(newPromoCode.durationValue) : undefined,
        conditions,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // In a real implementation, this would call an API to create the promo code
      // For now, we'll just add it to the local state
      setPromoCodes(prev => [...prev, { id: `promo_${Date.now()}`, ...promoCode } as PromoCode]);

      // Reset form
      setNewPromoCode({
        code: '',
        description: '',
        discount: '',
        subscriptionTiers: ['Any'],
        discountType: 'percentage',
        discountValue: 0,
        duration: 'one-time',
      });

      setShowAddForm(false);
      toast.success('Promo code added successfully');
    } catch (error) {
      console.error('Error adding promo code:', error);
      toast.error('Failed to add promo code');
    }
  };

  // Toggle promo code active status
  const togglePromoCodeStatus = (id: string, isActive: boolean) => {
    setPromoCodes(prev =>
      prev.map(code =>
        code.id === id ? { ...code, isActive: !isActive } : code
      )
    );

    toast.success(`Promo code ${isActive ? 'deactivated' : 'activated'}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Promo Codes Management</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Promo Code'}
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Promo Code</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Code</label>
                <Input
                  name="code"
                  value={newPromoCode.code}
                  onChange={handleInputChange}
                  placeholder="e.g. SUMMER2025"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  name="description"
                  value={newPromoCode.description}
                  onChange={handleInputChange}
                  placeholder="e.g. Summer Sale 2025"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Discount Display Text</label>
                <Input
                  name="discount"
                  value={newPromoCode.discount}
                  onChange={handleInputChange}
                  placeholder="e.g. 25% off for 3 months"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Discount Type</label>
                <select
                  name="discountType"
                  value={newPromoCode.discountType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="free">Free</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Discount Value</label>
                <Input
                  name="discountValue"
                  type="number"
                  value={newPromoCode.discountValue}
                  onChange={handleInputChange}
                  placeholder="e.g. 25 (for 25%)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <select
                  name="duration"
                  value={newPromoCode.duration}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="one-time">One-time</option>
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                  <option value="lifetime">Lifetime</option>
                </select>
              </div>

              {(newPromoCode.duration === 'days' || newPromoCode.duration === 'months') && (
                <div>
                  <label className="block text-sm font-medium mb-1">Duration Value</label>
                  <Input
                    name="durationValue"
                    type="number"
                    value={newPromoCode.durationValue || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. 3 (for 3 months)"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Max Uses</label>
                <Input
                  name="maxUses"
                  type="number"
                  value={newPromoCode.maxUses || ''}
                  onChange={handleInputChange}
                  placeholder="Leave empty for unlimited"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valid From</label>
                <Input
                  name="startDate"
                  type="date"
                  value={newPromoCode.startDate || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valid Until</label>
                <Input
                  name="endDate"
                  type="date"
                  value={newPromoCode.endDate || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">User Type</label>
                <select
                  name="userType"
                  value={newPromoCode.userType || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Any</option>
                  <option value="new">New Users</option>
                  <option value="existing">Existing Users</option>
                  <option value="inactive">Inactive Users</option>
                  <option value="beta">Beta Users</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">User Tag</label>
                <Input
                  name="userTag"
                  value={newPromoCode.userTag || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. parent, new_mom, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">User Action</label>
                <select
                  name="userAction"
                  value={newPromoCode.userAction || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">None</option>
                  <option value="referral">Referral</option>
                  <option value="cancellation">Cancellation</option>
                  <option value="paired_signup">Paired Signup</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Applicable Plans</label>
              <div className="flex flex-wrap gap-2">
                {(['Any', 'Monthly', 'Annual', 'Family Plan', 'Sleep Plan', 'Premium'] as SubscriptionTier[]).map(tier => (
                  <label key={tier} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={newPromoCode.subscriptionTiers.includes(tier)}
                      onChange={() => handleTierChange(tier)}
                      className="mr-1"
                    />
                    {tier}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Add Promo Code
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading promo codes...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plans</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promoCodes.map(code => (
                <tr key={code.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{code.code}</td>
                  <td className="px-6 py-4">{code.description}</td>
                  <td className="px-6 py-4">{code.discount}</td>
                  <td className="px-6 py-4">{code.subscriptionTiers.join(', ')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${code.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {code.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="ghost"
                      className={code.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
                      onClick={() => togglePromoCodeStatus(code.id, code.isActive)}
                    >
                      {code.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
              {promoCodes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No promo codes found. Add your first promo code!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPromoCodesPage;
