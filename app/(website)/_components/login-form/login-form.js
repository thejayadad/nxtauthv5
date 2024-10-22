'use client';
import { signInCredentials } from '@/lib/actions/user/login-user';
import { useRouter } from 'next/navigation';
import React from 'react';

const LoginForm = () => {
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
  )
}

export default LoginForm