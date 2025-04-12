import { QueryConstraint, Timestamp, Unsubscribe } from 'firebase/firestore';

export interface Document {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type TransformDocumentResult<T> =
  | ({ [K in keyof T]: T[K] } & Document)
  | null;

export type GetDocumentOptions<T> = {
  path: string;
  id?: string;
  queries?: QueryConstraint[];
  parseFn?: <K extends T>(
    res: TransformDocumentResult<T> | TransformDocumentResult<T>[]
  ) => TransformDocumentResult<K>;
};

export type GetFn<T> = () => Promise<
  TransformDocumentResult<T> | TransformDocumentResult<T>[]
>;

export type CallbackFn<T> = (
  data: TransformDocumentResult<T> | TransformDocumentResult<T>[]
) => void;

export type SnapshotFn<T> = (callback: CallbackFn<T>) => Unsubscribe;

export type Snapshot<T> = {
  onSnapshot: SnapshotFn<T>;
  get: GetFn<T>;
  collection: string;
};

export type SetDocumentOptions<T> = {
  path: string;
  id?: string;
  data: Partial<T>;
};

export type DeleteDocumentOptions = {
  path: string;
  id: string;
};
