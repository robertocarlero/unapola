import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  query,
  QuerySnapshot,
  setDoc,
  Timestamp,
  onSnapshot,
  deleteDoc,
} from 'firebase/firestore';

import { db } from '@/lib/api';
import { getRandomUUID } from '@/lib/helpers/strings';

import {
  DeleteDocumentOptions,
  GetDocumentOptions,
  SetDocumentOptions,
  Snapshot,
  TransformDocumentResult,
} from '@/lib/types/db';

/**
 * Transforms a Firestore document snapshot into a typed object.
 * @template T - The type of the transformed document.
 * @param doc - The document snapshot to transform.
 * @returns The transformed document or null if it doesn't exist.
 */
export function transformDocument<T>(
  doc: DocumentSnapshot<DocumentData>
): TransformDocumentResult<T> | null {
  return doc?.exists?.() ? { ...(doc.data() as T), id: doc.id } : null;
}

/**
 * Transforms an array of Firestore document snapshots into an array of typed objects.
 * @template T - The type of the transformed documents.
 * @param docs - The document snapshots to transform.
 * @returns An array of transformed documents.
 */
export function transformDocuments<T>(
  docs: DocumentSnapshot<DocumentData>[]
): TransformDocumentResult<T>[] {
  return docs.map((doc) => transformDocument<T>(doc));
}

/**
 * Retrieves a single document from Firestore and provides real-time updates.
 * @template T - The type of the document.
 * @param  options - Options for retrieving the document.
 * @param  options.path - The path to the document.
 * @param  options.id - The id of the document.
 * @param  options.parseFn - A function to parse the document data.
 * @returns An object containing methods to get the document and listen for updates.
 *
 * @example
 * const { data, loading } = useSnapshot({
 *   fn: () => getDocument({ path: 'users', id: '123' }),
 *   active: true,
 * });
 *
 * getDocument({ path: 'users', id: '123' }).onSnapshot((doc) => {
 *   console.log(doc);
 * });
 *
 * await getDocument({ path: 'users', id: '123' }).get();
 */
export const getDocument = <T>({
  path,
  id,
  parseFn,
}: GetDocumentOptions<T>): Snapshot<T> => {
  const q = doc(db, path, id ?? '');

  const prepareData = (data: DocumentSnapshot<DocumentData>) => {
    if (!data?.exists?.()) return null;
    const body = transformDocument<T>(data);

    if (parseFn) {
      return parseFn(body);
    }

    return body;
  };

  return {
    collection: path,
    onSnapshot: (callback) => {
      return onSnapshot(q, (res) => {
        console.log('New snapshot at', path);
        const body = prepareData(res as DocumentSnapshot<DocumentData>);
        callback(body);
      });
    },
    get: async () => {
      const res = await getDoc(q);
      return prepareData(res);
    },
  };
};

/**
 * Retrieves multiple documents from a Firestore collection and provides real-time updates.
 * @template T - The type of the documents.
 * @param  options - Options for retrieving the documents.
 * @param  options.path - The path to the collection.
 * @param  options.parseFn - A function to parse the documents data.
 * @param  options.queries - The queries to apply to the collection.
 * @returns An object containing methods to get the documents and listen for updates.
 *
 * @example
 * const { data, loading } = useSnapshot({
 *   fn: () => getDocuments({ path: 'users', queries: [where('name', '==', 'John')] }),
 *   active: true,
 * });
 *
 * getDocuments({ path: 'users', queries: [where('name', '==', 'John')] }).onSnapshot((docs) => {
 *   console.log(docs);
 * });
 *
 * await getDocuments({ path: 'users', queries: [where('name', '==', 'John')] }).get();
 */
export const getDocuments = <T>({
  path,
  parseFn,
  queries,
}: GetDocumentOptions<T>): Snapshot<T> => {
  const ref = collection(db, path);

  const q = query(ref, ...(queries ?? []));

  const prepareData = (data: QuerySnapshot<DocumentData, DocumentData>) => {
    if (data?.empty) return null;
    const body = transformDocuments<T>(data.docs);
    if (parseFn) {
      return parseFn(body);
    }

    return body;
  };

  return {
    collection: path,
    onSnapshot: (callback) => {
      return onSnapshot(q, (res) => {
        console.log('New snapshot at', path);
        const body = prepareData(
          res as QuerySnapshot<DocumentData, DocumentData>
        );
        callback(body);
      });
    },
    get: async () => {
      const res = await getDocs(q);
      return prepareData(res);
    },
  };
};

/**
 * Sets a document in Firestore, creating or updating it as necessary.
 * @template T - The type of the document data.
 * @param  options - Options for setting the document.
 * @param  options.path - The path to the document.
 * @param  options.id - The id of the document.
 * @param  options.data - The data to set in the document.
 * @returns A promise that resolves to the document data with metadata.
 *
 * @example
 * await setDocument({ path: 'users', id: '123', data: { name: 'John' } });
 */

export const setDocument = async <T>({
  path,
  id,
  data,
}: SetDocumentOptions<T>): Promise<
  T & { id: string; createdAt?: Timestamp; updatedAt?: Timestamp }
> => {
  const docID = id ?? getRandomUUID();
  const q = doc(db, path, docID);

  const body: DocumentData = {
    ...data,
  };

  if (id) {
    body.updatedAt = Timestamp.now();
  } else {
    body.createdAt = Timestamp.now();
  }

  await setDoc(q, body, { merge: true });

  return {
    id: docID,
    ...(body as T),
  };
};

/**
 * Deletes a document from Firestore.
 * @param  options - Options for deleting the document.
 * @param  options.path - The path to the document.
 * @param  options.id - The id of the document.
 * @returns A promise that resolves when the document is deleted.
 *
 * @example
 * await deleteDocument({ path: 'users', id: '123' });
 */
export const deleteDocument = async ({ path, id }: DeleteDocumentOptions) => {
  const q = doc(db, path, id);
  return await deleteDoc(q);
};
