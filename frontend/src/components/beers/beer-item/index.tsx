'use client';
import { memo, useEffect, useState } from 'react';
import Image from 'next/image';

import { PlusIcon, MinusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Beer } from '@/lib/types/beers';

export * from './skeleton';

type BeerItemProps = {
  data: Beer;
  onAddToCart: (beer: Beer) => void;
};

export const BeerItem = memo(({ data, onAddToCart }: BeerItemProps) => {
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const { name, price = 0, image, quantity, discount, description } = data;

  const discountedValue = price * ((discount ?? 0) / 100);
  const discountedPrice = (price - discountedValue)?.toFixed?.(2);
  const isDiscounted = discount && discount > 0;

  useEffect(() => {
    onAddToCart({ ...data, quantity: currentQuantity });
  }, [data, currentQuantity, onAddToCart]);

  const handleAddToCart = () => {
    const newQuantity = currentQuantity + 1;
    if (newQuantity > quantity) return;

    setCurrentQuantity(newQuantity);
  };

  const handleRemoveFromCart = () => {
    const newQuantity = currentQuantity - 1;
    if (newQuantity < 0) return;

    setCurrentQuantity(newQuantity);
  };

  return (
    <div className="flex justify-between gap-2 rounded-xl border bg-white p-4 shadow-md">
      <picture className="flex h-28 w-28 items-center gap-2 overflow-hidden rounded-lg">
        <Image
          src={image.url_thumb ?? image.url}
          alt={name}
          width={100}
          height={100}
          className="h-full w-full object-cover"
        />
      </picture>
      <div className="flex flex-1 shrink flex-col items-center gap-2">
        <div className="flex flex-1 flex-col">
          <div className="flex w-full items-end justify-between gap-2">
            <p className="font-bold">{name}</p>
            <p className="text-sm font-medium">
              <span
                className={`ml-1 ${isDiscounted ? 'text-muted-foreground text-xs line-through' : 'text-sm'}`}
              >
                {price}$
              </span>
              {isDiscounted && (
                <span className="ml-1 text-sm text-green-600">
                  {discountedPrice}$
                </span>
              )}
            </p>
          </div>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {description}
          </p>
        </div>
        <div className="flex w-full justify-end gap-2">
          <Button variant="outline" size="icon" onClick={handleRemoveFromCart}>
            <MinusIcon className="h-4 w-4" />
          </Button>
          <div className="flex h-9 w-9 items-center justify-center gap-2 rounded-md border bg-white shadow-md">
            <p className="text-sm font-medium">{currentQuantity}</p>
          </div>
          <Button variant="outline" size="icon" onClick={handleAddToCart}>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});

BeerItem.displayName = 'BeerItem';
