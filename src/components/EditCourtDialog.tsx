import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { updateCourt } from '../services/supabase/update';
import { getAddress } from '@/services/nominatin/getAddress';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Court } from '@/types/court';
import { Nivel } from '@/types/level';
import LiveNow from './LiveNow';

interface Props {
  court: Court;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export default function EditCourtDialog({ court, open, onOpenChange, onUpdate }: Props) {
  const [nomeLocal, setNomeLocal] = useState(court.nome_local);
  const date = new Date(court.data_hora)
  const [endereco, setEndereco] = useState('');
  const [ isLive, setIsLive ] = useState(court.status === 'live');

  const localDateTime = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16)

  const [dataHora, setDataHora] = useState(localDateTime)
  const [nivel, setNivel] = useState<Nivel>(court.nivel);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (court.latitude && court.longitude) {
      const enderecoStr = await getAddress(court.latitude, court.longitude);

      setEndereco(enderecoStr || '');
    }
  };

  useEffect(() => {
    fetchData();
  }, [ open ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await updateCourt(court, nomeLocal, dataHora, nivel, endereco, isLive);

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
      setLoading(false);
    } else {
      toast({ title: 'Jogo atualizado!' });
      onOpenChange(false);
      onUpdate();
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Jogo</DialogTitle>
          <DialogDescription>
            Edite as informações do jogo
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-nome">Local / Nome da Quadra</Label>
            <Input
              id="edit-nome"
              value={nomeLocal}
              onChange={(e) => setNomeLocal(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-dataHora">Data e Hora</Label>
            <Input
              id="edit-dataHora"
              type="datetime-local"
              value={dataHora}
              disabled={ isLive }
              onChange={(e) => setDataHora(e.target.value)}
              required
            />
          </div>

          <LiveNow value={isLive} onChange={setIsLive} />

          <div className="space-y-2">
            <Label>Nível</Label>
            <Select value={nivel} onValueChange={(v: Nivel) => setNivel(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="iniciante">Iniciante</SelectItem>
                <SelectItem value="intermediario">Intermediário</SelectItem>
                <SelectItem value="rachao">Rachão</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Ex: Rua Garibaldi, Jardim 25 de Agosto"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
