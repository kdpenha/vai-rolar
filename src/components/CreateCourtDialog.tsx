import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DialogDescription } from '@radix-ui/react-dialog';
import { getLatLng } from '@/services/nominatin/getLatLng';
import LiveNow from './LiveNow';
import { getLabel } from '@/services/nominatin/getLabel';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export default function CreateCourtDialog({ open, onOpenChange, onCreated }: Props) {
  const [nomeLocal, setNomeLocal] = useState('');
  const [endereco, setEndereco] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [nivel, setNivel] = useState<'iniciante' | 'intermediario' | 'rachao'>('iniciante');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ isLive, setIsLive ] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'Erro', description: 'A imagem deve ter no máximo 2MB', variant: 'destructive' });
      return;
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const resetForm = () => {
    setNomeLocal('');
    setDataHora('');
    setNivel('iniciante');
    setLatitude('');
    setLongitude('');
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      let photoUrl = null;

      if (photo) {
        const courtId = generateId();
        const filePath = `${courtId}/foto.jpg`;

        const { error: uploadError } = await supabase.storage.from('courts').upload(filePath, photo);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('courts').getPublicUrl(filePath);
        photoUrl = urlData.publicUrl;
      }

      const coords = await getLatLng(endereco);

      if (!coords) {
        toast({ title: 'Endereço inválido' });
        setLoading(false);
        return;
      }

      const label = await getLabel(coords.lat, coords.lng);
      const now = new Date();
      const dataHoraDate = new Date(dataHora);

      if (!isLive && dataHoraDate < now) {
        toast({ title: 'Só é possível marcar basquetes futuros' });
        setLoading(false);
        return;
      }

      const { error } = await supabase.from('courts').insert({
        nome_local: nomeLocal,
        data_hora: !isLive ? new Date(dataHora).toISOString() : new Date().toISOString(),
        nivel,
        criado_por: user.id,
        photo_url: photoUrl,
        latitude: coords.lat,
        longitude: coords.lng, 
        status: isLive ? 'live' : 'scheduled',
        started_at: isLive ? new Date().toISOString() : null,
        label: label?.label ?? ''
      });

      if (error) throw error;

      toast({ title: 'Jogo criado com sucesso!' });
      onOpenChange(false);
      resetForm();

      navigate(0);
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Puxa a Lista!</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para marcar um rachão
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Local / Nome da Quadra</Label>
            <Input
              id="nome"
              value={nomeLocal}
              onChange={(e) => setNomeLocal(e.target.value)}
              placeholder="Ex: Vila Olímpica"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataHora">Data e Hora</Label>
            <Input
              id="dataHora"
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
            <Select value={nivel} onValueChange={(v) => setNivel(v as any)}>
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

          {/* <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude (opcional)</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="-23.5505"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Longitude (opcional)</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="-46.6333"
              />
            </div>
          </div> */}

          <div className="space-y-2">
            <Label>Foto da Quadra (opcional, máx. 2MB)</Label>
            {photoPreview ? (
              <div className="relative">
                <img src={photoPreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removePhoto}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mt-2">Clique para enviar</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Aquecendo...' : 'PRONTO'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
