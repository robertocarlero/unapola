/* eslint-disable @next/next/no-img-element */
'use client';
import { useMemo } from 'react';
import { CheckIcon, TrashIcon } from 'lucide-react';

import { formatDate } from '@/lib/helpers/dates';
import { getRandomHexColor } from '@/lib/helpers/strings';

import { Hangout } from '@/lib/types/hangouts';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { setHangout } from '@/lib/api/hangouts';
import { useAuth } from '@/context/AuthContext';

type HangoutCardProps = {
  data: Hangout;
  focused: boolean;
  onClick: () => void;
};

export function HangoutCard({ data, focused, onClick }: HangoutCardProps) {
  const { user } = useAuth();
  const { name, address, date, image, id, cancelled, createdBy } = data || {};

  const isOwner = useMemo(
    () => createdBy === user?.uid,
    [createdBy, user?.uid]
  );

  const color = useMemo(() => getRandomHexColor(), []);

  const formattedDate = useMemo(() => formatDate(date), [date]);

  const handleToggleStateButtonClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      await setHangout({ id, data: { cancelled: !cancelled } });
      toast.success(`Juntada ${cancelled ? 'activada' : 'cancelada'}`);
    } catch (error) {
      console.error(error);
      toast.error('Error al cancelar la juntada');
    }
  };

  return (
    <div
      className={`relative flex w-64 shrink-0 flex-col overflow-hidden rounded-lg bg-white shadow-md ${focused ? 'border-ring ring-ring/50 ring-[3px]' : ''} `}
      onClick={onClick}
      role="button"
    >
      {isOwner && (
        <Button
          variant={cancelled ? 'default' : 'destructive'}
          size="icon"
          className="absolute top-2 right-2"
          onClick={handleToggleStateButtonClick}
        >
          {cancelled ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            <TrashIcon className="h-4 w-4" />
          )}
        </Button>
      )}
      {
        <picture className="h-40 w-full overflow-hidden">
          {image ? (
            <img
              src={image?.url ?? ''}
              alt={name}
              className="object-cover"
              width={256}
              height={160}
            />
          ) : (
            <div className="h-full w-full" style={{ backgroundColor: color }} />
          )}
        </picture>
      }
      <div className="flex w-full flex-col p-2">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="mt-[-8px] text-sm text-gray-500">{address}</p>
        <p className="text-xs text-gray-500 capitalize">{formattedDate}</p>
        <p
          className={`text-xs capitalize ${cancelled ? 'text-red-500' : 'text-green-500'}`}
        >
          {cancelled ? 'Cancelada' : 'Activa'}
        </p>
      </div>
    </div>
  );
}
