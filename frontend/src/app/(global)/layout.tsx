'use client';
import { redirect } from 'next/navigation';
import { LogOutIcon } from 'lucide-react';

import { logout } from '@/lib/api/auth';

import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { UserInfo } from '@/components/user-info';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { HangoutProvider } from '@/context/HangoutContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return redirect('/auth/signin');
  }

  const handleLogoutButtonClick = () => {
    logout();
  };

  return (
    <HangoutProvider>
      <section className="h-screen w-screen overflow-x-hidden">
        <header className="bg-background flex w-full items-center justify-between p-4">
          <UserInfo />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon">
                <LogOutIcon />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Vas a cerrar sesión y no podrás acceder a tu cuenta hasta que
                  vuelvas a iniciar sesión.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogoutButtonClick}>
                  Cerrar sesión
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </header>
        <main className="w-full p-4">{children}</main>
        <footer className="w-full shrink-0 p-4">
          <p className="text-center text-sm">
            Todos los derechos reservados para <strong>Parce, una pola</strong>{' '}
            &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </section>
    </HangoutProvider>
  );
}
