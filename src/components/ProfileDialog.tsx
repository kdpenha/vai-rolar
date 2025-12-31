import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileDialog({ open, onOpenChange }: Props) {
  const [nome, setNome] = useState('');
  const [position, setPosition] = useState(1)
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (open && user) {
      supabase
        .from('profiles')
        .select('nome, position')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setNome(data.nome);
          if (data) setPosition(data.position);
        });
    }
  }, [open, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, nome, position });

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Perfil atualizado!' });
      onOpenChange(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Meu Perfil</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email || ''} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-nome">Nome</Label>
            <Input
              id="profile-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
      
          <div className='space-y-2'>
            <label htmlFor="position" className="block text-sm font-medium text-white-700 mb-1">
              Posição <span className="border border-orange-500 text-xs font-medium px-1 py-1 rounded-sm bg-orange-600">Novo</span>
            </label>
            <select
              id="position"
              value={position}
              onChange={(e) => {setPosition(Number(e.target.value))}}
              className="block w-full rounded-md text-sm font-medium border border-gray-300 bg-card py-2 px-5 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
            >
              <option value="1">Armador</option>
              <option value="2">Ala-Armador</option>
              <option value="3">Ala</option>
              <option value="4">Ala-Pivô</option>
              <option value="5">Pivô</option>
            </select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
