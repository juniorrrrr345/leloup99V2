'use client';

import { Settings, SocialLink, Category, Farm } from '@/types';

interface HeaderProps {
  settings: Settings | null;
  socialLinks: SocialLink[];
  categories: Category[];
  farms: Farm[];
}

export default function Header({ settings, socialLinks, categories, farms }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-purple-900 to-blue-900 p-6 text-center">
      <div className="container mx-auto">
        {settings?.background_image ? (
          <img 
            src={settings.background_image} 
            alt="CALIWHITE" 
            className="h-12 sm:h-16 md:h-20 w-auto rounded-lg mx-auto"
            style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}
          />
        ) : (
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
            CALIWHITE
          </h1>
        )}
        
        {settings?.scrolling_text && (
          <div className="mt-4 text-sm text-gray-300 animate-pulse">
            {settings.scrolling_text}
          </div>
        )}

        {/* Liens sociaux */}
        {socialLinks.length > 0 && (
          <div className="flex justify-center space-x-4 mt-4">
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-gray-300">Catégories</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">{farms.length}</div>
            <div className="text-gray-300">Farms</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">{socialLinks.length}</div>
            <div className="text-gray-300">Réseaux</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">CALIWHITE</div>
            <div className="text-gray-300">Boutique</div>
          </div>
        </div>
      </div>
    </header>
  );
}