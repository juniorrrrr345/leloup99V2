import { NextResponse } from 'next/server';
import { executeSqlOnD1 } from '@/lib/cloudflare-d1';

export async function GET() {
  try {
    const result = await executeSqlOnD1('SELECT * FROM settings WHERE id = 1');
    const settings = result.result?.[0]?.results?.[0] || null;
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Erreur API settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des paramètres' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Vérifier si des paramètres existent déjà
    const existingResult = await executeSqlOnD1('SELECT id FROM settings WHERE id = 1');
    
    if (existingResult.result?.[0]?.results?.length > 0) {
      // Mettre à jour
      await executeSqlOnD1(
        `UPDATE settings SET 
         background_image = ?, background_opacity = ?, background_blur = ?,
         info_content = ?, contact_content = ?, shop_title = ?,
         whatsapp_link = ?, whatsapp_number = ?, scrolling_text = ?, theme_color = ?
         WHERE id = 1`,
        [
          body.background_image || '',
          body.background_opacity || 20,
          body.background_blur || 5,
          body.info_content || '',
          body.contact_content || '',
          body.shop_title || 'CALIWHITE',
          body.whatsapp_link || '',
          body.whatsapp_number || '',
          body.scrolling_text || '',
          body.theme_color || 'glow'
        ]
      );
    } else {
      // Créer
      await executeSqlOnD1(
        `INSERT INTO settings (id, background_image, background_opacity, background_blur,
         info_content, contact_content, shop_title, whatsapp_link, whatsapp_number, scrolling_text, theme_color)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          body.background_image || '',
          body.background_opacity || 20,
          body.background_blur || 5,
          body.info_content || '',
          body.contact_content || '',
          body.shop_title || 'CALIWHITE',
          body.whatsapp_link || '',
          body.whatsapp_number || '',
          body.scrolling_text || '',
          body.theme_color || 'glow'
        ]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur API settings POST:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde des paramètres' },
      { status: 500 }
    );
  }
}