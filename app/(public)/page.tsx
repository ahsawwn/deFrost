import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ProductShowcase from '@/components/landing/ProductShowcase';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative h-[70vh] md:h-[80vh] bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 relative z-10">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                  New Collection 2024
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 leading-tight">
                DeFrost
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Clothing
                </span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                Futuristic fashion for the next generation. Redefine your style with cutting-edge designs.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a
                  href="/shop"
                  className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
                >
                  Shop Now
                </a>
                <a
                  href="/shop?category=featured"
                  className="px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-all transform hover:scale-105"
                >
                  Featured
                </a>
                <a
                  href="/admin/dashboard"
                  className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Admin Dashboard
                </a>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
            </div>
          </div>
        </section>

        {/* New & Trending Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">New & Trending</h2>
                <p className="text-gray-600">
                  Just launched pieces inspired by what's hot now, crafted for those who love staying ahead of the style curve
                </p>
              </div>
              <a
                href="/shop?category=new"
                className="hidden md:block text-gray-900 font-semibold hover:text-gray-700 transition-colors"
              >
                View All →
              </a>
            </div>
            <ProductShowcase />
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Hoodies', image: '/categories/hoodies.jpg', href: '/shop?category=hoodies' },
                { name: 'T-Shirts', image: '/categories/tshirts.jpg', href: '/shop?category=tshirts' },
                { name: 'Jackets', image: '/categories/jackets.jpg', href: '/shop?category=jackets' },
                { name: 'Jeans', image: '/categories/jeans.jpg', href: '/shop?category=jeans' },
              ].map((category) => (
                <a
                  key={category.name}
                  href={category.href}
                  className="group relative aspect-square bg-gray-100 border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-200 transition-colors"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                      {category.name}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Collections Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shop by Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Essentials', description: 'Everyday basics reimagined', href: '/shop?collection=essentials' },
                { name: 'Featured', description: 'Curated picks for you', href: '/shop?collection=featured' },
                { name: 'New Arrivals', description: 'Latest drops', href: '/shop?category=new' },
              ].map((collection) => (
                <a
                  key={collection.name}
                  href={collection.href}
                  className="group relative h-64 bg-gray-100 border border-gray-200 rounded-lg p-8 hover:bg-gray-200 transition-colors"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{collection.name}</h3>
                  <p className="text-gray-600">{collection.description}</p>
                  <span className="absolute bottom-8 text-gray-900 font-semibold group-hover:translate-x-2 transition-transform">
                    Shop Now →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
