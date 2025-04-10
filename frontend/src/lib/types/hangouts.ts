import { Timestamp } from 'firebase/firestore';
import { FileObject } from './storage';

export type Hangout = {
  id: string;
  name: string;
  date: Timestamp | Date;
  address: string;
  image?: FileObject;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  createdBy: string;
  participants: string[];
};
