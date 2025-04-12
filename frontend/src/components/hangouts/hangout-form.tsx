'use client';
import { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';

import { setHangout } from '@/lib/api/hangouts';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageInput } from '@/components/ui/image-input';
import { Button } from '@/components/ui/button';

import { Sizes } from '@/lib/types/theme';
import { Hangout } from '@/lib/types/hangouts';
import { Timestamp } from 'firebase/firestore';

type FormData = {
  name: string;
  date: string;
  address: string;
  time: string;
};

type HangoutFormProps = {
  creatorId?: string;
  onSuccess?: () => void;
  value?: Hangout | null;
  isReadOnly?: boolean;
};

export function HangoutForm({
  creatorId,
  onSuccess,
  value,
  isReadOnly,
}: HangoutFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<FormData>({
    name: '',
    date: '',
    address: '',
    time: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!value) return;
    const date = value?.date?.toDate?.();
    setForm({
      name: value.name,
      date: date?.toISOString().split('T')[0],
      time: date?.toTimeString().split(' ')[0].substring(0, 5),
      address: value.address,
    });
  }, [value]);

  const fields = [
    { name: 'name', label: 'Nombre' },
    { name: 'date', label: 'Fecha', type: 'date' },
    { name: 'time', label: 'Hora', type: 'time' },
    { name: 'address', label: 'Dirección' },
  ];

  const saveData = async () => {
    try {
      const date = new Date(`${form.date}T${form.time}`);

      setIsLoading(true);
      const data: Partial<Hangout> = {
        date: Timestamp.fromDate(date),
        address: form.address,
        name: form.name,
      };
      if (creatorId) {
        data.participants = [creatorId];
        data.createdBy = creatorId;
      }
      await setHangout({
        id: value?.id,
        data,
        image,
      });

      toast.success('Información guardada exitosamente.');
      if (!value) formRef.current?.reset();
      setImage(null);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar la información.');
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
    if (isValid) {
      saveData();
    }
  };

  return (
    <form className="grid gap-4 py-4" onSubmit={handleFormSubmit} ref={formRef}>
      <div className="flex flex-col items-center justify-center">
        <ImageInput
          id="photo"
          name="photo"
          accept="image/*"
          onChange={handleImageChange}
          value={value?.image?.url || image}
          size={Sizes.xl}
          disabled={isReadOnly}
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
            disabled={isReadOnly}
          />
        </fieldset>
      ))}
      {!isReadOnly && (
        <Button disabled={isLoading} onClick={handleButtonClick}>
          {isLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      )}
    </form>
  );
}
