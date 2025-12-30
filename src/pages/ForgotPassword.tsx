import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Undo } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('')
    const navigate = useNavigate()

    function returnToAuth() {
        navigate('/auth')
    }

    const handleRecover = async (e: React.FormEvent) => {
        e.preventDefault()

        setLoading(true)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://vai-rolar.pages.dev/reset-password'
        })
        
        if (error) {
            toast({
                title: 'Erro ao enviar e-mail.',
                description: 'Por favor, tente novamente ou entre em contato.',
                variant: 'destructive'
            });
        } else {
            toast({
                title: 'Prontinho!',
                description: "E-mail enviado. Verifique na sua caixa de e-mail ou spam para prosseguir com a alteração."
            })

            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">

            <Card className="w-full max-w-md border-primary/20 flex flex-col">
                <CardContent>
                    <form onSubmit={handleRecover} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <div className='flex justify-between'>
                                <Label className='self-end' htmlFor="email-login">E-mail</Label>
                                <Button onClick={returnToAuth}><Undo/></Button>
                            </div>
                            
                            <Input
                                id="email-login"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                            />

                            <p className='text-sm font-light text-gray-600'>Você receberá um link por e-mail</p>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar E-mail'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}