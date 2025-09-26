import { NextResponse } from 'next/server';

// GET - Récupérer tous les liens sociaux
export async function GET() {
  try {
    const ACCOUNT_ID = '7979421604bd07b3bd34d3ed96222512';
    const DATABASE_ID = '852822ec-20e5-4c5a-b411-ecc51f18648c';
    const API_TOKEN = 'ijkVhaXCw6LSddIMIMxwPL5CDAWznxip5x9I1bNW';
    
    const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;
    
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql: 'SELECT * FROM social_links WHERE (is_active = 1 OR is_active = "true" OR is_active IS NULL) ORDER BY created_at ASC',
        params: []
      })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    
    if (data.success && data.result?.[0]?.results) {
      const socialLinks = data.result[0].results.map((link: any) => ({
        ...link,
        _id: link.id, // Frontend s'attend à _id
        platform: link.name, // Mapping correct pour le frontend
        is_available: link.is_active // Mapping correct pour le frontend
      }));
      console.log('🌐 Liens sociaux récupérés:', socialLinks.length);
      return NextResponse.json(socialLinks);
    } else {
      console.log('❌ Pas de résultats ou erreur:', data);
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Erreur récupération liens sociaux:', error);
    return NextResponse.json([]);
  }
}

// POST - Créer un nouveau lien social
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { platform, url, icon = '🔗', is_available = true } = body;

    if (!platform || !url) {
      return NextResponse.json(
        { error: 'La plateforme et l\'URL sont requis' },
        { status: 400 }
      );
    }

    const ACCOUNT_ID = '7979421604bd07b3bd34d3ed96222512';
    const DATABASE_ID = '852822ec-20e5-4c5a-b411-ecc51f18648c';
    const API_TOKEN = 'ijkVhaXCw6LSddIMIMxwPL5CDAWznxip5x9I1bNW';
    
    const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;
    
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql: 'INSERT INTO social_links (name, url, icon, is_active, created_at) VALUES (?, ?, ?, ?, datetime("now"))',
        params: [platform, url, icon, is_available ? 1 : 0]
      })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    console.log('🔍 Réponse création lien social:', data);
    
    if (data.success) {
      console.log('✅ Lien social créé avec succès');
      return NextResponse.json({ success: true, message: 'Lien social créé avec succès' }, { status: 201 });
    } else {
      console.log('❌ Erreur D1:', data);
      throw new Error('Erreur D1');
    }
  } catch (error) {
    console.error('Erreur création lien social:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création du lien social' },
      { status: 500 }
    );
  }
}