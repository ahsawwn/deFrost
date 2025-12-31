export interface User {
  id: string;
  name: string | null;
  email: string;
  role: 'customer' | 'admin' | 'staff';
  image: string | null;
  phone: string | null;
  address: any;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  comparePrice: string | null;
  costPrice: string | null;
  images: string[];
  category: string | null;
  tags: string[];
  sizes: string[];
  colors: string[];
  stockQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  metadata: any;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: string | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  shippingAddress: any;
  billingAddress: any;
  subtotal: string;
  tax: string;
  shippingCost: string;
  discount: string;
  total: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'upi' | 'netbanking' | null;
  transactionId: string | null;
  notes: string | null;
  isPosOrder: boolean;
  posSessionId: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface CartItem {
  id: number;
  userId: string | null;
  sessionId: string | null;
  productId: number;
  quantity: number;
  size: string | null;
  color: string | null;
  addedAt: Date | null;
}

