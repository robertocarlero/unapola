import { Unsubscribe } from 'firebase/firestore';

export type TransformDocumentResult<T> =
  | ({ [K in keyof T]: T[K] } & { id: string })
  | null;

export type GetDocumentOptions<T> = {
  path: string;
  id: string;
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
