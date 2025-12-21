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

import { Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const handleDelete = async ( id : string , onUpdate: () => void) => {
    const { error } = await supabase
      .from('courts')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Jogo cancelado' });
      onUpdate();
    }
  };

interface Props {
  id: string,
  onOpenChange: (open: boolean) => void,
  open: boolean,
  onUpdate: () => void
}

export default function DeleteCourt({ id, open, onOpenChange, onUpdate }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar jogo</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja cancelar este jogo?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(id, onUpdate)}>Sim, cancelar jogo</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}