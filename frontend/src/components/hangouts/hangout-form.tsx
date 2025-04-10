'use client';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { PlusIcon } from 'lucide-react';

import { setHangout } from '@/lib/api/hangouts';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageInput } from '@/components/ui/image-input';

import { Sizes } from '@/lib/types/theme';
import { Hangout } from '@/lib/types/hangouts';

type FormData = {
  name: string;
  date: string;
  address: string;
  time: string;
};

export function HangoutForm({ creatorId }: { creatorId?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: '',
    date: '',
    address: '',
    time: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fields = useMemo(() => {
    return [
      { name: 'name', label: 'Nombre' },
      { name: 'date', label: 'Fecha', type: 'date' },
      { name: 'time', label: 'Hora', type: 'time' },
      { name: 'address', label: 'Dirección' },
    ];
  }, []);

  const saveData = async () => {
    try {
      const date = new Date(`${form.date}T${form.time}`);

      setIsLoading(true);
      const data: Partial<Hangout> = {
        date,
        address: form.address,
        name: form.name,
        createdBy: creatorId,
      };
      if (creatorId) {
        data.participants = [creatorId];
      }
      await setHangout({
        data,
        image,
      });

      toast.success('Juntada creada correctamente');
      formRef.current?.reset();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Error al crear la juntada');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveData();
  };

  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    formRef.current?.reportValidity();
    const isValid = formRef.current?.checkValidity();
    console.log(isValid);
    if (isValid) {
      saveData();
    }
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
          <form
            className="grid gap-4 py-4"
            onSubmit={handleFormSubmit}
            ref={formRef}
          >
            <div className="flex flex-col items-center justify-center">
              <ImageInput
                id="photo"
                name="photo"
                accept="image/*"
                onChange={handleImageChange}
                value={image}
                size={Sizes.xl}
              />
            </div>
            {fields.map(({ name, label, type }) => (
              <fieldset className="flex flex-col gap-2" key={name}>
                <Label htmlFor={name} className="text-right">
                  {label}
                </Label>
                <Input
                  id={name}
                  className="col-span-3"
                  name={name}
                  type={type}
                  required
                  value={form[name as keyof typeof form]}
                  onChange={handleInputChange}
                />
              </fieldset>
            ))}
          </form>
          <DialogFooter>
            <Button disabled={isLoading} onClick={handleButtonClick}>
              {isLoading ? 'Creando...' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
