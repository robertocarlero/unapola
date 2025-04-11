/* eslint-disable @next/next/no-img-element */
'use client';
import { memo, useMemo } from 'react';
import { motion } from 'motion/react';

import { formatDate } from '@/lib/helpers/dates';
import { getRandomHexColor } from '@/lib/helpers/strings';

import { Hangout } from '@/lib/types/hangouts';
import { HangoutCancelButton } from './hangout-cancel-button';

type HangoutCardProps = {
  data: Hangout;
  focused: boolean;
  onClick: () => void;
};

export const HangoutCard = memo(
  ({ data, focused, onClick }: HangoutCardProps) => {
    const { name, address, date, image, cancelled } = data || {};

    const color = useMemo(() => getRandomHexColor(), []);

    const formattedDate = useMemo(() => formatDate(date), [date]);

    const shakeAnimation = {
      scale: focused ? 1.02 : 1,
      rotate: focused ? [0, -2, 2, 0] : 0,
    };

    const shakeTransition = {
      duration: 0.3,
      type: 'spring',
      stiffness: 300,
      damping: 10,
      rotate: {
        repeat: focused ? 1 : 0,
        duration: 0.15,
      },
    };

    return (
      <motion.div
        className={`relative flex w-64 shrink-0 cursor-pointer flex-col overflow-hidden rounded-lg bg-white shadow-md ${
          focused ? 'border-ring ring-ring/50 ring-[3px]' : ''
        }`}
        onClick={onClick}
        role="button"
        animate={shakeAnimation}
        transition={shakeTransition}
        whileHover={{ scale: 1.01 }}
      >
        <HangoutCancelButton
          className="absolute top-2 right-2"
          data={data}
          isIconButton
        />
        {
          <picture className="h-40 w-full overflow-hidden">
            {image ? (
              <img
                src={image?.url ?? ''}
                alt={name}
                className="object-cover"
                width={256}
                height={160}
              />
            ) : (
              <div
                className="h-full w-full"
                style={{ backgroundColor: color }}
              />
            )}
          </picture>
        }
        <div className="flex w-full flex-col p-2">
          <h3 className="text-lg font-bold">{name}</h3>
          <p className="mt-[-8px] text-sm text-gray-500">{address}</p>
          <p className="text-xs text-gray-500 capitalize">{formattedDate}</p>
          <p
            className={`text-xs capitalize ${cancelled ? 'text-red-500' : 'text-green-500'}`}
          >
            {cancelled ? 'Cancelada' : 'Activa'}
          </p>
        </div>
      </motion.div>
    );
  }
);

HangoutCard.displayName = 'HangoutCard';
