import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function obtenerProductos() {
  if (!supabase) {
    console.error('Supabase is not configured. Products cannot be loaded.');
    return null;
  }

  const { data, error } = await supabase
    .from('productos')
    .select('*');

  if (error) {
    console.error('Error al obtener productos:', error);
    return null;
  }

  return data;
}
