import { NextResponse } from 'next/server';

// DELETE - Supprimer un lien social
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
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
        sql: 'DELETE FROM social_links WHERE id = ?',
        params: [id]
      })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Lien social supprimé avec succès');
      return NextResponse.json({ 
        success: true, 
        message: 'Lien social supprimé avec succès.' 
      });
    } else {
      throw new Error('Erreur D1');
    }
  } catch (error) {
    console.error('Erreur suppression lien social:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression du lien social' },
      { status: 500 }
    );
  }
}

// PUT - Modifier un lien social
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { platform, url, icon, is_available } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

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
        sql: 'UPDATE social_links SET name = ?, url = ?, icon = ?, is_active = ?, updated_at = datetime("now") WHERE id = ?',
        params: [platform, url, icon || '🔗', is_available ? 1 : 0, id]
      })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Lien social modifié avec succès');
      return NextResponse.json({ 
        success: true, 
        message: 'Lien social modifié avec succès.' 
      });
    } else {
      throw new Error('Erreur D1');
    }
  } catch (error) {
    console.error('Erreur modification lien social:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la modification du lien social' },
      { status: 500 }
    );
  }
}