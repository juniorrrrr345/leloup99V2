import { NextRequest, NextResponse } from 'next/server';

// Configuration Cloudflare D1 hardcodée
const CLOUDFLARE_CONFIG = {
  accountId: '7979421604bd07b3bd34d3ed96222512',
  databaseId: '852822ec-20e5-4c5a-b411-ecc51f18648c',
  apiToken: 'ijkVhaXCw6LSddIMIMxwPL5CDAWznxip5x9I1bNW'
};

async function executeSqlOnD1(sql: string, params: any[] = []) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_CONFIG.accountId}/d1/database/${CLOUDFLARE_CONFIG.databaseId}/query`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_CONFIG.apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql, params })
  });
  
  if (!response.ok) {
    throw new Error(`D1 Error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

// GET - Récupérer les paramètres
export async function GET() {
  try {
    console.log('🔍 GET settings LELOUP99...');
    
    const result = await executeSqlOnD1('SELECT * FROM settings WHERE id = 1');
    
    if (result.result?.[0]?.results?.length) {
      const settings = result.result[0].results[0];
      console.log('✅ Settings LELOUP99 récupérés:', settings);
      
      // Mapper les champs D1 vers le format attendu par le frontend
      const mappedSettings = {
        ...settings,
        backgroundImage: settings.background_image,
        backgroundOpacity: settings.background_opacity || 20,
        backgroundBlur: settings.background_blur || 5,
        shopTitle: settings.shop_name || 'LELOUP99',
        shopName: settings.shop_name || 'LELOUP99',
        shopDescription: settings.shop_description || '',
        contactInfo: settings.contact_info || '',
        whatsappLink: settings.whatsapp_link || '',
        whatsappNumber: settings.whatsapp_number || '',
        scrollingText: settings.scrolling_text || '',
        titleStyle: settings.theme_color || 'glow'
      };
      
      return NextResponse.json(mappedSettings);
    } else {
      // Retourner des paramètres par défaut LELOUP99
      const defaultSettings = {
        id: 1,
        shop_name: 'LELOUP99',
        background_image: 'https://pub-b38679a01a274648827751df94818418.r2.dev/images/background-oglegacy.jpeg',
        background_opacity: 20,
        background_blur: 5,
        info_content: 'Bienvenue chez LELOUP99 - Votre boutique premium',
        contact_content: 'Contactez LELOUP99 pour toute question',
        backgroundImage: 'https://pub-b38679a01a274648827751df94818418.r2.dev/images/background-oglegacy.jpeg',
        backgroundOpacity: 20,
        backgroundBlur: 5,
        shopTitle: 'LELOUP99',
        shopName: 'LELOUP99'
      };
      
      return NextResponse.json(defaultSettings);
    }
  } catch (error) {
    console.error('❌ Erreur GET settings LELOUP99:', error);
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
    console.log('🔧 PUT settings LELOUP99...');
    const body = await request.json();
    
    const {
      background_image,
      backgroundImage,
      background_opacity,
      backgroundOpacity,
      background_blur,
      backgroundBlur,
      shop_name,
      shopName,
      shop_description,
      shopDescription,
      contact_info,
      contactInfo,
      whatsapp_link,
      whatsappLink,
      whatsapp_number,
      whatsappNumber,
      scrolling_text,
      scrollingText,
      theme_color,
      titleStyle
    } = body;

    // Utiliser les champs avec priorité aux versions snake_case
    const finalBackgroundImage = background_image || backgroundImage;
    const finalBackgroundOpacity = background_opacity ?? backgroundOpacity ?? 20;
    const finalBackgroundBlur = background_blur ?? backgroundBlur ?? 5;
    const finalShopName = shop_name || shopName || 'LELOUP99';
    const finalShopDescription = shop_description || shopDescription || 'Bienvenue chez LELOUP99';
    const finalContactInfo = contact_info || contactInfo || 'Contactez LELOUP99';
    const finalWhatsappLink = whatsapp_link || whatsappLink || '';
    const finalWhatsappNumber = whatsapp_number || whatsappNumber || '';
    const finalScrollingText = scrolling_text || scrollingText || '';
    const finalThemeColor = theme_color || titleStyle || 'glow';

    // Vérifier si un enregistrement existe
    const checkResult = await executeSqlOnD1('SELECT id FROM settings WHERE id = 1');
    
    if (checkResult.result?.[0]?.results?.length) {
      // UPDATE
      await executeSqlOnD1(`
        UPDATE settings SET 
          background_image = ?, 
          background_opacity = ?, 
          background_blur = ?,
          shop_name = ?,
          shop_description = ?,
          contact_info = ?,
          whatsapp_link = ?,
          whatsapp_number = ?,
          scrolling_text = ?,
          theme_color = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `, [
        finalBackgroundImage,
        finalBackgroundOpacity,
        finalBackgroundBlur,
        finalShopName,
        finalShopDescription,
        finalContactInfo,
        finalWhatsappLink,
        finalWhatsappNumber,
        finalScrollingText,
        finalThemeColor
      ]);
    } else {
      // INSERT
      await executeSqlOnD1(`
        INSERT INTO settings (
          id, background_image, background_opacity, background_blur, 
          shop_name, shop_description, contact_info, whatsapp_link,
          whatsapp_number, scrolling_text, theme_color
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        1,
        finalBackgroundImage,
        finalBackgroundOpacity,
        finalBackgroundBlur,
        finalShopName,
        finalShopDescription,
        finalContactInfo,
        finalWhatsappLink,
        finalWhatsappNumber,
        finalScrollingText,
        finalThemeColor
      ]);
    }

    // Récupérer les paramètres mis à jour
    const result = await executeSqlOnD1('SELECT * FROM settings WHERE id = 1');
    const settings = result.result[0].results[0];
    
    console.log('✅ Settings LELOUP99 mis à jour:', settings);

    const mappedSettings = {
      ...settings,
      backgroundImage: settings.background_image,
      backgroundOpacity: settings.background_opacity,
      backgroundBlur: settings.background_blur,
      shopTitle: settings.shop_name || 'LELOUP99',
      shopName: settings.shop_name || 'LELOUP99',
      shopDescription: settings.shop_description || '',
      contactInfo: settings.contact_info || '',
      whatsappLink: settings.whatsapp_link || '',
      whatsappNumber: settings.whatsapp_number || '',
      scrollingText: settings.scrolling_text || '',
      titleStyle: settings.theme_color || 'glow'
    };

    return NextResponse.json(mappedSettings);
  } catch (error) {
    console.error('❌ Erreur PUT settings LELOUP99:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour des paramètres' },
      { status: 500 }
    );
  }
}