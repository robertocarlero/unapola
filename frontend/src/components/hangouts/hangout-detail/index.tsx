'use client';
import { useCallback } from 'react';
import { CheckIcon, XIcon } from 'lucide-react';

import { getHangout } from '@/lib/api/hangouts';
import { useSnapshot } from '@/lib/hooks/useSnapshot';
import { formatDate } from '@/lib/helpers/dates';

import { useHangoutContext } from '@/context/HangoutContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HangoutDetailSkeleton } from './skeleton';

export function HangoutDetail() {
  const { focusedHangout } = useHangoutContext();

  const fn = useCallback(() => getHangout(focusedHangout), [focusedHangout]);

  const { data: hangout, loading } = useSnapshot({
    fn,
    active: !!focusedHangout,
  });

  const { name, image, date, address, cancelled } = hangout || {};

  const time =
    date?.toDate?.().toLocaleTimeString?.('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }) ?? '';
  const formattedDate = formatDate(date?.toDate?.());

  if (loading) return <HangoutDetailSkeleton />;

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-16 w-16 shadow-md">
            <AvatarImage src={image?.url} className="object-cover" />
            <AvatarFallback>
              {cancelled ? <XIcon /> : <CheckIcon />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold capitalize">{name}</h2>
            <p className="text-sm text-gray-500 capitalize">{address}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-sm capitalize">{formattedDate}</p>
          <div className="flex items-center gap-2">
            <Badge variant={cancelled ? 'destructive' : 'default'}>
              {cancelled ? 'Cancelada' : 'Activa'}
            </Badge>
            <p className="text-xs text-gray-500">{time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
