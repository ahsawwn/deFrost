'use client';

import { useState, useEffect, useRef, forwardRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Search, Plus, Trash2, CreditCard, User, RotateCcw, Printer, Package, ChevronRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string | number;
  category: string;
  image?: string;
  stockQuantity: number;
}

interface Category {
  id: number;
  name: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  customerType?: string;
}

interface CartItem extends Product {
  quantity: number;
}

// Receipt Component
const Receipt = forwardRef<HTMLDivElement, { 
  cart: CartItem[], 
  subtotal: number, 
  tax: number, 
  total: number, 
  customer: Customer | null,
  date: Date,
  orderNumber: string
}>(({ cart, subtotal, tax, total, customer, date, orderNumber }, ref) => {
  return (
    <div ref={ref} className="p-8 bg-white text-black" style={{ width: '80mm', minHeight: '100mm', margin: '0 auto' }}>
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold">DeFroost</h1>
        <p className="text-sm">Fashion & Clothing</p>
        <p className="text-xs mt-1">123 Fashion Street, New York, NY</p>
        <p className="text-xs">Tel: +1 (555) 123-4567</p>
      </div>
      
      <div className="mb-4 text-xs border-b pb-2 border-dashed border-gray-400">
        <p>Order: {orderNumber}</p>
        <p>Date: {date.toLocaleString()}</p>
        <p>Customer: {customer?.name || 'Walk-in'}</p>
      </div>

      <div className="space-y-2 mb-4 text-xs">
        {cart.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className="truncate w-32">{item.name}</span>
            <span className="w-8 text-center">x{item.quantity}</span>
            <span className="text-right">{formatCurrency(Number(item.price) * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-2 border-dashed border-gray-400 text-xs space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between font-bold text-sm mt-2">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="mt-8 text-center text-xs">
        <p>Thank you for shopping with us!</p>
        <p>Please visit again.</p>
      </div>
    </div>
  );
});

Receipt.displayName = 'Receipt';

export default function POSDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [change, setChange] = useState(0);
  const [lastOrder, setLastOrder] = useState<any>(null);

  const receiptRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
  });

  const handlePrintSafe = () => {
    if (handlePrint) {
      handlePrint();
    }
  };

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, customersRes] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/admin/categories'),
          fetch('/api/admin/customers')
        ]);

        if (productsRes.ok) setProducts(await productsRes.json());
        if (categoriesRes.ok) setCategories(await categoriesRes.json());
        if (customersRes.ok) setCustomers(await customersRes.json());
      } catch (error) {
        console.error('Failed to fetch POS data', error);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax example
  const total = subtotal + tax;

  const handlePayment = async () => {
    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        customerId: selectedCustomer?.id || null,
        total: total,
        paymentMethod,
        isPos: true
      };

      const res = await fetch('/api/admin/orders', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData) 
      });

      if (res.ok) {
        const order = await res.json();
        setLastOrder(order);
        setIsPaymentOpen(false);
        setIsReceiptOpen(true);
      }
    } catch (error) {
      console.error('Payment failed', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6">
      {/* Left Side - Products */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 overflow-x-auto">
           <Button 
              variant={selectedCategory === 'All' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('All')}
              className="whitespace-nowrap"
            >
              All Items
            </Button>
          {categories.map(cat => (
            <Button 
              key={cat.id}
              variant={selectedCategory === cat.name ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.name)}
              className="whitespace-nowrap"
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-blue-600 font-bold">{formatCurrency(Number(product.price))}</p>
                <p className="text-xs text-gray-500 mt-1">{product.stockQuantity} in stock</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Cart */}
      <div className="w-96 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
        {/* Customer Selection */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Customer</span>
            <Button variant="ghost" size="sm" className="text-blue-600">
              <Plus className="w-4 h-4 mr-1" /> New
            </Button>
          </div>
          <select 
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg"
            onChange={(e) => {
              const customer = customers.find(c => c.id === e.target.value);
              setSelectedCustomer(customer || null);
            }}
            value={selectedCustomer?.id || ''}
          >
            <option value="">Walk-in Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
            ))}
          </select>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Package className="w-12 h-12 mb-2 opacity-20" />
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-3">
                 <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0" />
                 <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                    <p className="text-blue-600 font-semibold">{formatCurrency(Number(item.price))}</p>
                 </div>
                 <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }}
                        className="w-6 h-6 flex items-center justify-center hover:bg-white rounded shadow-sm"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                         onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }}
                         className="w-6 h-6 flex items-center justify-center hover:bg-white rounded shadow-sm"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 text-xs p-1"
                    >
                      Remove
                    </button>
                 </div>
              </div>
            ))
          )}
        </div>

        {/* Totals */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (10%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setCart([])}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button onClick={() => setIsPaymentOpen(true)} disabled={cart.length === 0}>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>Select payment method and complete transaction</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            {['cash', 'card', 'upi', 'netbanking'].map(method => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  paymentMethod === method 
                    ? 'border-blue-600 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="w-6 h-6" />
                <span className="capitalize">{method}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Due</span>
              <span>{formatCurrency(total)}</span>
            </div>
            
            {paymentMethod === 'cash' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cash Received</label>
                <Input 
                  type="number" 
                  value={amountPaid}
                  onChange={(e) => {
                    setAmountPaid(e.target.value);
                    setChange(Number(e.target.value) - total);
                  }}
                  className="text-lg"
                  placeholder="0.00"
                />
                {Number(amountPaid) >= total && (
                   <div className="flex justify-between text-green-600 font-bold mt-2">
                     <span>Change</span>
                     <span>{formatCurrency(change)}</span>
                   </div>
                )}
              </div>
            )}
          </div>

          <Button className="w-full h-12 text-lg" onClick={handlePayment}>
            Complete Order
          </Button>
        </DialogContent>
      </Dialog>

      {/* Receipt Modal */}
      <Dialog open={isReceiptOpen} onOpenChange={(open) => {
        if (!open) {
           setCart([]); // Clear cart when closing receipt
           setLastOrder(null);
        }
        setIsReceiptOpen(open);
      }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Order Successful!</DialogTitle>
          </DialogHeader>
          
          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm my-4 text-center space-y-4">
             <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
               <Package className="w-8 h-8" />
             </div>
             <div>
               <p className="text-gray-500">Order Total</p>
               <p className="text-3xl font-bold text-gray-900">{formatCurrency(total)}</p>
             </div>
             <p className="text-sm text-gray-500">Receipt sent to {selectedCustomer?.email || 'Walk-in Customer'}</p>
          </div>

          <div className="flex gap-3">
             <Button variant="outline" className="flex-1" onClick={handlePrintSafe}>
               <Printer className="w-4 h-4 mr-2" />
               Print
             </Button>
             <Button className="flex-1" onClick={() => {
               setCart([]);
               setIsReceiptOpen(false);
               setLastOrder(null);
             }}>
               New Order
             </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Hidden Receipt for Printing */}
      <div style={{ display: 'none' }}>
        <Receipt 
          ref={receiptRef} 
          cart={cart} 
          subtotal={subtotal} 
          tax={tax} 
          total={total} 
          customer={selectedCustomer} 
          date={new Date()} 
          orderNumber={lastOrder?.orderNumber || 'PENDING'}
        />
      </div>
    </div>
  );
}
