import { Hangout } from '@/lib/types/hangouts';
import { CheckIcon } from 'lucide-react';
import { XIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function HangoutInfo({ hangout }: { hangout: Hangout | null }) {
  const { name, image, address, cancelled } = hangout || {};

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-16 w-16 shadow-xl">
        <AvatarImage src={image?.url} className="object-cover" />
        <AvatarFallback>{cancelled ? <XIcon /> : <CheckIcon />}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold capitalize">{name}</h2>
        <p className="text-sm text-gray-500 capitalize">{address}</p>
      </div>
    </div>
  );
}
