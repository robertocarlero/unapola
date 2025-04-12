import { limit, orderBy, where } from 'firebase/firestore';

import {
  deleteDocument,
  getDocument,
  getDocuments,
  setDocument,
} from '@/lib/helpers/db';
import { getRandomUUID } from '@/lib/helpers/strings';
import { uploadFile } from '@/lib/helpers/storage';

import { COLLECTIONS } from '@/lib/constants/collections';
import { Hangout } from '@/lib/types/hangouts';
import { Round } from '../types/beers';

const COLLECTION = COLLECTIONS.HANGOUTS;
const ROUNDS_COLLECTION = COLLECTIONS.ROUNDS;

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
      path: `${COLLECTION}/${hangoutId}/image`,
    });

    body.image = result;
  }

  return setDocument({
    path: COLLECTION,
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
 */
export const getHangouts = ({ participantId }: GetHangoutsParams) => {
  const queries = [
    where('participants', 'array-contains', participantId),
    orderBy('date', 'desc'),
    limit(20),
  ];

  return getDocuments<Hangout[]>({
    path: COLLECTION,
    queries,
  });
};

type GetHangoutParams = {
  id: string;
};

/**
 * Retrieves a hangout document from the database by its ID.
 *
 * @param  params - The parameters for retrieving a hangout.
 * @param  params.id - The ID of the hangout to retrieve.
 */
export const getHangout = ({ id }: GetHangoutParams) => {
  return getDocument<Hangout>({
    path: COLLECTION,
    id,
  });
};

type DeleteHangoutParams = {
  id: string;
};

/**
 * Deletes a hangout from the database.
 *
 * @param params - The params for deleting a hangout.
 * @param params.id - The ID of the hangout to delete.
 * @returns A promise that resolves when the hangout is deleted.
 */
export const deleteHangout = ({ id }: DeleteHangoutParams) => {
  return deleteDocument({ path: COLLECTION, id });
};

type SetRoundParams = {
  id?: string;
  data: Partial<Round>;
};

/**
 * Creates a new round for a hangout.
 *
 * @param  params - The params for creating a round.
 * @param params.id - The ID of the round to create.
 * @param params.data - The round data to create.
 * @returns A promise that resolves to the created round.
 */
export const setRound = ({ id, data }: SetRoundParams) => {
  const { hangoutId } = data;

  const path = `${COLLECTION}/${hangoutId}/${ROUNDS_COLLECTION}`;

  return setDocument<Round>({ path, id, data });
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
  const path = `${COLLECTION}/${hangoutId}/${ROUNDS_COLLECTION}`;

  return getDocuments<Round[]>({ path });
};
