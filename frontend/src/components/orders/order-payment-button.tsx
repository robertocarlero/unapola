import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { toast } from 'sonner';

import { setHangout } from '@/lib/api/hangouts';
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

import { Hangout } from '@/lib/types/hangouts';

type OrderPaymentButtonProps = {
  hangout: Hangout | null;
  onSuccess?: () => void;
};

export function OrderPaymentButton({
  hangout,
  onSuccess,
}: OrderPaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!hangout?.id) return;

    try {
      setLoading(true);
      await setHangout({
        id: hangout.id,
        data: {
          paid: true,
          paidAt: Timestamp.now(),
        },
      });
      toast.success('Pago realizado con éxito');
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full" disabled={loading}>
          {loading ? 'Procesando...' : 'Pagar Ahora'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Pago</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas procesar el pago? Esta acción no se
            puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Confirmar Pago
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
