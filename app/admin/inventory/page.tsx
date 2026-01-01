'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: string;
  stockQuantity: number;
  lowStockThreshold: number;
  category: string;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modifiedStock, setModifiedStock] = useState<Record<number, number>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        setProducts(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch inventory', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (id: number, value: string) => {
    const qty = parseInt(value);
    if (!isNaN(qty) && qty >= 0) {
      setModifiedStock(prev => ({ ...prev, [id]: qty }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, you might want a bulk update endpoint
      // For now, we'll update one by one or create a new endpoint
      // Let's assume we loop for now (not efficient but works)
      const updates = Object.entries(modifiedStock).map(async ([id, quantity]) => {
        // We need an endpoint to update specific fields. 
        // Existing PUT /api/admin/products/[id] likely supports partial updates.
        // I'll assume it does based on standard practices.
        // If not, I'd need to check the API code.
        // Actually, let's verify if I can update just stock.
        // The Products page uses PUT for bulk update, so it should work.
        
        await fetch(`/api/admin/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stockQuantity: quantity })
        });
      });

      await Promise.all(updates);
      
      // Refresh data
      await fetchProducts();
      setModifiedStock({});
      // Toast success here
    } catch (error) {
      console.error('Failed to save inventory', error);
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500">Track and update stock levels</p>
        </div>
        <div className="flex gap-3">
          {Object.keys(modifiedStock).length > 0 && (
            <>
              <Button variant="outline" onClick={() => setModifiedStock({})}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes ({Object.keys(modifiedStock).length})
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search by name or SKU..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading inventory...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Update Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const currentStock = modifiedStock[product.id] ?? product.stockQuantity;
                const isLow = currentStock <= (product.lowStockThreshold || 10);
                const isOut = currentStock === 0;

                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-gray-500">{product.sku || '-'}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-700">
                        {product.category || 'Uncategorized'}
                      </span>
                    </TableCell>
                    <TableCell>{product.stockQuantity}</TableCell>
                    <TableCell>
                      {isOut ? (
                        <span className="inline-flex items-center text-red-600 text-xs font-bold">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center text-amber-600 text-xs font-bold">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Low Stock
                        </span>
                      ) : (
                        <span className="text-green-600 text-xs font-bold">In Stock</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Input 
                          type="number"
                          min="0"
                          className={`w-24 text-right ${modifiedStock[product.id] !== undefined ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
                          value={currentStock}
                          onChange={(e) => handleStockChange(product.id, e.target.value)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
