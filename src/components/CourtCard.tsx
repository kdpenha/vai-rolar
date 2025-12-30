import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Calendar, Clock, MapPin, Users, Trash2, Edit, PowerOff, User } from 'lucide-react';
import EditCourtDialog from './EditCourtDialog';
import AttendeesDialog from './AttendeesDialog';
import DeleteCourt from './DeleteCourt';
import { Nivel } from '@/types/level';
import { Court } from '@/types/court';
import { Attendance } from '@/types/attendance';
import FinishCourt from './FinishCourt';
import { getUser } from '@/services/supabase/getUser';

interface Props {
  court: Court;
  attendances: Attendance[];
  isAttending: boolean;
  isOwner: boolean;
  onUpdate: () => void;
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

export default function CourtCard({ court, attendances, isAttending, isOwner, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [attendeesOpen, setAttendeesOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [ isLive, setIsLive ] = useState(court.status === 'live');
  const [ isFinished, setIsFinished ] = useState(false);
  const { user } = useAuth();
  const [ creator, setCreator ] = useState('')

  useEffect( () => {
    if (!user?.id) return;

    getUser(user.id).then( ({ creator }) => {
      if(!creator.error && creator.data?.length) {
        setCreator(creator.data[0].nome)
      }
    })
  }, [])

  const handleJoin = async () => {
    if (!user) return;
    setLoading(true);
    
    const { error } = await supabase
      .from('attendances')
      .insert({ court_id: court.id, user_id: user.id });

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } else {
      const swish = new Audio('/src/swish.mp3')
      swish.volume = 0.5
      swish.play()
      toast({ title: 'Você entrou no jogo!' })
      onUpdate()
    }
    setLoading(false);
  };

  const handleLeave = async () => {
    if (!user) return;
    setLoading(true);
    
    const { error } = await supabase
      .from('attendances')
      .delete()
      .eq('court_id', court.id)
      .eq('user_id', user.id);

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Você saiu do jogo' });
      onUpdate();
    }
    setLoading(false);
  };

  const dateTime = court.status == 'live'
  ? new Date(
    court.started_at.replace(' ', 'T')
  )
  : new Date(
    court.data_hora.replace(' ', 'T')
  )

  return (
    <>
      <Card className="overflow-hidden border-border/50 hover:border-primary/50 transition-colors">
        {court.photo_url && (
          <div className="h-40 overflow-hidden">
            <img 
              src={court.photo_url} 
              alt={court.nome_local}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{court.nome_local}</h3>
              <Badge className={`${nivelColors[court.nivel]} text-white mt-1`}>
                {nivelLabels[court.nivel]}
              </Badge>
            </div>
            {isOwner && (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => isLive ? setIsFinished(true) : setDeleteOpen(true)} disabled={loading}>
                  { isLive ? (
                    <PowerOff className="h-4 w-4 text-destructive" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-destructive" />
                  ) }
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-2 pb-2">
          { court.status == 'scheduled' && court.data_hora > new Date().toISOString() && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(dateTime, "EEEE, d 'de' MMMM", { locale: ptBR })}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {(court.status === 'live' ||
                (court.status === 'scheduled' &&
                court.data_hora <= new Date().toISOString())) && (
                  <span className="font-black text-green-400 animate-pulse duration-500">
                    ROLANDO DESDE{' '}
                  </span>
              )}
              {format(dateTime, 'HH:mm')}
            </span>

          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4"/>
            <span>Criado por <span className='font-bold'>{ creator }</span></span>
          </div>
          {court.latitude && court.longitude && (
            <a 
              href={`https://maps.google.com/?q=${court.latitude},${court.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <MapPin className="h-4 w-4" />
              <span>Ver no mapa</span>
            </a>
          )}
        </CardContent>
        
        <CardFooter className="flex items-center justify-between pt-2 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground"
            onClick={() => setAttendeesOpen(true)}
          >
            <Users className="h-4 w-4 mr-1" />
            {attendances.length} confirmado{attendances.length !== 1 ? 's' : ''}
          </Button>
          
          {isAttending ? (
            <Button variant="outline" onClick={handleLeave} disabled={loading}>
              Sair da lista
            </Button>
          ) : (
            <Button onClick={handleJoin} disabled={loading}>
              Vou Jogar!
            </Button>
          )}

          {/* <Button
            size="sm" 
            onClick={
              () => setEditOpen(true)
            }
            className="bg-[oklch(43.2%_0.095_166.913)] hover:bg-[oklch(38%_0.095_166.913)] text-white"
          >
            Começar Jogo
          </Button> */}

        </CardFooter>
      </Card>

      <EditCourtDialog court={court} open={editOpen} onOpenChange={setEditOpen} onUpdate={onUpdate} />
      <AttendeesDialog attendances={attendances} open={attendeesOpen} onOpenChange={setAttendeesOpen} />
      <DeleteCourt id={ court.id } open={ deleteOpen } onOpenChange={ setDeleteOpen } onUpdate={ onUpdate } />
      <FinishCourt id={ court.id } open={ isFinished } onOpenChange={ setIsFinished } onUpdate={ onUpdate } />
    </>
  );
}
