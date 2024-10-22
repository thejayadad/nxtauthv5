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
