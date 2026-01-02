import { supabase } from '@/integrations/supabase/client';

export async function getAttendancesWithProfiles(userIds: string[]) {
    const { data: profiles } = await supabase.from('profiles').select('id, nome, position, photo_url').in('id', userIds);
    return new Map(profiles?.map(p => [p.id, { nome: p.nome, position: p.position, photo_url: p.photo_url }]) || []);
}