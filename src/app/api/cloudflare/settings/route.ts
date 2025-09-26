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
        shopTitle: 'LeLoup99', // Valeur par défaut car shop_name n'existe pas
        shopName: 'LeLoup99', // Valeur par défaut car shop_name n'existe pas
        shopDescription: '', // Pas de colonne correspondante
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
    
    // Test de connexion D1 simple
    console.log('🔍 Test de connexion D1...');
    const testResult = await executeSqlOnD1('SELECT 1 as test');
    console.log('✅ Connexion D1 OK:', JSON.stringify(testResult, null, 2));
    
    // Vérifier la structure de la table
    console.log('🔍 Vérification structure table...');
    const tableInfo = await executeSqlOnD1("PRAGMA table_info(settings)");
    console.log('📊 Structure table:', JSON.stringify(tableInfo, null, 2));
    
    // Extraire les colonnes disponibles
    const availableColumns = tableInfo.result?.[0]?.results?.map((col: any) => col.name) || [];
    console.log('📋 Colonnes disponibles:', availableColumns);
    
    // Construire dynamiquement la requête UPDATE basée sur les colonnes disponibles
    const updateFields = [];
    const updateValues = [];
    
    if (availableColumns.includes('background_image')) {
      updateFields.push('background_image = ?');
      updateValues.push(String(body.background_image || ''));
    }
    
    if (availableColumns.includes('background_opacity')) {
      updateFields.push('background_opacity = ?');
      updateValues.push(Number(body.background_opacity || 20));
    }
    
    if (availableColumns.includes('background_blur')) {
      updateFields.push('background_blur = ?');
      updateValues.push(Number(body.background_blur || 5));
    }
    
    if (availableColumns.includes('contact_info')) {
      updateFields.push('contact_info = ?');
      updateValues.push(String(body.contact_info || ''));
    }
    
    if (availableColumns.includes('theme_color')) {
      updateFields.push('theme_color = ?');
      updateValues.push(String(body.theme_color || 'glow'));
    }
    
    console.log('🔧 Champs à mettre à jour:', updateFields);
    console.log('📊 Valeurs:', updateValues);
    
    if (updateFields.length === 0) {
      throw new Error('Aucune colonne compatible trouvée dans la table');
    }
    
    // Vérifier si l'enregistrement existe
    console.log('🔍 Vérification existence enregistrement...');
    const checkResult = await executeSqlOnD1('SELECT id FROM settings WHERE id = 1');
    console.log('📊 Résultat check:', JSON.stringify(checkResult, null, 2));
    
    if (checkResult.result?.[0]?.results?.length) {
      // UPDATE
      console.log('📝 Mise à jour enregistrement existant...');
      const updateQuery = `UPDATE settings SET ${updateFields.join(', ')} WHERE id = 1`;
      console.log('📝 Query UPDATE:', updateQuery);
      
      const updateResult = await executeSqlOnD1(updateQuery, updateValues);
      console.log('✅ Update result:', JSON.stringify(updateResult, null, 2));
    } else {
      // INSERT - Créer avec les colonnes disponibles
      console.log('📝 Création nouvel enregistrement...');
      const insertColumns = ['id', ...availableColumns.filter(col => 
        ['background_image', 'background_opacity', 'background_blur', 'contact_info', 'theme_color'].includes(col)
      )];
      const insertValues = [1];
      
      // Ajouter les valeurs dans le même ordre que les colonnes
      insertColumns.slice(1).forEach(col => {
        if (col === 'background_image') insertValues.push(String(body.background_image || ''));
        else if (col === 'background_opacity') insertValues.push(Number(body.background_opacity || 20));
        else if (col === 'background_blur') insertValues.push(Number(body.background_blur || 5));
        else if (col === 'contact_info') insertValues.push(String(body.contact_info || ''));
        else if (col === 'theme_color') insertValues.push(String(body.theme_color || 'glow'));
      });
      
      const insertQuery = `INSERT INTO settings (${insertColumns.join(', ')}) VALUES (${insertColumns.map(() => '?').join(', ')})`;
      console.log('📝 Query INSERT:', insertQuery);
      console.log('📊 Valeurs INSERT:', insertValues);
      
      const insertResult = await executeSqlOnD1(insertQuery, insertValues);
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

    // Mapping adaptatif basé sur les colonnes disponibles
    const mappedSettings = {
      ...settings,
      backgroundImage: settings.background_image || '',
      backgroundOpacity: settings.background_opacity || 20,
      backgroundBlur: settings.background_blur || 5,
      shopTitle: 'LeLoup99',
      shopName: 'LeLoup99',
      shopDescription: '',
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