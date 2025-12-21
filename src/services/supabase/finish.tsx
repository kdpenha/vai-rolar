import { supabase } from '@/integrations/supabase/client'
import { Court } from '@/types/court';

export async function finish(id: string) {
  return supabase
    .from('courts')
    .update({
      status: 'finished',
      ended_at: new Date().toISOString(),
    })
    .eq('id', id)
}