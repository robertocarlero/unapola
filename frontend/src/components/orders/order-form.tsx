import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { createRound } from '@/lib/api/hangouts';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { HangoutInfo } from '../hangouts/hangout-info';
import { BeersList } from '../beers/beers-list';

import { Hangout } from '@/lib/types/hangouts';
import { Beer } from '@/lib/types/beers';

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
      const body: object = {
        hangoutId: hangout?.id,
        userId: user?.uid,
        beers: beers,
      };
      await createRound(body);
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
          <SheetClose asChild>
            <Button onClick={handleSaveButtonClick} disabled={loading}>
              {loading ? 'Creando...' : 'Guardar'}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
