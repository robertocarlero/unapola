import { getRandomUUID, setDocument } from '../helpers/db';
import { Hangout } from '../types/hangouts';
import { COLLECTIONS } from '../constants/collections';
import { uploadFile } from '../helpers/storage';

const collection = COLLECTIONS.HANGOUTS;

type SetHangoutParams = {
  id?: string;
  data: Partial<Hangout>;
  image?: File | null;
};

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
    data,
  });
};
