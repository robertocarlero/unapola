import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  onSnapshot,
  QuerySnapshot,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import * as cryptoServer from 'crypto';

import { db } from '@/lib/api';

import {
  GetDocumentOptions,
  SetDocumentOptions,
  Snapshot,
  TransformDocumentResult,
} from '@/lib/types/db';

export function getRandomUUID() {
  if (typeof window === 'undefined') {
    return cryptoServer.randomBytes(16).toString('hex');
  }
  return crypto.randomUUID();
}

/**
 * Transforms a Firestore document snapshot into a typed object.
 * @template T - The type of the transformed document.
 * @param {DocumentSnapshot<DocumentData>} doc - The document snapshot to transform.
 * @returns {TransformDocumentResult<T> | null} - The transformed document or null if it doesn't exist.
 */
export function transformDocument<T>(
  doc: DocumentSnapshot<DocumentData>
): TransformDocumentResult<T> | null {
  return doc?.exists?.() ? { ...(doc.data() as T), id: doc.id } : null;
}

/**
 * Transforms an array of Firestore document snapshots into an array of typed objects.
 * @template T - The type of the transformed documents.
 * @param {DocumentSnapshot<DocumentData>[]} docs - The document snapshots to transform.
 * @returns {TransformDocumentResult<T>[]} - An array of transformed documents.
 */
export function transformDocuments<T>(
  docs: DocumentSnapshot<DocumentData>[]
): TransformDocumentResult<T>[] {
  return docs.map((doc) => transformDocument<T>(doc));
}

/**
 * Retrieves a single document from Firestore and provides real-time updates.
 * @template T - The type of the document.
 * @param {GetDocumentOptions<T>} options - Options for retrieving the document.
 * @param {string} options.path - The path to the document.
 * @param {string} options.id - The id of the document.
 * @param {Function} options.parseFn - A function to parse the document data.
 * @returns {Snapshot<T>} - An object containing methods to get the document and listen for updates.
 */
export const getDocument = <T>({
  path,
  id,
  parseFn,
}: GetDocumentOptions<T>): Snapshot<T> => {
  const q = doc(db, path, id);

  const prepareData = (data: DocumentSnapshot<DocumentData>) => {
    if (!data.exists()) return null;
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
        const body = prepareData(res);
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
 * @param {GetDocumentOptions<T>} options - Options for retrieving the documents.
 * @param {string} options.path - The path to the collection.
 * @param {Function} options.parseFn - A function to parse the documents data.
 * @returns {Snapshot<T>} - An object containing methods to get the documents and listen for updates.
 */
export const getDocuments = <T>({
  path,
  parseFn,
}: GetDocumentOptions<T>): Snapshot<T> => {
  const query = collection(db, path);

  const prepareData = (data: QuerySnapshot<DocumentData, DocumentData>) => {
    if (data.empty) return null;
    const body = transformDocuments<T>(data.docs);
    if (parseFn) {
      return parseFn(body);
    }

    return body;
  };

  return {
    collection: path,
    onSnapshot: (callback) => {
      return onSnapshot(query, (res) => {
        const body = prepareData(res);
        callback(body);
      });
    },
    get: async () => {
      const res = await getDocs(query);
      return prepareData(res);
    },
  };
};

/**
 * Sets a document in Firestore, creating or updating it as necessary.
 * @template T - The type of the document data.
 * @param {SetDocumentOptions<T>} options - Options for setting the document.
 * @param {string} options.path - The path to the document.
 * @param {string} options.id - The id of the document.
 * @param {DocumentData} options.data - The data to set in the document.
 * @returns {Promise<T & { id: string; createdAt?: Timestamp; updatedAt?: Timestamp }>} - A promise that resolves to the document data with metadata.
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
