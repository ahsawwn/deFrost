'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Monitor, Save, Loader2, Phone, Mail, MapPin } from 'lucide-react';

interface HeroSettings {
  title: string;
  description: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
}

interface ContactSettings {
  phone: string;
  email: string;
  address: string;
}

export default function SiteBuilderPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({
    title: 'DeFrost Clothing',
    description: 'Futuristic fashion for the next generation. Redefine your style with cutting-edge designs.',
    button1Text: 'Shop Now',
    button1Link: '/shop',
    button2Text: 'Featured',
    button2Link: '/shop?category=featured'
  });

  const [contactSettings, setContactSettings] = useState<ContactSettings>({
    phone: '+1 (555) 123-4567',
    email: 'hello@defrost.com',
    address: '123 Fashion Street, New York, NY'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/site-settings');
        if (res.ok) {
          const data = await res.json();
          if (data.hero) setHeroSettings(data.hero);
          if (data.contact) setContactSettings(data.contact);
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save Hero Settings
      await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'hero', value: heroSettings })
      });

      // Save Contact Settings
      await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'contact', value: contactSettings })
      });

      // Show simplified success feedback (e.g. alert for now, or use a toast if available)
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between sticky top-0 bg-gray-50/80 backdrop-blur-sm p-4 -mx-4 z-10 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Builder</h1>
          <p className="text-gray-500">Customize your storefront</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Hero Section Settings */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <Monitor className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Hero Section</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Title</label>
              <Input 
                value={heroSettings.title}
                onChange={(e) => setHeroSettings({...heroSettings, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                value={heroSettings.description}
                onChange={(e) => setHeroSettings({...heroSettings, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button Text</label>
                <Input 
                  value={heroSettings.button1Text}
                  onChange={(e) => setHeroSettings({...heroSettings, button1Text: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button Link</label>
                <Input 
                  value={heroSettings.button1Link}
                  onChange={(e) => setHeroSettings({...heroSettings, button1Link: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Text</label>
                <Input 
                  value={heroSettings.button2Text}
                  onChange={(e) => setHeroSettings({...heroSettings, button2Text: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Link</label>
                <Input 
                  value={heroSettings.button2Link}
                  onChange={(e) => setHeroSettings({...heroSettings, button2Link: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Settings */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
          </div>

          <div className="space-y-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" /> Phone Number
              </label>
              <Input 
                value={contactSettings.phone}
                onChange={(e) => setContactSettings({...contactSettings, phone: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" /> Email Address
              </label>
              <Input 
                value={contactSettings.email}
                onChange={(e) => setContactSettings({...contactSettings, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> Physical Address
              </label>
              <Input 
                value={contactSettings.address}
                onChange={(e) => setContactSettings({...contactSettings, address: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}