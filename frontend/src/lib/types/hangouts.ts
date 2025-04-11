import { Timestamp } from 'firebase/firestore';
import { Document } from './db';
import { FileObject } from './storage';

export interface Hangout extends Document {
  name: string;
  date: Timestamp;
  address: string;
  image?: FileObject;
  createdBy: string;
  participants: string[];
  cancelled?: boolean;
  paid?: boolean;
  paidAt?: Timestamp;
}
