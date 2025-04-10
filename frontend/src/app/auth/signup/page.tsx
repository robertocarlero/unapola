'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

import { signUp } from '@/lib/api/auth';
import { getUserByUsername } from '@/lib/api/users';

import { ImageInput } from '@/components/ui/image-input';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { Sizes } from '@/lib/types/theme';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  username: string;
}

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    username: '',
  });
  const [image, setImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
  };

  const fields = useMemo(
    (): {
      name: keyof FormData;
      label: string;
      autoComplete?: string;
      type?: string;
      minLength?: number;
      onBlur?: () => void;
    }[] => [
      {
        name: 'fullName',
        label: 'Nombre Completo',
        minLength: 3,
      },
      {
        name: 'email',
        label: 'Correo Electrónico',
        autoComplete: 'email',
        type: 'email',
        onBlur: () => {
          if (formData?.username) return;
          const username = formData?.email.split('@')[0];
          setFormData((prev) => ({ ...prev, username }));
        },
      },
      {
        name: 'username',
        label: 'Nombre de Usuario',
        minLength: 3,
      },
      {
        name: 'password',
        label: 'Contraseña',
        type: 'password',
        autoComplete: 'new-password',
        minLength: 6,
      },
    ],
    [formData?.email, formData?.username]
  );

  const validate = async (data: FormData) => {
    const errors: Partial<Record<keyof FormData, string>> = fields.reduce(
      (acc, field) => {
        if (!data[field.name]) {
          acc[field.name] = `${field.label} es requerido`;
        }
        return acc;
      },
      {} as Partial<Record<keyof FormData, string>>
    );

    if (data.username) {
      const usernameExists = await getUserByUsername({
        username: data.username,
      });
      if (usernameExists) {
        errors.username = 'El nombre de usuario ya existe';
      }
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const errors = await validate(formData);
      setErrors(errors);
      if (Object.keys(errors).length > 0) {
        throw new Error('Validation errors');
      }
      await signUp({
        ...formData,
        image,
      });
      toast.success('Cuenta creada correctamente');
    } catch (err) {
      toast.error((err as Error).message);
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <header className="w-full">
        <Button asChild variant="default" size="icon" className="mb-4">
          <Link href="/auth/signin">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </header>
      <div className="w-full max-w-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Registro
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Regístrate y bebe con tus amigos
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 rounded-lg sm:bg-white sm:p-4 sm:shadow-sm">
            <div className="mb-4 flex w-full justify-center">
              <ImageInput
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                value={image}
                size={Sizes.xl}
              />
            </div>

            {fields.map(({ name, label, ...rest }) => (
              <fieldset key={name}>
                <label htmlFor={name}>{label}</label>
                <Input
                  id={name}
                  name={name}
                  required
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={`Escribe tu ${label}`}
                  aria-invalid={!!errors[name]}
                  {...rest}
                />
                {errors[name] && (
                  <p className="ml-2 text-xs text-red-500">{errors[name]}</p>
                )}
              </fieldset>
            ))}
          </div>

          <div className="w-full">
            <Button disabled={loading} type="submit" className="w-full">
              {loading ? 'Cargando...' : 'Registrarse'}
            </Button>
          </div>

          <p className="text-center text-sm font-medium">
            ¿Ya tienes una cuenta?
            <Link
              href="/auth/signin"
              className="text-primary hover:text-primary/80 ml-1"
            >
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
