'use client';

import { useState, useEffect } from 'react';
import { Farm } from '@/types';

export default function FarmsManager() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    contact: ''
  });

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      const response = await fetch('/api/cloudflare/farms');
      const data = await response.json();
      setFarms(data.farms || []);
    } catch {
      console.error('Erreur chargement farms');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('💾 Sauvegarde...');

    try {
      const response = await fetch('/api/cloudflare/farms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSaveStatus('✅ Sauvegardé avec succès !');
        setTimeout(() => setSaveStatus(''), 3000);
        setShowForm(false);
        setFormData({ name: '', description: '', location: '', contact: '' });
        loadFarms();
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
        <h2 className="text-2xl font-bold">Gestion des Farms</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Nouvelle Farm
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
          <h3 className="text-xl font-bold mb-4">Nouvelle Farm</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Localisation</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contact</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
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
        {farms.map((farm) => (
          <div key={farm.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="font-bold text-lg mb-2">{farm.name}</h3>
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{farm.description}</p>
            
            <div className="space-y-1 text-sm text-gray-500">
              <div>📍 {farm.location}</div>
              <div>📞 {farm.contact}</div>
            </div>
            
            <div className="text-xs text-gray-500 mt-3">
              Créée le {new Date(farm.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}