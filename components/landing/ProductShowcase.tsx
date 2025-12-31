'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/shared/ProductCard';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  comparePrice: string | null;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  isFeatured?: boolean;
}

export default function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetch featured products, limit to 8
      const response = await fetch('/api/products?featured=true&limit=8');
      if (response.ok) {
        const data = await response.json();
        // If no featured products, get regular products
        if (data.length === 0) {
          const regularResponse = await fetch('/api/products?limit=8');
          if (regularResponse.ok) {
            const regularData = await regularResponse.json();
            setProducts(regularData);
          }
        } else {
          setProducts(data);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products available yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          slug={product.slug}
          comparePrice={product.comparePrice}
          image={product.images && product.images.length > 0 ? product.images[0] : undefined}
          category={product.category}
          sizes={product.sizes || ['S', 'M', 'L', 'XL']}
          colors={product.colors || []}
          onSale={product.comparePrice ? parseFloat(product.comparePrice) > parseFloat(product.price) : false}
        />
      ))}
    </div>
  );
}
