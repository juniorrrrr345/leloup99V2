# 🎨 CALIWHITE - Boutique E-commerce Premium

## 🚀 Vue d'ensemble

CALIWHITE est une boutique e-commerce moderne et élégante construite avec Next.js 15, TypeScript, et Tailwind CSS. Elle utilise Cloudflare D1 pour la base de données et Cloudflare R2 pour le stockage des médias.

## ✨ Fonctionnalités

### 🛍️ Boutique Client
- **Interface moderne** avec design sombre et effets de glow
- **Grille de produits** responsive avec aperçus d'images
- **Détails produits** avec support vidéo et images
- **Intégration WhatsApp** pour les commandes
- **Liens sociaux** configurables
- **Thème personnalisable** avec logo de fond

### 🔧 Panel Admin
- **Gestion des produits** avec aperçus temps réel
- **Gestion des catégories** avec icônes et couleurs
- **Gestion des farms** (producteurs)
- **Liens sociaux** configurables
- **Paramètres de boutique** complets
- **Upload de médias** vers Cloudflare R2

## 🏗️ Architecture Technique

### Base de Données (Cloudflare D1)
- **UUID**: `19ee81cc-91c0-4cfc-8cbe-dc67d8675e37`
- **Tables**:
  - `categories` - Catégories de produits
  - `farms` - Producteurs/Farms
  - `products` - Produits avec médias
  - `social_links` - Liens réseaux sociaux
  - `settings` - Configuration boutique
  - `pages` - Pages personnalisées

### Stockage Médias (Cloudflare R2)
- **Bucket**: `boutique-images`
- **URL Publique**: `https://pub-b38679a01a274648827751df94818418.r2.dev`
- **Support**: Images et vidéos

## 🔑 Configuration

### Variables d'Environnement
```env
# Cloudflare D1
CLOUDFLARE_ACCOUNT_ID=7979421604bd07b3bd34d3ed96222512
CLOUDFLARE_DATABASE_ID=19ee81cc-91c0-4cfc-8cbe-dc67d8675e37
CLOUDFLARE_API_TOKEN=ijkVhaXCw6LSddIMIMxwPL5CDAWznxip5x9I1bNW

# Cloudflare R2
CLOUDFLARE_R2_ACCESS_KEY_ID=82WsPNjX-j0UqZIGAny8b0uEehcHd0X3zMKNIKIN
CLOUDFLARE_R2_SECRET_ACCESS_KEY=28230e200a3b71e5374e569f8a297eba9aa3fe2e1097fdf26e5d9e340ded709d
CLOUDFLARE_R2_BUCKET_NAME=boutique-images
CLOUDFLARE_R2_PUBLIC_URL=https://pub-b38679a01a274648827751df94818418.r2.dev

# Admin
ADMIN_PASSWORD=caliwhiteadmin
```

## 🚀 Installation et Déploiement

### 1. Installation
```bash
npm install
```

### 2. Migration des Données
```bash
# Migration MongoDB → D1
node migrate-data-clean-caliwhite.js

# Migration médias Cloudinary → R2
node migrate-media-to-r2-caliwhite.js
```

### 3. Développement
```bash
npm run dev
```

### 4. Build Production
```bash
npm run build
npm start
```

## 📱 Accès

- **Boutique**: `http://localhost:3000`
- **Admin Panel**: `http://localhost:3000/admin`
  - Mot de passe: `caliwhiteadmin`

## 🎨 Personnalisation

### Logo de Boutique
- Upload d'image via Panel Admin → Paramètres
- Support des formats: JPG, PNG, WebP
- Affichage automatique dans le header

### Thèmes
- **Glow**: Effets lumineux (par défaut)
- **Dark**: Mode sombre classique
- **Light**: Mode clair

### Couleurs et Style
- Configuration via Panel Admin
- Opacité et flou d'arrière-plan
- Couleurs personnalisées par catégorie

## 🔧 API Endpoints

### Produits
- `GET /api/cloudflare/products` - Liste des produits
- `POST /api/cloudflare/products` - Créer un produit

### Catégories
- `GET /api/cloudflare/categories` - Liste des catégories
- `POST /api/cloudflare/categories` - Créer une catégorie

### Farms
- `GET /api/cloudflare/farms` - Liste des farms
- `POST /api/cloudflare/farms` - Créer une farm

### Liens Sociaux
- `GET /api/cloudflare/social-links` - Liste des liens
- `POST /api/cloudflare/social-links` - Créer un lien

### Paramètres
- `GET /api/cloudflare/settings` - Configuration boutique
- `POST /api/cloudflare/settings` - Sauvegarder configuration

## 🛠️ Corrections Appliquées

### ✅ Panel Admin
- Messages de succès corrects
- Aperçus d'images temps réel
- Gestion des erreurs améliorée

### ✅ Affichage Médias
- Support natif img/video
- URLs R2 fonctionnelles
- Aperçus instantanés

### ✅ Base de Données
- Schéma optimisé
- Migration sans doublons
- Credentials hardcodés

### ✅ API Products
- Conversion noms → IDs
- Synchronisation immédiate
- Gestion des catégories/farms

## 📊 Données Migrées

- **Catégories**: 1 unique
- **Farms**: 1 unique  
- **Produits**: 1 unique avec média R2
- **Liens sociaux**: 3 uniques (WhatsApp, Telegram, Instagram)
- **Base D1**: CALIWHITE (UUID: 19ee81cc-91c0-4cfc-8cbe-dc67d8675e37)

## 🎯 Fonctionnalités Confirmées

✅ Panel Admin avec messages corrects  
✅ Upload médias vers R2  
✅ Aperçus temps réel  
✅ Affichage client sans erreurs  
✅ Build Vercel garanti  
✅ Base propre sans doublons  
✅ Logo système fonctionnel  
✅ Catégories/Farms immédiates  
✅ Rechargement optimisé  

## 🚀 Déploiement Vercel

1. **Import Project** depuis GitHub
2. **Variables d'environnement** (optionnel - hardcodées)
3. **Deploy** - Build garanti ✅

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.

---

**CALIWHITE** - Boutique E-commerce Premium 🎨