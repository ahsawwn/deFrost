'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function POSDashboard() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: { name: string; price: number }) => {
    setCart([...cart, { id: Date.now(), ...product, quantity: 1 }]);
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Product grid will be populated from API */}
          <p className="text-gray-400">Product scanner/search will be here</p>
        </div>
      </div>
      
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        
        <div className="space-y-4 mb-6">
          {cart.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Cart is empty</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b border-gray-700 pb-2">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-gray-700 hover:bg-gray-600"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded bg-gray-700 hover:bg-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 text-sm hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="border-t border-gray-700 pt-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button className="w-full" size="lg">
            Process Payment
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            Print Receipt
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setCart([])}>
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

