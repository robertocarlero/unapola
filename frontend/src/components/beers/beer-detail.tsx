'use client';
import { memo, useState } from 'react';
import Image from 'next/image';
import { PlusIcon, MinusIcon } from 'lucide-react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Beer } from '@/lib/types/beers';

type BeerDetailProps = {
  data: Beer;
  isOpen: boolean;
  onClose: (quantity: number) => void;
  value: number;
};

export const BeerDetail = memo(
  ({ data, isOpen, onClose, value }: BeerDetailProps) => {
    const [currentQuantity, setCurrentQuantity] = useState(value ?? 0);

    const { name, price = 0, image, quantity, discount, description } = data;

    const discountedValue = price * ((discount ?? 0) / 100);
    const discountedPrice = price - discountedValue;
    const isDiscounted = discount && discount > 0;

    const totalPrice = discountedPrice * currentQuantity;

    const handleAddButtonClick = () => {
      const newQuantity = currentQuantity + 1;
      if (newQuantity > quantity) return;

      setCurrentQuantity(newQuantity);
    };

    const handleRemoveButtonClick = () => {
      const newQuantity = currentQuantity - 1;
      if (newQuantity < 0) return;

      setCurrentQuantity(newQuantity);
    };

    const handleAddToCartButtonClick = () => {
      onClose(currentQuantity);
    };

    return (
      <Dialog open={isOpen} onOpenChange={() => onClose(0)}>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-h-[90vh] sm:max-w-[425px]">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl">
              <Image src={image.url} alt={name} fill className="object-cover" />
              {isDiscounted && (
                <Badge variant="destructive" className="absolute top-2 right-2">
                  {discount}% OFF
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between gap-4">
              <DialogTitle className="text-lg font-bold">{name}</DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRemoveButtonClick}
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <div className="flex h-9 w-9 items-center justify-center gap-2 rounded-md border bg-white shadow-md">
                  <p className="text-sm font-medium">{currentQuantity}</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAddButtonClick}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <h3 className="font-medium">Descripción</h3>
                <p className="text-muted-foreground text-sm">{description}</p>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex flex-col gap-2">
                  <h3 className="font-medium">Precio</h3>
                  <div className="flex items-center gap-2">
                    {isDiscounted && (
                      <p className="text-sm text-green-600">
                        ${discountedPrice?.toFixed?.(2)}
                      </p>
                    )}
                    <p
                      className={`text-sm ${
                        isDiscounted ? 'text-muted-foreground line-through' : ''
                      }`}
                    >
                      ${price}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-medium">Stock disponible</h3>
                  <p className="text-muted-foreground text-sm">
                    {quantity} unidades
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between gap-4">
                <div className="flex flex-col">
                  <small className="text-muted-foreground font-medium">
                    Precio total:
                  </small>
                  <p className="text-lg font-bold">${totalPrice?.toFixed(2)}</p>
                </div>

                <Button
                  variant="default"
                  size="lg"
                  onClick={handleAddToCartButtonClick}
                  disabled={currentQuantity >= quantity}
                >
                  Agregar al carrito
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

BeerDetail.displayName = 'BeerDetail';
