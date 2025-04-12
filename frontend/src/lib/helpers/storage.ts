import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { randomUUID } from 'crypto';

import { storage } from '@/lib/api';
import { normalizeString } from '@/lib/helpers/strings';

import { UploadFileOptions, FileObject } from '@/lib/types/storage';

/**
 * Uploads a file to Firebase storage and returns a FileObject containing the file's URL, name, and full path.
 * @param options - Options for uploading the file.
 * @param options.path - The path in the storage where the file will be uploaded.
 * @param options.file - The file to be uploaded.
 * @param options.fileName - Optional custom file name. If not provided, a random UUID will be used.
 * @returns A promise that resolves to a FileObject containing the file's URL, name, and full path.
 *
 * @example
 * const fileObject = await uploadFile({ path: 'users/123/avatar', file: file });
 * console.log(fileObject);
 *
 * Response:
 * {
 *   url: 'https://storage.googleapis.com/bucket-name/users/123/avatar.png',
 *   fileName: 'avatar.png',
 *   fullPath: 'users/123/avatar.png',
 * }
 */
export const uploadFile = async ({
  path,
  file,
  fileName,
}: UploadFileOptions): Promise<FileObject> => {
  const currentFileName =
    fileName || file?.name || `${randomUUID()}.${file?.type.split('/')[1]}`;
  const formattedFileName = normalizeString(currentFileName);

  const storageRef = ref(storage, path);
  const fileRef = ref(storageRef, formattedFileName);

  const snapshot = await uploadBytesResumable(fileRef, file);
  const url = await getDownloadURL(snapshot.ref);

  return {
    url,
    fileName: formattedFileName,
    fullPath: snapshot.ref.fullPath,
  };
};
