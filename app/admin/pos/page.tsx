export default function POSPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">POS System</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Scanner Section */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-lg lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Scan Products</h2>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/20 rounded-xl">
              <p className="text-gray-400">Product scanner / barcode input</p>
            </div>
          </div>
          
          {/* Cart Section */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Current Cart</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Product 1</span>
                <span className="text-white">₹999</span>
              </div>
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-white">₹1,998</span>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-6 p-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors">
              Process Payment
            </button>
            
            <button className="w-full mt-3 p-3 border border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
