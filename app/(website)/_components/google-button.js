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