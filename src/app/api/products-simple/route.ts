import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Utiliser les valeurs hardcodées pour éviter les problèmes d'env
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
      body: JSON.stringify({
        sql: "SELECT * FROM products ORDER BY created_at DESC",
        params: []
      })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    
    console.log('🔍 Debug products-simple response:', data);
    
    if (data.success && data.result?.[0]?.results) {
      const products = data.result[0].results.map((product: any) => {
        let prices = {};
        let features = [];
        let tags = [];
        
        try {
          prices = JSON.parse(product.prices || '{}');
          features = JSON.parse(product.features || '[]');
          tags = JSON.parse(product.tags || '[]');
        } catch (e) {
          prices = {};
          features = [];
          tags = [];
        }
        
        return {
          id: product.id,
          name: product.name,
          description: product.description || '',
          category_id: product.category_id,
          farm_id: product.farm_id,
          image_url: product.image_url || '',
          video_url: product.video_url || '',
          prices: prices,
          price: product.price || 0,
          stock: product.stock || 0,
          is_available: product.is_available !== false,
          features: features,
          tags: tags
        };
      });
      
      console.log('✅ Products retournés:', products.length);
      return NextResponse.json(products);
    } else {
      console.log('❌ Pas de résultats ou erreur:', data);
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('❌ Erreur API produits:', error);
    return NextResponse.json([], { status: 500 });
  }
}