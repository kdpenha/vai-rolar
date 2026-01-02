import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, User, LogOut } from 'lucide-react';
import CourtsList from '@/components/CourtsList';
import CreateCourtDialog from '@/components/CreateCourtDialog';
import LiveList from '@/components/LiveList';
import ProfileDialog from '@/components/ProfileDialog';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Changelog from '@/components/Changelog';

export default function Home() {
  const {
    signOut
  } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [ showChangelog, setShowChangelog ] = useState(false)
  const CHANGELOG_VERSION = '1';

  useEffect(() => {
    const seen = localStorage.getItem('changelog_seen');

    if (seen !== CHANGELOG_VERSION) {
      setShowChangelog(true);
    }
  }, []);

  const closeModal = () => {
    localStorage.setItem('changelog_seen', CHANGELOG_VERSION);
    setShowChangelog(false);
  };

  return <div className="min-h-screen bg-background">
      <Header profileOpen={profileOpen} setProfileOpen={setProfileOpen} signOut={signOut} />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="upcoming">Próximos Jogos</TabsTrigger>
            <TabsTrigger value="live">Rolando Agora</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <CourtsList />
          </TabsContent>
          
          <TabsContent value="live">
            <LiveList />
          </TabsContent>
        </Tabs>

        {/* FAB */}
        <Button onClick={() => setCreateOpen(true)} className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg" size="icon">
          <Plus className="h-6 w-6" />
        </Button>
      </main>

      <CreateCourtDialog open={createOpen} onOpenChange={setCreateOpen} />
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />

      {showChangelog && (
        <Changelog closeModal={closeModal}/>
      )}

    </div>;
}