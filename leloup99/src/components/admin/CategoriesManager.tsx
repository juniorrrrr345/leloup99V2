'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types';

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    icon: '📦',
    color: '#22C55E'
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/cloudflare/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch {
      console.error('Erreur chargement catégories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('💾 Sauvegarde...');

    try {
      const response = await fetch('/api/cloudflare/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSaveStatus('✅ Sauvegardé avec succès !');
        setTimeout(() => setSaveStatus(''), 3000);
        setShowForm(false);
        setFormData({ name: '', icon: '📦', color: '#22C55E' });
        loadCategories();
      } else {
        const result = await response.json();
        setSaveStatus(`❌ Erreur: ${result.error || 'Erreur de sauvegarde'}`);
        setTimeout(() => setSaveStatus(''), 5000);
      }
    } catch {
      setSaveStatus('❌ Erreur de connexion');
      setTimeout(() => setSaveStatus(''), 5000);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Catégories</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Nouvelle Catégorie
        </button>
      </div>

      {saveStatus && (
        <div className={`mb-4 p-3 rounded-lg ${
          saveStatus.includes('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {saveStatus}
        </div>
      )}

      {showForm && (
        <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Nouvelle Catégorie</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Icône</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                  placeholder="📦"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Couleur</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-full h-10 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{category.icon}</span>
              <div>
                <h3 className="font-bold text-lg">{category.name}</h3>
                <div 
                  className="w-4 h-4 rounded-full inline-block mr-2"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-sm text-gray-400">{category.color}</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              Créée le {new Date(category.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}