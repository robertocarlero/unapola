import { Document } from './db';
import { FileObject } from './storage';

export interface User extends Document {
  fullName: string;
  username?: string;
  email: string;
  avatar?: FileObject;
}
