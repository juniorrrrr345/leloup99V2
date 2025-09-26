'use client';

import { useState, useEffect } from 'react';
import { Product, Category, Farm } from '@/types';

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saveStatus, setSaveStatus] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    farm_id: '',
    image_url: '',
    video_url: '',
    price: '',
    stock: '',
    features: '',
    tags: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes, farmsRes] = await Promise.all([
        fetch('/api/cloudflare/products'),
        fetch('/api/cloudflare/categories'),
        fetch('/api/cloudflare/farms')
      ]);

      const [productsData, categoriesData, farmsData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
        farmsRes.json()
      ]);

      setProducts(productsData.products || []);
      setCategories(categoriesData.categories || []);
      setFarms(farmsData.farms || []);
    } catch {
      console.error('Erreur chargement données');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('💾 Sauvegarde...');

    try {
      const response = await fetch('/api/cloudflare/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          category_id: Number(formData.category_id),
          farm_id: Number(formData.farm_id)
        })
      });

      if (response.ok) {
        setSaveStatus('✅ Sauvegardé avec succès !');
        setTimeout(() => setSaveStatus(''), 3000);
        setShowForm(false);
        setEditingProduct(null);
        resetForm();
        loadData();
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category_id: '',
      farm_id: '',
      image_url: '',
      video_url: '',
      price: '',
      stock: '',
      features: '',
      tags: ''
    });
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Catégorie';
  };

  const getFarmName = (farmId: number) => {
    const farm = farms.find(f => f.id === farmId);
    return farm?.name || 'Farm';
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Produits</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingProduct(null);
            resetForm();
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Nouveau Produit
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
          <h3 className="text-xl font-bold mb-4">
            {editingProduct ? 'Modifier le Produit' : 'Nouveau Produit'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium mb-2">Prix (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Catégorie</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Farm</label>
                <select
                  value={formData.farm_id}
                  onChange={(e) => setFormData({...formData, farm_id: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                  required
                >
                  <option value="">Sélectionner une farm</option>
                  {farms.map(farm => (
                    <option key={farm.id} value={farm.id}>{farm.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">URL Image</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                />
                {formData.image_url && (
                  <div className="mt-3">
                    <div className="text-xs text-gray-400 mb-2">Aperçu :</div>
                    <div className="w-32 h-20 rounded border border-white/20 overflow-hidden">
                      <img 
                        src={formData.image_url} 
                        alt="Aperçu image" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL Vidéo</label>
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
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
        {products.map((product) => (
          <div key={product.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-700">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  📷
                </div>
              )}
            </div>
            
            <h3 className="font-bold text-lg mb-2">{product.name}</h3>
            <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-purple-400 font-bold">{product.price}€</span>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                Stock: {product.stock}
              </span>
            </div>
            
            <div className="text-xs text-gray-500 mb-3">
              <div>{getCategoryName(product.category_id)}</div>
              <div>{getFarmName(product.farm_id)}</div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditingProduct(product);
                  setFormData({
                    name: product.name,
                    description: product.description,
                    category_id: product.category_id.toString(),
                    farm_id: product.farm_id.toString(),
                    image_url: product.image_url,
                    video_url: product.video_url,
                    price: product.price.toString(),
                    stock: product.stock.toString(),
                    features: product.features || '',
                    tags: product.tags || ''
                  });
                  setShowForm(true);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Modifier
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}