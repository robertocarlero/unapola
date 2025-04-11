'use client';

import { getBeers } from '@/lib/api/beers';
import { useSnapshot } from '@/lib/hooks/useSnapshot';
import { BeerItem, BeerItemSkeleton } from './beer-item';
import { Beer } from '@/lib/types/beers';
import React, { useCallback, useState } from 'react';

type BeersListProps = React.HTMLAttributes<HTMLDivElement>;

export const BeersList = (props: BeersListProps) => {
  const [cart, setCart] = useState<Beer[]>([]);
  const { data: beers, loading } = useSnapshot({
    fn: getBeers,
  });

  const handleAddToCart = useCallback((beer: Beer) => {
    setCart((prev) => [...prev, beer]);
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
