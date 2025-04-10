import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { randomUUID } from 'crypto';

import { storage } from '@/lib/api';
import { normalizeString } from '@/lib/helpers/strings';

import { UploadFileOptions, FileObject } from '@/lib/types/storage';

/**
 * Uploads a file to Firebase storage and returns a FileObject containing the file's URL, name, and full path.
 * @param {UploadFileOptions} options - Options for uploading the file.
 * @param {string} options.path - The path in the storage where the file will be uploaded.
 * @param {File} options.file - The file to be uploaded.
 * @param {string} [options.fileName] - Optional custom file name. If not provided, a random UUID will be used.
 * @returns {Promise<FileObject>} - A promise that resolves to a FileObject containing the file's URL, name, and full path.
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
