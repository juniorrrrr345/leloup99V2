#!/bin/bash

# 🗄️ INITIALISATION TABLES D1 POUR GOTHAM
ACCOUNT_ID="7979421604bd07b3bd34d3ed96222512"
DATABASE_ID="852822ec-20e5-4c5a-b411-ecc51f18648c"
API_TOKEN="ijkVhaXCw6LSddIMIMxwPL5CDAWznxip5x9I1bNW"
BASE_URL="https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/d1/database/$DATABASE_ID/query"

echo "🚀 Initialisation des tables D1 pour GOTHAM..."

# Fonction pour exécuter SQL
execute_sql() {
    local sql="$1"
    local description="$2"
    
    echo "   📝 $description..."
    
    RESPONSE=$(curl -s -X POST "$BASE_URL" \
        -H "Authorization: Bearer $API_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"sql\": \"$sql\", \"params\": []}")
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        echo "   ✅ $description - OK"
    else
        echo "   ❌ $description - ERREUR"
        echo "   $RESPONSE"
    fi
}

# 1. Table Settings
execute_sql "CREATE TABLE IF NOT EXISTS settings (
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
);" "Création table settings"

# 2. Table Categories
execute_sql "CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    icon TEXT DEFAULT '🏷️',
    color TEXT DEFAULT '#3B82F6',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);" "Création table categories"

# 3. Table Farms
execute_sql "CREATE TABLE IF NOT EXISTS farms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    location TEXT DEFAULT '',
    contact TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);" "Création table farms"

# 4. Table Products
execute_sql "CREATE TABLE IF NOT EXISTS products (
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
);" "Création table products"

# 5. Table Pages
execute_sql "CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    is_active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);" "Création table pages"

# 6. Table Social Links
execute_sql "CREATE TABLE IF NOT EXISTS social_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT DEFAULT '🔗',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);" "Création table social_links"

# Données par défaut GOTHAM
echo ""
echo "📋 Insertion des données par défaut GOTHAM..."

execute_sql "INSERT OR REPLACE INTO settings (
    id, shop_name, background_image, shop_description, scrolling_text
) VALUES (
    1, 'GOTHAM', 'https://i.imgur.com/s1rsguc.jpeg', 
    'GOTHAM - Votre destination premium pour des produits d\'exception',
    'Bienvenue dans GOTHAM - L\'élite du shopping 🏙️'
);" "Settings par défaut GOTHAM"

execute_sql "INSERT OR REPLACE INTO pages (slug, title, content) VALUES 
('info', 'Informations', 'Bienvenue dans GOTHAM ! Nous proposons des produits premium avec un service client d\'exception.'),
('contact', 'Contact', 'Contactez GOTHAM pour toute question. Notre équipe premium est à votre disposition.');" "Pages par défaut GOTHAM"

execute_sql "INSERT OR IGNORE INTO categories (name, description, icon, color) VALUES 
('Premium', 'Produits haut de gamme', '💎', '#8B5CF6'),
('Électronique', 'Technologie avancée', '📱', '#3B82F6'),
('Mode', 'Style et élégance', '👔', '#EF4444'),
('Maison', 'Design et confort', '🏠', '#10B981'),
('Sport', 'Performance et excellence', '⚽', '#F59E0B');" "Catégories par défaut GOTHAM"

execute_sql "INSERT OR IGNORE INTO farms (name, description, location) VALUES 
('Gotham Elite', 'Production premium de qualité exceptionnelle', 'Gotham City'),
('Dark Knight Supply', 'Fournisseur exclusif de produits rares', 'Batcave'),
('Wayne Enterprises', 'Division produits de luxe', 'Gotham');" "Fermes par défaut GOTHAM"

echo ""
echo "🎉 INITIALISATION GOTHAM TERMINÉE !"
echo "✅ Base de données GOTHAM prête"
echo "✅ Tables créées avec structure optimisée"
echo "✅ Données par défaut GOTHAM insérées"
echo ""
echo "🆔 UUID D1 GOTHAM: $DATABASE_ID"
echo "🚀 Panel admin prêt à fonctionner !"