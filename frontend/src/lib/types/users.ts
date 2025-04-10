import { FileObject } from './storage';

export type User = {
  id: string;
  fullName: string;
  username?: string;
  email: string;
  avatar?: FileObject;
};
