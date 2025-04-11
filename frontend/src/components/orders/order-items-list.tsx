import Image from 'next/image';
import { Beer } from '@/lib/types/beers';

type OrderItemsListProps = {
  items: (Beer & {
    finalPrice: number;
    totalDiscount: number;
    totalPrice: number;
  })[];
};

export function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Productos Ordenados</h2>
      <div className="flex flex-col gap-4">
        {items?.map(
          ({
            id,
            name,
            image,
            discount,
            quantity,
            finalPrice,
            totalDiscount,
            totalPrice,
            price,
          }) => (
            <div key={id} className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                <Image
                  src={image?.url ?? ''}
                  alt={name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{name}</h3>
                    <p className="text-muted-foreground">
                      ${price} x {quantity}
                      {!!discount && (
                        <span className="text-destructive ml-2">
                          -{discount}%
                        </span>
                      )}
                    </p>
                    {!!discount && (
                      <p className="text-destructive text-sm">
                        Ahorro: ${totalDiscount?.toFixed?.(2)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {!!discount && (
                      <p className="text-muted-foreground text-sm line-through">
                        ${totalPrice?.toFixed?.(2)}
                      </p>
                    )}
                    <p className="font-medium">${finalPrice.toFixed?.(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
