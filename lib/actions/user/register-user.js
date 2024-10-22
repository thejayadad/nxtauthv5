'use server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export const RegisterUser = async (formData) => {
  const { name, email, password } = formData;
console.log("Email " + email)
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error("Error: ", error); // Log the error for debugging
    console.log("Reg error " + error)
    throw new Error('Registration failed'); // Rethrow the error to be caught in the form
  }
};
