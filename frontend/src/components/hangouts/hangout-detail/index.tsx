'use client';
import { useCallback, useState } from 'react';
import { PlusIcon } from 'lucide-react';

import { getHangout } from '@/lib/api/hangouts';
import { useSnapshot } from '@/lib/hooks/useSnapshot';
import { useDeviceSize } from '@/lib/hooks/useDeviceSize';

import { useHangoutContext } from '@/context/HangoutContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderForm } from '@/components/orders/order-form';
import { HangoutInfo } from '../hangout-info';
import { OrderList } from '@/components/orders/order-list';
import { HangoutCancelButton } from '../hangout-cancel-button';
import { HangoutDetailSkeleton } from './skeleton';

export function HangoutDetail() {
  const { focusedHangout } = useHangoutContext();
  const { isSmall } = useDeviceSize();
  const [formOpen, setFormOpen] = useState(false);

  const fn = useCallback(() => getHangout(focusedHangout), [focusedHangout]);

  const { data: hangout, loading } = useSnapshot({
    fn,
    active: !!focusedHangout,
  });

  const handleOnNewRoundClick = () => {
    setFormOpen(true);
  };

  const handleOnFormClose = () => {
    setFormOpen(false);
  };

  if (loading) return <HangoutDetailSkeleton />;

  return (
    <section className="flex h-full w-full flex-col gap-4">
      <div className="flex w-full justify-between">
        <HangoutInfo hangout={hangout} />
        <div className="flex flex-col items-end gap-2">
          <HangoutCancelButton data={hangout} isIconButton={isSmall} />
        </div>
      </div>

      <Tabs defaultValue="rounds" className="m-auto w-full max-w-3xl">
        <TabsList className="m-auto mb-12">
          <TabsTrigger value="rounds">Rondas</TabsTrigger>
          <TabsTrigger value="participants">Participantes</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>
        <TabsContent value="rounds">
          <div className="flex w-full flex-col gap-4">
            <div
              className="hoover:shadow-md flex w-full cursor-pointer items-center justify-center gap-4 rounded-md border border-gray-200 bg-white p-4 hover:bg-gray-50"
              role="button"
              onClick={handleOnNewRoundClick}
            >
              <PlusIcon className="text-muted-foreground h-6 w-6" />
              <p className="text-muted-foreground text-xl font-medium">
                Nueva Ronda
              </p>
            </div>
            <OrderForm
              hangout={hangout}
              isOpen={formOpen}
              onClose={handleOnFormClose}
            />
            <OrderList hangoutId={focusedHangout} />
          </div>
        </TabsContent>
        <TabsContent value="participants">
          <div className="flex flex-col gap-4">
            <p>Participantes</p>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="flex flex-col gap-4">
            <p>Configuración</p>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
