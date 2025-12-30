import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react';
import Header from '@/components/Header';
import ProfileDialog from '@/components/ProfileDialog';
import { Button } from '@/components/ui/button';
import contact from '@/services/supabase/contact';
import { Linkedin, Instagram } from 'lucide-react';

export default function ContactPage() {
  const {
    signOut
  } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const data = { fullName, email, message };

     try {
      const { error } = await contact(data);

      if (error) throw error;

      setSuccess(true);

      //reset dos campos
      setFullName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setSuccess(false);
      console.error('Erro ao enviar:', err);
    }
    
  };

  return (
    <div className="min-h-screen bg-background">
      <Header profileOpen={profileOpen} setProfileOpen={setProfileOpen} signOut={signOut} />
      <div className="max-w-md mx-auto mt-16 p-6 bg-card rounded-2xl shadow-md">
          <h1 className="text-2xl font-bold mb-4">Contato</h1>
          {success && (
              <div className="mb-4 text-green-600 font-semibold">
                Sua mensagem foi enviada!
              </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className="block mb-1 font-medium" htmlFor="name">Nome</label>
              <input
                id="name"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                placeholder="Seu nome"
                required
              />
            </div>

            <div className='mb-4'>
              <label className="block mb-1 font-medium" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className='mb-4'>
              <label className="block mb-1 font-medium" htmlFor="message">Mensagem</label>
              <textarea
                id="message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                placeholder="Escreva sua mensagem..."
                required
              />
            </div>

            <Button className='w-full'>Enviar</Button>
          </form>

          <div className='flex gap-2 mt-5 justify-end'>
            <a
              href="https://www.linkedin.com/in/kdpenha/"
              target="_blank"
              rel="noopener noreferrer"
              className='border-2 border-white px-1 py-1 inline-block rounded-md hover:bg-orange-500 transition-colors'
            >
              <Linkedin/>
            </a>

            <a
              href="https://www.instagram.com/kdpenha/"
              target="_blank"
              rel="noopener noreferrer"
              className='border-2 border-white px-1 py-1 inline-block rounded-md hover:bg-orange-500 transition-colors'
            >
              <Instagram/>
            </a>

          </div>
      </div>

      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
}
