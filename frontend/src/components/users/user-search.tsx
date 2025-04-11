'use client';

import { useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { getUserByUsername } from '@/lib/api/users';
import { UserInfo } from './user-info';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

type UserSearchProps = {
  onUserSelect?: (userId: string) => void;
};

export const UserSearch = ({ onUserSelect }: UserSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [noResultsMessage, setNoResultsMessage] = useState('');

  const handleSearch = async () => {
    if (!searchTerm) return;

    setIsSearching(true);
    setNoResultsMessage('');
    try {
      const user = await getUserByUsername({ username: searchTerm });
      if (user) {
        setSearchResults(user.id);
      } else {
        setSearchResults(null);
        setNoResultsMessage('No se encontraron usuarios con ese username.');
      }
    } catch (error) {
      console.error('Error searching user:', error);
      setSearchResults(null);
      setNoResultsMessage('Error al buscar el usuario.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleUserSelect = () => {
    if (searchResults && onUserSelect) {
      setShowConfirmation(true);
    }
  };

  const handleConfirm = () => {
    if (searchResults && onUserSelect) {
      onUserSelect(searchResults);
      // Limpiar los datos después de seleccionar
      setSearchTerm('');
      setSearchResults(null);
    }
    setShowConfirmation(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder="Buscar usuario por username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          <SearchIcon className="h-4 w-4" />
        </Button>
      </div>

      {searchResults && (
        <div className="rounded-md border border-gray-200 bg-white p-4">
          <UserInfo userId={searchResults} />
          {onUserSelect && (
            <Button className="mt-2 w-full" onClick={handleUserSelect}>
              Agregar usuario
            </Button>
          )}
        </div>
      )}

      {!searchResults && noResultsMessage && (
        <p className="text-center text-sm text-red-500">{noResultsMessage}</p>
      )}

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar agregar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas agregar este usuario a la juntada?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
