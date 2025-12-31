import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ProductShowcase from '@/components/landing/ProductShowcase';

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Shop</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductShowcase />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
