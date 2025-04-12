'use client';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { PlusIcon } from 'lucide-react';

import { setHangout } from '@/lib/api/hangouts';
import { useDeviceSize } from '@/lib/hooks/useDeviceSize';

import { useAuth } from '@/context/AuthContext';
import { useHangoutContext } from '@/context/HangoutContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderForm } from '@/components/orders/order-form';
import { OrderList } from '@/components/orders/order-list';
import { HangoutCancelButton } from '../hangout-cancel-button';
import { HangoutInfo } from '../hangout-info';
import { HangoutDetailSkeleton } from './skeleton';
import { HangoutFinish } from '../hangout-finish';
import { HangoutsParticipantsList } from '../hangouts-participants-list';
import { HangoutForm } from '../hangout-form';
import { HangoutDeleteButton } from '../hangout-delete-button';

type HangoutDetailTabs = 'rounds' | 'participants' | 'settings';

export function HangoutDetail() {
  const { user } = useAuth();
  const { focusedHangout, hangout, loading } = useHangoutContext();
  const { isSmall } = useDeviceSize();
  const [formOpen, setFormOpen] = useState(false);
  const [focusedTab, setFocusedTab] = useState<HangoutDetailTabs>('rounds');

  const isCreator = useMemo(() => {
    return user?.uid === hangout?.createdBy;
  }, [user, hangout]);

  useEffect(() => {
    if (focusedHangout) setFocusedTab('rounds');
  }, [focusedHangout]);

  const handleOnNewRoundClick = () => {
    setFormOpen(true);
  };

  const handleOnFormClose = () => {
    setFormOpen(false);
  };

  const handleOnAddParticipant = async (userId: string) => {
    const { participants = [] } = hangout || {};
    const alreadyExists = participants.includes(userId);
    if (alreadyExists) {
      toast.error('El participante ya existe');
      return;
    }
    try {
      await setHangout({
        id: focusedHangout,
        data: { participants: [...participants, userId] },
      });
      toast.success('Participante añadido correctamente');
    } catch (error) {
      console.error(error);
      toast.error('Error al añadir participante');
    }
  };

  const canEdit = useMemo(() => {
    return !hangout?.paid && !hangout?.cancelled;
  }, [hangout]);

  if (!focusedHangout) return null;

  if (loading) return <HangoutDetailSkeleton />;

  return (
    <section className="flex h-full w-full flex-col gap-4">
      <div className="flex w-full justify-between">
        <HangoutInfo hangout={hangout} />
        <div className="flex items-start gap-2">
          <HangoutCancelButton data={hangout} isIconButton={isSmall} />
          {isCreator && <HangoutFinish data={hangout} isIconButton={isSmall} />}
        </div>
      </div>

      <Tabs
        defaultValue="rounds"
        value={focusedTab}
        onValueChange={(value) => setFocusedTab(value as HangoutDetailTabs)}
        className="m-auto w-full max-w-3xl"
      >
        <TabsList className="m-auto mb-12">
          <TabsTrigger value="rounds">Rondas</TabsTrigger>
          <TabsTrigger value="participants">Participantes</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>
        <TabsContent value="rounds">
          <div className="flex w-full flex-col gap-4">
            {canEdit && (
              <>
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
              </>
            )}
            <OrderList hangoutId={focusedHangout} />
          </div>
        </TabsContent>
        <TabsContent value="participants">
          <div className="flex flex-col gap-4">
            <HangoutsParticipantsList
              hangout={hangout}
              onAddParticipant={handleOnAddParticipant}
              isReadOnly={!canEdit}
            />
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="flex w-full flex-col gap-4">
            <h1 className="border-b pb-4 text-lg font-medium">
              Zona de configuración
            </h1>
            <HangoutForm value={hangout} isReadOnly={!isCreator || !canEdit} />
            {isCreator && (
              <div className="mt-12 flex w-full flex-col gap-4">
                <h1 className="w-full border-b pb-4 text-lg font-medium">
                  Zona de pago y eliminación
                </h1>
                <div className="mt-4 flex gap-4">
                  <HangoutFinish data={hangout} className="w-full shrink" />
                  <HangoutDeleteButton
                    className="w-full shrink"
                    data={hangout}
                  />
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
