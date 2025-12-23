import { supabase } from '@/integrations/supabase/client';
import { Court } from '@/types/court';
import { Attendance } from '@/types/attendance';
import { CourtFilters } from '@/types/courtFilters';

export async function getCourts(page: number, limit: number, status: string, filters: CourtFilters = {}) {
  const { searchTerm, dateFilter } = filters;
  const from = page * limit;
  const to = from + limit - 1;

  const ascending = dateFilter == 'maisProximos' || dateFilter == undefined ? true : false;

  let courtsQuery = supabase
    .from('courts')
    .select('*', { count: 'exact' })
    .range(from, to);

    if (searchTerm) {
      courtsQuery = courtsQuery.or(
        `nome_local.ilike.%${searchTerm}%,label.ilike.%${searchTerm}%`
      );
    }

    const now = new Date().toISOString();

    if (status === 'scheduled') {
      courtsQuery = courtsQuery.eq('status', 'scheduled');
      courtsQuery = courtsQuery.gte('data_hora', now);
      courtsQuery = courtsQuery.order('data_hora', { ascending: ascending, nullsFirst: false })
    } else {
      courtsQuery = courtsQuery.or(
        `status.eq.live,and(status.eq.scheduled,data_hora.lte.${now})`
      );

      courtsQuery = courtsQuery.order('started_at', {
        ascending: !ascending,
        nullsFirst: false
      });
    }

  const [courtsRes, attendancesRes] = await Promise.all([
    courtsQuery,
    supabase
      .from('attendances')
      .select('court_id, user_id')

  ]) as [
    { data: Court[] | null; error: any; count: number | null },
    { data: Attendance[] | null; error: any }
  ];

  return { courtsRes, attendancesRes };
}
