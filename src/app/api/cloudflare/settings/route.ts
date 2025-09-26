import { NextRequest, NextResponse } from 'next/server';

// Configuration Cloudflare D1 hardcodée
const CLOUDFLARE_CONFIG = {
  accountId: '7979421604bd07b3bd34d3ed96222512',
  databaseId: '91056561-162d-47a7-9057-5a30c2834227',
  apiToken: 'ijkVhaXCw6LSddIMIMxwPL5CDAWznxip5x9I1bNW'
};

async function executeSqlOnD1(sql: string, params: any[] = []) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_CONFIG.accountId}/d1/database/${CLOUDFLARE_CONFIG.databaseId}/query`;
  
  console.log('🔗 URL D1:', url);
  console.log('🔑 API Token (premiers 10 chars):', CLOUDFLARE_CONFIG.apiToken.substring(0, 10) + '...');
  console.log('📝 SQL:', sql);
  console.log('📊 Params:', params);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_CONFIG.apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql, params })
  });
  
  console.log('📡 Response status:', response.status);
  console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ D1 Error response:', errorText);
    throw new Error(`D1 Error: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const result = await response.json();
  console.log('✅ D1 Response:', JSON.stringify(result, null, 2));
  return result;
}

// GET - Récupérer les paramètres
export async function GET() {
  try {
    console.log('🔍 GET settings LeLoup99...');
    
    const result = await executeSqlOnD1('SELECT * FROM settings WHERE id = 1');
    
    if (result.result?.[0]?.results?.length) {
      const settings = result.result[0].results[0];
      console.log('✅ Settings LeLoup99 récupérés:', settings);
      
      // Mapper les champs D1 vers le format attendu par le frontend
      const mappedSettings = {
        ...settings,
        backgroundImage: settings.background_image,
        backgroundOpacity: settings.background_opacity || 20,
        backgroundBlur: settings.background_blur || 5,
        shopTitle: settings.shop_name || 'LeLoup99',
        shopName: settings.shop_name || 'LeLoup99',
        shopDescription: settings.shop_description || '',
        contactInfo: settings.contact_info || '',
        // Ces champs n'existent pas dans le schéma actuel
        whatsappLink: '',
        whatsappNumber: '',
        scrollingText: '',
        titleStyle: settings.theme_color || 'glow'
      };
      
      return NextResponse.json(mappedSettings);
    } else {
      // Retourner des paramètres par défaut LeLoup99
      const defaultSettings = {
        id: 1,
        shop_name: 'LeLoup99',
        background_image: 'https://pub-b38679a01a274648827751df94818418.r2.dev/images/background-oglegacy.jpeg',
        background_opacity: 20,
        background_blur: 5,
        info_content: 'Bienvenue chez LeLoup99 - Votre boutique premium',
        contact_content: 'Contactez LeLoup99 pour toute question',
        backgroundImage: 'https://pub-b38679a01a274648827751df94818418.r2.dev/images/background-oglegacy.jpeg',
        backgroundOpacity: 20,
        backgroundBlur: 5,
        shopTitle: 'LeLoup99',
        shopName: 'LeLoup99'
      };
      
      return NextResponse.json(defaultSettings);
    }
  } catch (error) {
    console.error('❌ Erreur GET settings LeLoup99:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des paramètres' },
      { status: 500 }
    );
  }
}

// POST - Créer ou mettre à jour les paramètres (pour compatibilité)
export async function POST(request: NextRequest) {
  return PUT(request);
}

// PUT - Mettre à jour les paramètres
export async function PUT(request: NextRequest) {
  try {
    console.log('🔧 PUT settings LeLoup99...');
    const body = await request.json();
    console.log('📝 Body reçu:', JSON.stringify(body, null, 2));
    
    // Extraire seulement les champs essentiels avec validation
    const shop_name = String(body.shop_name || 'LeLoup99');
    const background_image = String(body.background_image || '');
    const background_opacity = Number(body.background_opacity || 20);
    const background_blur = Number(body.background_blur || 5);
    const contact_info = String(body.contact_info || '');
    const theme_color = String(body.theme_color || 'glow');

    console.log('📝 Valeurs validées:', {
      shop_name,
      background_image,
      background_opacity,
      background_blur,
      contact_info,
      theme_color
    });
    
    // Test de connexion D1 simple
    console.log('🔍 Test de connexion D1...');
    const testResult = await executeSqlOnD1('SELECT 1 as test');
    console.log('✅ Connexion D1 OK:', JSON.stringify(testResult, null, 2));
    
    // Vérifier si l'enregistrement existe
    console.log('🔍 Vérification existence enregistrement...');
    const checkResult = await executeSqlOnD1('SELECT id FROM settings WHERE id = 1');
    console.log('📊 Résultat check:', JSON.stringify(checkResult, null, 2));
    
    if (checkResult.result?.[0]?.results?.length) {
      // UPDATE
      console.log('📝 Mise à jour enregistrement existant...');
      const updateResult = await executeSqlOnD1(`
        UPDATE settings SET 
          shop_name = ?,
          background_image = ?,
          background_opacity = ?,
          background_blur = ?,
          contact_info = ?,
          theme_color = ?
        WHERE id = 1
      `, [
        shop_name,
        background_image,
        background_opacity,
        background_blur,
        contact_info,
        theme_color
      ]);
      console.log('✅ Update result:', JSON.stringify(updateResult, null, 2));
    } else {
      // INSERT
      console.log('📝 Création nouvel enregistrement...');
      const insertResult = await executeSqlOnD1(`
        INSERT INTO settings (
          id, shop_name, background_image, background_opacity, 
          background_blur, contact_info, theme_color
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        1,
        shop_name,
        background_image,
        background_opacity,
        background_blur,
        contact_info,
        theme_color
      ]);
      console.log('✅ Insert result:', JSON.stringify(insertResult, null, 2));
    }

    // Récupérer les paramètres mis à jour
    console.log('🔍 Récupération des paramètres mis à jour...');
    const result = await executeSqlOnD1('SELECT * FROM settings WHERE id = 1');
    console.log('📊 Résultat récupération:', JSON.stringify(result, null, 2));
    
    if (!result.result?.[0]?.results?.length) {
      throw new Error('Aucun paramètre trouvé après mise à jour');
    }
    
    const settings = result.result[0].results[0];
    console.log('✅ Settings LeLoup99 mis à jour:', settings);

    const mappedSettings = {
      ...settings,
      backgroundImage: settings.background_image,
      backgroundOpacity: settings.background_opacity,
      backgroundBlur: settings.background_blur,
      shopTitle: settings.shop_name || 'LeLoup99',
      shopName: settings.shop_name || 'LeLoup99',
      shopDescription: settings.shop_description || '',
      contactInfo: settings.contact_info || '',
      whatsappLink: '',
      whatsappNumber: '',
      scrollingText: '',
      titleStyle: settings.theme_color || 'glow'
    };

    console.log('🎯 Settings mappés:', JSON.stringify(mappedSettings, null, 2));
    return NextResponse.json(mappedSettings);
  } catch (error) {
    console.error('❌ Erreur PUT settings LeLoup99:', error);
    console.error('❌ Stack trace:', error.stack);
    return NextResponse.json(
      { 
        error: 'Erreur serveur lors de la mise à jour des paramètres',
        details: error.message,
        type: error.constructor.name
      },
      { status: 500 }
    );
  }
}