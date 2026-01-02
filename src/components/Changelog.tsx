import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

export default function Changelog({ closeModal }: { closeModal: () => void }) {
  return (
    <Dialog open onOpenChange={closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>🚀 Novidades</DialogTitle>
            </DialogHeader>

            <ul className="text-sm space-y-2">
              <li>• Agora é possível definir sua posição na parte de perfil</li>
              <li>• Criador da pelada aparece no Card</li>
              <li>• Fotos de perfil agora são permitidas</li>
            </ul>

            <DialogHeader>
              <DialogTitle>⚙️ Correções</DialogTitle>
                <ul className="text-sm space-y-2">
                    <li>• Correção de bug onde não era possível deslogar na tela de contato</li>
                    <li>• Correção de "criado por" onde mostrava o usuário errado</li>
                </ul>
            </DialogHeader>

            <Button onClick={closeModal}>Entendi</Button>

          </DialogContent>
        </Dialog>
  );
}