import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export default function NewPassword() {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const navigate = useNavigate()

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== passwordConfirm) {
            toast({
                title: 'As senhas devem ser exatamente iguais.',
                variant: 'destructive'
            })

            return
        }

        const { error } = await supabase.auth.updateUser({
            password: passwordConfirm
        })

        if (error) {
            toast({
                title: 'Ocorreu um erro ao tentar mudar a senha. Tente novamente ou entre em contato com o suporte.',
                variant: 'destructive'
            })
        } else {
            toast({
                title: 'Senha alterada com sucesso.'
            })

            navigate('/auth')
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-primary/20">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full w-40 border border-primary/40">
                        <img className='w-60' src="/logo-img/logotipo.png" alt="Logo de Jogador de Basquete" />
                        </div>
                    </div>

                    <CardDescription>Não se desespere! Recupere sua conta!</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Informe a nova senha</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password-confirm">Confirme a nova senha</Label>
                            <Input
                                id="password-confirm"
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Mudando...' : 'Mudar Senha'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}