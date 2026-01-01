import POSDashboard from '@/components/admin/POSDashboard';

export default function POSPage() {
  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">POS Terminal</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      <POSDashboard />
    </div>
  );
}
