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

/**
 * Retrieves a user document from the database by user ID.
 *
 * @param {GetUserOptions} options - The options containing the user ID.
 * @param {string} options.id - The user ID.
 * @returns {Promise<User>} A promise that resolves to the user document.
 */
export const getUser = async ({ id }: GetUserOptions) => {
  return getDocument<User>({ path: COLLECTIONS.USERS, id });
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
 * @param {SetUserOptions} options - The options for setting the user data.
 * @param {string} [options.id] - The user ID. If not provided, a new ID is generated.
 * @param {Partial<User>} options.data - The user data to set.
 * @param {File | null} [options.image] - An optional image file for the user's avatar.
 * @returns {Promise<void>} A promise that resolves when the user document is set.
 */
export const setUser = async ({ id, data, image }: SetUserOptions) => {
  const body = { ...data };
  const userID = id ?? randomUUID();

  if (image) {
    const path = `${COLLECTIONS.USERS}/${userID}}`;
    const fileName = `avatar.${image.type.split('/')[1]}`;

    const avatar = await uploadFile({ file: image, path, fileName });
    body.avatar = avatar;
  }

  return setDocument<User>({ path: COLLECTIONS.USERS, id, data: body });
};

type GetUserByUsernameOptions = {
  username: string;
};

/**
 * Retrieves a user document from the database by username.
 *
 * @param {GetUserByUsernameOptions} options - The options containing the username.
 * @param {string} options.username - The username to search for.
 * @returns {Promise<User | null>} A promise that resolves to the user document or null if not found.
 */
export const getUserByUsername = async ({
  username,
}: GetUserByUsernameOptions): Promise<User | null> => {
  const ref = collection(db, COLLECTIONS.USERS);
  const q = query(ref, where('username', '==', username), limit(1));

  const res = await getDocs(q);

  return transformDocument<User>(res.docs[0]);
};
