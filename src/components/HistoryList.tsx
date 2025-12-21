import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserHistory } from '@/services/supabase/history';

type Nivel = 'iniciante' | 'intermediario' | 'rachao';

interface Court {
  id: string;
  nome_local: string;
  data_hora: string;
  nivel: Nivel;
  count: number;
}

const nivelColors: Record<Nivel, string> = {
  iniciante: 'bg-green-500',
  intermediario: 'bg-yellow-500',
  rachao: 'bg-red-500'
};

const nivelLabels: Record<Nivel, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  rachao: 'Rachão'
};

export default function HistoryList() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      const now = new Date().toISOString();
      const { data } = await getUserHistory(user.id, now);

      if (data) {
        const courtsWithCount: Court[] = data
        .filter(a => a.court)
        .map(a => ({
          id: a.court.id,
          nome_local: a.court.nome_local,
          data_hora: a.court.data_hora,
          nivel: a.court.nivel as Nivel,
          count: 1
        }))

        setCourts(courtsWithCount)
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (courts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhum jogo no histórico</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courts.map((court) => (
        <Card key={court.id} className="border-border/30 opacity-75">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <h3 className="font-medium">{court.nome_local}</h3>
              <Badge className={`${nivelColors[court.nivel]} text-white`}>
                {nivelLabels[court.nivel]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(court.data_hora), "d 'de' MMMM, HH:mm", { locale: ptBR })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{court.count}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
