'use client';

import { useState } from 'react';
import ProductsManager from '@/components/admin/ProductsManager';
import CategoriesManager from '@/components/admin/CategoriesManager';
import FarmsManager from '@/components/admin/FarmsManager';
import SocialLinksManager from '@/components/admin/SocialLinksManager';
import SettingsManager from '@/components/admin/SettingsManager';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  const handleLogin = () => {
    if (password === 'caliwhiteadmin') {
      setIsAuthenticated(true);
    } else {
      alert('Mot de passe incorrect');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-8 rounded-xl border border-purple-500/20">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">CALIWHITE Admin</h1>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Mot de passe admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-purple-500/20 rounded-lg text-white focus:border-purple-400 focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'products', label: 'Produits', icon: '🛍️' },
    { id: 'categories', label: 'Catégories', icon: '📁' },
    { id: 'farms', label: 'Farms', icon: '🏪' },
    { id: 'social', label: 'Réseaux', icon: '📱' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">CALIWHITE Admin Panel</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Déconnexion
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu */}
        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-500/20">
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'categories' && <CategoriesManager />}
          {activeTab === 'farms' && <FarmsManager />}
          {activeTab === 'social' && <SocialLinksManager />}
          {activeTab === 'settings' && <SettingsManager />}
        </div>
      </div>
    </div>
  );
}