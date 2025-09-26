import { NextResponse } from 'next/server';

async function executeSqlOnD1(sql: string, params: any[] = []) {
  const ACCOUNT_ID = '7979421604bd07b3bd34d3ed96222512';
  const DATABASE_ID = '91056561-162d-47a7-9057-5a30c2834227';
  const API_TOKEN = 'ijkVhaXCw6LSddIMIMxwPL5CDAWznxip5x9I1bNW';
  
  const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;
  
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql, params })
  });
  
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  
  const data = await response.json();
  return data;
}

export async function GET() {
  try {
    const data = await executeSqlOnD1('SELECT id, name, url, icon, is_active as is_available, created_at FROM social_links WHERE (is_active = 1 OR is_active = "true" OR is_active IS NULL) ORDER BY created_at ASC');
    
    if (data.success && data.result?.[0]?.results) {
      return NextResponse.json(data.result[0].results);
    } else {
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('❌ Erreur API réseaux sociaux:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, url, icon, is_active } = await request.json();
    
    const data = await executeSqlOnD1(
      'INSERT INTO social_links (name, url, icon, is_active, created_at) VALUES (?, ?, ?, ?, datetime("now")) RETURNING *',
      [name, url, icon || '📱', is_active !== undefined ? is_active : 1]
    );
    
    if (data.success && data.result?.[0]?.results?.[0]) {
      return NextResponse.json(data.result[0].results[0]);
    } else {
      throw new Error('Échec création social link');
    }
  } catch (error) {
    console.error('❌ Erreur création social link:', error);
    return NextResponse.json({ error: 'Erreur création social link' }, { status: 500 });
  }
}