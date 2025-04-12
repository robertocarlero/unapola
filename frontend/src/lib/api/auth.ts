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

type SignUpParams = {
  password: string;
  image?: File | null;
} & Pick<User, 'email' | 'fullName' | 'username'>;

/**
 * Registers a new user with the provided email and password.
 * Also sets additional user data and uploads an optional image.
 *
 * @param  params - The params for signing up a user.
 * @param  params.email - The user's email.
 * @param  params.password - The user's password.
 * @param  params.image - The user's image.
 * @param  params.fullName - The user's full name.
 * @param  params.username - The user's username.
 * @throws Will throw an error if the sign-up process fails.
 * @returns A promise that resolves when the user is signed up.
 */
export const signUp = async ({
  email,
  password,
  image,
  ...data
}: SignUpParams) => {
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

type SignInParams = {
  email: string;
  password: string;
};

/**
 * Signs in a user using email and password.
 *
 * @param  credentials - The user's credentials.
 * @param  credentials.email - The user's email.
 * @param  credentials.password - The user's password.
 * @throws Will throw an error if the sign-in process fails.
 * @returns A promise that resolves when the user is signed in.
 */
export const signIn = async ({ email, password }: SignInParams) => {
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
 * @returns A promise that resolves when the user is logged out.
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

type RecoveryPasswordParams = {
  email: string;
};

/**
 * Sends a password reset email to the user.
 *
 * @param  params - The params for sending a password reset email.
 * @param  params.email - The user's email.
 * @throws Will throw an error if the password reset email fails to send.
 * @returns A promise that resolves when the password reset email is sent.
 */
export const recoveryPassword = async ({ email }: RecoveryPasswordParams) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    const { code, message } = error as { code: string; message: string };
    console.log('Error on reset password:', code, message);
    throw new Error(AUTH_ERRORS[code as keyof typeof AUTH_ERRORS]);
  }
};
