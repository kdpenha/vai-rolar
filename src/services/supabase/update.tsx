import { supabase } from '@/integrations/supabase/client'
import { getLatLng } from '@/services/nominatin/getLatLng';
import { toast } from '@/hooks/use-toast';
import { Nivel } from '@/types/level';
import { Court } from '@/types/court';
import { getLabel } from '../nominatin/getLabel';

export async function updateCourt(court: Court, nomeLocal: string, dataHora: string, nivel: Nivel, endereco: string, isLive: boolean) {
    const coords = await getLatLng(endereco);

    if (!coords) {
        toast({ title: 'Endereço inválido' });
        return;
    }

    const label = await getLabel(coords.lat, coords.lng);

    if (!isLive && dataHora < new Date().toISOString()) {
        toast({ title: 'Só é possível marcar basquetes futuros' });
        return;
    }

    return supabase.from('courts')
        .update({
            nome_local: nomeLocal,
            data_hora: !isLive ? new Date(dataHora).toISOString() : new Date().toISOString(),
            nivel,
            latitude: coords.lat,
            longitude: coords.lng,
            status: isLive ? 'live' : 'scheduled',
            started_at: isLive ? new Date().toISOString() : null,
            label: label?.label ?? ''
        })
        .eq('id', court.id)
        .select()
}