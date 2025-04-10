import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';

import { setUser } from '@/lib/api/users';
import { auth } from '@/lib/api';

import { AUTH_ERRORS } from '@/lib/constants/errors';
import { User } from '@/lib/types/users';

type SignUpOptions = {
  password: string;
  image?: File | null;
} & Pick<User, 'email' | 'fullName' | 'username'>;

/**
 * Registers a new user with the provided email and password.
 * Also sets additional user data and uploads an optional image.
 *
 * @param {SignUpOptions} options - The options for signing up a user.
 * @param {string} options.email - The user's email.
 * @param {string} options.password - The user's password.
 * @param {File | null} options.image - The user's image.
 * @param {string} options.fullName - The user's full name.
 * @param {string} options.username - The user's username.
 * @throws Will throw an error if the sign-up process fails.
 */
export const signUp = async ({
  email,
  password,
  image,
  ...data
}: SignUpOptions) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setUser({
      id: user.uid,
      data,
      image,
    });
  } catch (error) {
    const { code, message } = error as { code: string; message: string };
    console.log('Error on signup:', code, message);
    throw new Error(AUTH_ERRORS[code as keyof typeof AUTH_ERRORS]);
  }
};

/**
 * Signs in a user using email and password.
 *
 * @param {Object} credentials - The user's credentials.
 * @param {string} credentials.email - The user's email.
 * @param {string} credentials.password - The user's password.
 * @throws Will throw an error if the sign-in process fails.
 */
export const signIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    const { code, message } = error as { code: string; message: string };
    console.log('Error on signin:', code, message);
    throw new Error(AUTH_ERRORS[code as keyof typeof AUTH_ERRORS]);
  }
};

/**
 * Logs out the current user.
 *
 * @throws Will throw an error if the logout process fails.
 */
export const logout = async () => {
  try {
    await signOut(auth);
    console.log('User logged out');
  } catch (error) {
    const { code, message } = error as { code: string; message: string };
    console.log('Error on logout:', code, message);
    throw new Error(AUTH_ERRORS[code as keyof typeof AUTH_ERRORS]);
  }
};

/**
 * Sends a password reset email to the user.
 *
 * @param {Object} options - The options for sending a password reset email.
 * @param {string} options.email - The user's email.
 * @throws Will throw an error if the password reset email fails to send.
 */
export const recoveryPassword = async ({ email }: { email: string }) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    const { code, message } = error as { code: string; message: string };
    console.log('Error on reset password:', code, message);
    throw new Error(AUTH_ERRORS[code as keyof typeof AUTH_ERRORS]);
  }
};
