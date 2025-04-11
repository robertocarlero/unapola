import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { randomUUID } from 'crypto';

import { db } from '@/lib/api';
import { getDocument, setDocument, transformDocument } from '@/lib/helpers/db';
import { uploadFile } from '@/lib/helpers/storage';

import { COLLECTIONS } from '@/lib/constants/collections';
import { User } from '@/lib/types/users';

type GetUserOptions = {
  id: string;
};

const COLLECTION = COLLECTIONS.USERS;

/**
 * Retrieves a user document from the database by user ID.
 *
 * @param  options - The options containing the user ID.
 * @param  options.id - The user ID.
 * @returns A promise that resolves to the user document.
 */
export const getUser = ({ id }: GetUserOptions) => {
  return getDocument<User>({ path: COLLECTION, id });
};

type SetUserOptions = {
  id?: string;
  data: Partial<User>;
  image?: File | null;
};

/**
 * Sets or updates a user document in the database.
 * If an image is provided, it uploads the image and sets the avatar URL.
 *
 * @param  options - The options for setting the user data.
 * @param  options.id - The user ID. If not provided, a new ID is generated.
 * @param  options.data - The user data to set.
 * @param  options.image - An optional image file for the user's avatar.
 * @returns A promise that resolves when the user document is set.
 */
export const setUser = async ({ id, data, image }: SetUserOptions) => {
  const body = { ...data };
  const userID = id ?? randomUUID();

  if (image) {
    const path = `${COLLECTION}/${userID}}`;
    const fileName = `avatar.${image.type.split('/')[1]}`;

    const avatar = await uploadFile({ file: image, path, fileName });
    body.avatar = avatar;
  }

  return setDocument<User>({ path: COLLECTION, id, data: body });
};

type GetUserByUsernameOptions = {
  username: string;
};

/**
 * Retrieves a user document from the database by username.
 *
 * @param  options - The options containing the username.
 * @param  options.username - The username to search for.
 * @returns A promise that resolves to the user document or null if not found.
 */
export const getUserByUsername = async ({
  username,
}: GetUserByUsernameOptions): Promise<User | null> => {
  const ref = collection(db, COLLECTION);
  const q = query(ref, where('username', '==', username), limit(1));

  const res = await getDocs(q);

  return transformDocument<User>(res.docs[0]);
};

type GetUserByIdOptions = {
  id: string;
};

/**
 * Retrieves a user document from the database by user ID.
 *
 * @param  options - The options containing the user ID.
 * @param  options.id - The user ID.
 * @returns A promise that resolves to the user document or null if not found.
 */
export const getUserById = ({ id }: GetUserByIdOptions) => {
  return getDocument<User>({ path: COLLECTION, id });
};
