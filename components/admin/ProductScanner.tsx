'use client';

import { useState } from 'react';
import { Search, Scan } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProductScanner() {
  const [barcode, setBarcode] = useState('');

  const handleScan = () => {
    // Barcode scanning logic will be implemented here
    console.log('Scanning barcode:', barcode);
  };

  return (
    <div className="glass p-6 rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Product Scanner</h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter barcode or search product"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleScan();
              }
            }}
          />
          <Button onClick={handleScan}>
            <Search className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-xl">
          <div className="text-center">
            <Scan className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-500">Barcode scanner area</p>
            <p className="text-sm text-gray-600 mt-2">Use camera or enter barcode manually</p>
          </div>
        </div>
      </div>
    </div>
  );
}

