import { memo, useCallback, useMemo } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { getRounds } from '@/lib/api/hangouts';
import { useSnapshot } from '@/lib/hooks/useSnapshot';
import { Beer } from '@/lib/types/beers';
import { Hangout } from '@/lib/types/hangouts';
import { OrderItemsList } from './order-items-list';
import { OrderPaymentButton } from './order-payment-button';

type OrderInvoiceProps = {
  isOpen: boolean;
  onClose: () => void;
  data: Hangout | null;
};

export const OrderInvoice = memo(
  ({ isOpen, onClose, data }: OrderInvoiceProps) => {
    const hangoutId = useMemo(() => data?.id, [data?.id]);

    const getData = useCallback(
      () => getRounds({ hangoutId: hangoutId ?? '' }),
      [hangoutId]
    );

    const { data: rounds } = useSnapshot({
      fn: getData,
      active: isOpen && !!hangoutId,
    });

    const groupedItems: (Beer & {
      finalPrice: number;
      totalDiscount: number;
      totalPrice: number;
    })[] = useMemo(() => {
      const items = rounds?.flatMap((round) => round.items) ?? [];
      const itemsMap = new Map<string, Beer & { quantity: number }>();

      items.forEach((item) => {
        const existingItem = itemsMap.get(item.id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          itemsMap.set(item.id, { ...item, quantity: item.quantity });
        }
      });

      const newItems = Array.from(itemsMap.values()).map((item) => {
        const totalPrice = item.price * item.quantity;
        const discountForProduct = item.discount
          ? (item.price * item.discount) / 100
          : 0;
        const totalDiscount = discountForProduct * item.quantity;
        const finalPrice = totalPrice - totalDiscount;
        return { ...item, finalPrice, totalDiscount, totalPrice };
      });

      return newItems;
    }, [rounds]);

    const totals = useMemo(() => {
      const subtotal = groupedItems.reduce((acc, item) => {
        return acc + item.totalPrice;
      }, 0);

      const discount = groupedItems.reduce((acc, item) => {
        return acc + item.totalDiscount;
      }, 0);

      const tax = subtotal * 0.1;
      const total = subtotal - discount + tax;
      const items = groupedItems.reduce((acc, item) => acc + item.quantity, 0);
      return { subtotal, discount, tax, total, items };
    }, [groupedItems]);

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-h-[90vh] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Factura</DialogTitle>
            <p className="text-muted-foreground">Resumen de tu pedido</p>
          </DialogHeader>

          <div className="my-4 flex flex-col gap-6">
            <OrderItemsList items={groupedItems} />

            <div className="space-y-4">
              <h2 className="font-semibold">Detalles de la Transacción</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">
                    Subtotal ({totals.items} productos)
                  </p>
                  <p>${totals.subtotal.toLocaleString()}</p>
                </div>
                {totals.discount > 0 && (
                  <div className="text-destructive flex justify-between">
                    <p>Descuento Total</p>
                    <p>-${totals.discount.toLocaleString()}</p>
                  </div>
                )}
                <div className="flex justify-between">
                  <p className="text-muted-foreground">IVA 10%</p>
                  <p>${totals.tax.toLocaleString()}</p>
                </div>
                <div className="flex justify-between font-medium">
                  <p>Total a Pagar</p>
                  <p className="text-primary">
                    ${totals.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!data?.paid ? (
            <DialogFooter className="flex gap-2 sm:gap-0">
              <OrderPaymentButton hangout={data} onSuccess={onClose} />
            </DialogFooter>
          ) : null}
        </DialogContent>
      </Dialog>
    );
  }
);

OrderInvoice.displayName = 'OrderInvoice';
