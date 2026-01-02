import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from 'lucide-react';
import { Attendance } from '@/types/attendance';

interface Props {
  attendances: Attendance[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AttendeesDialog({ attendances, open, onOpenChange }: Props) {
  const positions = ['PG', 'SG', 'SF', 'PF', 'C']

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Quem vai jogar ({attendances.length})</DialogTitle>
        </DialogHeader>
        
        {attendances.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Ninguém confirmou ainda
          </p>
        ) : (
          <ul className="space-y-2">
            {attendances.map((a) => (
              <li key={a.user_id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className="bg-primary/10 rounded-full overflow-hidden h-8 w-8">
                  {a.photo_url ? (
                    <img src={a.photo_url} alt="Foto de Perfil" className='h-full w-full object-cover'/>
                  )
                  : (
                    <User className="h-8 w-8 text-primary p-2" />
                  )}
                </div>
                <span>{a.nome || 'Usuário'} <span className="border border-orange-500 text-xs font-medium px-1 py-1 rounded-sm bg-fuchsia-900">{positions[a.position - 1]}</span></span>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
