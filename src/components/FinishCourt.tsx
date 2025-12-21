import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { toast } from '@/hooks/use-toast';
import { finish } from "@/services/supabase/finish";

const handleFinish = async ( id : string , onUpdate: () => void) => {
    const { error } = await finish(id);

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Jogo Finalizado' });
      onUpdate();
    }
  };

interface Props {
  id: string,
  onOpenChange: (open: boolean) => void,
  open: boolean,
  onUpdate: () => void
}

export default function FinishCourt({ id, open, onOpenChange, onUpdate }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Terminar jogo</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja terminar este jogo? Não tem como reverter essa ação.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleFinish(id, onUpdate)}>Sim, terminar jogo</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}