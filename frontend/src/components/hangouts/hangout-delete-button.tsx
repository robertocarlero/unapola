'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Hangout } from '@/lib/types/hangouts';
import { TrashIcon } from 'lucide-react';
import { deleteHangout } from '@/lib/api/hangouts';
import { toast } from 'sonner';
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

type HangoutDeleteButtonProps = {
  data: Hangout | null;
  className?: string;
  isIconButton?: boolean;
};

export const HangoutDeleteButton = ({
  data,
  className,
  isIconButton = false,
}: HangoutDeleteButtonProps) => {
  const { user } = useAuth();
  const { createdBy, id } = data || {};
  const [isOpen, setIsOpen] = useState(false);

  const isOwner = createdBy === user?.uid;

  const handleDelete = async () => {
    try {
      await deleteHangout({ id: id ?? '' });
      toast.success('Juntada eliminada correctamente');
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar la juntada');
    } finally {
      setIsOpen(false);
    }
  };

  if (!isOwner || !id) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size={isIconButton ? 'icon' : 'default'}
          className={className}
        >
          <TrashIcon className="h-4 w-4" />
          {!isIconButton && <span className="text-sm">Eliminar</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente la
            juntada.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
