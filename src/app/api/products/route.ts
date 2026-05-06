import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const categorySlug = searchParams.get('category');
  const categoryId = searchParams.get('categoryId');
  const limit = 20;
  
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      product_images (
        url
      )
    `)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (categorySlug) {
    // First get category ID from slug
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();
    
    if (catData) {
      query = query.eq('category_id', catData.id);
    }
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
