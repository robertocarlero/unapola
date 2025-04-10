'use client';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

import { recoveryPassword } from '@/api/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Recovery() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState('');

  const validate = (email: string) => {
    if (!email) {
      return 'Correo electrónico es requerido';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Por favor, ingrese una dirección de correo electrónico válida';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const validationError = validate(email);
      setError(validationError);
      if (validationError) {
        throw new Error(validationError);
      }
      await recoveryPassword({ email });
      toast.success('Correo de recuperación enviado correctamente');
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
      <div className="flex h-full w-full max-w-md flex-col items-center pt-12">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Recuperar contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tu correo electrónico y te enviaremos un enlace para
            restablecer tu contraseña
          </p>
        </div>

        <form className="mt-8 w-full space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 rounded-lg sm:bg-white sm:p-4 sm:shadow-sm">
            <fieldset>
              <label htmlFor="email">Correo electrónico</label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Escribe tu correo electrónico"
                aria-invalid={!!error}
                autoComplete="email"
              />
              {error && <p className="ml-2 text-xs text-red-500">{error}</p>}
            </fieldset>
          </div>

          <div className="w-full">
            <Button disabled={loading} type="submit" className="w-full">
              {loading ? 'Cargando...' : 'Enviar enlace de recuperación'}
            </Button>
          </div>

          <p className="text-center text-sm font-medium">
            ¿Recuerdas tu contraseña?
            <Link
              href="/auth/signin"
              className="text-primary hover:text-primary/80 ml-1"
            >
              Iniciar sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
