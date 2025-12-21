import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from 'lucide-react';

interface Attendance {
  court_id: string;
  user_id: string;
  nome: string | null;
}

interface Props {
  attendances: Attendance[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AttendeesDialog({ attendances, open, onOpenChange }: Props) {
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
                <div className="bg-primary/10 rounded-full p-2">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span>{a.nome || 'Usuário'}</span>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
