import { limit, orderBy, where } from 'firebase/firestore';

import {
  getDocument,
  getDocuments,
  getRandomUUID,
  setDocument,
} from '@/lib/helpers/db';
import { uploadFile } from '@/lib/helpers/storage';

import { COLLECTIONS } from '@/lib/constants/collections';
import { Hangout } from '@/lib/types/hangouts';

const collection = COLLECTIONS.HANGOUTS;

type SetHangoutParams = {
  id?: string;
  data: Partial<Hangout>;
  image?: File | null;
};

/**
 * Sets a hangout document in the database.
 * If an image is provided, it uploads the image and includes its reference in the document.
 *
 * @param {SetHangoutParams} params - The parameters for setting the hangout.
 * @param {string} [params.id] - Optional ID for the hangout. If not provided, a new UUID is generated.
 * @param {Partial<Hangout>} params.data - The data for the hangout.
 * @param {File | null} [params.image] - Optional image file to upload.
 * @returns {Promise<Partial<Hangout>>} A promise that resolves when the document is set.
 */
export const setHangout = async ({ id, data, image }: SetHangoutParams) => {
  const body = { ...data };
  const hangoutId = id ?? getRandomUUID();

  if (image) {
    const result = await uploadFile({
      file: image,
      path: `${collection}/${hangoutId}/image`,
    });

    body.image = result;
  }

  return setDocument({
    path: collection,
    id: hangoutId,
    data: body,
  });
};

type GetHangoutsParams = {
  participantId?: string;
};

/**
 * Retrieves hangouts from the database for a specific participant.
 * The results are ordered by date in descending order and limited to 20 entries.
 *
 * @param {GetHangoutsParams} params - The parameters for retrieving hangouts.
 * @param {string} [params.participantId] - The ID of the participant to filter hangouts by.
 * @returns {Snapshot<Hangout[]>} A promise that resolves with an array of hangouts.
 */
export const getHangouts = ({ participantId }: GetHangoutsParams) => {
  const queries = [
    where('participants', 'array-contains', participantId),
    orderBy('date', 'desc'),
    limit(20),
  ];

  return getDocuments<Hangout[]>({
    path: collection,
    queries,
  });
};

/**
 * Retrieves a hangout document from the database by its ID.
 *
 * @param {string} id - The ID of the hangout to retrieve.
 * @returns {Snapshot<Hangout>} A promise that resolves with the hangout document or null if it doesn't exist.
 */
export const getHangout = (id: string) => {
  return getDocument<Hangout>({
    path: collection,
    id,
  });
};
