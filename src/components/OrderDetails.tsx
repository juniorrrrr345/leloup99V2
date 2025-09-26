'use client';

import { X, ShoppingCart, Clock, MapPin, Phone } from 'lucide-react';
import { CartItem } from '@/lib/cartStore';

interface OrderDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  orderLink: string;
  onConfirmOrder: () => void;
}

export default function OrderDetails({
  isOpen,
  onClose,
  items,
  totalPrice,
  orderLink,
  onConfirmOrder
}: OrderDetailsProps) {
  if (!isOpen) return null;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-[10000] overflow-hidden pointer-events-none">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-4 md:inset-8 lg:inset-16 bg-gray-900 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6 text-green-400" />
              <div>
                <h2 className="text-xl font-bold text-white">Détails de votre commande</h2>
                <p className="text-sm text-gray-400">Vérifiez avant de confirmer</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-8 w-8 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{totalItems}</p>
                    <p className="text-sm text-gray-400">Article{totalItems > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="text-lg font-bold text-white">Livraison</p>
                    <p className="text-sm text-gray-400">À convenir</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-purple-400" />
                  <div>
                    <p className="text-lg font-bold text-white">Délai</p>
                    <p className="text-sm text-gray-400">Rapide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                📝 Détail des articles
              </h3>
              
              {items.map((item, index) => (
                <div key={`${item.productId}-${item.weight}`} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-white">{item.productName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-400">{item.weight}</span>
                            {item.discount > 0 && (
                              <span className="rounded bg-green-500/20 px-1.5 py-0.5 text-xs font-medium text-green-400">
                                -{item.discount}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-400">
                            {(item.price * item.quantity).toFixed(2)}€
                          </p>
                          <p className="text-sm text-gray-400">
                            {item.quantity}x {item.originalPrice}€
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg text-gray-300">Sous-total:</span>
                <span className="text-lg text-white">{totalPrice.toFixed(2)}€</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg text-gray-300">Livraison:</span>
                <span className="text-lg text-green-400">À convenir</span>
              </div>
              <div className="border-t border-gray-600 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-white">Total final:</span>
                  <span className="text-2xl font-bold text-green-400">{totalPrice.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="border-t border-gray-800 p-6 bg-gray-900/50">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg bg-gray-800 py-3 px-4 font-medium text-white hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
              >
                <X className="h-5 w-5" />
                Modifier
              </button>
              
              <button
                onClick={onConfirmOrder}
                className="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-green-600 py-3 px-4 font-medium text-white hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="h-5 w-5" />
                Confirmer la commande
              </button>
            </div>
            
            <p className="text-center text-sm text-gray-400 mt-3">
              🔒 Vos données sont sécurisées • 📱 Redirection automatique
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}