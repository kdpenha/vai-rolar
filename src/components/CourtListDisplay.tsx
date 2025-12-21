import CourtCard from './CourtCard';
import { Skeleton } from '@/components/ui/skeleton';
import { CourtListDisplayProps } from '@/types/courtListDisplay';
import { Nivel } from '@/types/level';
import { useAuth } from '@/contexts/AuthContext';



export default function CourtListDisplay({
  courts,
  attendances,
  loading,
  page,
  fetchData
}: CourtListDisplayProps) {
  const { user } = useAuth();

  if (loading) {
    return (
      <>
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </>
    );
  }

  if (courts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhum jogo agendado</p>
        <p className="text-sm">Clique no + para criar um!</p>
      </div>
    );
  }

  return (
    <>
      {courts.map(court => {
        const courtAttendances = attendances.filter(a => a.court_id === court.id);
        const isAttending = courtAttendances.some(a => a.user_id === user?.id);
        const isOwner = court.criado_por === user?.id;

        return (
          <CourtCard
            key={court.id}
            court={{ ...court, nivel: court.nivel as Nivel }}
            attendances={courtAttendances}
            isAttending={isAttending}
            isOwner={isOwner}
            onUpdate={() => fetchData(page)}
          />
        );
      })}
    </>
  );
}