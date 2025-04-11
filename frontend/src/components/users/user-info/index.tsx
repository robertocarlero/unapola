'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { UserInfoSkeleton } from './skeleton';
import { getUserById } from '@/lib/api/users';
import { useCallback } from 'react';
import { useSnapshot } from '@/lib/hooks/useSnapshot';

type UserInfoProps = {
  userId: string | null;
};

export const UserInfo = ({ userId }: UserInfoProps) => {
  const getUser = useCallback(
    () => getUserById({ id: userId ?? '' }),
    [userId]
  );

  const { data: userData, loading: loadingUserData } = useSnapshot({
    fn: getUser,
    active: !!userId,
  });

  const { avatar, fullName, username } = userData ?? {};

  const initials = fullName?.[0];

  if (loadingUserData) return <UserInfoSkeleton />;

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-12 w-12">
        <AvatarImage
          src={avatar?.url}
          className="object-cover"
          alt={fullName ?? ''}
        />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="text-sm font-medium">{fullName}</p>
        <p className="text-muted-foreground text-sm">@{username}</p>
      </div>
    </div>
  );
};
