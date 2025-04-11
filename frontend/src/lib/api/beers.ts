import { COLLECTIONS } from '@/lib/constants/collections';
import { getDocuments } from '@/lib/helpers/db';
import { Beer } from '@/lib/types/beers';

const collection = COLLECTIONS.BEERS;

/**
 * Fetches the list of beers from the database.
 *
 * @returns {Snapshot<Beer>} A promise that resolves to the list of beers.
 */
export const getBeers = () => {
  return getDocuments<Beer[]>({ path: collection });
};
