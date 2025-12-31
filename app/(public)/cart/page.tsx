import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <p className="text-gray-600">Your cart items will be displayed here</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
