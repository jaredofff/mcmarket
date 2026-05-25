import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function obtenerProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select('*');

  if (error) {
    console.error('Error al obtener productos:', error);
    return null;
  }

  return data;
}
