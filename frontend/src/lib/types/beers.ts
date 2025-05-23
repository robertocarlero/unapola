import { Document } from './db';
import { FileObject } from './storage';

export interface Beer extends Document {
  name: string;
  price: number;
  image: FileObject;
  quantity: number;
  discount?: number;
  description?: string;
}

export interface Round extends Document {
  hangoutId: string;
  userId: string;
  items: Beer[];
}
