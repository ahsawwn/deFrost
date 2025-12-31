'use client';

import { useState } from 'react';
import { Ticket, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export default function CouponsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Mock coupons data - replace with actual API call
  const coupons = [
    {
      id: '1',
      code: 'WELCOME20',
      discount: 20,
      type: 'percentage',
      description: 'Get 20% off on your first order',
      minPurchase: 1000,
      validUntil: '2024-12-31',
      status: 'active',
    },
    {
      id: '2',
      code: 'SAVE500',
      discount: 500,
      type: 'fixed',
      description: 'Save ₹500 on orders above ₹3000',
      minPurchase: 3000,
      validUntil: '2024-06-30',
      status: 'active',
    },
    {
      id: '3',
      code: 'SUMMER15',
      discount: 15,
      type: 'percentage',
      description: '15% off on summer collection',
      minPurchase: 2000,
      validUntil: '2024-03-31',
      status: 'expired',
    },
  ];

  const activeCoupons = coupons.filter((coupon) => coupon.status === 'active');
  const expiredCoupons = coupons.filter((coupon) => coupon.status === 'expired');

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CouponCard = ({ coupon }: { coupon: typeof coupons[0] }) => {
    const isExpired = coupon.status === 'expired';
    const isCopied = copiedCode === coupon.code;

    return (
      <div
        className={`bg-gray-50 border rounded-lg p-6 ${
          isExpired
            ? 'border-gray-200 opacity-50'
            : 'border-gray-200 hover:bg-gray-100'
        } transition-colors`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-lg ${
                isExpired ? 'bg-gray-200' : 'bg-gray-900'
              }`}
            >
              <Ticket className={`w-6 h-6 ${isExpired ? 'text-gray-400' : 'text-white'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">{coupon.code}</h3>
              <p className="text-sm text-gray-600">{coupon.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold mb-1">
              {coupon.type === 'percentage'
                ? `${coupon.discount}% OFF`
                : `₹${coupon.discount} OFF`}
            </p>
            <p className="text-xs text-gray-600">
              Min. purchase: {formatCurrency(coupon.minPurchase)}
            </p>
            <p className="text-xs text-gray-600">
              Valid until: {new Date(coupon.validUntil).toLocaleDateString()}
            </p>
          </div>

          <Button
            onClick={() => copyToClipboard(coupon.code)}
            disabled={isExpired}
            className={`${
              isExpired
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {isCopied ? (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Copied!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Copy Code
              </span>
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Coupons</h1>
          <p className="text-gray-600">Available discounts and promo codes</p>
        </div>

        {/* Active Coupons */}
        {activeCoupons.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Active Coupons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </div>
        )}

        {/* Expired Coupons */}
        {expiredCoupons.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Expired Coupons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {expiredCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </div>
        )}

        {/* No Coupons */}
        {coupons.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">No coupons available</p>
            <p className="text-gray-500 text-sm">
              Check back later for new promotional offers
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

