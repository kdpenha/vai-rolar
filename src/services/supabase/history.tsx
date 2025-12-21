import { supabase } from '@/integrations/supabase/client'

export async function getUserHistory(userId: string, now: string) {
  return supabase
    .from('attendances')
    .select(`
      court:courts (
        id,
        nome_local,
        data_hora,
        nivel
      )
    `)
    .eq('user_id', userId)
    .lte('court.data_hora', now)
    .order('data_hora', {
      ascending: false,
      referencedTable: 'courts',
    })
}