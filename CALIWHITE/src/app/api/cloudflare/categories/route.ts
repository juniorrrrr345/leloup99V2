import { NextResponse } from 'next/server';
import { executeSqlOnD1 } from '@/lib/cloudflare-d1';

export async function GET() {
  try {
    const result = await executeSqlOnD1('SELECT * FROM categories ORDER BY name');
    const categories = result.result?.[0]?.results || [];
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Erreur API categories:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des catégories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    await executeSqlOnD1(
      'INSERT INTO categories (name, icon, color) VALUES (?, ?, ?)',
      [body.name, body.icon || '📦', body.color || '#22C55E']
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur API categories POST:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    );
  }
}