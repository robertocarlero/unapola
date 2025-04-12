'use client';
import { useState } from 'react';
import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HangoutForm } from './hangout-form';

export function HangoutDialog({ creatorId }: { creatorId?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Crear juntada <PlusIcon />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear juntada</DialogTitle>
            <DialogDescription>
              Crea una nueva juntada para beber.
            </DialogDescription>
          </DialogHeader>
          <HangoutForm creatorId={creatorId} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
}
