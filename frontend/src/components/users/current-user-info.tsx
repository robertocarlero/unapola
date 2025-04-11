'use client';

import { useAuth } from '@/context/AuthContext';
import { UserInfo } from './user-info';

export const CurrentUserInfo = () => {
  const { user } = useAuth();

  return <UserInfo userId={user?.uid ?? ''} />;
};
