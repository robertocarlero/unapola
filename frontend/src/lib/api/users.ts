import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { randomUUID } from 'crypto';

import { db } from '@/lib/api';
import { getDocument, setDocument, transformDocument } from '@/lib/helpers/db';
import { uploadFile } from '@/lib/helpers/storage';

import { COLLECTIONS } from '@/lib/constants/collections';
import { User } from '@/lib/types/users';

type GetUserParams = {
  id: string;
};

const COLLECTION = COLLECTIONS.USERS;

/**
 * Retrieves a user document from the database by user ID.
 *
 * @param  params - The params containing the user ID.
 * @param  params.id - The user ID.
 * @returns A promise that resolves to the user document.
 */
export const getUser = ({ id }: GetUserParams) => {
  return getDocument<User>({ path: COLLECTION, id });
};

type SetUserParams = {
  id?: string;
  data: Partial<User>;
  image?: File | null;
};

/**
 * Sets or updates a user document in the database.
 * If an image is provided, it uploads the image and sets the avatar URL.
 *
 * @param  params - The params for setting the user data.
 * @param  params.id - The user ID. If not provided, a new ID is generated.
 * @param  params.data - The user data to set.
 * @param  params.image - An optional image file for the user's avatar.
 * @returns A promise that resolves when the user document is set.
 */
export const setUser = async ({ id, data, image }: SetUserParams) => {
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

type GetUserByUsernameParams = {
  username: string;
};

/**
 * Retrieves a user document from the database by username.
 *
 * @param  params - The params containing the username.
 * @param  params.username - The username to search for.
 * @returns A promise that resolves to the user document or null if not found.
 */
export const getUserByUsername = async ({
  username,
}: GetUserByUsernameParams): Promise<User | null> => {
  const ref = collection(db, COLLECTION);
  const q = query(ref, where('username', '==', username), limit(1));

  const res = await getDocs(q);

  return transformDocument<User>(res.docs[0]);
};

type GetUserByIdParams = {
  id: string;
};

/**
 * Retrieves a user document from the database by user ID.
 *
 * @param  params - The params containing the user ID.
 * @param  params.id - The user ID.
 */
export const getUserById = ({ id }: GetUserByIdParams) => {
  return getDocument<User>({ path: COLLECTION, id });
};
