/* eslint-disable @next/next/no-img-element */
'use client';
import { useMemo, useState } from 'react';
import { ImagePlusIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Sizes } from '@/lib/types/theme';
import { cn } from '@/lib/utils';

type InputFileProps = {
  value?: File | null | string;
  onChange?: (file: File | null) => void;
  size?: Sizes | keyof typeof Sizes;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'size'
>;

export function ImageInput({
  value,
  onChange,
  size = Sizes.md,
  className,
  ...props
}: InputFileProps) {
  const [image, setImage] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setImage(file);
    onChange?.(file);
  };

  const imageURL: string | null = useMemo(() => {
    if (image) {
      return URL.createObjectURL(image);
    }

    if (typeof value === 'string') {
      return value;
    }

    if (value instanceof File) {
      return URL.createObjectURL(value);
    }

    return null;
  }, [value, image]);

  const sizeClass = useMemo(() => {
    const sizeMap = {
      [Sizes.xs]: 'w-6 h-6 p-1',
      [Sizes.sm]: 'w-8 h-8 p-1',
      [Sizes.md]: 'w-12 h-12 p-1',
      [Sizes.lg]: 'w-16 h-16 p-2',
      [Sizes.xl]: 'w-24 h-24 p-2',
    };

    return sizeMap[size];
  }, [size]);

  const { width, height } = useMemo(() => {
    const dimensionsMap = {
      [Sizes.xs]: 24,
      [Sizes.sm]: 32,
      [Sizes.md]: 48,
      [Sizes.lg]: 64,
      [Sizes.xl]: 96,
    };

    const dimension = dimensionsMap[size];

    return { width: dimension, height: dimension };
  }, [size]);

  return (
    <div>
      <Label
        htmlFor={props.id || 'picture'}
        className={cn(
          sizeClass,
          'cursor-pointer overflow-hidden rounded-full border border-dashed border-gray-300',
          className,
          props.disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <div className="h-full w-full overflow-hidden rounded-full">
          {imageURL ? (
            <img
              src={imageURL}
              alt="Imagen"
              className="h-full w-full object-cover"
              width={width}
              height={height}
            />
          ) : (
            <div className="w- flex h-full w-full items-center justify-center bg-gray-200">
              <ImagePlusIcon className="h-6 w-6 text-gray-500" />
            </div>
          )}
        </div>
      </Label>
      <Input
        className="hidden"
        id="picture"
        type="file"
        onChange={handleInputChange}
        {...props}
      />
    </div>
  );
}
