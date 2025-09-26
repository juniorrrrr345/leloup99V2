import { NextResponse } from 'next/server';
import { executeSqlOnD1 } from '@/lib/cloudflare-d1';

export async function GET() {
  try {
    const result = await executeSqlOnD1('SELECT * FROM farms ORDER BY name');
    const farms = result.result?.[0]?.results || [];
    return NextResponse.json({ farms });
  } catch (error) {
    console.error('Erreur API farms:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des farms' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    await executeSqlOnD1(
      'INSERT INTO farms (name, description, location, contact) VALUES (?, ?, ?, ?)',
      [body.name, body.description || '', body.location || '', body.contact || '']
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur API farms POST:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la farm' },
      { status: 500 }
    );
  }
}