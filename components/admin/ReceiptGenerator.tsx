'use client';

import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface ReceiptGeneratorProps {
  order: {
    orderNumber: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    date: Date;
  };
}

export default function ReceiptGenerator({ order }: ReceiptGeneratorProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${order.orderNumber}`,
  });

  return (
    <div>
      <div ref={receiptRef} className="bg-white text-black p-8 max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">DeFrost Clothing</h1>
          <p className="text-sm text-gray-600">Futuristic Fashion Store</p>
        </div>
        
        <div className="border-t border-b border-gray-300 py-4 mb-4">
          <p className="text-sm">
            <strong>Order #:</strong> {order.orderNumber}
          </p>
          <p className="text-sm">
            <strong>Date:</strong> {order.date.toLocaleString()}
          </p>
        </div>
        
        <div className="mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between mb-2 text-sm">
              <div>
                <p>{item.name}</p>
                <p className="text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p>{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-300 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2">
            <span>Total:</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-600">
            Payment Method: {order.paymentMethod}
          </p>
          <p className="text-xs text-gray-500 mt-4">
            Thank you for shopping with DeFrost!
          </p>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <Button onClick={handlePrint} size="lg">
          <Printer className="w-4 h-4 mr-2" />
          Print Receipt
        </Button>
      </div>
    </div>
  );
}

