'use server';

import { signIn } from "@/auth";

export const signInCredentials = async (formData) => {
  const { email, password } = formData;
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });

    if (result?.error) {
      throw new Error(result.error); // Throw error if sign in fails
    }

    return result;
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error; // Re-throw error for handling in the LoginForm
  }
};
