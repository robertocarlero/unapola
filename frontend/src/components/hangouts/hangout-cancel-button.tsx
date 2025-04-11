'use client';
import { useMemo } from 'react';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

import { Hangout } from '@/lib/types/hangouts';
import { CheckIcon, TrashIcon } from 'lucide-react';
import { setHangout } from '@/lib/api/hangouts';
import { toast } from 'sonner';

type HangoutCancelButtonProps = {
  data: Hangout | null;
  className?: string;
  isIconButton?: boolean;
};

export const HangoutCancelButton = ({
  data,
  className,
  isIconButton = false,
}: HangoutCancelButtonProps) => {
  const { user } = useAuth();
  const { cancelled, createdBy, id, paid } = data || {};

  const isOwner = useMemo(
    () => createdBy === user?.uid,
    [createdBy, user?.uid]
  );

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

  const Icon = useMemo(() => {
    if (cancelled) return CheckIcon;
    return TrashIcon;
  }, [cancelled]);

  const variant = useMemo(() => {
    if (cancelled) return 'default';
    return 'destructive';
  }, [cancelled]);

  if (!isOwner || paid) return null;

  return (
    <Button
      variant={variant}
      size={isIconButton ? 'icon' : 'default'}
      className={className}
      onClick={handleToggleStateButtonClick}
    >
      <Icon className="h-4 w-4" />
      {!isIconButton && (
        <span className="text-sm">{cancelled ? 'Activar' : 'Cancelar'}</span>
      )}
    </Button>
  );
};
