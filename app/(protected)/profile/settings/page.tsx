'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Update user profile via API
    setTimeout(() => {
      setLoading(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    required
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    placeholder="+91 1234567890"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Address</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, street: e.target.value },
                      })
                    }
                    className="pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    placeholder="123 Main Street"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <Input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value },
                      })
                    }
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    placeholder="Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <Input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, state: e.target.value },
                      })
                    }
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    placeholder="Maharashtra"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <Input
                    type="text"
                    value={formData.address.zipCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, zipCode: e.target.value },
                      })
                    }
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    placeholder="400001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <Input
                    type="text"
                    value={formData.address.country}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, country: e.target.value },
                      })
                    }
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    placeholder="India"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-gray-900 text-white hover:bg-gray-800 px-8"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

