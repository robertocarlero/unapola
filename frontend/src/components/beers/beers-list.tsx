'use client';

import { getBeers } from '@/lib/api/beers';
import { useSnapshot } from '@/lib/hooks/useSnapshot';
import { BeerItem, BeerItemSkeleton } from './beer-item';
import { Beer } from '@/lib/types/beers';
import React, { useCallback, useEffect, useState } from 'react';

type BeersListProps = {
  onChange: (beers: Beer[]) => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;

export const BeersList = ({ onChange, ...props }: BeersListProps) => {
  const [cart, setCart] = useState<Map<string, Beer>>(new Map());
  const { data: beers, loading } = useSnapshot({
    fn: getBeers,
  });

  useEffect(() => {
    onChange(Array.from(cart.values()).filter((beer) => beer.quantity > 0));
  }, [cart, onChange]);

  const handleAddToCart = useCallback((beer: Beer) => {
    setCart((prev) => {
      const newCart = new Map(prev);
      newCart.set(beer.id, beer);
      return newCart;
    });
  }, []);

  return (
    <div {...props}>
      {loading
        ? [1, 2, 3, 4].map((index) => <BeerItemSkeleton key={index} />)
        : beers?.map((beer) => (
            <BeerItem key={beer.id} data={beer} onAddToCart={handleAddToCart} />
          ))}
    </div>
  );
};
