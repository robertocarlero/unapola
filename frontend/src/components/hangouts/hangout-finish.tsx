import { useMemo, useState } from 'react';
import { CircleCheckBigIcon, FileIcon } from 'lucide-react';

import { useHangoutContext } from '@/context/HangoutContext';
import { Button } from '@/components/ui/button';
import { OrderInvoice } from '../orders/order-invoice';

export function HangoutFinish({ isIconButton }: { isIconButton: boolean }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isOwn, hangout } = useHangoutContext();

  const { cancelled, paid } = hangout || {};

  const handleOnFinishClick = () => {
    setDialogOpen(true);
  };

  const buttonText = useMemo(() => {
    if (paid) return 'Ver Factura';
    return 'Finalizar';
  }, [paid]);

  const Icon = useMemo(() => {
    if (paid) return FileIcon;
    return CircleCheckBigIcon;
  }, [paid]);

  if (!hangout || !isOwn || cancelled) return null;

  return (
    <>
      <Button
        variant="outline"
        size={isIconButton ? 'icon' : 'default'}
        onClick={handleOnFinishClick}
      >
        <Icon className="h-4 w-4" />
        {!isIconButton ? buttonText : ''}
      </Button>
      {dialogOpen && (
        <OrderInvoice
          data={hangout}
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
}
