import { limit, orderBy, where } from 'firebase/firestore';

import {
  deleteDocument,
  getDocument,
  getDocuments,
  getRandomUUID,
  setDocument,
} from '@/lib/helpers/db';
import { uploadFile } from '@/lib/helpers/storage';

import { COLLECTIONS } from '@/lib/constants/collections';
import { Hangout } from '@/lib/types/hangouts';
import { Round } from '../types/beers';

const collection = COLLECTIONS.HANGOUTS;
const roundsCollection = COLLECTIONS.ROUNDS;

type SetHangoutParams = {
  id?: string;
  data: Partial<Hangout>;
  image?: File | null;
};

/**
 * Sets a hangout document in the database.
 * If an image is provided, it uploads the image and includes its reference in the document.
 *
 * @param params - The parameters for setting the hangout.
 * @param params.id - Optional ID for the hangout. If not provided, a new UUID is generated.
 * @param params.data - The data for the hangout.
 * @param params.image - Optional image file to upload.
 * @returns A promise that resolves when the document is set.
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
 * @param params - The parameters for retrieving hangouts.
 * @param params.participantId - The ID of the participant to filter hangouts by.
 * @returns A promise that resolves with an array of hangouts.
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
 * @param id - The ID of the hangout to retrieve.
 * @returns A promise that resolves with the hangout document or null if it doesn't exist.
 */
export const getHangout = (id: string) => {
  return getDocument<Hangout>({
    path: collection,
    id,
  });
};

type DeleteHangoutParams = {
  id: string;
};

/**
 * Deletes a hangout from the database.
 *
 * @param  options - The options for deleting a hangout.
 * @param options.id - The ID of the hangout to delete.
 * @returns A promise that resolves when the hangout is deleted.
 */
export const deleteHangout = ({ id }: DeleteHangoutParams) => {
  return deleteDocument({ path: collection, id });
};

/**
 * Creates a new round for a hangout.
 *
 * @param  options - The options for creating a round.
 * @param options.data - The round data to create.
 * @returns A promise that resolves to the created round.
 */
export const createRound = (data: Partial<Round>) => {
  const { hangoutId } = data;
  const path = `${collection}/${hangoutId}/${roundsCollection}`;

  return setDocument<Round>({ path, data });
};

type GetRoundsParams = {
  hangoutId: string;
};

/**
 * Retrieves rounds for a specific hangout from the database.
 *
 * @param  params - The parameters for retrieving rounds.
 * @param  params.hangoutId - The ID of the hangout to retrieve rounds for.
 * @returns  A snapshot with an array of rounds.
 */
export const getRounds = ({ hangoutId }: GetRoundsParams) => {
  const path = `${collection}/${hangoutId}/${roundsCollection}`;

  return getDocuments<Round[]>({ path });
};
