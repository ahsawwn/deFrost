import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">DeFrost</h3>
            <p className="text-gray-600 text-sm mb-4">
              Futuristic fashion for the next generation
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Shopping Guide</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/shop" className="hover:text-gray-900 transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=new" className="hover:text-gray-900 transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop?category=featured" className="hover:text-gray-900 transition-colors">Featured</Link></li>
              <li><Link href="/how-to-buy" className="hover:text-gray-900 transition-colors">How To Buy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/contact" className="hover:text-gray-900 transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-gray-900 transition-colors">Shipping & Deliveries</Link></li>
              <li><Link href="/returns" className="hover:text-gray-900 transition-colors">Exchange & Returns</Link></li>
              <li><Link href="/track-order" className="hover:text-gray-900 transition-colors">Track Your Order</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-gray-900 transition-colors">About Us</Link></li>
              <li><Link href="/stores" className="hover:text-gray-900 transition-colors">Retail Stores</Link></li>
              <li><Link href="/careers" className="hover:text-gray-900 transition-colors">Careers</Link></li>
              <li><Link href="/payment" className="hover:text-gray-900 transition-colors">Payment</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter Signup */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="max-w-md">
            <h4 className="font-semibold text-gray-900 mb-2">Be The First To Know</h4>
            <p className="text-sm text-gray-600 mb-4">
              Get an update of all our latest collections, discounts & features coming up
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-500 rounded focus:outline-none focus:border-gray-900"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
              >
                SIGN ME UP!
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} DeFrost Clothing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
