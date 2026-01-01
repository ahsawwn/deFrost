'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Search, Package, Filter, Grid3x3, List, X } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  comparePrice: string | null;
  images: string[];
  category: string;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
}

type ViewMode = 'grid' | 'list';
type CategoryFilter = 'all' | string;
type StockFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
type SortOption = 'name' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc' | 'date-desc';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [featuredFilter, setFeaturedFilter] = useState<boolean | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const toggleProductSelection = (id: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedProducts.size} products?`)) return;

    const deletePromises = Array.from(selectedProducts).map(id =>
      fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    );

    try {
      await Promise.all(deletePromises);
      setProducts(products.filter(p => !selectedProducts.has(p.id)));
      setSelectedProducts(new Set());
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error deleting products:', error);
      alert('Failed to delete some products');
    }
  };

  const handleBulkToggleActive = async (isActive: boolean) => {
    if (selectedProducts.size === 0) return;

    const updatePromises = Array.from(selectedProducts).map(id =>
      fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      })
    );

    try {
      await Promise.all(updatePromises);
      setProducts(products.map(p =>
        selectedProducts.has(p.id) ? { ...p, isActive } : p
      ));
      setSelectedProducts(new Set());
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error updating products:', error);
      alert('Failed to update some products');
    }
  };

  const handleBulkToggleFeatured = async (isFeatured: boolean) => {
    if (selectedProducts.size === 0) return;

    const updatePromises = Array.from(selectedProducts).map(id =>
      fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured }),
      })
    );

    try {
      await Promise.all(updatePromises);
      setProducts(products.map(p =>
        selectedProducts.has(p.id) ? { ...p, isFeatured } : p
      ));
      setSelectedProducts(new Set());
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error updating products:', error);
      alert('Failed to update some products');
    }
  };

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  // Apply filters
  let filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (categoryFilter !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
  }

  if (stockFilter !== 'all') {
    filteredProducts = filteredProducts.filter(p => {
      if (stockFilter === 'out-of-stock') return p.stockQuantity === 0;
      if (stockFilter === 'low-stock') return p.stockQuantity > 0 && p.stockQuantity <= 10;
      if (stockFilter === 'in-stock') return p.stockQuantity > 10;
      return true;
    });
  }

  if (featuredFilter !== null) {
    filteredProducts = filteredProducts.filter(p => p.isFeatured === featuredFilter);
  }

  // Apply sorting
  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-asc':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-desc':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'stock-asc':
        return a.stockQuantity - b.stockQuantity;
      case 'stock-desc':
        return b.stockQuantity - a.stockQuantity;
      case 'date-desc':
      default:
        return b.id - a.id; // Assuming newer products have higher IDs
    }
  });

  const activeFiltersCount = 
    (categoryFilter !== 'all' ? 1 : 0) + 
    (stockFilter !== 'all' ? 1 : 0) + 
    (featuredFilter !== null ? 1 : 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Products</h1>
          <p className="text-gray-600">
            Manage your product catalog ({products.length} total
            {filteredProducts.length !== products.length && `, ${filteredProducts.length} filtered`})
          </p>
        </div>
        <div className="flex gap-3">
          {selectedProducts.size > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <span className="text-sm font-semibold text-blue-900">
                {selectedProducts.size} selected
              </span>
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Actions
              </button>
              <button
                onClick={() => setSelectedProducts(new Set())}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <Link href="/admin/products/new">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 hover:shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Bulk Actions Menu */}
      {showBulkActions && selectedProducts.size > 0 && (
        <Card className="border-2 border-blue-200 bg-blue-50/50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Bulk Actions ({selectedProducts.size} products)</h3>
              <button
                onClick={() => setShowBulkActions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => handleBulkToggleActive(true)}
                className="p-3 bg-white border-2 border-green-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all text-left"
              >
                <p className="font-semibold text-gray-900 text-sm">Activate Products</p>
                <p className="text-xs text-gray-600 mt-1">Make products visible in store</p>
              </button>
              <button
                onClick={() => handleBulkToggleActive(false)}
                className="p-3 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all text-left"
              >
                <p className="font-semibold text-gray-900 text-sm">Deactivate Products</p>
                <p className="text-xs text-gray-600 mt-1">Hide products from store</p>
              </button>
              <button
                onClick={() => handleBulkToggleFeatured(true)}
                className="p-3 bg-white border-2 border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all text-left"
              >
                <p className="font-semibold text-gray-900 text-sm">Set as Featured</p>
                <p className="text-xs text-gray-600 mt-1">Highlight on homepage</p>
              </button>
              <button
                onClick={() => handleBulkToggleFeatured(false)}
                className="p-3 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all text-left"
              >
                <p className="font-semibold text-gray-900 text-sm">Remove Featured</p>
                <p className="text-xs text-gray-600 mt-1">Unmark from featured</p>
              </button>
              <button
                onClick={handleBulkDelete}
                className="p-3 bg-white border-2 border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all text-left"
              >
                <p className="font-semibold text-red-600 text-sm">Delete Products</p>
                <p className="text-xs text-gray-600 mt-1">Permanently remove</p>
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700"
            >
              <option value="date-desc">Newest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="stock-asc">Stock (Low to High)</option>
              <option value="stock-desc">Stock (High to Low)</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-xl font-medium transition-all ${
                showFilters || activeFiltersCount > 0
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* View Mode Toggle */}
            <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Select All Checkbox */}
          {filteredProducts.length > 0 && (
            <div className="flex items-center gap-2 py-2 border-t-2 border-gray-100">
              <input
                type="checkbox"
                id="select-all"
                checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="select-all" className="text-sm font-medium text-gray-700 cursor-pointer">
                Select all {filteredProducts.length} products
              </label>
            </div>
          )}

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t-2 border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Stock Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Status</label>
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value as StockFilter)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Stock Levels</option>
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>

                {/* Featured Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Featured</label>
                  <select
                    value={featuredFilter === null ? 'all' : featuredFilter.toString()}
                    onChange={(e) => setFeaturedFilter(e.target.value === 'all' ? null : e.target.value === 'true')}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Products</option>
                    <option value="true">Featured Only</option>
                    <option value="false">Not Featured</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    setCategoryFilter('all');
                    setStockFilter('all');
                    setFeaturedFilter(null);
                  }}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="py-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">No products found</p>
            <p className="text-gray-600 mb-6">
              {searchTerm || activeFiltersCount > 0
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first product'}
            </p>
            {!searchTerm && activeFiltersCount === 0 && (
              <Link href="/admin/products/new">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className={`overflow-hidden border-2 shadow-md hover:shadow-xl transition-all group ${
              selectedProducts.has(product.id) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'
            }`}>
              <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Package className="h-14 w-14" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                    className="w-5 h-5 text-blue-600 border-2 border-white rounded bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                {product.isFeatured && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                    ⭐ Featured
                  </div>
                )}
                {!product.isActive && (
                  <div className="absolute bottom-3 left-3 bg-gray-900/80 text-white text-xs px-3 py-1.5 rounded-full font-semibold">
                    Inactive
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg font-bold line-clamp-1">{product.name}</CardTitle>
                <CardDescription className="font-medium">{product.category || 'Uncategorized'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(parseFloat(product.price))}
                    </p>
                    {product.comparePrice && parseFloat(product.comparePrice) > parseFloat(product.price) && (
                      <p className="text-sm text-gray-500 line-through">
                        {formatCurrency(parseFloat(product.comparePrice))}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold px-2.5 py-1 rounded-lg ${
                        product.stockQuantity === 0
                          ? 'bg-red-100 text-red-700'
                          : product.stockQuantity <= 10
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {product.stockQuantity === 0 ? 'Out of stock' : `${product.stockQuantity} in stock`}
                      </span>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${
                      product.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link href={`/admin/products/${product.id}/edit`} className="flex-1">
                      <Button variant="outline" className="w-full border-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="flex-1 border-2 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-md">
          <CardContent className="p-0">
            <div className="divide-y-2 divide-gray-100">
              {filteredProducts.map((product) => (
                <div key={product.id} className={`p-5 hover:bg-gray-50 transition-colors ${
                  selectedProducts.has(product.id) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}>
                  <div className="flex items-center gap-5">
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{product.name}</h3>
                        {product.isFeatured && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{product.category || 'Uncategorized'}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-gray-900">
                          {formatCurrency(parseFloat(product.price))}
                        </span>
                        <span className={`text-sm font-semibold px-2 py-0.5 rounded ${
                          product.stockQuantity === 0
                            ? 'bg-red-100 text-red-700'
                            : product.stockQuantity <= 10
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {product.stockQuantity} in stock
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                          product.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="outline" className="border-2 hover:bg-blue-50 hover:border-blue-300">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="border-2 text-red-600 hover:bg-red-50 hover:border-red-300"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
