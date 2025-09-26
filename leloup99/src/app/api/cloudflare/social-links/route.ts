import { NextResponse } from 'next/server';
import { executeSqlOnD1 } from '@/lib/cloudflare-d1';

export async function GET() {
  try {
    const result = await executeSqlOnD1('SELECT * FROM social_links WHERE is_available = 1 ORDER BY platform');
    const socialLinks = result.result?.[0]?.results || [];
    return NextResponse.json({ socialLinks });
  } catch (error) {
    console.error('Erreur API social-links:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des liens sociaux' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    await executeSqlOnD1(
      'INSERT INTO social_links (platform, url, icon, is_available) VALUES (?, ?, ?, ?)',
      [body.platform, body.url, body.icon || '📱', body.is_available !== false]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur API social-links POST:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du lien social' },
      { status: 500 }
    );
  }
}