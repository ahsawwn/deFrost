'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface HeroSettings {
  title: string;
  description: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
}

const defaultSettings: HeroSettings = {
  title: 'DeFrost Clothing',
  description: 'Futuristic fashion for the next generation. Redefine your style with cutting-edge designs.',
  button1Text: 'Shop Now',
  button1Link: '/shop',
  button2Text: 'Featured',
  button2Link: '/shop?category=featured'
};

export default function HeroSection() {
  const [settings, setSettings] = useState<HeroSettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/site-settings');
        if (res.ok) {
          const data = await res.json();
          if (data.hero) {
            setSettings(data.hero);
          }
        }
      } catch (error) {
        console.error('Failed to load hero settings', error);
      }
    };
    fetchSettings();
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-gradient" />
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl md:text-8xl font-bold text-gradient mb-6"
        >
          {settings.title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
        >
          {settings.description}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex gap-4 justify-center"
        >
          <Button href={settings.button1Link} size="lg">
            {settings.button1Text}
          </Button>
          <Button href={settings.button2Link} variant="outline" size="lg">
            {settings.button2Text}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
