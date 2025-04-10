'use client';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { UserInfoSkeleton } from './skeleton';

export const UserInfo = () => {
  const { userData, loadingUserData } = useAuth();
  const { avatar, fullName, username } = userData ?? {};

  const initials = fullName?.[0];

  if (loadingUserData) return <UserInfoSkeleton />;

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-12 w-12">
        <AvatarImage src={avatar?.url} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="text-sm font-medium">{fullName}</p>
        <p className="text-muted-foreground text-sm">@{username}</p>
      </div>
    </div>
  );
};
