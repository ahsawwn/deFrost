'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
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
          DeFrost Clothing
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
        >
          Futuristic fashion for the next generation. Redefine your style with cutting-edge designs.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex gap-4 justify-center"
        >
          <Button href="/shop" size="lg">
            Shop Now
          </Button>
          <Button href="/shop?category=featured" variant="outline" size="lg">
            Featured
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

