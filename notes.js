/**
<---setup--->
create next app

<---Dependecies--->
npm i -D prisma
npm i @prisma/client
npm i react-icons bcrypt
npm i react-hot-toast react-hook-form
npm install next-auth@beta
npm i @auth/prisma-adapter
npx prisma init
add .env to gitignore
<---database--->
vercel setup
update .env and schema
<---authjs--->
.env:
AUTH_SECRET="ajsnkjasnvjna"
follow docs
then go to prisma adapter

<---prisma adapter and schema--->
follow the adapter docs
lib folder function
schema
npx prisma migrate dev --name init
npx prisma studio

<---Register--->
auth group
layout
add the register action

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

add the page
form

'use client'
import { RegisterUser } from '@/lib/actions/user/register-user';
import React from 'react';

const RegisterPage = () => {
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(event.target); // Get form data
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      await RegisterUser({ name, email, password }); // Pass the gathered data to RegisterUser
      // Optionally, handle successful registration (e.g., redirect, show a success message)
    } catch (error) {
      console.error("Registration error:", error); // Handle errors here
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name='name'
          type='text'
          placeholder='Name...'
          id='name'
        />
        <input
          type='email'
          name='email'
          id='email'
          placeholder='Email...'
        />
        <input
          type='password'
          name='password'
          id='password'
          placeholder='Password...'
        />
        <button type='submit'>Create User</button>
      </form>
    </div>
  );
};

export default RegisterPage;

test it out
include 

<---Login Page--->
auth.js file

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt"; // Make sure to import bcrypt
import { prisma } from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login"
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        // Find the user by email
        const user = await prisma.user.findUnique({
          where: { email },
        });

        // If user is not found or password is not set, throw an error
        if (!user || !user.password) {
          throw new Error("No user found");
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
          throw new Error("Invalid password");
        }

        // Return the user object if authentication is successful
        return user;
      },
    }),
  ],
});

login-user.js
'use server';
import { signIn } from '@/auth'; // Ensure you're importing from 'next-auth/react'

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

'use client';
import { signInCredentials } from '@/lib/actions/user/login-user';
import { useRouter } from 'next/navigation';
import React from 'react';

const LoginPage = () => {
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(event.target); // Get form data
    const email = formData.get('email');
    const password = formData.get('password');
    try {
      await signInCredentials({ email, password }); // Pass the gathered data to signInCredentials
      // Optionally, handle successful login (e.g., redirect, show a success message)
      router.push('/dashboard'); // Redirect to dashboard after successful login

    } catch (error) {
      console.error("Login error:", error); // Handle errors here
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          name='email'
          id='email'
          placeholder='Email...'
          required // Make this field required
        />
        <input
          type='password'
          name='password'
          id='password'
          placeholder='Password...'
          required // Make this field required
        />
        <button type='submit'>Login</button>
      </form>
    </div>
  );
}

export default LoginPage;

<---dashboard--->
import { auth } from '@/auth'
import React from 'react'

const DashboardPage = async () => {
    const session = await auth()
  return (
    <div>
        <h2>Welcome, <span>{session?.user?.name}</span></h2>
    </div>
  )
}

export default DashboardPage

<---Protect Routes--->
setup callbacks
auth.js
<---Google login--->
create the button
import React from 'react'
import { signIn } from '@/auth'

const GoogleButton = () => {
  return (
    <form

    action={async() => {
        'use server'
        await signIn("google", {redirectTo: "/dashboard"})
    }}
    >
        <button
        type='submit'
        >
            Google Login
        </button>
    </form>
  )
}

export default GoogleButton

create the google credentials


in auth.js add Google as a provider
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt"; // Make sure to import bcrypt
import { prisma } from "./lib/prisma";
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login"
  },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        // Find the user by email
        const user = await prisma.user.findUnique({
          where: { email },
        });

        // If user is not found or password is not set, throw an error
        if (!user || !user.password) {
          throw new Error("No user found");
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
          throw new Error("Invalid password");
        }

        // Return the user object if authentication is successful
        return user;
      },
    }),
  ],
  //callback
  session({session, token}){
    return session
  }
});


import it to the login page

 */