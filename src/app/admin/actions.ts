'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function clearAllProducts() {
  try {
    // 1. Delete all product images from database
    await supabase.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. Delete all products from database
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 3. Clear storage bucket
    const { data: files } = await supabase.storage.from('products').list();
    if (files && files.length > 0) {
      const filesToDelete = files.map(f => f.name);
      await supabase.storage.from('products').remove(filesToDelete);
    }

    // Clear cache
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/category/all');

    return { success: true };
  } catch (error: any) {
    console.error('Clear products error:', error);
    return { success: false, error: error.message };
  }
}

export async function revalidateStore() {
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/category/all');
  return { success: true };
}
