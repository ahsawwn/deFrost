import Link from 'next/link';

const categories = [
  { name: 'T-Shirts', slug: 'tshirts', image: '/categories/tshirts.jpg' },
  { name: 'Hoodies', slug: 'hoodies', image: '/categories/hoodies.jpg' },
  { name: 'Pants', slug: 'pants', image: '/categories/pants.jpg' },
  { name: 'Accessories', slug: 'accessories', image: '/categories/accessories.jpg' },
];

export default function CategoryGrid() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gradient text-center mb-12">
          Shop by Category
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="glass rounded-2xl overflow-hidden hover:neon-glow transition-all group"
            >
              <div className="aspect-square relative bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <h3 className="text-2xl font-bold group-hover:scale-110 transition-transform">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

