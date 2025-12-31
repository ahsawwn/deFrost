'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image?: string;
  slug: string;
  comparePrice?: string | null;
  fit?: string;
  category?: string;
  colors?: string[];
  sizes?: string[];
  onSale?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  slug,
  comparePrice,
  fit = 'Regular Fit',
  category = 'Men',
  colors = [],
  sizes = ['S', 'M', 'L', 'XL'],
  onSale = false,
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const priceNum = parseFloat(price);
  const comparePriceNum = comparePrice ? parseFloat(comparePrice) : null;
  const discount = comparePriceNum && comparePriceNum > priceNum
    ? Math.round(((comparePriceNum - priceNum) / comparePriceNum) * 100)
    : 0;

  const handleAddToBasket = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Add to cart logic
    console.log('Add to basket:', { id, name, selectedSize, selectedColor });
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${slug}`}>
        <div className="relative">
          {/* Sale Badge */}
          {onSale && discount > 0 && (
            <div className="absolute top-2 left-2 z-10 bg-white text-black text-xs font-semibold px-2 py-1">
              -{discount}%
            </div>
          )}

          {/* Product Image */}
          <div className="aspect-square relative bg-gray-100 border border-gray-200 overflow-hidden">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-100">
                <span className="text-sm">No Image</span>
              </div>
            )}
          </div>

          {/* Quick Add Button (on hover) */}
          {isHovered && (
            <div className="absolute inset-x-0 bottom-0 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200">
              <div className="space-y-2">
                {/* Size Selector */}
                {sizes.length > 0 && (
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedSize(size);
                        }}
                        className={`flex-1 py-1.5 text-xs font-medium border transition-colors ${
                          selectedSize === size
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-300 text-gray-900 hover:border-gray-900'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}

                {/* Add to Basket Button */}
                <Button
                  onClick={handleAddToBasket}
                  className="w-full bg-gray-900 text-white hover:bg-gray-800 text-sm py-2"
                  disabled={sizes.length > 0 && !selectedSize}
                >
                  Add to Basket
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
            {name}
          </h3>
          <p className="text-xs text-gray-600">
            {fit} | {category}
          </p>
          
          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            {comparePriceNum && comparePriceNum > priceNum ? (
              <>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(priceNum)}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  {formatCurrency(comparePriceNum)}
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(priceNum)}
              </span>
            )}
          </div>

          {/* Color Swatches */}
          {colors.length > 0 && (
            <div className="flex gap-2 mt-2">
              {colors.map((color, index) => {
                // Color mapping for common color names
                const colorMap: Record<string, string> = {
                  black: '#000000',
                  white: '#ffffff',
                  'off-white': '#f5f5f5',
                  grey: '#808080',
                  gray: '#808080',
                  blue: '#0000ff',
                  'dark-blue': '#00008b',
                  brown: '#8b4513',
                  'dark-brown': '#654321',
                  beige: '#f5f5dc',
                  'light-grey': '#d3d3d3',
                  'antique-white': '#faebd7',
                  'anthracite-grey': '#383838',
                  'forest-green': '#228b22',
                  coffee: '#6f4e37',
                  mink: '#8b7355',
                  stone: '#8b8680',
                  twilight: '#4e5180',
                };

                const hexColor = colorMap[color.toLowerCase()] || color;
                const isHex = /^#([0-9A-F]{3}){1,2}$/i.test(color);

                return (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedColor(color);
                    }}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? 'border-gray-900 scale-110'
                        : 'border-gray-300 hover:border-gray-600'
                    }`}
                    style={{ backgroundColor: isHex ? color : hexColor }}
                    title={color}
                  />
                );
              })}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
