import { NextRequest, NextResponse } from 'next/server';
import { executeSqlOnD1 } from '@/lib/cloudflare-d1';

export async function GET() {
  try {
    const result = await executeSqlOnD1(`
      SELECT p.*, c.name as category_name, c.icon as category_icon, c.color as category_color,
             f.name as farm_name, f.description as farm_description, f.location as farm_location
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN farms f ON p.farm_id = f.id
      WHERE p.is_available = 1
      ORDER BY p.created_at DESC
    `);

    const products = result.result?.[0]?.results?.map((row: Record<string, unknown>) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      category_id: row.category_id,
      farm_id: row.farm_id,
      image_url: row.image_url,
      video_url: row.video_url,
      price: row.price,
      stock: row.stock,
      prices: row.prices,
      is_available: Boolean(row.is_available),
      features: row.features,
      tags: row.tags,
      created_at: row.created_at,
      category: row.category_name ? {
        id: row.category_id,
        name: row.category_name,
        icon: row.category_icon,
        color: row.category_color
      } : null,
      farm: row.farm_name ? {
        id: row.farm_id,
        name: row.farm_name,
        description: row.farm_description,
        location: row.farm_location
      } : null
    })) || [];

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Erreur API products:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des produits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    let category_id = body.category_id;
    let farm_id = body.farm_id;

    // Si on reçoit des noms au lieu d'IDs, les convertir
    if (body.category) {
      const catResult = await executeSqlOnD1('SELECT id FROM categories WHERE name = ?', [body.category]);
      if (catResult.success && catResult.result?.[0]?.results?.[0]) {
        category_id = catResult.result[0].results[0].id;
      }
    }

    if (body.farm) {
      const farmResult = await executeSqlOnD1('SELECT id FROM farms WHERE name = ?', [body.farm]);
      if (farmResult.success && farmResult.result?.[0]?.results?.[0]) {
        farm_id = farmResult.result[0].results[0].id;
      }
    }

    const result = await executeSqlOnD1(
      `INSERT INTO products (name, description, category_id, farm_id, image_url, video_url, price, stock, prices, is_available, features, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.name,
        body.description,
        category_id || 1,
        farm_id || 1,
        body.image_url || '',
        body.video_url || '',
        body.price || 0,
        body.stock || 0,
        JSON.stringify(body.prices || {}),
        body.is_available !== false,
        body.features || '',
        body.tags || ''
      ]
    );

    return NextResponse.json({ success: true, id: result.result?.[0]?.meta?.changes });
  } catch (error) {
    console.error('Erreur API products POST:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    );
  }
}