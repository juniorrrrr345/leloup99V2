'use client';

import { Product, SocialLink } from '@/types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  socialLinks: SocialLink[];
}

export default function ProductDetail({ product, onBack, socialLinks }: ProductDetailProps) {
  const whatsappLink = socialLinks.find(link => 
    link.platform.toLowerCase().includes('whatsapp')
  )?.url;

  const handleOrder = () => {
    if (whatsappLink) {
      const message = `Bonjour ! Je suis intéressé par le produit "${product.name}" (${product.price}€).`;
      window.open(`${whatsappLink}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-purple-400 hover:text-purple-300 transition-colors"
      >
        ← Retour aux produits
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Média */}
        <div className="aspect-square rounded-xl overflow-hidden bg-gray-800">
          {product.video_url ? (
            <video 
              src={product.video_url}
              className="w-full h-full object-contain"
              controls
              muted
              playsInline
            >
              <source src={product.video_url} type="video/mp4" />
              Vidéo non supportée
            </video>
          ) : product.image_url ? (
            <img 
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">📷</div>
                <div>Aucune image</div>
              </div>
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-400 text-lg">{product.description}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-purple-400">
              {product.price}€
            </span>
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
              Stock: {product.stock}
            </span>
          </div>

          {product.features && (
            <div>
              <h3 className="font-bold mb-2">Caractéristiques</h3>
              <p className="text-gray-300">{product.features}</p>
            </div>
          )}

          {product.tags && (
            <div>
              <h3 className="font-bold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-sm"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleOrder}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Commander via WhatsApp
            </button>

            {socialLinks.length > 0 && (
              <div className="flex justify-center space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl hover:text-purple-300 transition-colors"
                    title={link.platform}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}