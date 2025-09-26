'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ProductGrid from '@/components/ProductGrid';
import ProductDetail from '@/components/ProductDetail';
import { Product, Category, Farm, SocialLink, Settings } from '@/types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAllData = async () => {
    try {
      // Charger les produits
      const productsResponse = await fetch('/api/cloudflare/products');
      const productsData = await productsResponse.json();
      setProducts(productsData.products || []);

      // Charger les catégories
      const categoriesResponse = await fetch('/api/cloudflare/categories');
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData.categories || []);

      // Charger les farms
      const farmsResponse = await fetch('/api/cloudflare/farms');
      const farmsData = await farmsResponse.json();
      setFarms(farmsData.farms || []);

      // Charger les liens sociaux
      const socialResponse = await fetch('/api/cloudflare/social-links');
      const socialData = await socialResponse.json();
      setSocialLinks(socialData.socialLinks || []);

      // Charger les paramètres
      const settingsResponse = await fetch('/api/cloudflare/settings');
      const settingsData = await settingsResponse.json();
      setSettings(settingsData.settings || null);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    
    // Rechargement automatique toutes les minutes
    const interval = setInterval(() => {
      loadAllData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Chargement CALIWHITE...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header 
        settings={settings} 
        socialLinks={socialLinks}
        categories={categories}
        farms={farms}
      />
      
      <main className="container mx-auto px-4 py-8">
        {selectedProduct ? (
          <ProductDetail 
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            socialLinks={socialLinks}
          />
        ) : (
          <ProductGrid 
            products={products}
            categories={categories}
            farms={farms}
            onProductSelect={setSelectedProduct}
          />
        )}
      </main>
    </div>
  );
}