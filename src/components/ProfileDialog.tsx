import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileDialog({ open, onOpenChange }: Props) {
  const [nome, setNome] = useState('');
  const [position, setPosition] = useState(1)
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [hasPhoto, setHasPhoto] = useState(false)
  const { user } = useAuth();
  const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

  useEffect(() => {
    if (open && user) {
      supabase
        .from('profiles')
        .select('nome, position, photo_url')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setNome(data.nome);
          if (data && data.position) setPosition(data.position);
          if (data && data.photo_url) {
            setPhotoPreview(data.photo_url)
            setHasPhoto(true)
          }
        });
    }
  }, [open, user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'Erro', description: 'A imagem deve ter no máximo 2MB', variant: 'destructive' });
      return;
    }

    const input = e.target;
    input.value = '';

    setPhoto(file);
    setPhotoPreview(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    let photoUrl = null;
  
    if (photo) {
      const ext = photo.name.split('.').pop();
      const randomId = generateId()
      const filePath = `${user.id}/profile_picture_${randomId}.${ext}`;

      const { error: uploadError } = await supabase.storage.from('profiles').upload(filePath, photo, {
        upsert:true,
        contentType: photo.type
      });
      
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('profiles').getPublicUrl(filePath);
      photoUrl = urlData.publicUrl;
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, nome, position, photo_url: photoUrl });

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
            <Label>Foto de Perfil (opcional, máx. 2MB)</Label>
            {photoPreview ? (
              <div className="relative rounded-full">
                <img src={photoPreview} alt="Preview" className="w-40 h-40 object-cover rounded-full m-auto" />
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
              <label className="flex flex-col items-center justify-center m-auto w-40 h-40 border-2 border-dashed rounded-full cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mt-2">Clique para enviar</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            )}
          </div>

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
