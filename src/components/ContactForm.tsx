import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = {
      name: form.name.valueOf,
      email: form.email.value,
      message: form.message.value,
    };

    try {
      setSuccess(true);
      form.reset();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Contato</h1>
      {success && (
        <div className="mb-4 text-green-600 font-semibold">
          Sua mensagem foi enviada!
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField name="name" render={() => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input name="name" placeholder="Seu nome" required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField name="email" render={() => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input name="email" type="email" placeholder="seu@email.com" required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField name="message" render={() => (
          <FormItem>
            <FormLabel>Mensagem</FormLabel>
            <FormControl>
              <Textarea name="message" placeholder="Escreva sua mensagem..." required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Enviando...' : 'Enviar'}
        </Button>
      </form>
    </div>
  );
}