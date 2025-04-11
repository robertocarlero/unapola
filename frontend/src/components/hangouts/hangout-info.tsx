import { useMemo } from 'react';
import { CheckIcon, CircleCheckBigIcon, XIcon } from 'lucide-react';

import { formatDate } from '@/lib/helpers/dates';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Hangout } from '@/lib/types/hangouts';

export function HangoutInfo({ hangout }: { hangout: Hangout | null }) {
  const { name, image, address, cancelled, date, paid } = hangout || {};

  const formattedDate = formatDate(date?.toDate?.(), {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const Icon = useMemo(() => {
    if (cancelled) return XIcon;
    if (paid) return CircleCheckBigIcon;
    return CheckIcon;
  }, [cancelled, paid]);

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-16 w-16 shadow-xl">
        <AvatarImage src={image?.url} className="object-cover" />
        <AvatarFallback>
          <Icon className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold capitalize">{name}</h2>
        <p className="text-sm text-gray-700 capitalize">{address}</p>
        <p className="text-muted-foreground text-xs capitalize">
          {formattedDate}
        </p>
      </div>
    </div>
  );
}
