'use client';

import { useState, useEffect } from 'react';
import { Settings } from '@/types';

export default function SettingsManager() {
  const [, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');

  const [formData, setFormData] = useState({
    shop_title: 'LELOUP99',
    theme_color: 'glow',
    background_image: '',
    background_opacity: 20,
    background_blur: 5,
    info_content: '',
    contact_content: '',
    whatsapp_link: '',
    whatsapp_number: '',
    scrolling_text: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/cloudflare/settings');
      const data = await response.json();
      if (data.settings) {
        setSettings(data.settings);
        setFormData({
          shop_title: data.settings.shop_title || 'LELOUP99',
          theme_color: data.settings.theme_color || 'glow',
          background_image: data.settings.background_image || '',
          background_opacity: data.settings.background_opacity || 20,
          background_blur: data.settings.background_blur || 5,
          info_content: data.settings.info_content || '',
          contact_content: data.settings.contact_content || '',
          whatsapp_link: data.settings.whatsapp_link || '',
          whatsapp_number: data.settings.whatsapp_number || '',
          scrolling_text: data.settings.scrolling_text || ''
        });
      }
    } catch {
      console.error('Erreur chargement paramètres');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('💾 Sauvegarde...');

    try {
      const response = await fetch('/api/cloudflare/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSaveStatus('✅ Sauvegardé avec succès !');
        setTimeout(() => setSaveStatus(''), 3000);
        loadSettings();
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
        <h2 className="text-2xl font-bold">Paramètres de la Boutique</h2>
      </div>

      {saveStatus && (
        <div className={`mb-4 p-3 rounded-lg ${
          saveStatus.includes('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {saveStatus}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations générales */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Informations Générales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom de la boutique</label>
              <input
                type="text"
                value={formData.shop_title}
                onChange={(e) => setFormData({...formData, shop_title: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Thème</label>
              <select
                value={formData.theme_color}
                onChange={(e) => setFormData({...formData, theme_color: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
              >
                <option value="glow">Glow</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Texte de défilement</label>
            <input
              type="text"
              value={formData.scrolling_text}
              onChange={(e) => setFormData({...formData, scrolling_text: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
              placeholder="Message qui défile en haut de la page"
            />
          </div>
        </div>

        {/* Image de fond */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Image de Fond</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">URL de l&apos;image de fond</label>
              <input
                type="url"
                value={formData.background_image}
                onChange={(e) => setFormData({...formData, background_image: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                placeholder="https://..."
              />
              {formData.background_image && (
                <div className="mt-3">
                  <div className="text-xs text-gray-400 mb-2">Aperçu :</div>
                  <div className="w-32 h-20 rounded border border-white/20 overflow-hidden">
                    <img 
                      src={formData.background_image} 
                      alt="Aperçu image de fond" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Opacité (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.background_opacity}
                  onChange={(e) => setFormData({...formData, background_opacity: Number(e.target.value)})}
                  className="w-full"
                />
                <div className="text-sm text-gray-400">{formData.background_opacity}%</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Flou (px)</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={formData.background_blur}
                  onChange={(e) => setFormData({...formData, background_blur: Number(e.target.value)})}
                  className="w-full"
                />
                <div className="text-sm text-gray-400">{formData.background_blur}px</div>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Configuration WhatsApp</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Lien WhatsApp</label>
              <input
                type="url"
                value={formData.whatsapp_link}
                onChange={(e) => setFormData({...formData, whatsapp_link: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                placeholder="https://wa.me/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Numéro WhatsApp</label>
              <input
                type="text"
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({...formData, whatsapp_number: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                placeholder="+33123456789"
              />
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Contenu</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Contenu d&apos;information</label>
              <textarea
                value={formData.info_content}
                onChange={(e) => setFormData({...formData, info_content: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                rows={4}
                placeholder="Informations sur la boutique..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contenu de contact</label>
              <textarea
                value={formData.contact_content}
                onChange={(e) => setFormData({...formData, contact_content: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                rows={4}
                placeholder="Informations de contact..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors"
          >
            Sauvegarder les Paramètres
          </button>
        </div>
      </form>
    </div>
  );
}