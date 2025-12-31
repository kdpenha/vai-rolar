import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CourtCard from './CourtCard';
import { Skeleton } from '@/components/ui/skeleton';
import CreateCourtDialog from './CreateCourtDialog';
import { Court } from '@/types/court';
import { Attendance } from '@/types/attendance';
import { Nivel } from '@/types/level';
import { getCourts } from '@/services/supabase/getCourts';
import { Button } from './ui/button';
import CourtListDisplay from './CourtListDisplay';
import FilterDropdown from './FIlterDropdown';
import { CourtFilters } from '@/types/courtFilters';
import { getAttendancesWithProfiles } from '@/services/supabase/getAttendancesWithProfiles';

export default function CourtsList() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [ dateFilter, setDateFilter ] = useState('maisProximos');
  const [ searchTerm, setSearchTerm ] = useState('');

  const fetchData = async (pageNumber: number, filters: CourtFilters = {}) => {
    setLoading(true);

    const { searchTerm, dateFilter } = filters;

    const { courtsRes, attendancesRes } = await getCourts(pageNumber, limit, 'live', { searchTerm, dateFilter });

    if (courtsRes.data) {
      setCourts(courtsRes.data.map(c => ({ ...c, nivel: c.nivel as Nivel })));
      setTotalPages(Math.ceil(courtsRes.count / limit));
    }

    if (attendancesRes.data) {
      const userIds = [...new Set(attendancesRes.data.map(a => a.user_id))];
      const profileMap = await getAttendancesWithProfiles(userIds)

      setAttendances(attendancesRes.data.map(a => ({
        court_id: a.court_id,
        user_id: a.user_id,
        nome: profileMap.get(a.user_id)?.nome || null,
        position: profileMap.get(a.user_id)?.position || null
      })));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData(page);
  }, [ page ]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Button onClick={() => setOpenDialog(true)}>+ Novo Jogo</Button>
        <FilterDropdown 
          dateFilter={dateFilter} 
          setDateFilter={setDateFilter} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          onApply={({ searchTerm, dateFilter }) => {
            fetchData(0, { searchTerm, dateFilter }); // chama sua função pra buscar os courts com os filtros
          }}
          live={true}
        />
      </div>

      <CourtListDisplay
        courts={courts}
        attendances={attendances}
        loading={loading}
        page={page}
        fetchData={fetchData}
      />

      {totalPages > 1 && courts.length > 0 && (
        <div className="flex justify-center space-x-2">
          <Button disabled={page === 0} onClick={() => setPage(prev => prev - 1)}>Anterior</Button>
          <span>Página {page + 1} de {totalPages}</span>
          <Button disabled={page + 1 >= totalPages} onClick={() => setPage(prev => prev + 1)}>Próxima</Button>
        </div>
      )}

      <CreateCourtDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onCreated={() => fetchData(page)}
      />
    </div>
  );
}