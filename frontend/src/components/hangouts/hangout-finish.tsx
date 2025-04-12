import { useMemo, useState } from 'react';
import { CircleCheckBigIcon, FileIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { OrderInvoice } from '@/components/orders/order-invoice';

import { Hangout } from '@/lib/types/hangouts';

export function HangoutFinish({
  isIconButton,
  className,
  data,
}: {
  isIconButton?: boolean;
  className?: string;
  data: Hangout | null;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { cancelled, paid } = data || {};

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

  if (!data || cancelled) return null;

  return (
    <>
      <Button
        variant="outline"
        size={isIconButton ? 'icon' : 'default'}
        onClick={handleOnFinishClick}
        className={className}
      >
        <Icon className="h-4 w-4" />
        {!isIconButton ? buttonText : ''}
      </Button>
      {dialogOpen && (
        <OrderInvoice
          data={data}
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
}
