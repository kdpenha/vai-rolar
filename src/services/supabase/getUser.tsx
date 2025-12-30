import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';

export async function getUser(userId: string) {
    const [creator] = await Promise.all([
        supabase
            .from('profiles')
            .select('nome')
            .eq('id', userId)
    ]) as [
        { data: Profile[] | null; error: any }
    ]

  return { creator };
}
