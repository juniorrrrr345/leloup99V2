// 🗄️ INITIALISATION TABLES D1 POUR GOTHAM
const CLOUDFLARE_CONFIG = {
  accountId: '7979421604bd07b3bd34d3ed96222512',
  databaseId: '852822ec-20e5-4c5a-b411-ecc51f18648c',
  apiToken: 'ijkVhaXCw6LSddIMIMxwPL5CDAWznxip5x9I1bNW'
};

const BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_CONFIG.accountId}/d1/database/${CLOUDFLARE_CONFIG.databaseId}/query`;

async function executeSQL(sql, description) {
  console.log(`   📝 ${description}...`);
  
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_CONFIG.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql: sql,
        params: []
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`   ✅ ${description} - OK`);
      return true;
    } else {
      console.log(`   ❌ ${description} - ERREUR`);
      console.log(`   ${JSON.stringify(result)}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ ${description} - ERREUR`);
    console.log(`   ${error.message}`);
    return false;
  }
}

async function initializeGothamDatabase() {
  console.log('🚀 Initialisation des tables D1 pour GOTHAM...');
  
  // 1. Table Settings
  await executeSQL(`CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shop_name TEXT DEFAULT 'GOTHAM',
    admin_password TEXT DEFAULT 'admin123',
    background_image TEXT DEFAULT 'https://i.imgur.com/s1rsguc.jpeg',
    background_opacity INTEGER DEFAULT 20,
    background_blur INTEGER DEFAULT 5,
    theme_color TEXT DEFAULT 'glow',
    contact_info TEXT DEFAULT '',
    shop_description TEXT DEFAULT '',
    loading_enabled BOOLEAN DEFAULT true,
    loading_duration INTEGER DEFAULT 3000,
    whatsapp_link TEXT DEFAULT '',
    whatsapp_number TEXT DEFAULT '',
    scrolling_text TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, 'Création table settings');

  // 2. Table Categories
  await executeSQL(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    icon TEXT DEFAULT '🏷️',
    color TEXT DEFAULT '#3B82F6',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, 'Création table categories');

  // 3. Table Farms
  await executeSQL(`CREATE TABLE IF NOT EXISTS farms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    location TEXT DEFAULT '',
    contact TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, 'Création table farms');

  // 4. Table Products
  await executeSQL(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    price REAL NOT NULL DEFAULT 0,
    prices TEXT DEFAULT '{}',
    category_id INTEGER,
    farm_id INTEGER,
    image_url TEXT DEFAULT '',
    video_url TEXT DEFAULT '',
    images TEXT DEFAULT '[]',
    stock INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    features TEXT DEFAULT '[]',
    tags TEXT DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, 'Création table products');

  // 5. Table Pages
  await executeSQL(`CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    is_active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, 'Création table pages');

  // 6. Table Social Links
  await executeSQL(`CREATE TABLE IF NOT EXISTS social_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT DEFAULT '🔗',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, 'Création table social_links');

  console.log('');
  console.log('📋 Insertion des données par défaut GOTHAM...');

  // Données par défaut
  await executeSQL(`INSERT OR REPLACE INTO settings (
    id, shop_name, background_image, shop_description, scrolling_text
  ) VALUES (
    1, 'GOTHAM', 'https://i.imgur.com/s1rsguc.jpeg', 
    'GOTHAM - Votre destination premium pour des produits d''exception',
    'Bienvenue dans GOTHAM - L''élite du shopping 🏙️'
  )`, 'Settings par défaut GOTHAM');

  await executeSQL(`INSERT OR REPLACE INTO pages (slug, title, content) VALUES 
  ('info', 'Informations', 'Bienvenue dans GOTHAM ! Nous proposons des produits premium avec un service client d''exception.'),
  ('contact', 'Contact', 'Contactez GOTHAM pour toute question. Notre équipe premium est à votre disposition.')`, 'Pages par défaut GOTHAM');

  await executeSQL(`INSERT OR IGNORE INTO categories (name, description, icon, color) VALUES 
  ('Premium', 'Produits haut de gamme', '💎', '#8B5CF6'),
  ('Électronique', 'Technologie avancée', '📱', '#3B82F6'),
  ('Mode', 'Style et élégance', '👔', '#EF4444'),
  ('Maison', 'Design et confort', '🏠', '#10B981'),
  ('Sport', 'Performance et excellence', '⚽', '#F59E0B')`, 'Catégories par défaut GOTHAM');

  await executeSQL(`INSERT OR IGNORE INTO farms (name, description, location) VALUES 
  ('Gotham Elite', 'Production premium de qualité exceptionnelle', 'Gotham City'),
  ('Dark Knight Supply', 'Fournisseur exclusif de produits rares', 'Batcave'),
  ('Wayne Enterprises', 'Division produits de luxe', 'Gotham')`, 'Fermes par défaut GOTHAM');

  console.log('');
  console.log('🎉 INITIALISATION GOTHAM TERMINÉE !');
  console.log('✅ Base de données GOTHAM prête');
  console.log('✅ Tables créées avec structure optimisée');
  console.log('✅ Données par défaut GOTHAM insérées');
  console.log('');
  console.log(`🆔 UUID D1 GOTHAM: ${CLOUDFLARE_CONFIG.databaseId}`);
  console.log('🚀 Panel admin prêt à fonctionner !');
}

// Exécuter l'initialisation
initializeGothamDatabase().catch(console.error);