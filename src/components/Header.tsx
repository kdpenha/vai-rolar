import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Plus, User, LogOut } from 'lucide-react';

interface HeaderProps {
  profileOpen: boolean;
  setProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  signOut: () => Promise<void>;
}

export default function Header({ profileOpen, setProfileOpen, signOut }: HeaderProps) {
    return(
        <header className="h-16 bg-primary text-primary-foreground sticky top-0 z-50 flex items-center px-6">
            <div className="flex w-full items-center justify-between">
                <div>
                    <Link to={'/'} className="flex items-center gap-2">
                    <img
                    src="/logo-img/jogador-de-basquete.png"
                    alt="Logo de Jogador de Basquete"
                    className="h-8 w-8"
                    />
                    <h1 className="text-2xl font-bold">Vai Rolar?</h1>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        to="/contato"
                        className="text-sm font-medium opacity-90 hover:opacity-100 transition"
                    >
                        Contato
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setProfileOpen(true)}>
                    <User className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={signOut}>
                    <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    )
}