'use client';

import { Product, Category, Farm } from '@/types';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  farms: Farm[];
  onProductSelect: (product: Product) => void;
}

export default function ProductGrid({ products, categories, farms, onProductSelect }: ProductGridProps) {
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Catégorie';
  };

  const getFarmName = (farmId: number) => {
    const farm = farms.find(f => f.id === farmId);
    return farm?.name || 'Farm';
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🛍️</div>
        <h2 className="text-2xl font-bold mb-2">Aucun produit disponible</h2>
        <p className="text-gray-400">Les produits CALIWHITE arrivent bientôt...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Produits CALIWHITE</h2>
        <p className="text-gray-400">Découvrez notre sélection premium</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onProductSelect(product)}
            className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 border border-purple-500/20 hover:border-purple-400/40 group"
          >
            <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-gray-800">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div className="text-gray-400 text-4xl">📷</div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-lg line-clamp-2">{product.name}</h3>
              <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-bold">
                  {product.price}€
                </span>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                  Stock: {product.stock}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{getCategoryName(product.category_id)}</span>
                <span>{getFarmName(product.farm_id)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}