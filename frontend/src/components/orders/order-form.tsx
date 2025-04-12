import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { setRound } from '@/lib/api/hangouts';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

import { HangoutInfo } from '../hangouts/hangout-info';
import { BeersList } from '../beers/beers-list';

import { Hangout } from '@/lib/types/hangouts';
import { Beer, Round } from '@/lib/types/beers';

type OrderFormProps = {
  hangout: Hangout | null;
  isOpen: boolean;
  onClose: () => void;
};

export function OrderForm({ hangout, isOpen, onClose }: OrderFormProps) {
  const { user } = useAuth();
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSaveButtonClick = async () => {
    setLoading(true);

    try {
      if (!hangout) {
        throw new Error('Hangout not found');
      }
      const data: Partial<Round> = {
        hangoutId: hangout?.id,
        userId: user?.uid,
        items: beers,
      };
      await setRound({ data });
      toast.success('Ronda creada correctamente');
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnBeersListChange = useCallback((beers: Beer[]) => {
    setBeers(beers);
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Nueva ronda</SheetTitle>
          <HangoutInfo hangout={hangout} />
        </SheetHeader>
        <div className="overflow-y-auto">
          <BeersList
            className="grid grid-cols-1 gap-4 p-2"
            onChange={handleOnBeersListChange}
          />
        </div>
        <SheetFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={loading || beers.length === 0}>
                {loading ? 'Creando...' : 'Guardar'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Se creará una ronda con los productos seleccionados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleSaveButtonClick}>
                  Guardar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
