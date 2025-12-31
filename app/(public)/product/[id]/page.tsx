import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold text-white mb-8">Product {params.id}</h1>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <p className="text-gray-400">Product details will be displayed here</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
