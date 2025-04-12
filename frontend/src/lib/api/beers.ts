import { COLLECTIONS } from '@/lib/constants/collections';
import { getDocuments } from '@/lib/helpers/db';
import { Beer } from '@/lib/types/beers';

const COLLECTION = COLLECTIONS.BEERS;

/**
 * Fetches the list of beers from the database.
 */
export const getBeers = () => {
  return getDocuments<Beer[]>({ path: COLLECTION });
};
